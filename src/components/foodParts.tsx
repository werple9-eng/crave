import type { ReactElement } from 'react'
import type { Food } from '../types'

/**
 * The parts a dish is built from.
 *
 * The first version of the art drew one anonymous beige mound inside a bowl
 * and reused it for fifty-nine different dishes. Ramen, mac and cheese and
 * açaí all came out as the same blob, which is exactly why the app looked
 * generated rather than designed.
 *
 * Real food photography reads instantly for a specific reason: a bowl of
 * ramen isn't a mound, it's four or five *distinct, high-contrast objects*
 * arranged around the bowl — a halved egg, folded chashu, a black sheet of
 * nori, a scatter of scallion — sitting on a broth field. You identify the
 * dish from the toppings, not the vessel.
 *
 * So a dish is composed here, not drawn:
 *
 *   vessel   bowl / plate / pot / salad bowl   (in FoodArt.tsx)
 *   fill     the field it sits on: broth, rice, greens, sauce, noodles
 *   toppings 3-4 identifiable objects, chosen from the dish's own data
 *
 * That gives hundreds of genuinely different pictures from a small set of
 * parts, and every one of them says what the food actually is.
 */

/* ----------------------------- palette ---------------------------- */

export const P = {
  eggWhite: '#fdf6e8',
  yolk: '#f0a52c',
  yolkLight: '#f8c866',
  nori: '#28402f',
  noriEdge: '#3d5c46',
  pork: '#d99a7a',
  porkRim: '#f0d2be',
  porkLine: '#a86a52',
  scallion: '#65b355',
  scallionDark: '#3f8a38',
  herb: '#4f9c42',
  herbLight: '#8ecb7d',
  corn: '#f5c53a',
  shrimp: '#f08a62',
  shrimpDark: '#d9603a',
  tomato: '#d8412e',
  tomatoLight: '#eb7059',
  cheese: '#f0b23c',
  cheeseLight: '#f7ce74',
  fry: '#e8b45c',
  crumb: '#c98a3c',
  sesame: '#efe0c0',
  rice: '#fbf4e6',
  riceShade: '#e8d9bf',
  chilli: '#d93a24',
  lime: '#8fc23f',
  olive: '#4a5a2c',
  cucumber: '#9ccf6a',
  beanBrown: '#8a5230',
  gold: '#e0a94e',
  goldDark: '#c07f2c',
} as const

/* ---------------------------- primitives -------------------------- */

type Part = (x: number, y: number, s?: number, key?: string) => ReactElement

/** A halved soft-boiled egg. The single most legible "real bowl" cue. */
export const egg: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx="11" ry="8.4" fill={P.eggWhite} />
    <ellipse rx="11" ry="8.4" fill="none" stroke="#e7d6ba" strokeWidth="1.1" />
    <ellipse cy="0.4" rx="5.6" ry="4.2" fill={P.yolk} />
    <ellipse cx="-1.7" cy="-1" rx="2" ry="1.3" fill={P.yolkLight} />
  </g>
)

