import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { FOODS, FOOD_BY_ID } from '../data/foods'
import { PHOTOS } from '../data/photos'
import { DIETARY_OPTIONS } from '../data/questions'
import { FoodArt } from '../components/FoodArt'
import { Screen } from '../components/ui'
import {
  IconDice, IconFlame, IconForward, IconUser, IconUtensils,
} from '../components/icons'
import { currentDaypart, DAYPART_GREETING, DAYPART_NOTE } from '../engine/daypart'
import type { History } from '../storage/history'

/**
 * The opening screen.
 *
 * It used to be a centered logo with the app's name under it — a splash
 * screen, basically, which told you nothing and made you read a brand before
 * you could do the one thing you came for.
 *
 * Now the question is the headline, a strip of real dishes does the work of
 * making you hungry, and the answer to "what did I have last time?" is right
 * there. The brand is a small mark in the corner where it belongs.
 */
export function HomeScreen({
  history, onStart, onSurprise, onProfile,
}: {
  history: History
  onStart: () => void
  onSurprise: () => void
  onProfile: () => void
}) {
  const daypart = useMemo(() => currentDaypart(), [])

  /**
   * Three dishes across the top, favouring ones we have a photo of.
   *
   * Reshuffled every visit: seeing actual food is what makes you hungry, and
   * it quietly shows how much is in here.
   */
  const teaser = useMemo(() => {
    const withPhotos = FOODS.filter((f) => PHOTOS[f.id])
    const pool = withPhotos.length >= 12 ? withPhotos : FOODS
    const picked: typeof FOODS = []
    const seen = new Set<string>()
    while (picked.length < 3 && seen.size < pool.length) {
      const f = pool[Math.floor(Math.random() * pool.length)]
      if (seen.has(f.id)) continue
      seen.add(f.id)
      picked.push(f)
    }
    return picked
  }, [])

  const lastPick = history.recentPicks[0] ? FOOD_BY_ID[history.recentPicks[0]] : undefined

  const dietary = history.dietary
    .map((id) => DIETARY_OPTIONS.find((o) => o.value === id)?.label)
    .filter(Boolean)

  return (
    <Screen
      right={
        <button className="iconbtn" onClick={onProfile} aria-label="Your food profile">
          <IconUser />
        </button>
      }
      footer={
        <>
          <button className="btn btn-primary btn-hero" onClick={onStart}>
            Find my food
            <IconForward size={20} />
          </button>
          <button className="btn btn-ghost" onClick={onSurprise}>
            <IconDice size={20} />
            Just tell me what to eat
          </button>
        </>
      }
    >
      <div className="opener">
        <span className="wordmark">Crave</span>

        <h1 className="opener-h">{DAYPART_GREETING[daypart]}</h1>
        {/* The time-of-day nudge is stated out loud rather than applied behind
          * your back — it changes what you're shown. */}
        <p className="opener-sub">{DAYPART_NOTE[daypart]}</p>

        <div className="teaser" aria-hidden="true">
          {teaser.map((food, i) => (
            <div className="teaser-card" key={food.id} style={{ '--i': i } as CSSProperties}>
              <FoodArt food={food} />
            </div>
          ))}
        </div>

        <div className="opener-meta">
          {lastPick && (
            <span className="metaline">
              Last time you picked <strong>{lastPick.name}</strong>
            </span>
          )}
          <div className="opener-chips">
            {history.sessions > 0 && (
              <span className="streak">
                <IconFlame size={15} />
                {history.sessions} {history.sessions === 1 ? 'round' : 'rounds'}
              </span>
            )}
            <button className="dietline" onClick={onProfile}>
              <IconUtensils size={15} />
              {dietary.length > 0 ? dietary.join(' · ') : 'No dietary rules'}
            </button>
          </div>
        </div>
      </div>
    </Screen>
  )
}
