import { useEffect, useState } from 'react'
import type {
  Food, HungerLevel, PreferenceAnswers, Reaction, ReactionValue,
  ScoredFood, SessionInput, VetoId,
} from './types'
import { DEFAULT_PREFERENCES } from './data/questions'
import type { AnswerValue, QuestionKey } from './data/questions'
import { buildDeck } from './engine/deck'
import { rankFoods, topPicks } from './engine/recommend'
import { WEIGHTS } from './engine/weights'
import { currentDaypart } from './engine/daypart'
import {
  clearHistory, emptyHistory, loadHistory, recordChoice, recordSession,
  saveHistory, setDietary,
} from './storage/history'
import type { History } from './storage/history'
import { applyTheme, loadTheme, saveTheme } from './storage/theme'
import type { Theme } from './storage/theme'
import { Ambient } from './components/ui'
import { HomeScreen } from './screens/HomeScreen'
import { QuestionsScreen } from './screens/QuestionsScreen'
import { SwipeScreen } from './screens/SwipeScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ArtGallery } from './screens/ArtGallery'

type Step = 'home' | 'questions' | 'swipe' | 'results' | 'profile'

export default function App() {
  const [step, setStep] = useState<Step>('home')
  const [history, setHistory] = useState<History>(() => loadHistory())
  const [theme, setTheme] = useState<Theme>(() => loadTheme())

  useEffect(() => { applyTheme(theme) }, [theme])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  // Current session
  const [hunger, setHunger] = useState<HungerLevel | null>(null)
  const [preferences, setPreferences] = useState<PreferenceAnswers>(DEFAULT_PREFERENCES)
  const [deck, setDeck] = useState<Food[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [picks, setPicks] = useState<ScoredFood[]>([])
  const [headline, setHeadline] = useState("Here's what you should eat.")

  const persist = (next: History) => {
    setHistory(next)
    saveHistory(next)
  }

  const start = () => {
    setHunger(null)
    setPreferences(DEFAULT_PREFERENCES)
    setReactions([])
    setDeck([])
    setStep('questions')
  }

  const answer = (key: QuestionKey, value: AnswerValue) => {
    if (key === 'hunger') {
      setHunger(value as HungerLevel)
    } else {
      // Safe: each option's value comes from that question's own key.
      setPreferences((prev) => ({ ...prev, [key]: value }) as PreferenceAnswers)
    }
  }

  const openDeck = () => {
    setDeck(buildDeck(
      { hunger: hunger ?? 'normal', daypart: currentDaypart(), vetoes: history.dietary, preferences },
      history,
      Math.floor(Math.random() * 1_000_000),
    ))
    setReactions([])
    setStep('swipe')
  }

  /**
   * Finishes the round.
   *
   * Ranking uses the history from *before* this session so the swipes you
   * just made aren't counted twice - once as reactions, once as learned taste.
   */
  const finish = (finalReactions: Reaction[]) => {
    const input: SessionInput = {
      hunger: hunger ?? 'normal',
      daypart: currentDaypart(),
      vetoes: history.dietary,
      preferences,
      reactions: finalReactions,
    }
    // Six, but only three are shown up front - the rest are behind
    // "show me 3 more" for when none of the top picks land.
    const results = topPicks(
      rankFoods(input, history),
      new Set(finalReactions.map((r) => r.foodId)),
      WEIGHTS.results.computed,
    )
    setPicks(results)
    setHeadline("Here's what you should eat.")
    persist(recordSession(history, {
      reactions: finalReactions,
      // Only what was actually put in front of you counts as recommended.
      recommendedIds: results.slice(0, WEIGHTS.results.shown).map((r) => r.food.id),
    }))
    setStep('results')
  }

  const react = (foodId: string, value: ReactionValue) => {
    const next = [...reactions, { foodId, value }]
    setReactions(next)
    if (next.length >= deck.length) finish(next)
  }

  /** No questions, no swiping - just commit to something reasonable. */
  const surprise = () => {
    const input: SessionInput = {
      hunger: 'normal',
      daypart: currentDaypart(),
      vetoes: history.dietary,
      preferences: DEFAULT_PREFERENCES,
      reactions: [],
    }
    const pool = rankFoods(input, history).slice(0, 20)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    // One per category here: if you're not answering questions, near
    // identical options are the opposite of helpful.
    setPicks(topPicks(pool, new Set(), WEIGHTS.results.computed, 1))
    setHeadline('Stop thinking. Eat this.')
    setStep('results')
  }

  const choose = (foodId: string) => persist(recordChoice(history, foodId))

  const reset = () => {
    clearHistory()
    setHistory(emptyHistory())
  }

  const updateDietary = (dietary: VetoId[]) => persist(setDietary(history, dietary))

  const screen = () => {
    switch (step) {
      case 'questions':
        return (
          <QuestionsScreen
            hunger={hunger}
            preferences={preferences}
            onAnswer={answer}
            onDone={openDeck}
            onSkip={openDeck}
            onBack={() => setStep('home')}
          />
        )

      case 'swipe':
        return (
          <SwipeScreen
            deck={deck}
            reactions={reactions}
            onReact={react}
            onUndo={() => setReactions(reactions.slice(0, -1))}
            onFinishEarly={() => finish(reactions)}
            onBack={() => setStep('questions')}
          />
        )

      case 'results':
        return (
          <ResultsScreen
            picks={picks}
            headline={headline}
            onChoose={choose}
            onRetry={openDeck}
            onHome={() => setStep('home')}
          />
        )

      case 'profile':
        return (
          <ProfileScreen
            history={history}
            onSetDietary={updateDietary}
            onReset={reset}
            onBack={() => setStep('home')}
          />
        )

      default:
        return (
          <HomeScreen
            history={history}
            theme={theme}
            onToggleTheme={toggleTheme}
            onStart={start}
            onSurprise={surprise}
            onProfile={() => setStep('profile')}
          />
        )
    }
  }

  // Dev-only contact sheet for the illustrations. Stripped from production.
  if (import.meta.env.DEV && typeof location !== 'undefined' && location.hash === '#gallery') {
    return (
      <>
        <Ambient />
        <ArtGallery />
      </>
    )
  }

  return (
    <>
      <Ambient />
      {screen()}
    </>
  )
}
