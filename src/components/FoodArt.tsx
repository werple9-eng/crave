import { useId } from 'react'
import type { ReactElement } from 'react'
import type { ArtForm, Food } from '../types'
import {
  P, fillFor, noodleCoil, renderToppings, riceField, toppingsFor,
} from './foodParts'

/**
 * Hand-drawn food illustrations.
 *
 * Every dish maps to one of twenty-three silhouettes, recoloured from its own
 * two colours and shaded with real gradients, so hundreds of dishes read as
 * one deliberate set instead of a bag of clip art. Unlike stock photography
 * they load instantly, never 404, carry no licence, and match the palette.
 *
 * Drawn on a 128x128 grid.
 *
 * ## Vessels
 *
 * Bowls, pots and plates all use the same construction, and getting it wrong
 * is what made the first version look broken - the food was drawn as a dome
 * *on top of* the vessel with the rim ellipse slicing straight through it.
 * The order that actually works:
 *
 *   1. vessel body
 *   2. the opening, filled dark (the inside of the bowl in shadow)
 *   3. the full rim ring — this is the *back* rim
 *   4. contents, clipped to (opening ∪ a shallow dome), so food can mound up
 *      past the rim without ever spilling out sideways
 *   5. the *front* half of the rim only, drawn over the contents
 *   6. gloss and foot
 *
 * To swap in real photography, add a `photo` field to Food and branch at the
 * bottom of this file; nothing else in the app changes.
 */

/* ------------------------- colour helpers ------------------------- */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const out = [r, g, b].map((channel, i) =>
    Math.round(channel + (target[i] - channel) * amount),
  )
  return `rgb(${out[0]}, ${out[1]}, ${out[2]})`
}

const lighten = (hex: string, amount: number) => mix(hex, [255, 248, 236], amount)
/** Darkens toward a warm brown rather than grey - food shadows are never cold. */
const darken = (hex: string, amount: number) => mix(hex, [58, 26, 12], amount)

interface Colors {
  base: string
  baseL: string
  baseD: string
  accent: string
  accentL: string
  accentD: string
}

interface Grads {
  base: string
  accent: string
  vessel: string
  gloss: string
}

/* One dinner service across every plated dish. */
const CERAMIC_TOP = '#ffffff'
const RIM = '#e0c5a6'
const INNER = '#e9d6c0'
const INNER_DEEP = '#d8bda0'
const LEAF = '#5fae52'
const LEAF_D = '#3f8a38'
const LEAF_L = '#8ecb7d'
const CHAR = 'rgba(74, 34, 14, 0.32)'
const GLOSS = 'rgba(255, 255, 255, 0.75)'
const WOOD = '#c9a274'

const u = (id: string) => `url(#${id})`

/* --------------------------- shared bits -------------------------- */

/** Sesame / seed speckle, scattered deterministically. */
function speckle(points: [number, number][], fill: string, r = 1.7) {
  return (
    <g fill={fill} opacity="0.85">
      {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} />)}
    </g>
  )
}

/* ----------------------------- forms ------------------------------ */

/**
 * The field the toppings sit on, clipped to the vessel's opening.
 *
 * Deliberately a *field* rather than a mound: real bowls read as a flat
 * surface of broth or rice with objects arranged on it.
 */
function fillLayer(food: Food, c: Colors, g: Grads, cx: number, cy: number): ReactElement {
  switch (fillFor(food)) {
    case 'broth':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx="44" ry="21" fill={u(g.base)} />
          <ellipse cx={cx - 8} cy={cy - 5} rx="18" ry="7" fill={lighten(c.base, 0.16)} opacity="0.55" />
        </>
      )
    case 'rice':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx="44" ry="21" fill={P.rice} />
          {riceField(cx, cy)}
        </>
      )
    case 'greens':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx="44" ry="21" fill="#5aa64c" />
          <path d={`M${cx - 34} ${cy + 2}c4-12 14-18 24-15-2 11-11 17-24 15z`} fill="#74bd61" />
          <path d={`M${cx + 34} ${cy + 2}c-4-12-14-18-24-15 2 11 11 17 24 15z`} fill="#3f8a38" />
          <path d={`M${cx - 4} ${cy + 6}c-7-8-5-18 4-22 6 7 5 17-4 22z`} fill="#8ecb7d" />
        </>
      )
    case 'sauce':
      // Fill with the dish's *base*, not its accent. The accent is the darker
      // of the two, and a dark field swallows the toppings sitting on it -
      // which is what made mac and cheese come out as brown sludge.
      return (
        <>
          <ellipse cx={cx} cy={cy} rx="44" ry="21" fill={u(g.base)} />
          <path
            d={`M${cx - 26} ${cy + 2}c8-9 20-9 28-2s18 5 24-4`}
            fill="none" stroke={c.accent} strokeWidth="5" strokeLinecap="round" opacity="0.55"
          />
        </>
      )
    case 'noodles':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx="44" ry="21" fill={darken(c.base, 0.18)} />
          <ellipse cx={cx} cy={cy} rx="42" ry="19" fill={u(g.base)} />
          {noodleCoil(cx, cy, lighten(c.base, 0.48))}
        </>
      )
    default:
      return (
        <>
          <ellipse cx={cx} cy={cy} rx="44" ry="21" fill={u(g.base)} />
          <ellipse cx={cx - 10} cy={cy - 6} rx="16" ry="6" fill={lighten(c.base, 0.2)} opacity="0.5" />
        </>
      )
  }
}