/** A sheet of nori standing up out of the broth. */
export const nori: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s}) rotate(-9)`}>
    <path d="M-8-13h16v22h-16z" fill={P.nori} />
    <path d="M-8-13h16v22h-16z" fill="none" stroke={P.noriEdge} strokeWidth="1.2" />
    <path d="M-4-9v14M1-11v18" stroke={P.noriEdge} strokeWidth="1.1" opacity="0.8" />
  </g>
)

/** Rolled pork belly: rim of fat, spiral inside. */
export const chashu: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx="10.5" ry="8" fill={P.porkRim} />
    <ellipse rx="8.4" ry="6.2" fill={P.pork} />
    <path d="M-4 0a4 3 0 0 1 8 0 6 4.5 0 0 1-9 0" fill="none" stroke={P.porkLine} strokeWidth="1.4" />
  </g>
)

/** Scallion rings, scattered. */
export const scallion: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    {[[0, 0], [7, 3], [-6, 4], [3, -5], [-3, -3], [10, -3]].map(([dx, dy], i) => (
      <g key={i}>
        <circle cx={dx} cy={dy} r="2.6" fill={P.scallion} />
        <circle cx={dx} cy={dy} r="1.1" fill={P.scallionDark} />
      </g>
    ))}
  </g>
)

export const corn: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={P.corn}>
    {[[0, 0], [5, 3], [-5, 2], [2, -4], [-3, -4], [8, -1]].map(([dx, dy], i) => (
      <ellipse key={i} cx={dx} cy={dy} rx="2.4" ry="1.9" />
    ))}
  </g>
)

export const shrimp: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-9 3c-1-6 3-10 8-10 4 0 7 3 6 7-1 5-6 7-10 5 3-1 5-3 4-5-1-3-5-3-8 3z" fill={P.shrimp} />
    <path d="M-9 3c-1-6 3-10 8-10" fill="none" stroke={P.shrimpDark} strokeWidth="1.3" />
    <circle cx="3" cy="-4" r="1.1" fill={P.shrimpDark} />
  </g>
)

export const tomato: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="7" fill={P.tomato} />
    <circle r="4.4" fill={P.tomatoLight} />
    <path d="M-2.4-1.4a2.6 2.6 0 0 1 4.8 0" fill="none" stroke={P.tomato} strokeWidth="1.2" />
  </g>
)

export const cucumber: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="6.2" fill={P.cucumber} />
    <circle r="4" fill="#d6ecb4" />
    <circle r="1.2" fill={P.herb} />
  </g>
)

export const olive: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx="5" ry="4" fill={P.olive} />
    <ellipse rx="1.8" ry="1.4" fill="#c0483a" />
  </g>
)

/** A cluster of leaves. */
export const greens: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 4c0-8 6-13 13-12-1 8-6 13-13 12z" fill={P.herb} />
    <path d="M12 5c1-8-5-14-12-13 0 8 5 13 12 13z" fill={P.scallionDark} />
    <path d="M-2 6c-5-6-3-13 3-16 4 5 4 12-3 16z" fill={P.herbLight} />
  </g>
)

/** A small herb sprig, for the corner of a plate. */
export const herbSprig: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 6c-4-4-4-9 0-12 4 3 4 8 0 12z" fill={P.herb} />
    <path d="M0 6v4" stroke={P.scallionDark} strokeWidth="1.6" strokeLinecap="round" />
  </g>
)

/** Molten cheese with a drip. */
export const cheese: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-11-5c7-3 15-3 22 0 2 5-1 9-5 9-2 3-6 2-7-1-4 1-8-3-10-8z" fill={P.cheese} />
    <path d="M-6 3c1 4 0 7-2 8" fill="none" stroke={P.cheeseLight} strokeWidth="2.2" strokeLinecap="round" />
  </g>
)

/** A pile of chips, laid at angles so it reads as many not one. */
export const fries: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-9, 2, -24], [-2, -1, -6], [5, 2, 14], [0, 6, 32], [9, -2, -34]].map(([dx, dy, r], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${r})`}>
        <rect x="-2.6" y="-11" width="5.2" height="22" rx="2.6" fill={P.gold} />
        <rect x="-2.6" y="-11" width="2.2" height="22" rx="1.1" fill="#f0c775" opacity="0.75" />
      </g>
    ))}
  </g>
)

/** Breaded strips: lumpy edges are what makes them read as fried. */
export const tenders: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-7, -3, -16], [6, 1, 12]].map(([dx, dy, r], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${r})`}>
        <path d="M-11-6c4-3 10-4 15-2 4 2 5 6 3 9-3 4-10 5-15 3-4-2-5-7-3-10z" fill={P.gold} />
        <path d="M-9-5c4-2 9-3 13-1" fill="none" stroke="#f2cd84" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="-3" cy="1" r="1.3" fill={P.goldDark} opacity="0.7" />
        <circle cx="5" cy="-2" r="1.1" fill={P.goldDark} opacity="0.7" />
      </g>
    ))}
  </g>
)

/** Chunks of braised meat. */
export const meatChunks: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-6, -2, 8], [5, 2, -12], [0, -7, 20]].map(([dx, dy, r], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${r})`}>
        <rect x="-6" y="-4.4" width="12" height="8.8" rx="3.4" fill={P.beanBrown} />
        <rect x="-4.4" y="-3" width="6" height="2.6" rx="1.3" fill="#a86a44" opacity="0.8" />
      </g>
    ))}
  </g>
)

export const sesame: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={P.sesame}>
    {[[0, 0], [6, 3], [-5, 3], [3, -4], [-4, -3], [9, -2], [-9, 0]].map(([dx, dy], i) => (
      <ellipse key={i} cx={dx} cy={dy} rx="1.6" ry="1.1" transform={`rotate(${i * 25} ${dx} ${dy})`} />
    ))}
  </g>
)

export const chilliSlices: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    {[[0, 0], [7, 4], [-6, 3]].map(([dx, dy], i) => (
      <g key={i}>
        <circle cx={dx} cy={dy} r="2.8" fill={P.chilli} />
        <circle cx={dx} cy={dy} r="1.2" fill="#f2a08a" />
      </g>
    ))}
  </g>
)

