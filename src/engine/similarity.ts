import type { Food, Tag } from '../types'

/**
 * How alike two foods are, from 0 (nothing in common) to 1 (basically twins).
 *
 * This is what lets one swipe teach the engine about foods you never saw.
 * Liking Korean fried chicken should lift Nashville hot chicken and buffalo
 * wings, because they share category (fried), texture (crispy) and most tags -
 * even though the cuisines differ.
 *
 * The weights below sum to 1.0.
 */
export function calculateFoodSimilarity(a: Food, b: Food): number {
  if (a.id === b.id) return 1

  let score = 0

  // What kind of thing it is matters most - a burger is a burger.
  if (a.category === b.category) score += 0.22
  if (a.cuisine === b.cuisine) score += 0.2
  if (a.texture === b.texture) score += 0.14
  if (a.temperature === b.temperature) score += 0.06

  // Numeric attributes: closer values, more similarity.
  score += 0.1 * closeness(a.heaviness, b.heaviness, 4)
  score += 0.1 * closeness(a.spiceLevel, b.spiceLevel, 5)
  score += 0.06 * closeness(a.healthiness, b.healthiness, 4)
  score += 0.07 * closeness(a.sweetness, b.sweetness, 5)

  score += 0.15 * jaccard(a.tags, b.tags)

  // Two foods with nothing whatsoever in common still collect ~0.15 from the
  // numeric terms, because they're both non-spicy and roughly as sweet as each
  // other. Shared *absence* of a trait isn't evidence of similarity, so we
  // subtract that floor and rescale - otherwise a burger reads as 20% similar
  // to an acai bowl and every reaction leaks into unrelated foods.
  return clamp01((score - BASELINE) / (1 - BASELINE))
}

const BASELINE = 0.15

/** 1 when the values are equal, 0 when they're `range` apart. */
function closeness(x: number, y: number, range: number): number {
  return clamp01(1 - Math.abs(x - y) / range)
}

/** Overlap of two tag sets: shared tags divided by total distinct tags. */
function jaccard(a: Tag[], b: Tag[]): number {
  if (a.length === 0 && b.length === 0) return 0
  const setB = new Set<Tag>(b)
  let shared = 0
  for (const tag of a) if (setB.has(tag)) shared += 1
  const union = new Set<Tag>([...a, ...b]).size
  return union === 0 ? 0 : shared / union
}

export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n
}

export function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n
}
