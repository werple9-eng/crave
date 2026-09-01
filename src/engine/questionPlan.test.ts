import { describe, expect, it } from 'vitest'
import { DEFAULT_PREFERENCES, PREFERENCE_QUESTIONS } from '../data/questions'
import type { AnswerValue, QuestionKey } from '../data/questions'
import type { HungerLevel, PreferenceAnswers } from '../types'
import { FOODS } from '../data/foods'
import {
  candidatePool, ENOUGH, fits, gainFor, MAX_QUESTIONS, MIN_QUESTIONS, planNext,
} from './questionPlan'
import type { PrefKey } from './questionPlan'

/**
 * Plays a whole session, answering with the given strategy, and reports how
 * many questions it took. This is the behavior that matters - the point of
 * the planner is the *length* of the interview, not any single decision.
 */
function runSession(
  hunger: HungerLevel,
  pick: (key: PrefKey) => string,
): { asked: QuestionKey[]; remaining: number } {
  let preferences: PreferenceAnswers = { ...DEFAULT_PREFERENCES }
  const answered = new Set<QuestionKey>(['hunger'])
  const asked: QuestionKey[] = ['hunger']

  for (let guard = 0; guard < 20; guard++) {
    const plan = planNext(hunger, preferences, answered, [])
    if (plan.next === null) return { asked, remaining: plan.remaining }
    const value = pick(plan.next)
    preferences = { ...preferences, [plan.next]: value } as PreferenceAnswers
    answered.add(plan.next)
    asked.push(plan.next)
  }
  throw new Error('planner did not terminate')
}

/** The most decisive answer available for each question. */
const decisive: Record<PrefKey, string> = {
  temperature: 'hot',
  texture: 'crispy',
  spice: 'spicy',
  indulgence: 'healthy',
  sweetness: 'sweet',
  budget: 'cheap',
}

describe('fits', () => {
  it('never cuts anything on "any"', () => {
    for (const q of PREFERENCE_QUESTIONS) {
      const key = q.key as PrefKey
      expect(FOODS.every((f) => fits(f, key, 'any'))).toBe(true)
    }
  })

  it('splits the library on every real option', () => {
    // A question whose options all keep everything, or all keep nothing,
    // would be pure filler on screen.
    for (const q of PREFERENCE_QUESTIONS) {
      const key = q.key as PrefKey
      for (const option of q.options) {
        if (option.value === 'any') continue
        const kept = FOODS.filter((f) => fits(f, key, String(option.value))).length
        expect(kept).toBeGreaterThan(0)
        expect(kept).toBeLessThan(FOODS.length)
      }
    }
  })
})

describe('candidatePool', () => {
  it('is the whole library before anything is answered', () => {
    expect(candidatePool(null, DEFAULT_PREFERENCES, new Set(), []).length).toBe(FOODS.length)
  })

  it('only ever shrinks as answers come in', () => {
    let preferences: PreferenceAnswers = { ...DEFAULT_PREFERENCES }
    const answered = new Set<QuestionKey>(['hunger'])
    let last = candidatePool('normal', preferences, answered, []).length

    for (const q of PREFERENCE_QUESTIONS) {
      const key = q.key as PrefKey
      preferences = { ...preferences, [key]: decisive[key] } as PreferenceAnswers
      answered.add(key)
      const now = candidatePool('normal', preferences, answered, []).length
      expect(now).toBeLessThanOrEqual(last)
      last = now
    }
  })
})

describe('gainFor', () => {
  it('is zero against an empty pool', () => {
    expect(gainFor([], 'temperature')).toBe(0)
  })

  it('rates a question lower once it has already been used to cut', () => {
    const full = candidatePool('normal', DEFAULT_PREFERENCES, new Set(['hunger']), [])
    const before = gainFor(full, 'spice')
    const after = gainFor(
      candidatePool(
        'normal',
        { ...DEFAULT_PREFERENCES, spice: 'none' },
        new Set<QuestionKey>(['hunger', 'spice']),
        [],
      ),
      'spice',
    )
    expect(after).toBeLessThan(before)
  })
})

