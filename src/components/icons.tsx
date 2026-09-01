import type { ReactElement, SVGProps } from 'react'

/**
 * The icon set.
 *
 * All drawn on the same 24px grid with a 1.85 stroke, round caps and round
 * joins, so they sit together as one family. Everything inherits
 * `currentColor` - never hardcode a colour in here.
 *
 * Shapes are drawn from what the real object actually looks like, which
 * matters more than it sounds. The first pass had a flame with a notch in it,
 * a fork with no tines and a leaf that read as an eye. Reference points used:
 *
 *   flame  a candle flame is a teardrop - pointed tip, widest about a third
 *          up from the base, tucking back in at the wick, with a small cooler
 *          core low down. It is NOT a circle with a nick out of it.
 *   fork   short tines (about a quarter of total length) meeting a rounded
 *          shoulder, then a long tapering handle.
 *   knife  straight spine, the edge curving up to meet it at the point.
 *   leaf   an asymmetric lens with a midrib running off-centre to the tip.
 *
 * Check any change at `#gallery` in dev - it renders every icon at display
 * size and again at 16px, where weak shapes fall apart first.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 22, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/* --------------------------- navigation --------------------------- */

export const IconBack = (p: IconProps) => (
  <Icon {...p}><path d="M14.5 4.5 7 12l7.5 7.5" /></Icon>
)

export const IconForward = (p: IconProps) => (
  <Icon {...p}><path d="M9.5 4.5 17 12l-7.5 7.5" /></Icon>
)

export const IconX = (p: IconProps) => (
  <Icon {...p}><path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8" /></Icon>
)

export const IconCheck = (p: IconProps) => (
  <Icon {...p}><path d="M4.8 12.4 9.7 17.3 19.2 6.9" /></Icon>
)

export const IconPlus = (p: IconProps) => (
  <Icon {...p}><path d="M12 5.2v13.6M5.2 12h13.6" /></Icon>
)

/** Arrowhead, then the line curving back on itself. */
export const IconUndo = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.8 5.4 3.9 10.3l4.9 4.9" />
    <path d="M3.9 10.3h9.6a5.6 5.6 0 0 1 0 11.2H9.2" />
  </Icon>
)

export const IconRefresh = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.8 13.6A8 8 0 1 1 17.4 6.6" />
    <path d="m13.4 6 5.4-2.4.7 5.9z" fill="currentColor" stroke="none" />
  </Icon>
)

export const IconShuffle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 6.8h3.1c1.9 0 3 1.1 4.1 2.7l2.6 3.9c1.1 1.6 2.2 2.7 4.1 2.7h3.1" />
    <path d="M3.5 17.2h3.1c1.9 0 3-1.1 4.1-2.7" />
    <path d="M14.6 9.2c1.1-1.4 2.2-2.4 3.9-2.4h2.1" />
    <path d="m17.6 4 3 2.8-3 2.8M17.6 13.6l3 3.1-3 2.8" />
  </Icon>
)

/* ----------------------------- people ----------------------------- */

export const IconUser = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.7" />
    <path d="M5 20.4a7 7 0 0 1 14 0" />
  </Icon>
)

/* ---------------------------- reactions --------------------------- */

export const IconHeart = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20.4C7.3 17.3 4 14.2 4 10.5A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8 2.9c0 3.7-3.3 6.8-8 9.9z" />
  </Icon>
)

export const IconBookmark = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.4 3.6h11.2a.9.9 0 0 1 .9.9v15.9L12 15.8l-6.5 4.6V4.5a.9.9 0 0 1 .9-.9z" />
  </Icon>
)

/* ------------------------------ food ------------------------------ */

/**
 * Fork and knife. The fork's tines are the whole point - a bare U-shape with
 * no tines reads as a tuning fork, which is what the last version did.
 */
export const IconUtensils = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.2 3v5.1a3 3 0 0 0 6 0V3" />
    <path d="M9.2 3v5.3M9.2 11.1V21" />
    <path d="M18.4 21v-8.4c-1.9-.4-2.8-1.6-2.6-3.6.2-2.2 1.1-4.2 2.6-6z" />
  </Icon>
)

/** A candle-flame teardrop with its cooler inner core. */
export const IconFlame = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.6c3.3 4.1 6.1 6.7 6.1 10.5a6.1 6.1 0 0 1-12.2 0C5.9 9.3 8.7 6.7 12 2.6z" />
    <path d="M12 13.1c1.5 1.7 2.3 2.7 2.3 4.1a2.3 2.3 0 0 1-4.6 0c0-1.4.8-2.4 2.3-4.1z" />
  </Icon>
)

/** An asymmetric leaf with an off-centre midrib. */
export const IconLeaf = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.4 19.7c-1-8.2 4.9-15 15.2-15.4.7 10-5.7 16-15.2 15.4z" />
    <path d="M4.6 19.6c3.5-3.8 7.8-6.9 12.8-9.1" />
  </Icon>
)

