import { describe, expect, it } from 'vitest'
import type { PreferenceAnswers, SessionInput } from '../types'
import { FOODS, FOOD_BY_ID } from '../data/foods'
import { DEFAULT_PREFERENCES, DIETARY_OPTIONS, QUESTIONS } from '../data/questions'

import { ART_FORM_KEYS } from '../components/FoodArt'
import { isHardExcluded, rankFoods, topPicks } from './recommend'
import { buildDeck } from './deck'
import { calculateFoodSimilarity } from './similarity'
import { WEIGHTS } from './weights'
import { emptyHistory, recordChoice, recordSession } from '../storage/history'

/* --------------------------- helpers --------------------------- */

function session(overrides: Partial<SessionInput> = {}): SessionInput {
  return {
    hunger: 'normal',
    vetoes: [],
    preferences: { ...DEFAULT_PREFERENCES },
    reactions: [],
    ...overrides,
  }
}

function prefs(overrides: Partial<PreferenceAnswers>): PreferenceAnswers {
  return { ...DEFAULT_PREFERENCES, ...overrides }
}

/** Position of a food in the ranking, or -1 if filtered out. */
function rankOf(results: ReturnType<typeof rankFoods>, id: string): number {
  return results.findIndex((r) => r.food.id === id)
}

/* ----------------------- preference matching -------------------- */

describe('preference matching', () => {
  it('favors filling meals when starving and asking for heavy savory food', () => {
    const results = rankFoods(session({
      hunger: 'starving',
      preferences: prefs({ sweetness: 'savory' }),
    }))

    const top5 = results.slice(0, 5)
    for (const pick of top5) {
      expect(pick.food.fillingLevel).toBeGreaterThanOrEqual(4)
      expect(pick.food.sweetness).toBeLessThanOrEqual(2)
    }
  })

  it('favors salads and bowls when asking for light and healthy', () => {
    const results = rankFoods(session({
      hunger: 'snack',
      preferences: prefs({ indulgence: 'healthy' }),
    }))

    for (const pick of results.slice(0, 5)) {
      expect(pick.food.healthiness).toBeGreaterThanOrEqual(4)
      expect(pick.food.heaviness).toBeLessThanOrEqual(3)
    }
  })

  it('surfaces spicy food when you ask for actual heat', () => {
    const results = rankFoods(session({ preferences: prefs({ spice: 'spicy' }) }))
    for (const pick of results.slice(0, 5)) {
      expect(pick.food.spiceLevel).toBeGreaterThanOrEqual(3)
    }
  })

  it('keeps spicy food away when you ask for none', () => {
    const results = rankFoods(session({ preferences: prefs({ spice: 'none' }) }))
    for (const pick of results.slice(0, 8)) {
      expect(pick.food.spiceLevel).toBeLessThanOrEqual(1)
    }
  })

  it('favors cold light food for a cold, light craving', () => {
    const results = rankFoods(session({
      hunger: 'snack',
      preferences: prefs({ temperature: 'cold' }),
    }))
    for (const pick of results.slice(0, 4)) {
      expect(pick.food.temperature).not.toBe('hot')
      expect(pick.food.heaviness).toBeLessThanOrEqual(3)
    }
  })

  it('puts something sweet on top when you ask for sweet', () => {
    const results = rankFoods(session({ preferences: prefs({ sweetness: 'sweet' }) }))
    expect(results[0].food.sweetness).toBeGreaterThanOrEqual(4)
  })
})

/* --------------------------- reactions -------------------------- */

