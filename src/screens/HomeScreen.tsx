import { useMemo } from 'react'
import { FOODS } from '../data/foods'
import { DIETARY_OPTIONS } from '../data/questions'
import { FoodArt } from '../components/FoodArt'
import { Screen } from '../components/ui'
import { IconDice, IconFlame, IconMoon, IconSun, IconUser, IconUtensils } from '../components/icons'
import { currentDaypart, DAYPART_GREETING, DAYPART_NOTE } from '../engine/daypart'
import type { History } from '../storage/history'
import type { Theme } from '../storage/theme'

export function HomeScreen({
  history, theme, onStart, onSurprise, onProfile, onToggleTheme,
}: {
  history: History
  theme: Theme
  onToggleTheme: () => void
  onStart: () => void
  onSurprise: () => void
  onProfile: () => void
}) {
  // A different dish greets you each time you open it. Costs nothing, and
  // the app feels awake rather than static.
  const hero = useMemo(() => FOODS[Math.floor(Math.random() * FOODS.length)], [])
  const daypart = useMemo(() => currentDaypart(), [])

  const dietary = history.dietary
    .map((id) => DIETARY_OPTIONS.find((o) => o.value === id)?.label)
    .filter(Boolean)

  return (
    <Screen
      center
      right={
        <>
          <button
            className="iconbtn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
          <button className="iconbtn" onClick={onProfile} aria-label="Your food profile">
            <IconUser />
          </button>
        </>
      }
      footer={
        <>
          <button className="btn btn-primary" onClick={onStart}>Find my food</button>
          <button className="btn btn-ghost" onClick={onSurprise}>
            <IconDice size={20} />
            Just tell me what to eat
          </button>
        </>
      }
    >
      <div className="hero">
        <div className="logo">
          <FoodArt food={hero} />
        </div>
        <h1>Crave</h1>
        {/* The time-of-day nudge is stated out loud rather than applied
          * behind your back - it changes what you're shown, so you should
          * be able to see that it's happening. */}
        <p className="greeting">{DAYPART_GREETING[daypart]}</p>
        <p>{DAYPART_NOTE[daypart]}</p>

        {history.sessions > 0 && (
          <div style={{ marginTop: 18 }}>
            <span className="streak">
              <IconFlame size={15} />
              {history.sessions} {history.sessions === 1 ? 'round' : 'rounds'} played
            </span>
          </div>
        )}

        <button className="dietline" onClick={onProfile}>
          <IconUtensils size={15} />
          {dietary.length > 0 ? dietary.join(' · ') : 'No dietary rules set'}
        </button>
      </div>
    </Screen>
  )
}