export const limeWedge: Part = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s}) rotate(18)`}>
    <path d="M-8 5a9 9 0 0 1 16 0z" fill={P.lime} />
    <path d="M-6 4.2a7 7 0 0 1 12 0z" fill="#c9e88a" />
    <path d="M0 4.2v-5.4M-3.4 4.2 -1 0M3.4 4.2 1 0" stroke={P.lime} strokeWidth="0.9" />
  </g>
)

/** Noodle strands, coiled. Drawn as arcs so they read as many strands. */
export function noodleCoil(cx: number, cy: number, color: string, key?: string) {
  return (
    <g key={key} stroke={color} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.95">
      <path d={`M${cx - 26} ${cy}a26 11 0 0 1 52 0`} />
      <path d={`M${cx - 20} ${cy + 7}a20 8 0 0 1 40 0`} />
      <path d={`M${cx - 22} ${cy - 7}a22 9 0 0 1 44 0`} />
      <path d={`M${cx - 14} ${cy - 13}a14 6 0 0 1 28 0`} />
    </g>
  )
}

/** Speckled rice field. */
export function riceField(cx: number, cy: number, key?: string) {
  return (
    <g key={key}>
      {[[-18, -4], [-8, 3], [2, -6], [12, 2], [20, -3], [-14, 6], [8, 7], [-2, 0], [17, 7], [-22, 1]].map(
        ([dx, dy], i) => (
          <ellipse
            key={i} cx={cx + dx} cy={cy + dy} rx="3.4" ry="2.2"
            fill={i % 2 ? P.rice : P.riceShade}
            transform={`rotate(${i * 33} ${cx + dx} ${cy + dy})`}
          />
        ),
      )}
    </g>
  )
}

/* --------------------- choosing parts per dish -------------------- */

export type ToppingKey =
  | 'egg' | 'nori' | 'chashu' | 'scallion' | 'corn' | 'shrimp' | 'tomato'
  | 'cucumber' | 'olive' | 'greens' | 'herb' | 'cheese' | 'fries' | 'tenders'
  | 'meat' | 'sesame' | 'chilli' | 'lime'

const PART_BY_KEY: Record<ToppingKey, Part> = {
  egg, nori, chashu, scallion, corn, shrimp, tomato, cucumber, olive,
  greens, herb: herbSprig, cheese, fries, tenders, meat: meatChunks,
  sesame, chilli: chilliSlices, lime: limeWedge,
}

export type FillKey = 'broth' | 'rice' | 'greens' | 'sauce' | 'noodles' | 'plain'

/** What the toppings are sitting on. */
export function fillFor(food: Food): FillKey {
  if (food.category === 'salad') return 'greens'
  if (food.category === 'noodle') return 'noodles'
  if (food.category === 'rice-bowl') return 'rice'
  if (food.category === 'soup' || food.tags.includes('soupy')) return 'broth'
  if (food.category === 'curry' || food.texture === 'saucy') return 'sauce'
  return 'plain'
}

/**
 * Picks the identifiable objects for a dish, most characteristic first.
 *
 * Driven off data the dish already carries, so adding a dish to foods.ts
 * still needs nothing but its attributes - it composes its own picture.
 */
export function toppingsFor(food: Food): ToppingKey[] {
  const picked: ToppingKey[] = []
  const add = (...keys: ToppingKey[]) => {
    for (const k of keys) if (!picked.includes(k)) picked.push(k)
  }
  const asian = ['japanese', 'korean', 'chinese', 'thai', 'vietnamese'].includes(food.cuisine)

  switch (food.category) {
    case 'noodle':
      if (food.cuisine === 'japanese') add('egg', 'chashu', 'nori', 'scallion')
      else if (asian) add('meat', 'scallion', 'chilli')
      else add('meat', 'cheese', 'herb')
      break
    case 'soup':
      add('meat', 'scallion', 'herb')
      break
    case 'rice-bowl':
      add('meat', 'greens', 'sesame')
      break
    case 'salad':
      add('tomato', 'cucumber', 'olive')
      break
    case 'curry':
      add('meat', 'herb', 'chilli')
      break
    case 'fried':
      add('tenders', 'fries', 'herb')
      break
    case 'grill':
      add('meat', 'herb', 'lime')
      break
    case 'seafood':
      add('shrimp', 'lime', 'herb')
      break
    case 'breakfast':
      add('egg')
      if (food.tags.includes('meat')) add('meat')
      if (food.tags.includes('bread-heavy')) add('fries')
      add('herb')
      break
    case 'pasta':
      add('cheese', 'herb', 'tomato')
      break
    default:
      add('herb')
  }

  // The dish's own attributes override the category default.
  if (food.tags.includes('seafood')) picked.unshift('shrimp')
  if (food.tags.includes('cheesy')) add('cheese')
  if (food.spiceLevel >= 3) add('chilli')
  if (food.cuisine === 'japanese' || food.cuisine === 'korean') add('sesame')
  if (food.tags.includes('fresh') || food.healthiness >= 5) add('herb')
  if (food.tags.includes('grilled')) add('lime')

  return picked.slice(0, 4)
}

/**
 * Positions inside a vessel opening.
 *
 * Spread around the well rather than stacked in the middle, because that is
 * how a bowl is actually plated - and a centred pile is exactly what made the
 * old art read as one anonymous mound.
 */
const SLOTS: [number, number][] = [[45, 51], [83, 47], [87, 65], [50, 67]]

export function renderToppings(keys: ToppingKey[], scale = 1, offsetY = 0): ReactElement[] {
  return keys.map((key, i) => {
    const [x, y] = SLOTS[i % SLOTS.length]
    return PART_BY_KEY[key](x, y + offsetY, scale, `${key}-${i}`)
  })
}
