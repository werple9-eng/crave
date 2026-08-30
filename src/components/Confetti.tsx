import { useEffect, useState } from 'react'

/**
 * A two-second burst when you commit to a dish.
 *
 * Pure CSS animation over a handful of divs - no library, no canvas, and it
 * unmounts itself so nothing keeps ticking in the background.
 */

const COLORS = ['#2b7cf3', '#6aa8ff', '#12b981', '#f7a723', '#f2506e', '#8fd0ff']
const PIECES = 42
const LIFETIME_MS = 2100

interface Piece {
  left: number
  delay: number
  duration: number
  color: string
  size: number
}

function makePieces(): Piece[] {
  return Array.from({ length: PIECES }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 350,
    duration: 1500 + Math.random() * 700,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 0.7 + Math.random() * 0.7,
  }))
}

export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>(makePieces)

  useEffect(() => {
    const timer = window.setTimeout(() => setPieces([]), LIFETIME_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (pieces.length === 0) return null

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, i) => (
        <i
          key={i}
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${piece.duration}ms`,
            transform: `scale(${piece.size})`,
          }}
        />
      ))}
    </div>
  )
}