describe('swipe reactions', () => {
  it('lifts foods similar to one you liked', () => {
    const base = rankFoods(session())
    const withLike = rankFoods(session({
      reactions: [{ foodId: 'korean-fried-chicken', value: 'like' }],
    }))

    // The exact food you liked should be at or near the very top.
    expect(rankOf(withLike, 'korean-fried-chicken')).toBe(0)

    // And other crispy fried chicken should climb.
    for (const id of ['nashville-hot-chicken', 'fried-chicken', 'hot-wings']) {
      expect(rankOf(withLike, id)).toBeLessThan(rankOf(base, id))
    }
  })

  it('buries the food you passed on and pushes down its lookalikes', () => {
    const base = rankFoods(session())
    const withDislike = rankFoods(session({
      reactions: [{ foodId: 'smashburger', value: 'dislike' }],
    }))

    // A rejected food is removed from the results entirely.
    expect(rankOf(withDislike, 'smashburger')).toBe(-1)

    // Compare scores, not ranks: removing the rejected food shifts every
    // index after it up by one, which would mask the penalty.
    const scoreOf = (results: typeof base, id: string) =>
      results.find((r) => r.food.id === id)!.score

    expect(scoreOf(withDislike, 'bacon-cheeseburger'))
      .toBeLessThan(scoreOf(base, 'bacon-cheeseburger'))

    // An unrelated food shouldn't be touched at all.
    expect(scoreOf(withDislike, 'poke-bowl')).toBeCloseTo(scoreOf(base, 'poke-bowl'), 5)

    // And the lookalike should now sit below that unrelated food.
    expect(scoreOf(withDislike, 'bacon-cheeseburger'))
      .toBeLessThan(scoreOf(withDislike, 'poke-bowl'))
  })

  it('treats a maybe as a weak yes', () => {
    const base = rankFoods(session())
    const withMaybe = rankFoods(session({
      reactions: [{ foodId: 'pad-thai', value: 'maybe' }],
    }))
    expect(rankOf(withMaybe, 'pad-thai')).toBeLessThanOrEqual(rankOf(base, 'pad-thai'))
  })

  it('caps reaction influence so swipes cannot fully overrule the questionnaire', () => {
    const results = rankFoods(session({
      preferences: prefs({ temperature: 'cold', indulgence: 'healthy' }),
      reactions: [
        { foodId: 'lasagna', value: 'like' },
        { foodId: 'chicken-parm', value: 'like' },
        { foodId: 'bacon-cheeseburger', value: 'like' },
      ],
    }))
    const reactionTotal = results[0].contributions
      .filter((c) => c.source === 'reactions')
      .reduce((sum, c) => sum + c.points, 0)
    expect(Math.abs(reactionTotal)).toBeLessThanOrEqual(WEIGHTS.reaction.totalCap + 0.001)
  })
})

/* ---------------------------- vetoes ---------------------------- */

describe('vetoes', () => {
  it('removes seafood entirely when you say no seafood', () => {
    const results = rankFoods(session({ vetoes: ['seafood'] }))
    for (const pick of results) {
      expect(pick.food.tags).not.toContain('seafood')
    }
    expect(isHardExcluded(FOOD_BY_ID['poke-bowl'], ['seafood'])).toBe(true)
  })

  it('removes meat entirely when you say no meat', () => {
    const results = rankFoods(session({ vetoes: ['meat'] }))
    for (const pick of results) {
      expect(pick.food.tags).not.toContain('meat')
    }
    expect(results.length).toBeGreaterThan(5)
  })

  it('removes dairy and raw food entirely when those rules are set', () => {
    const results = rankFoods(session({ vetoes: ['dairy', 'raw'] }))
    for (const pick of results) {
      expect(pick.food.tags).not.toContain('dairy')
      expect(pick.food.tags).not.toContain('raw')
    }
    expect(results.length).toBeGreaterThan(20)
  })

  it('penalises soft rules heavily but keeps the food in the library', () => {
    const base = rankFoods(session())
    const noFried = rankFoods(session({ vetoes: ['fried'] }))

    // Still present - a soft rule is a penalty, not an exclusion.
    expect(rankOf(noFried, 'fried-chicken')).toBeGreaterThanOrEqual(0)
    // But well behind where it started.
    expect(rankOf(noFried, 'fried-chicken')).toBeGreaterThan(rankOf(base, 'fried-chicken'))
    // And nothing fried should be near the top.
    for (const pick of noFried.slice(0, 6)) {
      expect(pick.food.tags).not.toContain('fried')
    }
  })

  it('leaves enough food to work with even under every dietary rule at once', () => {
    const results = rankFoods(session({
      vetoes: ['meat', 'seafood', 'dairy', 'raw', 'fried', 'bread'],
    }))
    expect(results.length).toBeGreaterThanOrEqual(WEIGHTS.deck.size)
  })
})

/* ------------------- the questionnaire itself ------------------- */

