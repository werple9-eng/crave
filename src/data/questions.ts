import type { HungerLevel, PreferenceAnswers, VetoId } from '../types'

/**
 * The questionnaire, as data.
 *
 * Three rules keep this from getting annoying:
 *
 * 1. Never ask what cuisine you want. If you knew that, you wouldn't be here.
 * 2. Never ask the same thing twice. The old build asked "not feeling spicy?"
 *    on one screen and "do you want heat?" on the next, plus the same
 *    duplicate pair for hot/cold, heavy, healthy and sweet. Now the mood
 *    questions live here and *only* here, and standing dietary rules live in
 *    your profile where you set them once.
 * 3. Ask what's *off* the table, not what's on it. "I want something crispy"
 *    is a decision you mostly haven't made yet - that's why you're here. "I'm
 *    not doing anything fried right now" is one you already have. Ruling out
 *    is faster and more honest than picking, so every option below is phrased
 *    as a no wherever a no makes sense.
 *
 * How many of these you get asked is decided at runtime - see
 * engine/questionPlan.ts. The order here is only the tie-breaker.
 */

export type QuestionKey = 'hunger' | keyof PreferenceAnswers
export type AnswerValue = HungerLevel | PreferenceAnswers[keyof PreferenceAnswers]

export interface AnswerOption {
  value: AnswerValue
  label: string
  emoji: string
  hint?: string
}

export interface Question {
  key: QuestionKey
  prompt: string
  options: AnswerOption[]
}

/**
 * Hunger is always asked first: it sets portion *and* heaviness, so every
 * later question is scored against a pool that already fits your appetite.
 */
export const HUNGER_QUESTION: Question = {
  key: 'hunger',
  prompt: 'How hungry, honestly?',
  options: [
    { value: 'snack', label: 'Barely', emoji: '🍿', hint: 'just picking at something' },
    { value: 'normal', label: 'Normal hungry', emoji: '🍽️', hint: 'a proper meal' },
    { value: 'starving', label: 'Starving', emoji: '🍜', hint: 'feed me immediately' },
  ],
}

/** Everything after hunger. The planner picks which of these you actually see. */
export const PREFERENCE_QUESTIONS: Question[] = [
  {
    key: 'temperature',
    prompt: "What's not happening?",
    options: [
      { value: 'cold', label: 'Nothing hot', emoji: '🧊', hint: 'cool or room temp' },
      { value: 'hot', label: 'Nothing cold', emoji: '🔥', hint: 'wants to be warm' },
      { value: 'any', label: 'Either, whatever', emoji: '🤷' },
    ],
  },
  {
    key: 'texture',
    prompt: 'Rule one out.',
    options: [
      { value: 'soft', label: 'Nothing fried', emoji: '🍲', hint: 'soft and saucy instead' },
      { value: 'crispy', label: 'Nothing soggy', emoji: '🍟', hint: 'crunch, fried edges' },
      { value: 'any', label: 'No strong feelings', emoji: '🤷' },
    ],
  },
  {
    key: 'spice',
    prompt: 'Where are you on heat?',
    options: [
      { value: 'none', label: 'Not doing spicy', emoji: '🚫' },
      { value: 'mild', label: 'A little is fine', emoji: '🌶️' },
      { value: 'spicy', label: 'Cannot be too hot', emoji: '🔥' },
      { value: 'any', label: 'Genuinely do not mind', emoji: '🤷' },
    ],
  },
  {
    key: 'indulgence',
    prompt: "Which one's off the table?",
    options: [
      { value: 'healthy', label: 'Nothing heavy', emoji: '🥗', hint: 'keep it light' },
      { value: 'indulgent', label: 'Not doing salad', emoji: '🧈', hint: 'zero regrets' },
      { value: 'any', label: 'Somewhere in between', emoji: '🤷' },
    ],
  },
  {
    key: 'sweetness',
    prompt: 'Any hard no here?',
    options: [
      { value: 'savory', label: 'Nothing sweet', emoji: '🧂' },
      { value: 'sweet', label: 'Not doing savoury', emoji: '🍩' },
      { value: 'any', label: 'Either, whatever', emoji: '🤷' },
    ],
  },
  {
    key: 'budget',
    prompt: 'Is money a thing right now?',
    options: [
      { value: 'cheap', label: 'Not spending much', emoji: '💸', hint: 'under about $12' },
      { value: 'treat', label: 'Happy to spend', emoji: '✨', hint: 'worth the money' },
      { value: 'any', label: 'Not a factor', emoji: '🤷' },
    ],
  },
]

/** Every question, hunger first. Used for lookups and tests. */
export const QUESTIONS: Question[] = [HUNGER_QUESTION, ...PREFERENCE_QUESTIONS]

export function questionFor(key: QuestionKey): Question {
  const found = QUESTIONS.find((q) => q.key === key)
  if (!found) throw new Error(`no question for ${key}`)
  return found
}

/** Everything unanswered reads as "don't care", so skipping is always safe. */
export const DEFAULT_PREFERENCES: PreferenceAnswers = {
  temperature: 'any',
  texture: 'any',
  spice: 'any',
  indulgence: 'any',
  sweetness: 'any',
  budget: 'any',
}

/**
 * Standing dietary rules, set once in your profile.
 *
 * `hard` removes those foods from the library entirely. The rest are heavy
 * penalties a genuinely perfect match can still climb back out of.
 */
export const DIETARY_OPTIONS: {
  value: VetoId
  label: string
  emoji: string
  hard: boolean
  note: string
}[] = [
  { value: 'meat', label: 'No meat', emoji: '🥩', hard: true, note: 'removed completely' },
  { value: 'seafood', label: 'No seafood', emoji: '🦐', hard: true, note: 'removed completely' },
  { value: 'dairy', label: 'No dairy', emoji: '🥛', hard: true, note: 'removed completely' },
  { value: 'raw', label: 'Nothing raw', emoji: '🍣', hard: true, note: 'removed completely' },
  { value: 'fried', label: 'Nothing fried', emoji: '🍟', hard: false, note: 'pushed way down' },
  { value: 'bread', label: 'Easy on bread', emoji: '🥖', hard: false, note: 'pushed way down' },
]