/** A chilli: curved body tapering to a point, stem leaning off the shoulder. */
export const IconChilli = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15.6 6.4c2.6 1 3.6 3.9 2.6 7-1.3 3.9-5.2 6.6-9.6 6.6-2.4 0-4.2-.8-5.2-2.2 4.6-.3 7.8-2.4 9.4-6.2.7-1.7.9-3.4.8-5.2z" />
    <path d="M15.6 6.4c-.4-1.9.4-3.2 2.4-3.8" />
  </Icon>
)

export const IconChilliOff = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15.6 6.4c2.6 1 3.6 3.9 2.6 7-1.3 3.9-5.2 6.6-9.6 6.6-2.4 0-4.2-.8-5.2-2.2 4.6-.3 7.8-2.4 9.4-6.2.7-1.7.9-3.4.8-5.2z" />
    <path d="M3.6 3.6 20.4 20.4" />
  </Icon>
)

export const IconSnowflake = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.8v18.4M4 7.4l16 9.2M20 7.4 4 16.6" />
    <path d="M12 6.6 9.4 4.6M12 6.6l2.6-2M12 17.4l-2.6 2M12 17.4l2.6 2" />
    <path d="m5.9 10.3-3.1-.5M18.1 13.7l3.1.5M18.1 10.3l3.1-.5M5.9 13.7l-3.1.5" />
  </Icon>
)

/** Crispy: a sharp zig-zag. Nothing round about it. */
export const IconCrispy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 15.6 6.6 8l3.4 5.4L13.4 6l3.4 6.2L20.4 7" />
    <path d="M3 19.6h18" />
  </Icon>
)

/** Soft and saucy: slow, rolling waves. */
export const IconSoft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8.4c2.2-2.4 4.5-2.4 6.8 0s4.6 2.4 6.9 0 4.5-2.4 6.8 0" />
    <path d="M3 14c2.2-2.4 4.5-2.4 6.8 0s4.6 2.4 6.9 0 4.5-2.4 6.8 0" />
    <path d="M3 19.6c2.2-2.4 4.5-2.4 6.8 0" />
  </Icon>
)

export const IconDonut = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="2.9" />
    <path d="M8.4 5.6 9.6 7.4M15.8 6.2l-1.2 1.9M19 10.2l-2 .7M18.2 16.4l-1.9-1M12.6 20.5l.3-2M6.2 18.2l1.6-1.4M4.4 12.4l2 .2" />
  </Icon>
)

export const IconSalt = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.4 21.4V11a3.6 3.6 0 0 1 7.2 0v10.4z" />
    <path d="M8.6 15.4h6.8" />
    <path d="M10.6 7.2c0-1.6.5-3 1.4-4.2.9 1.2 1.4 2.6 1.4 4.2" />
  </Icon>
)

/** Cheap: a coin. Deliberately not a dollar sign - the app has no currency. */
export const IconCoin = (p: IconProps) => (
  <Icon {...p}>
    <ellipse cx="12" cy="7.6" rx="7.8" ry="3.6" />
    <path d="M4.2 7.6v8.8c0 2 3.5 3.6 7.8 3.6s7.8-1.6 7.8-3.6V7.6" />
    <path d="M4.2 12c0 2 3.5 3.6 7.8 3.6s7.8-1.6 7.8-3.6" />
  </Icon>
)

export const IconGem = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 3.6h10l4 6-9 11.2L3 9.6z" />
    <path d="M3 9.6h18M7 3.6l2 6 3 11.2 3-11.2 2-6" />
  </Icon>
)

/** Snack: a small round biscuit. */
export const IconSnack = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <circle cx="9.4" cy="9.8" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="14.6" cy="11" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="10.8" cy="15" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="15" cy="15.4" r="1" fill="currentColor" stroke="none" />
  </Icon>
)

/** Normal meal: a plate seen from above. */
export const IconPlate = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="5.2" />
  </Icon>
)

/** Starving: a full bowl, steaming. */
export const IconBowl = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.8 11.4h18.4a9.2 9.2 0 0 1-18.4 0z" />
    <path d="M9 7.8c-1-1.3.9-2.2 0-3.6M14.4 7.8c-1-1.3.9-2.2 0-3.6" />
  </Icon>
)

/* ------------------------------ misc ------------------------------ */

export const IconMapPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21.6c4.7-5.3 7-9.2 7-11.7a7 7 0 1 0-14 0c0 2.5 2.3 6.4 7 11.7z" />
    <circle cx="12" cy="9.9" r="2.7" />
  </Icon>
)

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 6.8v5.4l3.6 2.1" />
  </Icon>
)

export const IconSparkle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M11 3.2 12.8 8l4.8 1.8-4.8 1.8L11 16.4 9.2 11.6 4.4 9.8 9.2 8z" />
    <path d="m18.2 15.4.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" />
  </Icon>
)

export const IconDice = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.2" />
    <circle cx="8.4" cy="8.4" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15.6" cy="8.4" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="8.4" cy="15.6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15.6" cy="15.6" r="1.3" fill="currentColor" stroke="none" />
  </Icon>
)

export const IconWallet = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.4 7.6a2.6 2.6 0 0 1 2.6-2.6h11.2a2 2 0 0 1 2 2v1.6" />
    <rect x="3.4" y="7.6" width="17.2" height="11.8" rx="2.6" />
    <circle cx="16.4" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
  </Icon>
)

