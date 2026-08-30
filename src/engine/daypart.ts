import type { Contribution, Daypart, Food } from '../types'
import { WEIGHTS } from './weights'
import { clamp } from './similarity'

/**
 * Time of day.
 *
 * Two well-supported effects are worth designing around, and neither of them
 * is a growth trick:
 *
 * 1. **Appetite is contextual.** What sounds good at 8am and at 11pm are
 *    genuinely different foods. An app that offers pancakes at midnight feels
 *    broken, and one that reads the clock feels like it knows you.
 * 2. **Relevance drives return use far better than nagging does.** The app
 *    earns a second visit by being right at 7pm, not by guilt-tripping a
 *    streak. There is deliberately no "don't lose your streak" prompt here.
 *
 * The weight is small on purpose - it breaks ties, it never overrules what
 * you actually said you wanted.
 */

export type { Daypart }

export function daypartOf(hour: number): Daypart {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 16) return 'midday'
  if (hour >= 16 && hour < 22) return 'evening'
  return 'latenight'
}

export function currentDaypart(now = new Date()): Daypart {
  return daypartOf(now.getHours())
}

export const DAYPART_GREETING: Record<Daypart, string> = {
  morning: 'Morning. What sounds good?',
  midday: 'Lunchtime. What sounds good?',
  evening: 'Evening. What sounds good?',
  latenight: 'Late one. What sounds good?',
}

/** Shown under the greeting, so the nudge is visible rather than sneaky. */
export const DAYPART_NOTE: Record<Daypart, string> = {
  morning: 'Leaning toward breakfast things right now.',
  midday: 'Leaning toward something you can eat in half an hour.',
  evening: 'Leaning toward a proper dinner.',
  latenight: 'Leaning toward comfort food, obviously.',
}

/**
 * A gentle nudge toward food that fits the hour.
 *
 * Returns null outside the cases worth nudging, so most dishes get no
 * contribution at all and the results screen stays uncluttered.
 */
export function scoreDaypart(food: Food, daypart: Daypart): Contribution | null {
  const w = WEIGHTS.daypart
  const isBreakfast = food.cuisine === 'breakfast' || food.category === 'breakfast'
  let points = 0
  let reason = ''

  switch (daypart) {
    case 'morning':
      if (isBreakfast) { points = w; reason = 'Breakfast, and it is the morning' }
      else if (food.heaviness >= 4) { points = -w * 0.7; reason = '' }
      break
    case 'midday':
      // Lunch skews lighter and quicker than dinner.
      points = clamp(w * (1 - Math.abs(food.heaviness - 3) / 2), -w, w) * 0.6
      if (points > 1) reason = 'A sensible size for the middle of the day'
      if (isBreakfast) points -= w * 0.4
      break
    case 'evening':
      if (isBreakfast) { points = -w * 0.8; reason = '' }
      else if (food.fillingLevel >= 4) { points = w * 0.7; reason = 'Proper dinner food' }
      break
    case 'latenight':
      if (food.tags.includes('comfort')) { points = w; reason = 'Exactly the right kind of late-night food' }
      else if (food.healthiness >= 5) { points = -w * 0.6; reason = '' }
      break
  }

  if (points === 0) return null
  return { source: 'daypart', reason: reason || 'Fits the time of day', points, max: w }
}
