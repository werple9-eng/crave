import type { Food, HungerLevel, PreferenceAnswers, VetoId } from '../types'
import type { QuestionKey } from '../data/questions'
import { PREFERENCE_QUESTIONS } from '../data/questions'
import { FOODS } from '../data/foods'
import { isHardExcluded } from './recommend'

/**
 * Decides which question to ask next, and when to stop asking.
 *
 * A fixed questionnaire is wrong in both directions. Answer "starving",
 * "nothing cold" and "not doing spicy" and you have already cut 314 dishes to
 * a couple of dozen - three more questions are just tax. Shrug at everything
 * and six questions have told us nothing, so the picks are close to random.
 *
 * So: ask the question that best splits what's *still* plausible, and stop
 * when the pool is small enough or nothing left to ask would move it. The
 * floor and ceiling exist because pure information theory feels erratic to
 * use - one question then an answer reads as a guess, and nobody wants nine.
 */

export type PrefKey = keyof PreferenceAnswers

/** Always ask at least this many, so the result feels earned. */
export const MIN_QUESTIONS = 3
/** Never ask more than this, however vague the answers. */
export const MAX_QUESTIONS = 7
/** Once this few dishes are plausible the ranking has plenty to work with, and
 * more questions stop paying for themselves. */
export const ENOUGH = 45
/** Below this split quality, a question is not worth your time. */
export const MIN_GAIN = 0.05

/**
 * Whether a dish survives one answer.
 *
 * Deliberately more forgiving than the scorer: this decides what to *ask*,
 * not what to recommend, and cutting too hard here would end the questions
 * early on a pool that the real ranking then disagrees with. `any` never cuts.
 */
export function fits(food: Food, key: PrefKey, value: string): boolean {
  if (value === 'any') return true
  switch (key) {
    case 'temperature':
      return food.temperature === 'either' || food.temperature === value
    case 'texture':
      return value === 'crispy'
        ? food.texture === 'crispy' || food.texture === 'mixed'
        : food.texture !== 'crispy'
    case 'spice':
      if (value === 'none') return food.spiceLevel <= 1
      if (value === 'mild') return food.spiceLevel >= 1 && food.spiceLevel <= 3
      return food.spiceLevel >= 3
    case 'indulgence':
      return value === 'healthy' ? food.healthiness >= 3 : food.healthiness <= 3
    case 'sweetness':
      return value === 'sweet' ? food.sweetness >= 3 : food.sweetness <= 2
    case 'budget':
      return value === 'cheap' ? food.priceLevel <= 2 : food.priceLevel >= 2
    default:
      return true
  }
}

/** Hunger is a filter too - it is why we ask it first. */
export function fitsHunger(food: Food, hunger: HungerLevel): boolean {
  if (hunger === 'snack') return food.fillingLevel <= 3
  if (hunger === 'starving') return food.fillingLevel >= 3
  return true
}

/** Everything still plausible given what you've said so far. */
export function candidatePool(
  hunger: HungerLevel | null,
  preferences: PreferenceAnswers,
  answered: Set<QuestionKey>,
  vetoes: VetoId[] = [],
): Food[] {
  return FOODS.filter((food) => {
    if (vetoes.length && isHardExcluded(food, vetoes)) return false
    if (hunger && answered.has('hunger') && !fitsHunger(food, hunger)) return false
    for (const q of PREFERENCE_QUESTIONS) {
      const key = q.key as PrefKey
      if (!answered.has(key)) continue
      if (!fits(food, key, preferences[key])) return false
    }
    return true
  })
}

/**
 * How useful a question would be against this pool, 0..1.
 *
 * Two things matter and both are necessary. A question must *cut* - options
 * that each keep 95% of the pool tell us nothing - and it must cut *evenly*.
 * A question where one option keeps 300 dishes and the other keeps 2 is
 * almost always answered the first way, so on average it buys nothing.
 */
