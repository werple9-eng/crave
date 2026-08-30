import type { ReactNode } from 'react'
import type { Food } from '../types'
import { IconBack, IconCheck } from './icons'

/** Static background wash, rendered once behind every screen. */
export function Ambient() {
  return <div className="ambient" aria-hidden="true" />
}

const CUISINE_LABEL: Record<string, string> = {
  'middle-eastern': 'Middle Eastern',
  'bbq': 'BBQ',
  'dessert': 'Sweet',
  'latin': 'Latin',
}

/** Short human descriptors shown as pills on a food card. */
export function cardTags(food: Food): string[] {
  const tags: string[] = [CUISINE_LABEL[food.cuisine] ?? capitalize(food.cuisine), food.texture]
  if (food.spiceLevel >= 4) tags.push('very spicy')
  else if (food.spiceLevel >= 2) tags.push('spicy')
  if (food.heaviness >= 4) tags.push('heavy')
  else if (food.heaviness <= 2) tags.push('light')
  if (food.healthiness >= 4) tags.push('healthy')
  if (food.fillingLevel >= 4) tags.push('filling')
  return tags.slice(0, 4)
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/* ------------------------------------------------------------------ */

export function Screen({
  children, onBack, step, right, footer, center,
}: {
  children: ReactNode
  onBack?: () => void
  step?: string
  right?: ReactNode
  footer?: ReactNode
  center?: boolean
}) {
  return (
    <div className="shell screen-in">
      <div className="topbar">
        {onBack && (
          <button className="iconbtn" onClick={onBack} aria-label="Go back">
            <IconBack />
          </button>
        )}
        {step && <span className="steplabel">{step}</span>}
        <span className="spacer" />
        {right}
      </div>
      <div className={center ? 'content center' : 'content'}>{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  )
}

export function Option({
  emoji, label, hint, selected, onClick, index = 0,
}: {
  emoji: string
  label: string
  hint?: string
  selected?: boolean
  onClick: () => void
  /** Staggers the entrance so the list cascades in. */
  index?: number
}) {
  return (
    <button
      className={selected ? 'option selected' : 'option'}
      onClick={onClick}
      aria-pressed={selected}
      style={{ animationDuration: `${320 + index * 95}ms` }}
    >
      <span className="oicon" aria-hidden="true">{emoji}</span>
      <span style={{ minWidth: 0 }}>
        <span className="olabel">{label}</span>
        {hint && <span className="ohint">{hint}</span>}
      </span>
      <span className="otick" aria-hidden="true"><IconCheck size={16} strokeWidth={2.8} /></span>
    </button>
  )
}

/** Segmented progress: one pip per question. */
export function Pips({ total, current }: { total: number; current: number }) {
  return (
    <div className="pips" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < current ? 'done' : i === current ? 'now' : ''} />
      ))}
    </div>
  )
}

/**
 * Continuous progress bar. `value` is 0-1.
 *
 * Driven by scaleX rather than width: transforms are composited, width
 * animations force a layout pass on every frame.
 */
export function Progress({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value))
  return (
    <div className="progress">
      <i style={{ transform: `scaleX(${clamped})` }} />
    </div>
  )
}

/** A short buzz on supported phones. Silently does nothing everywhere else. */
export function buzz(pattern: number | number[] = 12): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* some browsers throw when the page isn't focused */
    }
  }
}