/**
 * A vessel seen from steeply above, which is the angle real food photography
 * uses because it shows the contents rather than the crockery.
 */
function vessel(
  food: Food, c: Colors, g: Grads,
  { cy, rx, ry, depth, handles = false }:
  { cy: number; rx: number; ry: number; depth: number; handles?: boolean },
): ReactElement {
  const clip = `${g.vessel}well`
  const innerRx = rx - 7
  const innerRy = ry - 4.5
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <ellipse cx="64" cy={cy} rx={innerRx} ry={innerRy} />
        </clipPath>
      </defs>

      {handles && (
        <g fill="none" stroke={INNER_DEEP} strokeWidth="6.5" strokeLinecap="round">
          <path d={`M${64 - rx + 3} ${cy + 6}c-9 0-13 5-13 10s4 10 13 10`} />
          <path d={`M${64 + rx - 3} ${cy + 6}c9 0 13 5 13 10s-4 10-13 10`} />
        </g>
      )}

      {/* outer bowl: the wall below the rim */}
      <path d={`M${64 - rx} ${cy}a${rx} ${depth} 0 0 0 ${rx * 2} 0z`} fill={darken('#e8d3ba', 0.06)} />
      <path d={`M${64 - rx} ${cy}a${rx} ${depth} 0 0 0 ${rx * 2} 0z`} fill={u(g.vessel)} />
      <ellipse cx="64" cy={cy} rx={rx} ry={ry} fill={u(g.vessel)} />
      <ellipse cx="64" cy={cy} rx={rx} ry={ry} fill="none" stroke={RIM} strokeWidth="2.2" />

      {/* the well, and everything in it */}
      <ellipse cx="64" cy={cy} rx={innerRx} ry={innerRy} fill={INNER} />
      <g clipPath={`url(#${clip})`}>
        {fillLayer(food, c, g, 64, cy)}
        {renderToppings(toppingsFor(food), 1, cy - 57)}
      </g>
      <ellipse cx="64" cy={cy} rx={innerRx} ry={innerRy} fill="none" stroke={RIM} strokeWidth="1.8" opacity="0.85" />

      <path
        d={`M${64 - rx + 6} ${cy + depth * 0.4}a${rx - 6} ${depth} 0 0 0 12 ${depth * 0.5}`}
        fill="none" stroke={GLOSS} strokeWidth="4.5" strokeLinecap="round" opacity="0.8"
      />
    </>
  )
}

