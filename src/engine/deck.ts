import type { Contribution, Daypart, Food, HungerLevel, PreferenceAnswers, VetoId } from '../types'
import { FOODS } from '../data/foods'
import { WEIGHTS } from './weights'
import { isHardExcluded, scoreAppetite, scorePreferenceMatch, scoreHistory, scoreVetoes } from './recommend'
import { scoreDaypart } from './daypart'
import { emptyHistory } from '../storage/history'
import type { History } from '../storage/history'

/**
 * Chooses which foods you get to swipe on.
 *
 * This matters more than it sounds. If the deck is just "the ten highest
 * pre-scoring foods" you end up staring at four burgers and three pizzas,
 * which teaches the engine nothing and feels broken. So we take a strong
 * candidate pool, then pick greedily under diversity caps, and finish with a
 * couple of wildcards from further down so there's always something you
 * hadn't considered.
 */

export interface DeckInput {
  hunger: HungerLevel
  daypart?: Daypart
  vetoes: VetoId[]
  preferences: PreferenceAnswers
}

/** Small deterministic RNG so a given seed always yields the same deck. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Score before any swipes have happened - questionnaire, hunger, vetoes, history. */
export function preScore(food: Food, input: DeckInput, history: History): number {
  const contributions = [
    ...scorePreferenceMatch(food, input.preferences),
    ...scoreAppetite(food, input.hunger),
    ...scoreVetoes(food, input.vetoes),
    ...(input.daypart ? [scoreDaypart(food, input.daypart)].filter(Boolean) as Contribution[] : []),
    ...scoreHistory(food, history),
  ]
  return contributions.reduce((sum, c) => sum + c.points, 0)
}

export function buildDeck(
  input: DeckInput,
  history: History = emptyHistory(),
  seed = 1,
  size = WEIGHTS.deck.size,
): Food[] {
  const rng = mulberry32(seed)
  const D = WEIGHTS.deck

  const ranked = FOODS
    .filter((food) => !isHardExcluded(food, input.vetoes))
    // Jitter keeps two identical sessions from producing an identical deck.
    .map((food) => ({ food, score: preScore(food, input, history) + (rng() - 0.5) * D.jitter }))
    .sort((a, b) => b.score - a.score)

  const categories = new Map<string, number>()
  const cuisines = new Map<string, number>()
  const chosen: Food[] = []

  const tryTake = (food: Food): boolean => {
    const catCount = categories.get(food.category) ?? 0
    const cuisineCount = cuisines.get(food.cuisine) ?? 0
    if (catCount >= D.maxPerCategory || cuisineCount >= D.maxPerCuisine) return false
    categories.set(food.category, catCount + 1)
    cuisines.set(food.cuisine, cuisineCount + 1)
    chosen.push(food)
    return true
  }

  // Leave room for wildcards from outside the top of the list.
  const mainSlots = Math.max(1, size - D.wildcards)
  for (const row of ranked) {
    if (chosen.length >= mainSlots) break
    tryTake(row.food)
  }

  // Wildcards: something from the middle you wouldn't have picked yourself.
  const wildcardPool = ranked
    .slice(mainSlots)
    .filter((row) => !chosen.includes(row.food))
  shuffle(wildcardPool, rng)
  for (const row of wildcardPool) {
    if (chosen.length >= size) break
    tryTake(row.food)
  }

  // Diversity caps can starve the deck when vetoes shrink the library.
  // Backfill with anything eligible rather than showing a short deck.
  if (chosen.length < size) {
    for (const row of ranked) {
      if (chosen.length >= size) break
      if (!chosen.includes(row.food)) chosen.push(row.food)
    }
  }

  // Present them mixed rather than strictly best-first, so the last few cards
  // aren't always the odd ones out.
  shuffle(chosen, rng)
  return chosen.slice(0, size)
}

function shuffle<T>(items: T[], rng: () => number): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
}
