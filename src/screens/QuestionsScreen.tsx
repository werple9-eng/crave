import { useEffect, useState } from 'react'
import type { HungerLevel, PreferenceAnswers } from '../types'
import { QUESTIONS } from '../data/questions'
import type { AnswerValue, QuestionKey } from '../data/questions'
import { Option, Pips, Screen, buzz } from '../components/ui'
import { IconForward } from '../components/icons'

/**
 * The whole questionnaire, one screen.
 *
 * This replaces three separate screens (hunger, then vetoes, then cravings)
 * that between them asked you about heat, temperature, heaviness and sweetness
 * *twice*. Now it's one pass, one tap per question, auto-advancing, and you
 * can bail out to the food at any point.
 */
export function QuestionsScreen({
  hunger, preferences, onAnswer, onDone, onSkip, onBack,
}: {
  hunger: HungerLevel | null
  preferences: PreferenceAnswers
  onAnswer: (key: QuestionKey, value: AnswerValue) => void
  onDone: () => void
  onSkip: () => void
  onBack: () => void
}) {
  const [index, setIndex] = useState(0)
  const [pending, setPending] = useState<AnswerValue | null>(null)
  /**
   * Which questions you've actually answered.
   *
   * Needed because every preference defaults to `'any'`, which is also a real
   * option ("Either works") - without this, every unanswered question renders
   * with that option already ticked, as though you'd chosen it.
   */
  const [answered, setAnswered] = useState<Set<QuestionKey>>(() => new Set())
  const question = QUESTIONS[index]

  const currentValue: AnswerValue | null =
    question.key === 'hunger' ? hunger : preferences[question.key]
  const showSelection = answered.has(question.key)

  const choose = (answer: AnswerValue) => {
    if (pending) return
    buzz(8)
    setPending(answer)
    setAnswered((prev) => new Set(prev).add(question.key))
    onAnswer(question.key, answer)
    // Brief pause so the selection actually registers visually.
    window.setTimeout(() => {
      setPending(null)
      if (index + 1 >= QUESTIONS.length) onDone()
      else setIndex(index + 1)
    }, 190)
  }

  const back = () => {
    if (index === 0) onBack()
    else setIndex(index - 1)
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

  return (
    <Screen
      onBack={back}
      step={`${index + 1} of ${QUESTIONS.length}`}
      right={
        index > 0 ? (
          <button className="btn-text" style={{ width: 'auto', padding: '8px 4px' }} onClick={onSkip}>
            Skip to food
            <IconForward size={15} />
          </button>
        ) : undefined
      }
    >
      <Pips total={QUESTIONS.length} current={index} />
      <h2 className="title">{question.prompt}</h2>
      <p className="subtitle">Go with your gut. There's no wrong answer.</p>
      <div className="options">
        {question.options.map((option, i) => (
          <Option
            key={`${question.key}-${String(option.value)}`}
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