export function gainFor(pool: Food[], key: PrefKey): number {
  const question = PREFERENCE_QUESTIONS.find((q) => q.key === key)
  if (!question || pool.length === 0) return 0
  const real = question.options.filter((o) => o.value !== 'any')
  const counts = real.map((o) => pool.filter((f) => fits(f, key, String(o.value))).length)
  const total = counts.reduce((a, b) => a + b, 0)
  if (total === 0) return 0

  // How much a typical answer shrinks the pool.
  const avgKept = counts.reduce((a, b) => a + b, 0) / counts.length / pool.length
  const cut = Math.max(0, 1 - avgKept)

  // How evenly it splits, as normalized entropy.
  let entropy = 0
  for (const c of counts) {
    if (c === 0) continue
    const p = c / total
    entropy -= p * Math.log(p)
  }
  const balance = counts.length > 1 ? entropy / Math.log(counts.length) : 0

  return cut * balance
}

export interface Plan {
  /** The question to ask, or null when we're done. */
  next: PrefKey | null
  /** How many dishes are still plausible. */
  remaining: number
  /** Why we stopped, for the copy on screen. */
  reason: 'narrow' | 'exhausted' | 'capped' | 'indifferent' | null
}

/**
 * What to do next.
 *
 * `asked` counts hunger, so the first call after hunger sees asked === 1.
 */
export function planNext(
  hunger: HungerLevel | null,
  preferences: PreferenceAnswers,
  answered: Set<QuestionKey>,
  vetoes: VetoId[] = [],
): Plan {
  const pool = candidatePool(hunger, preferences, answered, vetoes)
  const asked = answered.size
  const open = PREFERENCE_QUESTIONS
    .map((q) => q.key as PrefKey)
    .filter((k) => !answered.has(k))

  if (open.length === 0) return { next: null, remaining: pool.length, reason: 'exhausted' }
  if (asked >= MAX_QUESTIONS) return { next: null, remaining: pool.length, reason: 'capped' }

  const ranked = open
    .map((key) => ({ key, gain: gainFor(pool, key) }))
    .sort((a, b) => b.gain - a.gain)
  const best = ranked[0]

  // Below the floor we keep going regardless - a two-question answer reads as
  // a guess even when the maths says we already know enough.
  if (asked < MIN_QUESTIONS) return { next: best.key, remaining: pool.length, reason: null }

  /**
   * Shrugging is an answer.
   *
   * If nothing has been ruled out yet, the pool is still the whole library and
   * every remaining question still scores well - so on pure information the
   * planner would happily ask all seven. But someone answering "whatever" to
   * everything is telling us they are not fussy, and the honest response to
   * that is food, not another question.
   */
  const answeredPrefs = PREFERENCE_QUESTIONS
    .map((q) => q.key as PrefKey)
    .filter((k) => answered.has(k))
  const allShrugs = answeredPrefs.length > 0 && answeredPrefs.every((k) => preferences[k] === 'any')
  if (allShrugs && asked > MIN_QUESTIONS) {
    return { next: null, remaining: pool.length, reason: 'indifferent' }
  }

  if (pool.length <= ENOUGH) return { next: null, remaining: pool.length, reason: 'narrow' }
  if (best.gain < MIN_GAIN) return { next: null, remaining: pool.length, reason: 'exhausted' }

  return { next: best.key, remaining: pool.length, reason: null }
}

/**
 * A rough "how far through are we" for the progress dots, 0..1.
 *
 * There is no real total to count against, so this blends questions asked
 * against the floor with how far the pool has closed toward ENOUGH, and never
 * goes backwards on screen.
 */
export function progressFor(asked: number, remaining: number): number {
  const byCount = Math.min(1, asked / MIN_QUESTIONS)
  const span = FOODS.length - ENOUGH
  const byPool = span > 0 ? Math.min(1, Math.max(0, (FOODS.length - remaining) / span)) : 1
  return Math.max(0.08, Math.min(0.97, 0.45 * byCount + 0.55 * byPool))
}
