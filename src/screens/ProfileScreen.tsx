import { useState } from 'react'
import type { VetoId } from '../types'
import { DIETARY_OPTIONS } from '../data/questions'
import { FoodArt } from '../components/FoodArt'
import { Screen, buzz } from '../components/ui'
import { IconTrash } from '../components/icons'
import { summarizeHistory, TOTAL_FOODS } from '../storage/history'
import type { History } from '../storage/history'

/**
 * What the app has learned, plus your standing dietary rules.
 *
 * The dietary rules live here rather than in the session flow on purpose:
 * they're settings, not moods, so you set them once instead of answering
 * "any seafood?" every single time you get hungry.
 */
export function ProfileScreen({
  history, onSetDietary, onReset, onCredits, onBack,
}: {
  history: History
  onSetDietary: (dietary: VetoId[]) => void
  onReset: () => void
  onCredits: () => void
  onBack: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const summary = summarizeHistory(history)

  const toggle = (id: VetoId) => {
    buzz(8)
    onSetDietary(
      history.dietary.includes(id)
        ? history.dietary.filter((v) => v !== id)
        : [...history.dietary, id],
    )
  }

  return (
    <Screen onBack={onBack} step="Your food brain">
      <h2 className="title">Your profile</h2>
      <p className="subtitle">
        Everything here stays on this device. Nothing is uploaded anywhere.
      </p>

      <div className="sectiontitle">Always avoid</div>
      <div className="chips" style={{ marginBottom: 8 }}>
        {DIETARY_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={history.dietary.includes(option.value) ? 'chip on' : 'chip'}
            onClick={() => toggle(option.value)}
            aria-pressed={history.dietary.includes(option.value)}
          >
            <span aria-hidden="true">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
      <p className="subtitle" style={{ fontSize: 13.5, marginBottom: 24 }}>
        Set once, applies every time. The first four remove those foods completely;
        fried and bread just get pushed way down.
      </p>

      {!summary.hasData ? (
        <p className="empty">
          Nothing learned yet.<br />Finish a round or two and your patterns show up here.
        </p>
      ) : (
        <>
          <div className="statgrid">
            <div className="stat">
              <div className="snum">{summary.sessions}</div>
              <div className="slabel">{summary.sessions === 1 ? 'round played' : 'rounds played'}</div>
            </div>
            <div className="stat">
              <div className="snum">{summary.totalSwipes}</div>
              <div className="slabel">of {TOTAL_FOODS} dishes rated</div>
            </div>
          </div>

          {summary.tendencies.length > 0 && (
            <>
              <div className="sectiontitle">Patterns</div>
              <div className="rows">
                {summary.tendencies.map((tendency, i) => (
                  <div className="row" key={`${tendency.label}-${i}`}>
                    <span className="rlabel">{tendency.label}</span>
                    <span className="rvalue">{tendency.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {summary.topFoods.length > 0 && (
            <>
              <div className="sectiontitle">Your top foods</div>
              <div className="rows">
                {summary.topFoods.map((row) => (
                  <div className="row" key={row.food.id}>
                    <span className="rleft">
                      <span className="remoji" aria-hidden="true">
                        <FoodArt food={row.food} />
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span className="rvalue" style={{ display: 'block' }}>{row.food.name}</span>
                        <span className="rsub">{row.food.description}</span>
                      </span>
                    </span>
                    <span className="rlabel">
                      {row.chosen > 0 ? `picked ${row.chosen}×` : `liked ${row.likes}×`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        {confirming ? (
          <>
            <p className="subtitle" style={{ textAlign: 'center', marginBottom: 12 }}>
              This erases everything the app has learned. It can't be undone.
            </p>
            <button className="btn btn-primary" onClick={() => { onReset(); setConfirming(false) }}>
              Yes, reset everything
            </button>
            <button className="btn-text" onClick={() => setConfirming(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn-text" onClick={onCredits}>Photo credits</button>
            <button className="btn-text" onClick={() => setConfirming(true)}>
            <IconTrash size={16} />
            Reset my food preferences
            </button>
          </>
        )}
      </div>
    </Screen>
  )
}
