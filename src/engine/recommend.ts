import type {
  Contribution, Food, HungerLevel, PreferenceAnswers, Reaction,
  ScoredFood, SessionInput, Texture, VetoId,
} from '../types'
import { FOODS } from '../data/foods'
import { REASON_THRESHOLD, WEIGHTS } from './weights'
import { calculateFoodSimilarity, clamp } from './similarity'
import { emptyHistory, HARD_VETOES, traitAffinity, traitKeys } from '../storage/history'
import { scoreDaypart } from './daypart'
import type { History } from '../storage/history'

/**
 * The recommendation engine.
 *
 * No AI model, no API - just a transparent weighted score. Every rule returns
 * a `Contribution` carrying both its points and the sentence explaining them,
 * so the results screen can never invent a reason that the math didn't
 * actually produce.
 *
 * Scoring groups, roughly in order of influence:
 *   1. reactions      what you said yes/no to on real dishes
 *   2. preferences    the craving questionnaire
 *   3. hunger         does the portion match the need
 *   4. vetoes         what you're definitely not feeling
 *   5. history        gentle nudge from past sessions
 */

/* ------------------------------------------------------------------ */
/* Vetoes                                                              */
/* ------------------------------------------------------------------ */

/** What counts as each standing dietary rule. */
export const VETO_MATCHERS: Record<VetoId, (food: Food) => boolean> = {
  meat: (f) => f.tags.includes('meat'),
  seafood: (f) => f.tags.includes('seafood'),
  dairy: (f) => f.tags.includes('dairy'),
  raw: (f) => f.tags.includes('raw'),
  fried: (f) => f.tags.includes('fried'),
  bread: (f) => f.tags.includes('bread-heavy'),
}

const VETO_REASONS: Record<VetoId, string> = {
  meat: 'Contains meat',
  seafood: 'Contains seafood',
  dairy: 'Contains dairy',
  raw: 'Served raw',
  fried: 'You avoid fried food',
  bread: 'Heavier on bread than you like',
}

/**
 * Hard exclusions remove a food from consideration entirely.
 *
 * "No seafood" means no seafood, full stop. "Easy on bread" is a soft rule -
 * a big penalty, but a spectacular match can still earn its way back.
 */
export function isHardExcluded(food: Food, vetoes: VetoId[]): boolean {
  return vetoes.some((v) => HARD_VETOES.includes(v) && VETO_MATCHERS[v](food))
}

