import { useEffect, useRef } from 'react'
import type { Food, Reaction, ReactionValue } from '../types'
import { GhostCard, SwipeCard } from '../components/SwipeCard'
import type { SwipeCardHandle } from '../components/SwipeCard'
import { Progress, Screen } from '../components/ui'
import { IconBookmark, IconHeart, IconUndo, IconX, IconForward } from '../components/icons'
import { WEIGHTS } from '../engine/weights'

/**
 * The heart of the app: react to real dishes instead of describing food in
 * the abstract.
 *
 * You can stop early once you've rated a few - the engine has plenty to work
 * with by then, and forcing ten swipes when you already know the answer is
 * exactly the kind of friction that makes people close the app.
 */
export function SwipeScreen({
  deck, reactions, onReact, onUndo, onFinishEarly, onBack,
}: {
  deck: Food[]
  reactions: Reaction[]
  onReact: (foodId: string, value: ReactionValue) => void
  onUndo: () => void
  onFinishEarly: () => void
  onBack: () => void
}) {
  const cardRef = useRef<SwipeCardHandle>(null)
  const index = reactions.length
  const current = deck[index]
  const upcoming = deck.slice(index + 1, index + 3)
  const canFinish = index >= WEIGHTS.deck.minBeforeFinish

  // Arrow keys on desktop, matching the on-screen buttons.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') cardRef.current?.swipe('dislike')
      else if (event.key === 'ArrowRight') cardRef.current?.swipe('like')
      else if (event.key === 'ArrowUp') cardRef.current?.swipe('maybe')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!current) return null

  return (
    <Screen
      onBack={onBack}
      step={`${index + 1} of ${deck.length}`}
      right={
        <button
          className="iconbtn"
          onClick={onUndo}
          disabled={index === 0}
          aria-label="Undo last swipe"
        >
          <IconUndo />
        </button>
      }
      footer={
        <>
          <div className="controls">
            <button className="ctrl no" onClick={() => cardRef.current?.swipe('dislike')}>
              <IconX size={26} />
              Nope
            </button>
            <button className="ctrl yes" onClick={() => cardRef.current?.swipe('like')}>
              <IconHeart size={26} />
              Yes
            </button>
          </div>
          {/* Maybe sits on its own row underneath: it's the least-used answer
            * of the three, and giving it equal billing made the two that
            * matter smaller than they should be. */}
          <button className="ctrl maybe wide" onClick={() => cardRef.current?.swipe('maybe')}>
            <IconBookmark size={20} />
            Maybe — save it for later
          </button>
          {canFinish && (
            <button className="btn-text" onClick={onFinishEarly}>
              I've seen enough — show me the answer
              <IconForward size={16} />
            </button>
          )}
        </>
      }
    >
      <Progress value={index / deck.length} />
      <p className="subtitle" style={{ marginBottom: 12 }}>
        Does this sound good <em>right now</em>?
      </p>
      <div className="deck">
        {upcoming
          .map((food, i) => (
            <GhostCard key={food.id} food={food} depth={upcoming.length - i} />
          ))
          .reverse()}
        <SwipeCard
          key={current.id}
          ref={cardRef}
          food={current}
          onDecide={(value) => onReact(current.id, value)}
        />
      </div>
    </Screen>
  )
}
