import { useEffect, useState } from 'react'
import type { Food, ScoredFood } from '../types'
import { FoodArt } from '../components/FoodArt'
import { Confetti } from '../components/Confetti'
import { Screen, buzz } from '../components/ui'
import {
  IconCheck, IconMapPin, IconPlus, IconRefresh, IconSparkle,
} from '../components/icons'
import { WEIGHTS } from '../engine/weights'

/**
 * Three dishes, not fifty restaurants.
 *
 * The reasons under each card come straight out of the scoring engine, so
 * they always describe why the food actually won.
 */

/** Animates a number up from zero. Makes the match score feel earned. */
function useCountUp(target: number, duration = 950, delay = 0): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    let startedAt = 0
    const tick = (now: number) => {
      if (!startedAt) startedAt = now
      const elapsed = now - startedAt - delay
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, elapsed / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, delay])

  return value
}

function ResultCard({
  pick, rank, onChoose,
}: {
  pick: ScoredFood
  rank: number
  onChoose: (food: Food) => void
}) {
  // Capped so a revealed fifth card doesn't sit at 0% for a second first.
  const percent = useCountUp(pick.matchPercent, 900, 240 + Math.min(rank, 2) * 120)

  return (
    <button
      className={rank === 0 ? 'result top' : 'result'}
      style={{ animationDuration: `${480 + rank * 170}ms` }}
      onClick={() => onChoose(pick.food)}
    >
      <span className="thumb" aria-hidden="true">
        <FoodArt food={pick.food} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="rank" aria-hidden="true">{rank + 1}</span>
        <span className="rname">{pick.food.name}</span>
        <span className="rdesc">{pick.food.description}</span>
        <span className="matchrow">
          <span className="matchbar">
            <i style={{ transform: `scaleX(${percent / 100})` }} />
          </span>
          <span className="matchnum">{percent}% match</span>
        </span>
        {pick.reasons.length > 0 && (
          <span className="reasons">
            {pick.reasons.map((reason) => (
              <span key={reason}>
                <IconCheck size={14} strokeWidth={2.6} />
                {reason}
              </span>
            ))}
          </span>
        )}
      </span>
    </button>
  )
}

export function ResultsScreen({
  picks, headline, onChoose, onRetry, onHome,
}: {
  picks: ScoredFood[]
  headline: string
  onChoose: (foodId: string) => void
  onRetry: () => void
  onHome: () => void
}) {
  const [chosen, setChosen] = useState<Food | null>(null)
  const [expanded, setExpanded] = useState(false)

  // Three is the answer. The rest are there for when none of them land - but
  // only the ones that are still a real match; offering a 12% match as a
  // recommendation makes the whole list look broken.
  const top = picks.slice(0, WEIGHTS.results.shown)
  const extras = picks
    .slice(WEIGHTS.results.shown)
    .filter((p) => p.matchPercent >= WEIGHTS.results.minExtraMatch)
  const visible = expanded ? [...top, ...extras] : top

  const choose = (food: Food) => {
    buzz([12, 40, 18])
    setChosen(food)
    onChoose(food.id)
  }

  return (
    <Screen
      onBack={onHome}
      step="Your pick"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onRetry}>
            <IconRefresh size={19} />
            Not feeling these — try again
          </button>
          <button className="btn-text" onClick={onHome}>Back to start</button>
        </>
      }
    >
      <h2 className="title">{headline}</h2>
      <p className="subtitle">Tap one to lock it in.</p>

      <div className="results">
        {visible.map((pick, i) => (
          <ResultCard key={pick.food.id} pick={pick} rank={i} onChoose={choose} />
        ))}
      </div>

      {extras.length > 0 && !expanded && (
        <button className="btn-text" style={{ marginTop: 14 }} onClick={() => setExpanded(true)}>
          <IconPlus size={16} />
          Show me {extras.length} more
        </button>
      )}

      {chosen && (
        <>
          <Confetti />
          <div className="backdrop" onClick={() => setChosen(null)}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
              <div className="mart" aria-hidden="true">
                <FoodArt food={chosen} animate />
              </div>
              <div className="mlabel">Tonight's pick</div>
              <div className="mname">{chosen.name}</div>
              <p className="mdesc">{chosen.description}</p>
              <a
                className="btn btn-primary"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chosen.name + ' near me')}`}
                target="_blank"
                rel="noreferrer"
              >
                <IconMapPin size={20} />
                Find it near me
              </a>
              <button className="btn btn-ghost" onClick={() => setChosen(null)}>
                <IconSparkle size={19} />
                Show me the others again
              </button>
              <button className="btn-text" onClick={onHome}>Done</button>
            </div>
          </div>
        </>
      )}
    </Screen>
  )
}