export function scoreVetoes(food: Food, vetoes: VetoId[]): Contribution[] {
  const out: Contribution[] = []
  for (const veto of vetoes) {
    if (HARD_VETOES.includes(veto)) continue // handled by filtering
    if (!VETO_MATCHERS[veto](food)) continue
    out.push({
      source: 'veto',
      reason: VETO_REASONS[veto],
      points: -WEIGHTS.vetoSoft,
      max: 0,
    })
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Preference questionnaire                                            */
/* ------------------------------------------------------------------ */

/** How well each texture satisfies a craving for crispy / soft. */
const TEXTURE_FIT: Record<'crispy' | 'soft', Record<Texture, number>> = {
  crispy: { crispy: 1, mixed: 0.35, chewy: 0.15, fresh: 0, soft: -0.6, saucy: -0.7 },
  soft: { soft: 1, saucy: 0.85, chewy: 0.35, mixed: 0.3, fresh: 0, crispy: -0.5 },
}

/** Linear falloff: full points on target, negative once you're `range` away. */
function nearTarget(value: number, target: number, range: number, weight: number): number {
  return clamp(weight * (1 - Math.abs(value - target) / range), -weight, weight)
}

export function scorePreferenceMatch(food: Food, prefs: PreferenceAnswers): Contribution[] {
  const out: Contribution[] = []
  const W = WEIGHTS.preference

  if (prefs.temperature !== 'any') {
    const w = W.temperature
    const points =
      food.temperature === 'either' ? w * 0.4 : food.temperature === prefs.temperature ? w : -w
    out.push({
      source: 'temperature',
      reason: prefs.temperature === 'hot' ? 'You wanted something hot' : 'You wanted something cold',
      points, max: w,
    })
  }

  if (prefs.texture !== 'any') {
    const w = W.texture
    out.push({
      source: 'texture',
      reason: prefs.texture === 'crispy' ? 'You wanted something crispy' : 'You wanted something soft and comforting',
      points: w * TEXTURE_FIT[prefs.texture][food.texture],
      max: w,
    })
  }

  if (prefs.spice !== 'any') {
    const w = W.spice
    let points: number
    let reason: string
    if (prefs.spice === 'none') {
      // Not a target - anything above mild should fall off fast.
      points = clamp(w * (1 - food.spiceLevel / 2), -w, w)
      reason = 'No heat, the way you wanted'
    } else if (prefs.spice === 'mild') {
      points = nearTarget(food.spiceLevel, 2, 2.2, w)
      reason = 'Has a little heat'
    } else {
      points = nearTarget(food.spiceLevel, 4.5, 2.5, w)
      reason = 'Genuinely spicy'
    }
    out.push({ source: 'spice', reason, points, max: w })
  }

  if (prefs.indulgence !== 'any') {
    const w = W.indulgence
    const healthy = prefs.indulgence === 'healthy'
    out.push({
      source: 'indulgence',
      reason: healthy ? 'On the healthier side' : 'Satisfyingly indulgent',
      points: healthy
        ? clamp((w * (food.healthiness - 3)) / 2, -w, w)
        : clamp((w * (3 - food.healthiness)) / 2, -w, w),
      max: w,
    })
  }

  if (prefs.sweetness !== 'any') {
    const w = W.sweetness
    const points =
      prefs.sweetness === 'sweet'
        ? clamp((w * (food.sweetness - 2.5)) / 2, -w, w)
        : clamp((w * (2 - food.sweetness)) / 1.8, -w, w)
    out.push({
      source: 'sweetness',
      reason: prefs.sweetness === 'sweet' ? 'You wanted something sweet' : 'Savoury, not sweet',
      points, max: w,
    })
  }

  if (prefs.budget !== 'any') {
    const w = W.budget
    const cheap = prefs.budget === 'cheap'
    out.push({
      source: 'budget',
      reason: cheap ? 'Easy on the wallet' : 'Worth spending a bit more on',
      // priceLevel runs 1-4, so a two-step gap is the full swing either way.
      points: cheap
        ? clamp((w * (2.5 - food.priceLevel)) / 1.5, -w, w)
        : clamp((w * (food.priceLevel - 2)) / 1.5, -w, w),
      max: w,
    })
  }

  return out
}

/* ------------------------------------------------------------------ */
/* Hunger                                                              */
/* ------------------------------------------------------------------ */

/**
 * Scores portion *and* heaviness off the single hunger answer.
 *
 * These used to be two separate questions, which meant the app asked you
 * roughly the same thing twice in a row. One answer, two targets: a snack
 * should be small *and* light, starving wants big *and* substantial.
 */
export function scoreAppetite(food: Food, hunger: HungerLevel): Contribution[] {
  const W = WEIGHTS.appetite
  const fillTarget = hunger === 'snack' ? 2 : hunger === 'normal' ? 3.5 : 5
  const heavyTarget = hunger === 'snack' ? 2 : hunger === 'normal' ? 3 : 4.5

  const fillReason =
    hunger === 'snack' ? 'Small enough for just a snack'
    : hunger === 'normal' ? 'The right size for a normal meal'
    : 'Filling enough for how hungry you are'

  const heavyReason =
    hunger === 'snack' ? 'Light, not a whole production'
    : hunger === 'normal' ? 'Not too light, not too heavy'
    : 'Substantial enough to actually fix this'

  return [
    {
      source: 'appetite',
      reason: fillReason,
      points: nearTarget(food.fillingLevel, fillTarget, 2.4, W.filling),
      max: W.filling,
    },
    {
      source: 'appetite',
      reason: heavyReason,
      points: nearTarget(food.heaviness, heavyTarget, 2.4, W.heaviness),
      max: W.heaviness,
    },
  ]
}

/* ------------------------------------------------------------------ */
/* Swipe reactions - the strongest signal                              */
/* ------------------------------------------------------------------ */

export function scoreReactionInfluence(food: Food, reactions: Reaction[]): Contribution[] {
  const R = WEIGHTS.reaction
  let exactPoints = 0
  let exactReason = ''
  let likeSimilar = 0
  /** Accumulates negative, since `dislikeSimilar` is a negative weight. */
  let dislikeSimilar = 0
  /** Name of the liked food that most resembles this one, for the reason line. */
  let closestLike: { name: string; sim: number } | null = null

  for (const reaction of reactions) {
    const other = FOODS.find((f) => f.id === reaction.foodId)
    if (!other) continue

    if (other.id === food.id) {
      if (reaction.value === 'like') {
        exactPoints += R.likeExact
        exactReason = 'You said yes to this one'
      } else if (reaction.value === 'maybe') {
        exactPoints += R.maybeExact
        exactReason = 'You were curious about this one'
      } else {
        exactPoints += R.dislikeExact
        exactReason = 'You passed on this one'
      }
      continue
    }

    const sim = calculateFoodSimilarity(food, other)
    if (sim < R.similarityFloor) continue

    if (reaction.value === 'like') {
      likeSimilar += R.likeSimilar * sim
      if (!closestLike || sim > closestLike.sim) closestLike = { name: other.name, sim }
    } else if (reaction.value === 'maybe') {
      likeSimilar += R.maybeSimilar * sim
    } else {
      dislikeSimilar += R.dislikeSimilar * sim
    }
  }

  const out: Contribution[] = []
  if (exactPoints !== 0) {
    out.push({ source: 'reactions', reason: exactReason, points: exactPoints, max: R.likeExact })
  }
  if (likeSimilar > 0) {
    out.push({
      source: 'reactions',
      reason: closestLike ? `A lot like ${closestLike.name}, which you liked` : 'Similar to foods you liked',
      points: likeSimilar,
      max: R.likeSimilar,
    })
  }
  if (dislikeSimilar < 0) {
    out.push({
      source: 'reactions',
      reason: 'Close to something you passed on',
      points: dislikeSimilar,
      max: 0,
    })
  }

  // Ten swipes shouldn't be able to completely overrule the questionnaire.
  const total = out.reduce((sum, c) => sum + c.points, 0)
  if (Math.abs(total) > R.totalCap) {
    const scale = R.totalCap / Math.abs(total)
    for (const c of out) c.points *= scale
  }

  return out
}

/* ------------------------------------------------------------------ */
/* Learned preferences                                                 */
/* ------------------------------------------------------------------ */

export function scoreHistory(food: Food, history: History): Contribution[] {
  const out: Contribution[] = []
  if (history.sessions === 0) return out
  const H = WEIGHTS.history

  const keys = traitKeys(food)
  const affinities = keys.map((k) => traitAffinity(history, k))
  const average = affinities.reduce((a, b) => a + b, 0) / Math.max(1, affinities.length)
  if (Math.abs(average) > 0.02) {
    out.push({
      source: 'history',
      reason: average > 0 ? 'Fits what you usually go for' : 'Not usually your thing',
      points: H.traitBonus * average,
      max: H.traitBonus,
    })
  }

  const stat = history.foods[food.id]
  if (stat?.chosen) {
    out.push({
      source: 'history',
      reason: 'One of your regulars',
      points: Math.min(H.favoriteFood, stat.chosen * 2),
      max: H.favoriteFood,
    })
  }

  // Don't keep serving the same dinner back.
  const recentIndex = history.recentPicks.indexOf(food.id)
  if (recentIndex >= 0 && recentIndex < H.recentWindow) {
    const freshness = 1 - recentIndex / H.recentWindow
    out.push({
      source: 'history',
      reason: 'You had this recently',
      points: -H.recentPickPenalty * freshness,
      max: 0,
    })
  }

  return out
}

/* ------------------------------------------------------------------ */
/* Putting it together                                                 */
/* ------------------------------------------------------------------ */

export function scoreFood(food: Food, input: SessionInput, history: History): Contribution[] {
  return [
    ...scorePreferenceMatch(food, input.preferences),
    ...scoreAppetite(food, input.hunger),
    ...scoreVetoes(food, input.vetoes),
    ...(input.daypart ? [scoreDaypart(food, input.daypart)].filter(Boolean) as Contribution[] : []),
    ...scoreReactionInfluence(food, input.reactions),
    ...scoreHistory(food, history),
  ]
}

function pickReasons(contributions: Contribution[]): string[] {
  const seen = new Set<string>()
  const reasons: string[] = []
  for (const c of [...contributions].sort((a, b) => b.points - a.points)) {
    if (c.points < REASON_THRESHOLD) break
    if (seen.has(c.reason)) continue
    seen.add(c.reason)
    reasons.push(c.reason)
    if (reasons.length === 3) break
  }
  return reasons
}

/**
 * Ranks every eligible food, best first.
 *
 * `matchPercent` is measured against the best score any food actually
 * achieved on each scoring group this session, so 100% means "nothing in the
 * library fits your answers better" rather than a made-up number.
 */
/**
 * Narrows a full ranking down to the three you actually get shown.
 *
 * Two rules beyond raw score:
 *
 * 1. At most `maxPerCategory` from one category, so the answer is never
 *    "burger, burger, burger" - there's always a real alternative.
 * 2. At least one food you didn't already swipe on. Handing back only the
 *    three things you just said yes to is a ranking, not a recommendation -
 *    the point is to surface the thing you hadn't thought of.
 */
export function topPicks(
  ranked: ScoredFood[],
  reacted: Set<string> = new Set(),
  count = 3,
  maxPerCategory = 2,
): ScoredFood[] {
  const picks: ScoredFood[] = []
  const categoryCount = new Map<string, number>()

  for (const row of ranked) {
    if (picks.length >= count) break
    const used = categoryCount.get(row.food.category) ?? 0
    if (used >= maxPerCategory) continue
    categoryCount.set(row.food.category, used + 1)
    picks.push(row)
  }

  // Reserve the last slot for something new, but only if every pick so far is
  // already familiar - a strong unfamiliar match earns its place on merit.
  if (picks.length === count && picks.every((p) => reacted.has(p.food.id))) {
    const keep = picks.slice(0, count - 1)
    const keptCategories = new Map<string, number>()
    for (const pick of keep) {
      keptCategories.set(pick.food.category, (keptCategories.get(pick.food.category) ?? 0) + 1)
    }
    const fresh = ranked.find(
      (row) =>
        !reacted.has(row.food.id) &&
        (keptCategories.get(row.food.category) ?? 0) < maxPerCategory,
    )
    if (fresh) return [...keep, fresh]
  }

  // If the caps starved us (heavy vetoes), fill from the top regardless.
  for (const row of ranked) {
    if (picks.length >= count) break
    if (!picks.includes(row)) picks.push(row)
  }
  return picks
}

export function rankFoods(input: SessionInput, history: History = emptyHistory()): ScoredFood[] {
  const dislikedIds = new Set(
    input.reactions.filter((r) => r.value === 'dislike').map((r) => r.foodId),
  )

  const rows = FOODS
    .filter((food) => !isHardExcluded(food, input.vetoes))
    .map((food) => {
      const contributions = scoreFood(food, input, history)
      const score = contributions.reduce((sum, c) => sum + c.points, 0)
      return { food, contributions, score }
    })

  // Best achievable per scoring group, used to turn scores into percentages.
  const groupBest = new Map<string, number>()
  for (const row of rows) {
    const perGroup = new Map<string, number>()
    for (const c of row.contributions) {
      perGroup.set(c.source, (perGroup.get(c.source) ?? 0) + c.points)
    }
    for (const [group, value] of perGroup) {
      groupBest.set(group, Math.max(groupBest.get(group) ?? 0, value))
    }
  }
  const denominator = Math.max(1, [...groupBest.values()].reduce((a, b) => a + b, 0))

  return rows
    // You just rejected these - don't hand them back as the answer.
    .filter((row) => !dislikedIds.has(row.food.id))
    .map<ScoredFood>((row) => ({
      food: row.food,
      score: row.score,
      matchPercent: clamp(Math.round((100 * row.score) / denominator), 1, 100),
      contributions: row.contributions,
      reasons: pickReasons(row.contributions),
    }))
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
}
