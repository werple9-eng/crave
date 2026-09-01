import type { HungerLevel, PreferenceAnswers, VetoId } from '../types'

/**
 * The questionnaire, as data.
 *
 * Two rules keep this from getting annoying:
 *
 * 1. Never ask what cuisine you want. If you knew that, you wouldn't be here.
 * 2. Never ask the same thing twice. The old build asked "not feeling spicy?"
 *    on one screen and "do you want heat?" on the next, plus the same
 *    duplicate pair for hot/cold, heaviness, healthiness and sweetness. Now
 *    the mood questions live here and *only* here, and standing dietary rules
 *    live in your profile where you set them once.
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
    prompt: 'Hot or cold?',
    options: [
      { value: 'hot', label: 'Something hot', emoji: '🔥' },
      { value: 'cold', label: 'Something cold', emoji: '🧊' },
      { value: 'any', label: 'Either, whatever', emoji: '🤷' },
    ],
  },
  {
    key: 'texture',
    prompt: 'What sounds better?',
    options: [
      { value: 'crispy', label: 'Crispy', emoji: '🍟', hint: 'crunch, fried edges' },
      { value: 'soft', label: 'Soft and saucy', emoji: '🍲', hint: 'warm, comforting' },
      { value: 'any', label: 'No strong feelings', emoji: '🤷' },
    ],
  },
  {
    key: 'spice',
    prompt: 'How much heat?',
    options: [
      { value: 'none', label: 'None', emoji: '🚫' },
      { value: 'mild', label: 'A little kick', emoji: '🌶️' },
      { value: 'spicy', label: 'Bring it', emoji: '🔥' },
      { value: 'any', label: "Don't care", emoji: '🤷' },
    ],
  },
  {
    key: 'indulgence',
    prompt: 'Being good, or not?',
    options: [
      { value: 'healthy', label: 'Something healthy', emoji: '🥗', hint: 'keep it light' },
      { value: 'indulgent', label: 'Zero regrets', emoji: '🧈', hint: 'go for it' },
      { value: 'any', label: 'Somewhere in between', emoji: '🤷' },
    ],
  },
  {
    key: 'sweetness',
    prompt: 'Sweet or savory?',
    options: [
      { value: 'sweet', label: 'Sweet', emoji: '🍩' },
      { value: 'savory', label: 'Savory', emoji: '🧂' },
      { value: 'any', label: 'Either, whatever', emoji: '🤷' },
    ],
  },
  {
    key: 'budget',
    prompt: 'What are we spending?',
    options: [
      { value: 'cheap', label: 'Keep it cheap', emoji: '💸', hint: 'under about $12' },
      { value: 'treat', label: 'Treat myself', emoji: '✨', hint: 'worth the money' },
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
