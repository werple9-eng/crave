import type { Food, Reaction, VetoId } from '../types'
import { FOODS, FOOD_BY_ID } from '../data/foods'
import { clamp } from '../engine/similarity'

/**
 * Local, on-device memory of what you tend to like.
 *
 * Nothing leaves the browser. No account, no server, no sync - it's all one
 * localStorage key you can wipe from the Profile screen.
 */

const STORAGE_KEY = 'crave.history.v1'

export interface FoodStat {
  likes: number
  maybes: number
  dislikes: number
  /** Times it appeared in your top 3. */
  recommended: number
  /** Times you actually picked it. The strongest signal we ever get. */
  chosen: number
}

export interface History {
  version: 1
  foods: Record<string, FoodStat>
  /**
   * Running affinity per trait, e.g. `cuisine:japanese` or `trait:crispy`.
   * Positive means you gravitate toward it. Raw and unbounded - it gets
   * normalized against session count when scoring.
   */
  traits: Record<string, number>
  sessions: number
  /** Food ids you picked, most recent first. Used to avoid repeats. */
  recentPicks: string[]
  /**
   * Standing dietary rules. These live here rather than in the session
   * because "I don't eat seafood" isn't a mood - you shouldn't have to
   * re-answer it every single time you're hungry.
   */
  dietary: VetoId[]
}

export function emptyHistory(): History {
  return { version: 1, foods: {}, traits: {}, sessions: 0, recentPicks: [], dietary: [] }
}

function emptyStat(): FoodStat {
  return { likes: 0, maybes: 0, dislikes: 0, recommended: 0, chosen: 0 }
}

export function loadHistory(): History {
  if (typeof localStorage === 'undefined') return emptyHistory()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyHistory()
    const parsed = JSON.parse(raw) as Partial<History>
    if (parsed?.version !== 1) return emptyHistory()
    return {
      version: 1,
      foods: parsed.foods ?? {},
      traits: parsed.traits ?? {},
      sessions: parsed.sessions ?? 0,
      recentPicks: parsed.recentPicks ?? [],
      dietary: parsed.dietary ?? [],
    }
  } catch {
    // Corrupt or blocked storage should never break the app.
    return emptyHistory()
  }
}

export function saveHistory(history: History): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    /* private mode / quota - the app still works, it just won't remember */
  }
}

export function clearHistory(): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/** Every trait key a food contributes to, used for learning and scoring. */
export function traitKeys(food: Food): string[] {
  const keys = [
    `cuisine:${food.cuisine}`,
    `category:${food.category}`,
    `texture:${food.texture}`,
    `temp:${food.temperature}`,
  ]
  if (food.spiceLevel >= 3) keys.push('trait:spicy')
  if (food.heaviness >= 4) keys.push('trait:heavy')
  if (food.heaviness <= 2) keys.push('trait:light')
  if (food.healthiness >= 4) keys.push('trait:healthy')
  if (food.healthiness <= 2) keys.push('trait:indulgent')
  if (food.sweetness >= 4) keys.push('trait:sweet')
  if (food.fillingLevel >= 4) keys.push('trait:filling')
  for (const tag of food.tags) keys.push(`tag:${tag}`)
  return keys
}

function bump(history: History, food: Food, amount: number): void {
  for (const key of traitKeys(food)) {
    history.traits[key] = (history.traits[key] ?? 0) + amount
  }
}

function statFor(history: History, id: string): FoodStat {
  if (!history.foods[id]) history.foods[id] = emptyStat()
  return history.foods[id]
}

export interface SessionRecord {
  reactions: Reaction[]
  /** Ids of the foods that made the top 3. */
  recommendedIds: string[]
  /** The one you actually committed to, if any. */
  chosenId?: string
}

/** Folds one finished session into long-term memory. Returns a new History. */
export function recordSession(history: History, record: SessionRecord): History {
  const next: History = {
    ...history,
    foods: { ...history.foods },
    traits: { ...history.traits },
  }

  for (const reaction of record.reactions) {
    const food = FOOD_BY_ID[reaction.foodId]
    if (!food) continue
    const stat = { ...statFor(next, food.id) }
    if (reaction.value === 'like') {
      stat.likes += 1
      bump(next, food, 1)
    } else if (reaction.value === 'maybe') {
      stat.maybes += 1
      bump(next, food, 0.25)
    } else {
      stat.dislikes += 1
      bump(next, food, -1)
    }
    next.foods[food.id] = stat
  }

  for (const id of record.recommendedIds) {
    const stat = { ...statFor(next, id) }
    stat.recommended += 1
    next.foods[id] = stat
  }

  next.sessions += 1
  return record.chosenId ? recordChoice(next, record.chosenId) : next
}

/**
 * Records the food you actually committed to.
 *
 * Kept separate from `recordSession` because choosing happens after the
 * results appear, and it's the single most reliable thing the app ever
 * learns - you can swipe carelessly, but you don't eat carelessly.
 */