const FORMS: Record<ArtForm, (c: Colors, g: Grads, food: Food) => ReactElement> = {
  bowl: (c, g, food) => vessel(food, c, g, { cy: 57, rx: 47, ry: 21, depth: 34 }),

  pot: (c, g, food) => vessel(food, c, g, { cy: 54, rx: 42, ry: 18, depth: 40, handles: true }),

  salad: (c, g, food) => vessel(food, c, g, { cy: 58, rx: 46, ry: 21, depth: 30 }),

  plate: (c, g, food) => (
    <>
      <ellipse cx="64" cy="70" rx="54" ry="30" fill={darken('#e8d3ba', 0.05)} />
      <ellipse cx="64" cy="68" rx="54" ry="30" fill={u(g.vessel)} />
      <ellipse cx="64" cy="68" rx="54" ry="30" fill="none" stroke={RIM} strokeWidth="2.2" />
      <ellipse cx="64" cy="68" rx="43" ry="22" fill="none" stroke={RIM} strokeWidth="1.6" opacity="0.7" />
      <path d="M22 76a48 26 0 0 0 22 20" fill="none" stroke={GLOSS} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      {/* The main mass. Without it, a dish whose category only yields a
        * couple of small garnishes renders as an almost empty plate. */}
      <ellipse cx="64" cy="66" rx="31" ry="16" fill={darken(c.base, 0.22)} />
      <ellipse cx="64" cy="64" rx="31" ry="16" fill={u(g.base)} />
      <ellipse cx="56" cy="59" rx="13" ry="5.5" fill={lighten(c.base, 0.28)} opacity="0.6" />
      {renderToppings(toppingsFor(food), 1.05, 9)}
    </>
  ),

  /** Newspaper-lined tray of shellfish, corn and potatoes. */
  boil: (c, g) => (
    <>
      {/* tray */}
      <path d="M14 62h100l-8 40a8 8 0 0 1-8 6H30a8 8 0 0 1-8-6z" fill={WOOD} />
      <path d="M14 62h100l-8 40a8 8 0 0 1-8 6H30a8 8 0 0 1-8-6z" fill="none" stroke={darken(WOOD, 0.2)} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M18 62h92l-2 9H20z" fill={lighten(WOOD, 0.3)} />
      {/* corn */}
      <g transform="rotate(-16 34 84)">
        <rect x="22" y="76" width="26" height="14" rx="7" fill="#f2c744" />
        {speckle([[28, 80], [34, 84], [40, 80], [44, 86], [30, 87]], '#d9a92c', 1.6)}
      </g>
      {/* potatoes */}
      <circle cx="92" cy="88" r="9" fill="#e2c08a" />
      <circle cx="89" cy="85" r="3" fill="#f0d6ab" opacity="0.8" />
      <circle cx="76" cy="94" r="7.5" fill="#d9b47c" />
      {/* shrimp */}
      <g fill={u(g.base)}>
        <path d="M48 74c10-8 22-5 24 4 2 8-6 13-13 10 5-3 7-8 4-11s-9-3-15-3z" />
        <path d="M78 68c9-7 20-4 22 4 2 7-6 12-12 9 5-3 6-7 3-10s-8-3-13-3z" />
      </g>
      <circle cx="64" cy="76" r="2" fill={darken(c.base, 0.4)} />
      <circle cx="94" cy="70" r="1.8" fill={darken(c.base, 0.4)} />
      {/* crab claw */}
      <g fill={u(g.accent)}>
        <path d="M32 62c-6-4-6-12 0-16 4-3 9-2 11 2l-5 3 7 1 4 6-9 2 3 4c-3 3-8 2-11-2z" />
      </g>
      {/* sausage rounds */}
      <circle cx="58" cy="94" r="7" fill={darken(c.accent, 0.18)} />
      <circle cx="58" cy="94" r="3.4" fill={c.accentL} opacity="0.6" />
      {speckle([[40, 96], [68, 84], [86, 76]], '#e0492c', 1.8)}
    </>
  ),

  burger: (c, g) => (
    <>
      <path d="M24 54a40 32 0 0 1 80 0z" fill={u(g.base)} />
      <ellipse cx="52" cy="36" rx="3.2" ry="2.2" fill={lighten(c.base, 0.62)} transform="rotate(-18 52 36)" />
      <ellipse cx="66" cy="30" rx="3.2" ry="2.2" fill={lighten(c.base, 0.62)} />
      <ellipse cx="80" cy="38" rx="3.2" ry="2.2" fill={lighten(c.base, 0.62)} transform="rotate(16 80 38)" />
      <ellipse cx="42" cy="44" rx="2.6" ry="1.8" fill={lighten(c.base, 0.5)} transform="rotate(-30 42 44)" />
      <path d="M30 44a34 20 0 0 1 22-12" stroke={GLOSS} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M22 55h84c0 6-5 5-8 8s-7 1-11 3-7-1-11 1-8-2-12 0-8-2-12-1-8-3-12-3-6 2-8-3z" fill={LEAF} />
      <path d="M28 58c6-2 14-2 20 0" stroke={LEAF_L} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M25 62h78c0 5-4 6-7 10-2 3-6-2-9 1s-6 4-9 1-6 3-9 1-6 2-9-1-6 1-9-1-5-6-8-6-7-1-9-5z" fill={c.accentL} />
      <rect x="25" y="66" width="78" height="16" rx="8" fill={u(g.accent)} />
      <path d="M32 71h64M34 77h58" stroke={darken(c.accent, 0.28)} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M27 83h74c0 10-9 15-37 15s-37-5-37-15z" fill={u(g.base)} />
      <path d="M34 88c8 4 22 5 32 3" stroke={darken(c.base, 0.16)} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
    </>
  ),

  sandwich: (c, g) => {
    const clip = `${g.vessel}sw`
    const wedge = 'M64 22 18 94h92z'
    return (
      <>
        <defs>
          <clipPath id={clip}><path d={wedge} /></clipPath>
        </defs>
        <path d={wedge} fill={u(g.base)} />
        <g clipPath={`url(#${clip})`}>
          <path d="M10 58h108v10H10z" fill={u(g.accent)} />
          <path d="M14 60h100" stroke={darken(c.accent, 0.24)} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path
            d="M10 68h108v6c-4 3-8 0-12 2s-7-1-11 1-8-1-12 1-8-1-12 0-8-2-12-1-8-1-12-2-8 2-12-1-9 1-13-1z"
            fill={LEAF}
          />
          <path d="M10 76h108v9H10z" fill={lighten(c.base, 0.36)} />
          <circle cx="44" cy="80" r="3.4" fill="#d9432c" opacity="0.8" />
          <circle cx="84" cy="80" r="3" fill="#d9432c" opacity="0.8" />
          <path d="M10 85h108v12H10z" fill={darken(c.base, 0.12)} />
          <path d="M64 22 44 54l20 6 20-6z" fill={lighten(c.base, 0.32)} />
          {speckle([[56, 36], [70, 40], [62, 30]], lighten(c.base, 0.6), 1.6)}
        </g>
        <path d={wedge} fill="none" stroke={darken(c.base, 0.22)} strokeWidth="2.6" strokeLinejoin="round" />
      </>
    )
  },

  wrap: (c, g) => (
    <>
      <path d="M36 98 78 26a17 17 0 0 1 24 9L60 107a17 17 0 0 1-24-9z" fill={u(g.base)} />
      <path d="M36 98 78 26a17 17 0 0 1 12 4L48 102a17 17 0 0 1-12-4z" fill={lighten(c.base, 0.26)} />
      <ellipse cx="90" cy="30" rx="14" ry="10" transform="rotate(-60 90 30)" fill={u(g.accent)} />
      <ellipse cx="90" cy="30" rx="9" ry="6" transform="rotate(-60 90 30)" fill={LEAF} />
      <ellipse cx="90" cy="30" rx="4.5" ry="3" transform="rotate(-60 90 30)" fill={c.accentL} />
      <path d="M50 78 84 44M58 88 92 54" stroke={darken(c.base, 0.2)} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      {speckle([[56, 80], [66, 66], [74, 54]], lighten(c.base, 0.55), 1.5)}
    </>
  ),

  taco: (c, g) => (
    <>
      <ellipse cx="44" cy="52" rx="12" ry="8" fill={u(g.accent)} />
      <ellipse cx="66" cy="47" rx="13" ry="9" fill={c.accentD} />
      <ellipse cx="86" cy="52" rx="11" ry="7.5" fill={LEAF} />
      <ellipse cx="56" cy="45" rx="6.5" ry="4.2" fill={LEAF_L} />
      <ellipse cx="78" cy="44" rx="5.5" ry="3.6" fill={c.accentL} />
      <circle cx="70" cy="39" r="3" fill="#f2ad33" />
      {speckle([[50, 48], [74, 50], [62, 42]], '#fdf5e6', 1.8)}
      <path d="M22 54a42 42 0 0 0 84 0 42 15 0 0 1-84 0z" fill={u(g.base)} />
      <path d="M24 56a40 40 0 0 0 80 0" fill="none" stroke={darken(c.base, 0.24)} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 72a34 34 0 0 0 8 12" stroke={GLOSS} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" />
      {speckle([[46, 76], [64, 82], [82, 76]], darken(c.base, 0.22), 1.6)}
    </>
  ),

  pizza: (c, g) => (
    <>
      <path d="M64 20 102 92a5 5 0 0 1-4 7H30a5 5 0 0 1-4-7z" fill={u(g.base)} />
      <path d="M64 32 94 90H34z" fill={u(g.accent)} />
      <path d="M64 32 78 60 50 78z" fill={lighten(c.accent, 0.24)} opacity="0.55" />
      <path d="M26 91h76a5 5 0 0 1-4 8H30a5 5 0 0 1-4-8z" fill={darken(c.base, 0.2)} />
      <circle cx="64" cy="58" r="7.5" fill={c.accentD} />
      <circle cx="47" cy="79" r="6.5" fill={c.accentD} />
      <circle cx="81" cy="79" r="6.5" fill={c.accentD} />
      <circle cx="62" cy="55" r="2.4" fill={lighten(c.accent, 0.5)} opacity="0.8" />
      <path d="M56 70c4-3 9-3 12 0" stroke={LEAF} strokeWidth="3" fill="none" strokeLinecap="round" />
      {speckle([[40, 88], [64, 86], [88, 88]], darken(c.base, 0.28), 1.6)}
    </>
  ),

  /** A twirled nest on a plate, rather than a bowl of broth. */
  noodles: (c, g, food) => (
    <>
      <ellipse cx="64" cy="80" rx="52" ry="27" fill={darken('#e8d3ba', 0.05)} />
      <ellipse cx="64" cy="78" rx="52" ry="27" fill={u(g.vessel)} />
      <ellipse cx="64" cy="78" rx="52" ry="27" fill="none" stroke={RIM} strokeWidth="2.2" />
      <ellipse cx="64" cy="78" rx="41" ry="20" fill="none" stroke={RIM} strokeWidth="1.6" opacity="0.7" />
      {/* Nest kept a shade darker than the plate: a pale pile of pasta on a
       * pale plate reads as one flat blob. */}
      <ellipse cx="64" cy="70" rx="36" ry="20" fill={darken(c.base, 0.3)} />
      <ellipse cx="64" cy="67" rx="36" ry="20" fill={u(g.base)} />
      {noodleCoil(64, 66, darken(c.base, 0.34))}
      {noodleCoil(64, 62, lighten(c.base, 0.45))}
      <ellipse cx="64" cy="63" rx="18" ry="8" fill={u(g.accent)} opacity="0.92" />
      {renderToppings(toppingsFor(food).slice(0, 3), 0.92, 2)}
    </>
  ),

  cup: (c, g) => (
    <>
      <path d="M38 42h52l-7 56a9 9 0 0 1-9 8H54a9 9 0 0 1-9-8z" fill={u(g.base)} />
      <path d="M38 42h20l-5 64h-1a9 9 0 0 1-9-8z" fill={lighten(c.base, 0.34)} />
      <path d="M42 78h44" stroke={darken(c.base, 0.16)} strokeWidth="2" opacity="0.35" />
      <rect x="34" y="33" width="60" height="12" rx="6" fill={CERAMIC_TOP} stroke={RIM} strokeWidth="2" />
      <rect x="66" y="8" width="9" height="28" rx="4.5" fill={u(g.accent)} transform="rotate(13 70 22)" />
      <circle cx="56" cy="70" r="5.5" fill={GLOSS} opacity="0.6" />
      <circle cx="72" cy="90" r="4.2" fill={c.accentD} opacity="0.6" />
      <circle cx="58" cy="96" r="3.6" fill={c.accentD} opacity="0.6" />
      <circle cx="66" cy="82" r="3" fill={c.accentD} opacity="0.5" />
    </>
  ),

  scoop: (c, g) => (
    <>
      <circle cx="47" cy="55" r="17" fill={u(g.base)} />
      <circle cx="81" cy="55" r="17" fill={u(g.accent)} />
      <circle cx="64" cy="39" r="18" fill={lighten(c.base, 0.28)} />
      <circle cx="58" cy="33" r="4.5" fill={GLOSS} opacity="0.75" />
      <path d="M38 48c3-6 8-9 13-10M74 48c3-6 8-9 13-10" stroke={GLOSS} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M64 21v-7" stroke={c.accentD} strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="64" cy="12" r="3.4" fill="#d9432c" />
      <path d="M32 66h64a32 32 0 0 1-32 32 32 32 0 0 1-32-32z" fill={u(g.vessel)} opacity="0.94" />
      <path d="M32 66h64a32 32 0 0 1-32 32 32 32 0 0 1-32-32z" fill="none" stroke={RIM} strokeWidth="2.2" />
      <path d="M42 74a24 24 0 0 0 7 16" stroke={GLOSS} strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),

  dumpling: (c, g) => {
    const one = (x: number, y: number, s: number) => (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-24 0a24 21 0 0 1 48 0z" fill={u(g.base)} />
        <path d="M-24 0a24 21 0 0 1 48 0z" fill="none" stroke={darken(c.base, 0.18)} strokeWidth="2" />
        <g stroke={darken(c.base, 0.22)} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M-16-6v6M-8-11v11M0-14v14M8-11v11M16-6v6" />
        </g>
        <ellipse cx="0" cy="-3" rx="11" ry="4" fill={GLOSS} opacity="0.32" />
      </g>
    )
    return (
      <>
        {one(38, 92, 0.85)}
        {one(90, 92, 0.85)}
        {one(64, 76, 1)}
        <ellipse cx="64" cy="97" rx="47" ry="6" fill={u(g.accent)} opacity="0.3" />
        <path d="M52 100c8 3 20 3 26 0" stroke={u(g.accent)} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.6" />
      </>
    )
  },

  toast: (c, g) => (
    <>
      <path d="M28 46a11 11 0 0 1 9-16 18 13 0 0 1 54 0 11 11 0 0 1 9 16v42a9 9 0 0 1-9 9H37a9 9 0 0 1-9-9z" fill={u(g.base)} />
      <path d="M35 48a7 7 0 0 1 6-11 13 10 0 0 1 46 0 7 7 0 0 1 6 11v36a5 5 0 0 1-5 5H40a5 5 0 0 1-5-5z" fill={lighten(c.base, 0.32)} />
      <ellipse cx="64" cy="64" rx="23" ry="15" fill={u(g.accent)} />
      <ellipse cx="58" cy="59" rx="8" ry="5" fill={c.accentL} opacity="0.7" />
      <circle cx="55" cy="68" r="3.4" fill={c.accentD} />
      <circle cx="72" cy="66" r="3.8" fill={c.accentD} />
      <path d="M48 54c5-5 11-6 15-3" stroke={LEAF} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      {speckle([[64, 74], [50, 62], [78, 58]], '#fdf5e6', 1.8)}
    </>
  ),

  stack: (c, g) => (
    <>
      <ellipse cx="64" cy="88" rx="38" ry="12" fill={u(g.base)} />
      <ellipse cx="64" cy="84" rx="38" ry="11.5" fill={lighten(c.base, 0.06)} />
      <ellipse cx="64" cy="72" rx="36" ry="11" fill={u(g.base)} />
      <ellipse cx="64" cy="69" rx="36" ry="10.5" fill={lighten(c.base, 0.14)} />
      <ellipse cx="64" cy="57" rx="34" ry="10.5" fill={u(g.base)} />
      <ellipse cx="64" cy="54" rx="34" ry="10" fill={lighten(c.base, 0.22)} />
      <ellipse cx="52" cy="52" rx="9" ry="3.4" fill={GLOSS} opacity="0.4" />
      <path d="M34 52c9 12 47 12 58 0 5 9-2 19-29 19s-34-10-29-19z" fill={u(g.accent)} opacity="0.94" />
      <path d="M92 56c4 6 3 13-2 16" stroke={c.accentD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M36 58c-3 5-2 11 2 14" stroke={c.accentD} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.55" />
      <rect x="55" y="37" width="18" height="11" rx="3.5" fill={lighten(c.accent, 0.58)} />
      <rect x="55" y="37" width="18" height="4" rx="2" fill="#fff" opacity="0.62" />
      <circle cx="46" cy="44" r="3.4" fill="#d9432c" />
      <circle cx="82" cy="46" r="3" fill="#d9432c" />
    </>
  ),

  roll: (c, g) => {
    const piece = (x: number, y: number, r: number) => (
      <g>
        <circle cx={x} cy={y} r={r} fill={darken(c.base, 0.3)} />
        <circle cx={x} cy={y - 2} r={r} fill="#fbf3e6" />
        <circle cx={x} cy={y - 2} r={r} fill="none" stroke={u(g.base)} strokeWidth="5" />
        <circle cx={x} cy={y - 2} r={r * 0.44} fill={u(g.accent)} />
        <circle cx={x - r * 0.2} cy={y - r * 0.4} r={r * 0.14} fill={GLOSS} opacity="0.75" />
        {speckle(
          [[x - r * 0.55, y - 2], [x + r * 0.5, y - r * 0.4], [x, y + r * 0.4]],
          '#e8d9bd', 1.4,
        )}
      </g>
    )
    return (
      <>
        <ellipse cx="64" cy="98" rx="46" ry="6" fill="rgba(74,34,14,0.08)" />
        {piece(34, 76, 18)}
        {piece(94, 76, 18)}
        {piece(64, 62, 19)}
        <path d="M52 96c8 3 18 3 24 0" stroke={darken(c.base, 0.3)} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.4" />
      </>
    )
  },

  nigiri: (c, g) => (
    <>
      <ellipse cx="64" cy="96" rx="42" ry="6" fill="rgba(74,34,14,0.08)" />
      <rect x="30" y="66" width="68" height="26" rx="13" fill="#fbf3e6" />
      <rect x="30" y="66" width="68" height="26" rx="13" fill="none" stroke={RIM} strokeWidth="2" />
      {speckle([[42, 78], [54, 84], [70, 80], [84, 85], [60, 74]], '#e6d6ba', 1.5)}
      <path d="M26 66c0-11 12-18 38-18s38 7 38 18c0 6-8 8-38 8s-38-2-38-8z" fill={u(g.base)} />
      <path d="M34 60c8-5 20-7 30-7" stroke={lighten(c.base, 0.52)} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M40 68c10-3 30-3 44 0" stroke={lighten(c.base, 0.3)} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <rect x="56" y="48" width="16" height="46" rx="3" fill={u(g.accent)} opacity="0.92" />
      <circle cx="100" cy="58" r="5" fill={LEAF} />
    </>
  ),

  skewer: (c, g) => (
    <>
      <path d="M20 104 108 22" stroke={WOOD} strokeWidth="5.5" strokeLinecap="round" />
      <g>
        <rect x="34" y="62" width="25" height="25" rx="7" transform="rotate(-43 46 74)" fill={u(g.base)} />
        <rect x="52" y="44" width="25" height="25" rx="7" transform="rotate(-43 64 56)" fill={u(g.accent)} />
        <rect x="70" y="26" width="25" height="25" rx="7" transform="rotate(-43 82 38)" fill={u(g.base)} />
      </g>
      <g stroke={CHAR} strokeWidth="2.6" strokeLinecap="round">
        <path d="M40 70l8-8M76 34l8-8M46 76l8-8" />
      </g>
      <circle cx="64" cy="56" r="3.2" fill={lighten(c.accent, 0.5)} opacity="0.8" />
      {speckle([[48, 68], [82, 34]], GLOSS, 1.8)}
    </>
  ),

  box: (c, g) => (
    <>
      <path d="M32 46h64l-6 50a10 10 0 0 1-10 8H48a10 10 0 0 1-10-8z" fill={u(g.base)} />
      <path d="M32 46h25l-4 58h-5a10 10 0 0 1-10-8z" fill={lighten(c.base, 0.24)} />
      <path d="M27 36h74l-4 11H31z" fill={lighten(c.base, 0.42)} />
      <path d="M27 36h74l-4 11H31z" fill="none" stroke={darken(c.base, 0.2)} strokeWidth="2" strokeLinejoin="round" />
      <path d="M56 34 72 8M64 34 88 12" stroke={WOOD} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M44 44c4-8 12-11 20-8" stroke={u(g.accent)} strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="64" cy="43" rx="21" ry="5.5" fill={c.accentL} opacity="0.72" />
      <path d="M42 62h44M44 74h40" stroke={darken(c.base, 0.14)} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </>
  ),

  drumstick: (c, g) => (
    <>
      <ellipse cx="64" cy="100" rx="36" ry="5" fill="rgba(74,34,14,0.08)" />
      <path d="M82 22a28 28 0 0 1 9 43L60 94a17 17 0 0 1-26-22l32-34a28 28 0 0 1 16-16z" fill={u(g.base)} />
      <path d="M79 29a21 21 0 0 1 7 32L59 87a13 13 0 0 1-18-16l30-32a21 21 0 0 1 8-10z" fill={lighten(c.base, 0.24)} />
      <path d="M36 74 22 90" stroke="#fdf5e6" strokeWidth="12" strokeLinecap="round" />
      <path d="M36 74 22 90" stroke={RIM} strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="92" r="6.5" fill="#fdf5e6" stroke={RIM} strokeWidth="2" />
      {speckle(
        [[74, 44], [61, 58], [82, 58], [68, 34], [55, 70], [88, 48]],
        u(g.accent), 3.2,
      )}
      <path d="M70 30c6 4 9 10 9 16" stroke={GLOSS} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.45" />
    </>
  ),

  slice: (c, g) => (
    <>
      <path d="M26 88 64 28l38 60z" fill={u(g.base)} />
      <path d="M26 88 64 28l14 22-32 38z" fill={lighten(c.base, 0.26)} />
      <path d="M40 64h48l7 12H33z" fill={u(g.accent)} />
      <path d="M44 58h40l4 6H40z" fill={lighten(c.accent, 0.4)} opacity="0.8" />
      <path d="M26 88h76v5a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6z" fill={darken(c.base, 0.2)} />
      <circle cx="64" cy="38" r="6.5" fill={c.accentL} />
      <circle cx="62" cy="36" r="2" fill={GLOSS} opacity="0.8" />
      <path d="M50 50c5-6 11-8 16-6" stroke={GLOSS} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
    </>
  ),

  pastry: (c, g) => (
    <>
      <ellipse cx="64" cy="98" rx="38" ry="6" fill="rgba(74,34,14,0.08)" />
      <circle cx="64" cy="64" r="34" fill={u(g.base)} />
      <circle cx="64" cy="62" r="34" fill={lighten(c.base, 0.14)} />
      <path d="M64 30a34 34 0 1 1-24 58" fill="none" stroke={darken(c.base, 0.22)} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M64 44a18 18 0 1 1-13 30" fill="none" stroke={darken(c.base, 0.22)} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M36 50c8 9 48 9 56 0 4 8-4 16-28 16s-32-8-28-16z" fill={u(g.accent)} />
      <circle cx="52" cy="50" r="2.6" fill={GLOSS} opacity="0.8" />
      <circle cx="78" cy="52" r="2" fill={GLOSS} opacity="0.7" />
      {speckle([[46, 62], [82, 66], [64, 76]], lighten(c.accent, 0.55), 1.8)}
    </>
  ),
}

/**
 * Every form that actually has a renderer.
 *
 * Exported so tests can assert each dish's `art.form` can really be drawn,
 * rather than checking against a hand-copied list that quietly goes stale.
 */
export const ART_FORM_KEYS = Object.keys(FORMS) as ArtForm[]

/* ---------------------------- garnishes --------------------------- */

/**
 * Details layered over the silhouette, chosen from the dish's own attributes.
 *
 * This is what stops the dozen dishes sharing the `plate` form from looking
 * like a dozen recolours of one picture. Capped at two so cards stay calm.
 */
function garnishesFor(food: Food): ReactElement[] {
  const out: ReactElement[] = []
  const brothy = food.tags.includes('soupy') || food.tags.includes('brothy')

  if (food.temperature === 'hot' && brothy) {
    out.push(
      <g key="steam" fill="none" stroke="#d9b79a" strokeWidth="3.2" strokeLinecap="round" opacity="0.85">
        <path className="steam" d="M46 32c-6-7 6-12 0-19" />
        <path className="steam" d="M64 27c-6-7 6-12 0-19" />
        <path className="steam" d="M82 32c-6-7 6-12 0-19" />
      </g>,
    )
  }

  if (food.spiceLevel >= 4) {
    out.push(
      <g key="chilli">
        <path d="M102 20c7-1 11 4 9 11-2 8-10 12-17 8 5-6 8-12 8-19z" fill="#d93a24" />
        <path d="M102 20c-1-4 2-8 6-8" stroke={LEAF_D} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M100 26c3 2 4 6 3 10" stroke="#f2705a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>,
    )
  }

  if (food.sweetness >= 4) {
    out.push(
      <g key="sparkle" fill="#f6c445">
        <path className="sparkle" d="M24 26l2.8 5.8L33 34l-5.8 2.8L24 43l-2.8-6.2L15 34l6.2-2.2z" />
        <path className="sparkle" d="M106 46l2.2 4.4 4.4 2-4.4 2-2.2 4.4-2-4.4-4.6-2 4.6-2z" />
        <path className="sparkle" d="M36 13l1.8 3.6L41 18l-3.2 1.8L36 23l-1.8-3.2L31 18l3.2-1.4z" />
      </g>,
    )
  }

  if (food.tags.includes('fresh') || food.healthiness >= 5) {
    out.push(
      <g key="herb">
        <path d="M18 42c0-9 7-16 16-16 0 9-7 16-16 16z" fill={LEAF} />
        <path d="M25 32c3-4 8-6 13-4" stroke={LEAF_D} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>,
    )
  }

  if (food.tags.includes('grilled')) {
    out.push(
      <g key="char" stroke={CHAR} strokeWidth="3.2" strokeLinecap="round">
        <path d="M48 112h13M70 112h11" />
      </g>,
    )
  }

  return out.slice(0, 2)
}

/* ---------------------------- component --------------------------- */

export function FoodArt({
  food, className, animate = false,
}: {
  food: Food
  className?: string
  /** Adds the gentle idle float used on the big swipe cards. */
  animate?: boolean
}) {
  // Gradient ids must be unique per instance - the same dish can appear on a
  // card, a ghost card behind it and a results thumbnail all at once.
  const raw = useId()
  const uid = `fa${raw.replace(/[^a-zA-Z0-9]/g, '')}`
  const g: Grads = {
    base: `${uid}b`, accent: `${uid}a`, vessel: `${uid}v`, gloss: `${uid}g`,
  }

  const { base, accent } = food.art
  const c: Colors = {
    base,
    baseL: lighten(base, 0.3),
    baseD: darken(base, 0.24),
    accent,
    accentL: lighten(accent, 0.3),
    accentD: darken(accent, 0.24),
  }

  return (
    <svg
      viewBox="0 0 128 128"
      className={[className, animate ? 'art-float' : ''].filter(Boolean).join(' ')}
      role="img"
      aria-label={food.name}
    >
      <defs>
        <linearGradient id={g.base} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor={lighten(base, 0.34)} />
          <stop offset="0.52" stopColor={base} />
          <stop offset="1" stopColor={darken(base, 0.2)} />
        </linearGradient>
        <linearGradient id={g.accent} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor={lighten(accent, 0.32)} />
          <stop offset="0.55" stopColor={accent} />
          <stop offset="1" stopColor={darken(accent, 0.2)} />
        </linearGradient>
        <linearGradient id={g.vessel} x1="0.15" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor={CERAMIC_TOP} />
          <stop offset="0.55" stopColor="#fdf2e4" />
          <stop offset="1" stopColor="#eddac2" />
        </linearGradient>
        <radialGradient id={g.gloss} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(255,196,120,0.30)" />
          <stop offset="1" stopColor="rgba(255,196,120,0)" />
        </radialGradient>
      </defs>

      {/* warm glow, so food never looks pasted onto the card */}
      <circle cx="64" cy="62" r="58" fill={u(g.gloss)} />
      <ellipse cx="64" cy="114" rx="34" ry="5.5" fill="rgba(84, 40, 16, 0.13)" />
      {FORMS[food.art.form](c, g, food)}
      {garnishesFor(food)}
    </svg>
  )
}