describe('question set', () => {
  it('never asks the same thing twice', () => {
    const keys = QUESTIONS.map((q) => q.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('keeps standing dietary rules out of the mood questions', () => {
    // The old build asked "not feeling spicy?" and then "do you want heat?".
    // Dietary rules and craving questions must not overlap at all.
    const questionKeys = new Set<string>(QUESTIONS.map((q) => q.key))
    for (const option of DIETARY_OPTIONS) {
      expect(questionKeys.has(option.value)).toBe(false)
    }
  })

  it('offers a no-preference escape on every question', () => {
    for (const question of QUESTIONS) {
      const values = question.options.map((o) => String(o.value))
      // Hunger is the one question you must actually answer.
      if (question.key === 'hunger') continue
      expect(values).toContain('any')
    }
  })
})

/* --------------------------- food data -------------------------- */

describe('food library', () => {
  it('has unique ids and complete artwork', () => {
    const ids = FOODS.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const food of FOODS) {
      expect(food.art.base).toMatch(/^#[0-9a-f]{6}$/i)
      expect(food.art.accent).toMatch(/^#[0-9a-f]{6}$/i)
      // Every dish must map to a form that has an actual renderer.
      expect(ART_FORM_KEYS).toContain(food.art.form)
    }
  })

  it('is big and varied enough for repeat use', () => {
    expect(FOODS.length).toBeGreaterThanOrEqual(280)
    expect(new Set(FOODS.map((f) => f.cuisine)).size).toBeGreaterThanOrEqual(14)
    expect(new Set(FOODS.map((f) => f.art.form)).size).toBeGreaterThanOrEqual(20)
  })

  it('gives every dish a real description', () => {
    for (const food of FOODS) {
      expect(food.description.length).toBeGreaterThan(18)
      // A description should describe, not just restate the name.
      expect(food.description.toLowerCase()).not.toBe(food.name.toLowerCase())
      expect(food.description.trim()).toBe(food.description)
    }
  })

  it('draws every form it declares, and uses every form it draws', () => {
    const used = new Set(FOODS.map((f) => f.art.form))
    for (const form of ART_FORM_KEYS) {
      // An unused form is dead code; a form with no renderer crashes the card.
      expect(used.has(form)).toBe(true)
    }
  })

  it('tags anything cheesy as dairy, so the dairy rule actually works', () => {
    for (const food of FOODS) {
      if (food.tags.includes('cheesy')) expect(food.tags).toContain('dairy')
    }
  })
})

/* --------------------------- learning --------------------------- */

describe('learned preferences', () => {
  it('nudges toward what you usually like', () => {
    let history = emptyHistory()
    for (let i = 0; i < 4; i++) {
      history = recordSession(history, {
        reactions: [
          { foodId: 'sushi-rolls', value: 'like' },
          { foodId: 'poke-bowl', value: 'like' },
        ],
        recommendedIds: ['sushi-rolls'],
      })
      history = recordChoice(history, 'sushi-rolls')
    }

    const neutral = session()
    const withoutHistory = rankFoods(neutral)
    const withHistory = rankFoods(neutral, history)
    expect(rankOf(withHistory, 'poke-bowl')).toBeLessThan(rankOf(withoutHistory, 'poke-bowl'))
  })

  it('never lets history override what you say you want right now', () => {
    let history = emptyHistory()
    for (let i = 0; i < 10; i++) {
      history = recordSession(history, {
        reactions: [{ foodId: 'acai-bowl', value: 'like' }],
        recommendedIds: ['acai-bowl'],
        chosenId: 'acai-bowl',
      })
    }

    // Despite a strong cold-and-sweet habit, asking for hot savory heavy food wins.
    const results = rankFoods(session({
      hunger: 'starving',
      preferences: prefs({ temperature: 'hot', sweetness: 'savory' }),
    }), history)

    expect(results[0].food.temperature).toBe('hot')
    expect(results[0].food.id).not.toBe('acai-bowl')
    expect(rankOf(results, 'acai-bowl')).toBeGreaterThan(10)
  })

  it('avoids recommending what you just ate', () => {
    const history = recordChoice(emptyHistory(), 'pepperoni-pizza')
    const withRecent = { ...history, sessions: 1 }
    const base = rankFoods(session())
    const after = rankFoods(session(), withRecent)
    expect(rankOf(after, 'pepperoni-pizza')).toBeGreaterThan(rankOf(base, 'pepperoni-pizza'))
  })

  it('records swipes, picks and recency', () => {
    let history = recordSession(emptyHistory(), {
      reactions: [
        { foodId: 'ramen', value: 'like' },
        { foodId: 'tonkotsu-ramen', value: 'like' },
        { foodId: 'caesar-salad', value: 'dislike' },
      ],
      recommendedIds: ['tonkotsu-ramen'],
    })
    history = recordChoice(history, 'tonkotsu-ramen')

    expect(history.sessions).toBe(1)
    expect(history.foods['tonkotsu-ramen'].likes).toBe(1)
    expect(history.foods['tonkotsu-ramen'].chosen).toBe(1)
    expect(history.foods['tonkotsu-ramen'].recommended).toBe(1)
    expect(history.foods['caesar-salad'].dislikes).toBe(1)
    expect(history.recentPicks[0]).toBe('tonkotsu-ramen')
    // Unknown ids are ignored rather than crashing.
    expect(history.foods['ramen']).toBeUndefined()
  })
})

/* ---------------------------- output ---------------------------- */

describe('results output', () => {
  it('explains every top pick with reasons drawn from the scoring', () => {
    const results = rankFoods(session({
      hunger: 'starving',
      preferences: prefs({ temperature: 'hot', texture: 'crispy', spice: 'spicy' }),
    }))

    for (const pick of results.slice(0, 3)) {
      expect(pick.reasons.length).toBeGreaterThan(0)
      // Each displayed reason must trace back to a real positive contribution.
      for (const reason of pick.reasons) {
        const source = pick.contributions.find((c) => c.reason === reason)
        expect(source).toBeDefined()
        expect(source!.points).toBeGreaterThan(0)
      }
    }
  })

  it('keeps match percentages in a sane range, best first', () => {
    const results = rankFoods(session({ preferences: prefs({ temperature: 'hot' }) }))
    for (const pick of results) {
      expect(pick.matchPercent).toBeGreaterThanOrEqual(1)
      expect(pick.matchPercent).toBeLessThanOrEqual(100)
    }
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score)
    expect(results[0].matchPercent).toBeGreaterThan(results[results.length - 1].matchPercent)
  })
})

/* --------------------------- final picks ------------------------ */

describe('final picks', () => {
  const ranked = rankFoods(session({
    hunger: 'starving',
    preferences: prefs({ temperature: 'hot', texture: 'crispy' }),
  }))

  it('never returns three of the same category', () => {
    const counts = new Map<string, number>()
    for (const pick of topPicks(ranked)) {
      counts.set(pick.food.category, (counts.get(pick.food.category) ?? 0) + 1)
    }
    for (const count of counts.values()) expect(count).toBeLessThanOrEqual(2)
  })

  it('always offers something you did not already swipe on', () => {
    // Simulate having said yes to exactly the foods that would win anyway.
    const reacted = new Set(ranked.slice(0, 4).map((r) => r.food.id))
    const picks = topPicks(ranked, reacted)
    expect(picks).toHaveLength(3)
    expect(picks.some((p) => !reacted.has(p.food.id))).toBe(true)
  })

  it('keeps a strong unfamiliar match on merit rather than forcing a swap', () => {
    // Only the second-ranked food was swiped on, so no swap is needed.
    const reacted = new Set([ranked[1].food.id])
    const picks = topPicks(ranked, reacted)
    expect(picks[0].food.id).toBe(ranked[0].food.id)
  })
})

/* --------------------------- similarity ------------------------- */

describe('similarity', () => {
  it('rates a food identical to itself', () => {
    expect(calculateFoodSimilarity(FOOD_BY_ID['smashburger'], FOOD_BY_ID['smashburger'])).toBe(1)
  })

  it('rates near-twins higher than unrelated foods', () => {
    const twins = calculateFoodSimilarity(FOOD_BY_ID['smashburger'], FOOD_BY_ID['bacon-cheeseburger'])
    const strangers = calculateFoodSimilarity(FOOD_BY_ID['smashburger'], FOOD_BY_ID['acai-bowl'])
    expect(twins).toBeGreaterThan(0.6)
    expect(strangers).toBeLessThan(0.1)
  })

  it('connects foods across cuisines when the eating experience matches', () => {
    const crispyChicken = calculateFoodSimilarity(
      FOOD_BY_ID['korean-fried-chicken'],
      FOOD_BY_ID['nashville-hot-chicken'],
    )
    expect(crispyChicken).toBeGreaterThan(WEIGHTS.reaction.similarityFloor)
  })
})

/* ------------------------------ deck ---------------------------- */

describe('deck building', () => {
  const deckInput = {
    hunger: 'normal' as const,
    vetoes: [],
    preferences: { ...DEFAULT_PREFERENCES },
  }

  it('deals a full deck of distinct foods', () => {
    const deck = buildDeck(deckInput, emptyHistory(), 42)
    expect(deck).toHaveLength(WEIGHTS.deck.size)
    expect(new Set(deck.map((f) => f.id)).size).toBe(deck.length)
  })

  it('never shows four burgers in a row', () => {
    const counts = new Map<string, number>()
    for (const food of buildDeck(deckInput, emptyHistory(), 7)) {
      counts.set(food.category, (counts.get(food.category) ?? 0) + 1)
    }
    for (const count of counts.values()) {
      expect(count).toBeLessThanOrEqual(WEIGHTS.deck.maxPerCategory)
    }
  })

  it('respects hard exclusions', () => {
    const deck = buildDeck({ ...deckInput, vetoes: ['seafood', 'meat'] }, emptyHistory(), 3)
    for (const food of deck) {
      expect(food.tags).not.toContain('seafood')
      expect(food.tags).not.toContain('meat')
    }
    expect(deck).toHaveLength(WEIGHTS.deck.size)
  })

  it('is deterministic for a given seed, and varies across seeds', () => {
    const a = buildDeck(deckInput, emptyHistory(), 99).map((f) => f.id)
    const b = buildDeck(deckInput, emptyHistory(), 99).map((f) => f.id)
    const c = buildDeck(deckInput, emptyHistory(), 100).map((f) => f.id)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })
})