export function recordChoice(history: History, foodId: string): History {
  const food = FOOD_BY_ID[foodId]
  if (!food) return history

  const next: History = {
    ...history,
    foods: { ...history.foods },
    traits: { ...history.traits },
  }
  const stat = { ...statFor(next, food.id) }
  stat.chosen += 1
  next.foods[food.id] = stat
  bump(next, food, 2)
  next.recentPicks = [food.id, ...next.recentPicks.filter((i) => i !== food.id)].slice(0, 12)
  return next
}

/**
 * How much you lean toward a trait, normalized to roughly -1..1.
 *
 * Dividing by session count keeps early sessions from creating a permanent
 * bias off a single swipe, and stops the numbers running away over months.
 */
export function traitAffinity(history: History, key: string): number {
  const raw = history.traits[key] ?? 0
  const denom = Math.max(4, history.sessions * 1.5)
  return clamp(raw / denom, -1, 1)
}

/* ------------------------------------------------------------------ */
/* Profile screen summaries                                            */
/* ------------------------------------------------------------------ */

export interface Tendency {
  label: string
  value: string
}

export interface ProfileSummary {
  sessions: number
  totalSwipes: number
  tendencies: Tendency[]
  topFoods: { food: Food; likes: number; chosen: number }[]
  hasData: boolean
}

const PRETTY: Record<string, string> = {
  'american': 'American', 'italian': 'Italian', 'mexican': 'Mexican',
  'japanese': 'Japanese', 'chinese': 'Chinese', 'korean': 'Korean',
  'thai': 'Thai', 'vietnamese': 'Vietnamese', 'indian': 'Indian',
  'mediterranean': 'Mediterranean', 'middle-eastern': 'Middle Eastern',
  'bbq': 'BBQ', 'breakfast': 'Breakfast', 'dessert': 'Sweets',
  'european': 'European', 'latin': 'Latin American',
  'crispy': 'Crispy', 'soft': 'Soft', 'chewy': 'Chewy', 'saucy': 'Saucy',
  'fresh': 'Fresh', 'mixed': 'Mixed',
  'spicy': 'Spicy food', 'heavy': 'Heavy meals', 'light': 'Light meals',
  'healthy': 'Healthy food', 'indulgent': 'Indulgent food',
  'sweet': 'Sweet things', 'filling': 'Filling meals',
}

function pretty(value: string): string {
  return PRETTY[value] ?? value
}

function topKeyed(history: History, prefix: string): string | null {
  let best: string | null = null
  let bestValue = 0
  for (const [key, value] of Object.entries(history.traits)) {
    if (!key.startsWith(prefix) || value <= bestValue) continue
    bestValue = value
    best = key.slice(prefix.length)
  }
  return best
}

export function summarizeHistory(history: History): ProfileSummary {
  const stats = Object.entries(history.foods)
  const totalSwipes = stats.reduce(
    (sum, [, s]) => sum + s.likes + s.maybes + s.dislikes,
    0,
  )

  const tendencies: Tendency[] = []
  const cuisine = topKeyed(history, 'cuisine:')
  if (cuisine) tendencies.push({ label: 'Go-to cuisine', value: pretty(cuisine) })
  const texture = topKeyed(history, 'texture:')
  if (texture) tendencies.push({ label: 'Favorite texture', value: pretty(texture) })

  // Each comparison gets its own label - repeating "You lean toward" three
  // times down the screen reads like a bug.
  const comparisons = [
    { label: 'Portion size', a: 'trait:heavy', b: 'trait:light' },
    { label: 'Style', a: 'trait:indulgent', b: 'trait:healthy' },
  ]
  for (const row of comparisons) {
    const va = history.traits[row.a] ?? 0
    const vb = history.traits[row.b] ?? 0
    if (va <= 0 && vb <= 0) continue
    tendencies.push({
      label: row.label,
      value: pretty((va >= vb ? row.a : row.b).replace('trait:', '')),
    })
  }
  if ((history.traits['trait:spicy'] ?? 0) > 0) {
    tendencies.push({ label: 'Heat', value: 'You like it spicy' })
  }

  const topFoods = stats
    .map(([id, s]) => ({ food: FOOD_BY_ID[id], likes: s.likes, chosen: s.chosen }))
    .filter((row) => Boolean(row.food))
    .sort((a, b) => b.chosen * 3 + b.likes - (a.chosen * 3 + a.likes))
    .filter((row) => row.chosen > 0 || row.likes > 0)
    .slice(0, 5)

  return {
    sessions: history.sessions,
    totalSwipes,
    tendencies: tendencies.slice(0, 4),
    topFoods,
    hasData: history.sessions > 0 || totalSwipes > 0,
  }
}

/** Used by the Profile screen to show how much of the library you've seen. */
export const TOTAL_FOODS = FOODS.length

/** Dietary rules that remove a food entirely rather than just penalising it. */
export const HARD_VETOES: VetoId[] = ['meat', 'seafood', 'dairy', 'raw']

/** Immutably update the standing dietary rules. */
export function setDietary(history: History, dietary: VetoId[]): History {
  return { ...history, dietary }
}
