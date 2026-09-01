import { useEffect, useMemo, useState } from 'react'
import type { HungerLevel, PreferenceAnswers, VetoId } from '../types'
import { HUNGER_QUESTION, questionFor } from '../data/questions'
import type { AnswerValue, QuestionKey } from '../data/questions'
import { MIN_QUESTIONS, planNext, progressFor } from '../engine/questionPlan'
import { Option, Progress, Screen, buzz } from '../components/ui'
import { IconForward } from '../components/icons'

/**
 * The questionnaire, one question at a time.
 *
 * How many you get is not fixed - after each answer the planner looks at
 * what's still plausible and either picks the question that best splits it or
 * decides we already know enough. Answer decisively and this is three
 * questions; shrug at everything and it's up to seven.
 *
 * The step label deliberately never says "3 of 8", because that would be a
 * lie the moment the count changes. It counts down dishes instead, which is
 * the thing actually happening.
 */
export function QuestionsScreen({
  hunger, preferences, vetoes, onAnswer, onDone, onSkip, onBack,
}: {
  hunger: HungerLevel | null
  preferences: PreferenceAnswers
  vetoes: VetoId[]
  onAnswer: (key: QuestionKey, value: AnswerValue) => void
  onDone: () => void
  onSkip: () => void
  onBack: () => void
}) {
  /** Answered keys, in the order they were asked, so Back can retrace. */
  const [asked, setAsked] = useState<QuestionKey[]>([])
  const [current, setCurrent] = useState<QuestionKey>('hunger')
  const [pending, setPending] = useState<AnswerValue | null>(null)

  const answered = useMemo(() => new Set(asked), [asked])
  const question = current === 'hunger' ? HUNGER_QUESTION : questionFor(current)

  /** What the pool looks like *before* this question is answered. */
  const plan = useMemo(
    () => planNext(hunger, preferences, answered, vetoes),
    [hunger, preferences, answered, vetoes],
  )

  const showSelection = answered.has(current)
  const currentValue: AnswerValue | null =
    current === 'hunger' ? hunger : preferences[current]

  const choose = (answer: AnswerValue) => {
    if (pending) return
    buzz(8)
    setPending(answer)
    onAnswer(current, answer)

    // Brief pause so the selection actually registers visually.
    window.setTimeout(() => {
      setPending(null)
      const nextAnswered = new Set(answered).add(current)
      const nextPrefs =
        current === 'hunger'
          ? preferences
          : ({ ...preferences, [current]: answer } as PreferenceAnswers)
      const nextHunger = current === 'hunger' ? (answer as HungerLevel) : hunger

      const step = planNext(nextHunger, nextPrefs, nextAnswered, vetoes)
      setAsked((prev) => (prev.includes(current) ? prev : [...prev, current]))
      if (step.next === null) onDone()
      else setCurrent(step.next)
    }, 190)
  }

  const back = () => {
    if (asked.length === 0) return onBack()
    const previous = asked[asked.length - 1]
    setAsked((prev) => prev.slice(0, -1))
    setCurrent(previous)
  }

  // Number keys pick an option on desktop.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const slot = Number(event.key)
      if (slot >= 1 && slot <= question.options.length) {
        choose(question.options[slot - 1].value)
      } else if (event.key === 'Backspace') {
        back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const count = asked.length
  const step =
    count === 0
      ? 'First one'
      : plan.remaining > 40
        ? `${plan.remaining} still in play`
        : `Down to ${plan.remaining}`

  return (
    <Screen
      onBack={back}
      step={step}
      right={
        count > 0 ? (
          <button className="btn-text" style={{ width: 'auto', padding: '8px 4px' }} onClick={onSkip}>
            Skip ahead
            <IconForward size={15} />
          </button>
        ) : undefined
      }
    >
      <Progress value={progressFor(count, plan.remaining)} />
      <h2 className="title">{question.prompt}</h2>
      <p className="subtitle">
        {count === 0
          ? 'A few quick ones. Go with your gut.'
          : count + 1 > MIN_QUESTIONS
            ? 'Nearly there. Whatever comes to mind.'
            : "Easier to say what you don't want."}
      </p>
      <div className="options">
        {question.options.map((option, i) => (
          <Option
            key={`${current}-${String(option.value)}`}
            emoji={option.emoji}
            label={option.label}
            hint={option.hint}
            index={i}
            selected={
              pending === option.value ||
              (pending === null && showSelection && currentValue === option.value)
            }
            onClick={() => choose(option.value)}
          />
        ))}
      </div>
    </Screen>
  )
}