export const IconTrash = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.4 6.6h15.2" />
    <path d="M9.4 6.6V5a1.5 1.5 0 0 1 1.5-1.5h2.2A1.5 1.5 0 0 1 14.6 5v1.6" />
    <path d="M6.4 6.6 7.3 19a1.7 1.7 0 0 0 1.7 1.6h6a1.7 1.7 0 0 0 1.7-1.6l.9-12.4" />
    <path d="M10.3 10.2v6.6M13.7 10.2v6.6" />
  </Icon>
)

/** Indulgent: a fat droplet, about to land. */
export const IconDrop = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.2c3.9 4.8 5.9 8.1 5.9 10.6a5.9 5.9 0 0 1-11.8 0c0-2.5 2-5.8 5.9-10.6z" />
    <path d="M9.2 14.4a2.8 2.8 0 0 0 1.7 3" />
  </Icon>
)

/** A cut of meat: rounded muscle with a bone at one end. */
export const IconMeat = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17.2 4.2c2.8 2 3.6 5.6 1.9 8.9-1.9 3.7-6 5.8-9.6 4.8a4.6 4.6 0 0 1-3.4-5.6c.9-3.6 4-6.6 7.6-7.6 1.3-.4 2.5-.9 3.5-.5z" />
    <path d="M7.4 15.8 4.6 18.6" />
    <circle cx="3.6" cy="19.6" r="1.6" />
  </Icon>
)

export const IconFish = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.4 12c3-4.2 6.4-6.3 10.2-6.3 3.2 0 5.8 2.1 7.8 6.3-2 4.2-4.6 6.3-7.8 6.3-3.8 0-7.2-2.1-10.2-6.3z" />
    <path d="M3.4 12c-.9-1.7-1-3.4-.2-5.1 1.7.5 2.9 1.5 3.6 3M3.4 12c-.9 1.7-1 3.4-.2 5.1 1.7-.5 2.9-1.5 3.6-3" />
    <circle cx="16.4" cy="10.4" r="1.1" fill="currentColor" stroke="none" />
  </Icon>
)

export const IconMilk = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 2.8h6v2.6l2.6 4v11a1.6 1.6 0 0 1-1.6 1.6H8a1.6 1.6 0 0 1-1.6-1.6v-11l2.6-4z" />
    <path d="M6.4 12.4h11.2" />
  </Icon>
)

export const IconBread = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.2 10.6c0-3.3 3.5-5.4 7.8-5.4s7.8 2.1 7.8 5.4c0 1.5-1 2.3-2.4 2.5v5.6a1.6 1.6 0 0 1-1.6 1.6H8.2a1.6 1.6 0 0 1-1.6-1.6v-5.6c-1.4-.2-2.4-1-2.4-2.5z" />
    <path d="M8.4 8.2c1-.5 2.2-.8 3.6-.8s2.6.3 3.6.8" />
  </Icon>
)

/** Raw: a sliced fillet, marbling running across it. */
export const IconSashimi = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.2" y="7" width="17.6" height="10" rx="5" />
    <path d="M7.6 8.4c1.4 1.4 2 3.6 1.4 7.2M12.6 7.4c1.4 1.6 2 4 1.4 8.2M17.2 8.6c1 1.2 1.4 2.8 1.2 5" />
  </Icon>
)

/** The neutral "either is fine" answer. */
export const IconEither = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.6 9.2c2-2.2 4.1-2.2 6.2 0s4.2 2.2 6.3 0 4.1-2.2 6.1 0" />
    <path d="M3.6 15.4c2-2.2 4.1-2.2 6.2 0s4.2 2.2 6.3 0 4.1-2.2 6.1 0" />
  </Icon>
)



/* ------------------------- lookup by name ------------------------- */

export type IconName =
  | 'flame' | 'snowflake' | 'either' | 'crispy' | 'soft' | 'chilli'
  | 'chilliOff' | 'leaf' | 'gem' | 'donut' | 'salt' | 'coin' | 'drop'
  | 'snack' | 'plate' | 'bowl' | 'sparkle' | 'utensils' | 'clock'
  | 'meat' | 'fish' | 'milk' | 'bread' | 'sashimi'

/** Lets data files name an icon without importing React components. */
export const ICON_BY_NAME: Record<IconName, (p: IconProps) => ReactElement> = {
  flame: IconFlame,
  snowflake: IconSnowflake,
  either: IconEither,
  crispy: IconCrispy,
  soft: IconSoft,
  chilli: IconChilli,
  chilliOff: IconChilliOff,
  leaf: IconLeaf,
  gem: IconGem,
  donut: IconDonut,
  salt: IconSalt,
  coin: IconCoin,
  drop: IconDrop,
  snack: IconSnack,
  plate: IconPlate,
  bowl: IconBowl,
  sparkle: IconSparkle,
  utensils: IconUtensils,
  clock: IconClock,
  meat: IconMeat,
  fish: IconFish,
  milk: IconMilk,
  bread: IconBread,
  sashimi: IconSashimi,
}
