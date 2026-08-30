import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Food, ReactionValue } from '../types'
import { FoodArt } from './FoodArt'
import { buzz, cardTags } from './ui'

/**
 * A draggable food card.
 *
 * Buttons are the primary control and always work; dragging is a bonus. The
 * parent triggers the same exit animation through the ref, so a tapped button
 * and a flicked card behave identically.
 *
 * A card also commits on a *fast flick* even if it hasn't travelled far,
 * which is what makes swiping feel responsive rather than draggy.
 */

const SWIPE_THRESHOLD = 92
const UP_THRESHOLD = 108
/** px per ms - roughly "a deliberate flick". */
const FLICK_VELOCITY = 0.45
const EXIT_MS = 300

export interface SwipeCardHandle {
  swipe: (value: ReactionValue) => void
}

interface Props {
  food: Food
  onDecide: (value: ReactionValue) => void
}

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { food, onDecide },
  ref,
) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [leaving, setLeaving] = useState<ReactionValue | null>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const last = useRef<{ x: number; y: number; t: number } | null>(null)
  const velocity = useRef({ x: 0, y: 0 })
  const timer = useRef<number | null>(null)

  const commit = (value: ReactionValue) => {
    if (leaving) return
    buzz(value === 'like' ? [10, 30, 14] : 10)
    setDragging(false)
    setLeaving(value)
    timer.current = window.setTimeout(() => onDecide(value), EXIT_MS)
  }

  useImperativeHandle(ref, () => ({ swipe: commit }))

  // Don't fire a decision for a card that's already gone.
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (leaving) return
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current = { x: event.clientX, y: event.clientY }
    last.current = { x: event.clientX, y: event.clientY, t: performance.now() }
    velocity.current = { x: 0, y: 0 }
    setDragging(true)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current || leaving) return
    const now = performance.now()
    if (last.current) {
      const dt = Math.max(1, now - last.current.t)
      velocity.current = {
        x: (event.clientX - last.current.x) / dt,
        y: (event.clientY - last.current.y) / dt,
      }
    }
    last.current = { x: event.clientX, y: event.clientY, t: now }
    setOffset({ x: event.clientX - start.current.x, y: event.clientY - start.current.y })
  }

  const onPointerUp = () => {
    if (!start.current || leaving) return
    start.current = null
    setDragging(false)

    const { x, y } = offset
    const v = velocity.current
    const flickedRight = v.x > FLICK_VELOCITY && x > 24
    const flickedLeft = v.x < -FLICK_VELOCITY && x < -24
    const flickedUp = v.y < -FLICK_VELOCITY && y < -30

    if (x > SWIPE_THRESHOLD || flickedRight) commit('like')
    else if (x < -SWIPE_THRESHOLD || flickedLeft) commit('dislike')
    else if (y < -UP_THRESHOLD || flickedUp) commit('maybe')
    else setOffset({ x: 0, y: 0 })
  }

  const transform = leaving
    ? leaving === 'like'
      ? 'translate(620px, -60px) rotate(30deg)'
      : leaving === 'dislike'
        ? 'translate(-620px, -60px) rotate(-30deg)'
        : 'translate(0, -760px) scale(0.9)'
    : `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.055}deg)`

  const yesOpacity = Math.min(1, Math.max(0, offset.x / SWIPE_THRESHOLD))
  const noOpacity = Math.min(1, Math.max(0, -offset.x / SWIPE_THRESHOLD))

  const className = [
    'swipe-card',
    leaving ? 'leaving' : dragging ? '' : 'animating',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={className}
      style={{ transform, opacity: leaving ? 0 : 1 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="stamp yes" style={{ opacity: yesOpacity }}>YES</div>
      <div className="stamp no" style={{ opacity: noOpacity }}>NOPE</div>

      <div className="food-art">
        <FoodArt food={food} animate />
      </div>
      <div className="food-meta">
        <div className="food-name">{food.name}</div>
        <div className="food-desc">{food.description}</div>
        <div className="tags">
          {cardTags(food).map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
})

/** Static card rendered behind the active one, purely for depth. */
export function GhostCard({ food, depth }: { food: Food; depth: number }) {
  return (
    <div
      className="swipe-card behind"
      style={{
        // Shift down further than the scale shrinks, otherwise a smaller card
        // sits entirely inside the front one and the stack is invisible.
        transform: `scale(${1 - depth * 0.045}) translateY(${depth * 27}px)`,
        opacity: 1 - depth * 0.3,
      }}
      aria-hidden="true"
    >
      <div className="food-art">
        <FoodArt food={food} />
      </div>
      <div className="food-meta">
        <div className="food-name">{food.name}</div>
        <div className="food-desc">{food.description}</div>
      </div>
    </div>
  )
}
