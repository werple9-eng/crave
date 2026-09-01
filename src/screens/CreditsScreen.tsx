import { useEffect, useState } from 'react'
import { PHOTOS } from '../data/photos'
import { Screen } from '../components/ui'
import type { PhotoCredit } from '../data/photoCredits'

/**
 * Photo credits.
 *
 * Not optional decoration: the dish photographs come from Wikimedia Commons
 * and most are CC BY or CC BY-SA, which require naming the photographer.
 *
 * The credit list is fetched on demand rather than bundled — it is ~70KB of
 * text that only matters on this one screen.
 */
export function CreditsScreen({ onBack }: { onBack: () => void }) {
  const [credits, setCredits] = useState<PhotoCredit[] | null>(null)

  useEffect(() => {
    let live = true
    import('../data/photoCredits')
      .then((m) => { if (live) setCredits(m.PHOTO_CREDITS) })
      .catch(() => { if (live) setCredits([]) })
    return () => { live = false }
  }, [])

  const total = Object.keys(PHOTOS).length

  return (
    <Screen onBack={onBack} step="Credits">
      <h2 className="title">Photo credits</h2>
      <p className="subtitle">
        {total} dishes have a photograph, all of them CC0 studio work from StockSnap
        and Rawpixel — released for any use, no attribution required. Anything that
        does require naming a photographer is listed below. Every other dish is
        drawn, because a bad photo of food looks broken in a way a drawing doesn't.
      </p>

      {credits === null ? (
        <p className="empty">Loading credits…</p>
      ) : credits.length === 0 ? (
        <p className="empty">No photographs needing attribution are in use.</p>
      ) : (
        <div className="credits">
          {credits.map((c) => (
            <a
              className="credit"
              key={c.page || c.title}
              href={c.page}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="credit-title">{c.title}</span>
              <span className="credit-meta">{c.author} · {c.license}</span>
            </a>
          ))}
        </div>
      )}
    </Screen>
  )
}
