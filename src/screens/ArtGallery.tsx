import { FOODS } from '../data/foods'
import { ART_FORM_KEYS, FoodArt } from '../components/FoodArt'
import * as Icons from '../components/icons'
import type { ArtForm } from '../types'

const ICON_ENTRIES = Object.entries(Icons).filter(([name]) => name.startsWith('Icon'))

/**
 * Dev-only contact sheet of every illustration form.
 *
 * Reachable at `#gallery` in development. Drawing 22 silhouettes without a
 * way to see them side by side means fixing one and breaking two others
 * without noticing - this is that way.
 */
export function ArtGallery() {
  const sample = (form: ArtForm) => FOODS.find((f) => f.art.form === form)

  return (
    <div className="shell" style={{ maxWidth: 980 }}>
      <h2 className="title">Icons ({ICON_ENTRIES.length})</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
          gap: 10,
          marginBottom: 34,
        }}
      >
        {ICON_ENTRIES.map(([name, Cmp]) => {
          const Component = Cmp as (p: { size?: number }) => JSX.Element
          return (
            <div key={name} className="stat" style={{ textAlign: 'center', padding: 10 }}>
              <div style={{ display: 'grid', placeItems: 'center', height: 46, color: 'var(--text)' }}>
                <Component size={28} />
              </div>
              {/* same icon at the size it is actually used, to catch shapes
                * that only fall apart when small */}
              <div style={{ display: 'grid', placeItems: 'center', height: 26, color: 'var(--muted)' }}>
                <Component size={16} />
              </div>
              <div className="slabel" style={{ fontSize: 11 }}>{name.replace('Icon', '')}</div>
            </div>
          )
        })}
      </div>

      <h2 className="title">Art forms ({ART_FORM_KEYS.length})</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 14,
          paddingBottom: 40,
        }}
      >
        {ART_FORM_KEYS.map((form) => {
          const food = sample(form)
          if (!food) {
            return (
              <div key={form} className="stat">
                <div className="slabel">{form} — unused</div>
              </div>
            )
          }
          return (
            <div key={form} className="stat" style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'radial-gradient(120% 88% at 50% 6%, #fffdfa, var(--surface-warm) 60%, var(--bg-deep))',
                  borderRadius: 14,
                  padding: 6,
                }}
              >
                <FoodArt food={food} drawn />
              </div>
              <div className="slabel" style={{ fontWeight: 800, color: 'var(--text)' }}>{form}</div>
              <div className="slabel">{food.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