describe('planNext', () => {
  it('always asks at least the floor, even when answers narrow hard', () => {
    const { asked } = runSession('starving', (k) => decisive[k])
    expect(asked.length).toBeGreaterThanOrEqual(MIN_QUESTIONS)
  })

  it('never asks more than the ceiling, even when nothing is ruled out', () => {
    const { asked } = runSession('normal', () => 'any')
    expect(asked.length).toBeLessThanOrEqual(MAX_QUESTIONS)
  })

  it('asks fewer questions of someone decisive than someone half-decided', () => {
    // The whole reason the count varies: partial answers leave the pool wide,
    // so it keeps asking; ruling things out gets you to food faster.
    const sharp = runSession('starving', (k) => decisive[k])
    const partial = runSession('normal', (k) =>
      k === 'spice' || k === 'budget' ? 'any' : decisive[k])
    expect(sharp.asked.length).toBeLessThan(partial.asked.length)
  })

  it('gives up on someone who shrugs at everything', () => {
    // More questions cannot help a user with no preferences, so it stops
    // well short of the ceiling rather than interrogating them.
    const { asked } = runSession('normal', () => 'any')
    expect(asked.length).toBeLessThan(MAX_QUESTIONS)
    expect(asked.length).toBeGreaterThan(MIN_QUESTIONS)
  })

  it('never repeats a question', () => {
    const { asked } = runSession('normal', (k) => decisive[k])
    expect(new Set(asked).size).toBe(asked.length)
  })

  it('stops once few enough dishes are left', () => {
    const { remaining, asked } = runSession('starving', (k) => decisive[k])
    // Either it narrowed below the threshold or it ran out of things to ask.
    expect(remaining <= ENOUGH || asked.length >= MAX_QUESTIONS).toBe(true)
  })

  it('leaves something to recommend whatever you answer', () => {
    // A pool of zero would mean the questions talked the user out of dinner.
    for (const hunger of ['snack', 'normal', 'starving'] as HungerLevel[]) {
      const { remaining } = runSession(hunger, (k) => decisive[k])
      expect(remaining).toBeGreaterThan(0)
    }
  })

  it('terminates for every single-answer strategy', () => {
    const values: Record<PrefKey, string[]> = {
      temperature: ['hot', 'cold', 'any'],
      texture: ['crispy', 'soft', 'any'],
      spice: ['none', 'mild', 'spicy', 'any'],
      indulgence: ['healthy', 'indulgent', 'any'],
      sweetness: ['sweet', 'savory', 'any'],
      budget: ['cheap', 'treat', 'any'],
    }
    for (const hunger of ['snack', 'normal', 'starving'] as HungerLevel[]) {
      for (let i = 0; i < 4; i++) {
        const { asked } = runSession(hunger, (k) => values[k][i % values[k].length])
        expect(asked.length).toBeGreaterThanOrEqual(MIN_QUESTIONS)
        expect(asked.length).toBeLessThanOrEqual(MAX_QUESTIONS)
      }
    }
  })
})

describe('question copy', () => {
  it('offers a way out of every question', () => {
    // Without an "any" option an adaptive interview can force a preference
    // the user does not actually have.
    for (const q of PREFERENCE_QUESTIONS) {
      expect(q.options.some((o) => o.value === 'any')).toBe(true)
    }
  })

  it('uses distinct prompts, since they are asked in varying order', () => {
    const prompts = PREFERENCE_QUESTIONS.map((q) => q.prompt)
    expect(new Set(prompts).size).toBe(prompts.length)
  })
})

/** Guards the union stays in step with the data. */
const _keys: QuestionKey[] = ['hunger', ...PREFERENCE_QUESTIONS.map((q) => q.key)]
const _value: AnswerValue = 'any'
void _keys
void _value
