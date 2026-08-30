/**
 * Core data model for Crave.
 *
 * Foods are described by *attributes* (hot/cold, crispy/soft, how heavy)
 * rather than by cuisine alone, because the whole point of the app is helping
 * you when you don't already know that you want Thai food.
 */

export type Cuisine =
  | 'american' | 'italian' | 'mexican' | 'japanese' | 'chinese' | 'korean'
  | 'thai' | 'vietnamese' | 'indian' | 'mediterranean' | 'middle-eastern'
  | 'bbq' | 'breakfast' | 'dessert' | 'european' | 'latin'

export type Category =
  | 'burger' | 'pizza' | 'sandwich' | 'taco' | 'wrap' | 'noodle' | 'soup'
  | 'rice-bowl' | 'salad' | 'fried' | 'pasta' | 'grill' | 'seafood'
  | 'dumpling' | 'breakfast' | 'snack' | 'sweet' | 'curry' | 'drink'

export type Temperature = 'hot' | 'cold' | 'either'

/** The dominant mouthfeel. Drives matching and the pills on each card. */
export type Texture = 'crispy' | 'soft' | 'chewy' | 'saucy' | 'fresh' | 'mixed'

export type Tag =
  | 'meat' | 'seafood' | 'vegetarian' | 'dairy' | 'cheesy' | 'fried'
  | 'bread-heavy' | 'carb-heavy' | 'protein-heavy' | 'soupy' | 'grilled'
  | 'raw' | 'comfort' | 'handheld' | 'shareable' | 'fresh' | 'rich'
  | 'street-food' | 'brothy' | 'nuts'

export type Scale5 = 1 | 2 | 3 | 4 | 5
export type Scale0to5 = 0 | 1 | 2 | 3 | 4 | 5
export type PriceLevel = 1 | 2 | 3 | 4

/**
 * Which illustration to draw. Every dish maps to one of a small set of
 * silhouettes, recolored per food - which is what keeps 120+ dishes looking
 * like one deliberate set rather than a bag of clip art.
 */
export type ArtForm =
  | 'bowl' | 'plate' | 'burger' | 'sandwich' | 'wrap' | 'taco' | 'pizza'
  | 'noodles' | 'cup' | 'scoop' | 'dumpling' | 'toast' | 'stack' | 'roll'
  | 'skewer' | 'box' | 'drumstick' | 'slice'
  | 'salad' | 'pot' | 'nigiri' | 'pastry' | 'boil'

export interface FoodArt {
  form: ArtForm
  /** Main colour of the food itself. */
  base: string
  /** Secondary colour: sauce, filling, crust, topping. */
  accent: string
}

export interface Food {
  id: string
  name: string
  description: string
  cuisine: Cuisine
  category: Category
  temperature: Temperature
  texture: Texture
  /** How much it sits in your stomach. */
  heaviness: Scale5
  spiceLevel: Scale0to5
  /** 5 = genuinely good for you, 1 = joyfully not. */
  healthiness: Scale5
  sweetness: Scale0to5
  /** How well it actually solves hunger, independent of heaviness. */
  fillingLevel: Scale5
  priceLevel: PriceLevel
  art: FoodArt
  tags: Tag[]
}

/* ------------------------------------------------------------------ */
/* What the user tells us                                              */
/* ------------------------------------------------------------------ */

export type HungerLevel = 'snack' | 'normal' | 'starving'

export type Daypart = 'morning' | 'midday' | 'evening' | 'latenight'

/**
 * The craving questions.
 *
 * Note there is no `heaviness` here any more: it duplicated the hunger
 * question badly enough that the app felt like it was asking you the same
 * thing twice. Hunger now drives both portion *and* heaviness.
 */
export interface PreferenceAnswers {
  temperature: 'hot' | 'cold' | 'any'
  texture: 'crispy' | 'soft' | 'any'
  spice: 'none' | 'mild' | 'spicy' | 'any'
  indulgence: 'healthy' | 'indulgent' | 'any'
  sweetness: 'sweet' | 'savory' | 'any'
  /** Uses the priceLevel already on every dish. */
  budget: 'cheap' | 'treat' | 'any'
}

/**
 * Standing dietary rules, not moods.
 *
 * These live in your profile and apply to every session, because "I don't eat
 * seafood" is not something you should have to re-answer every time you're
 * hungry. Everything mood-shaped is covered by the questions instead.
 */
export type VetoId = 'meat' | 'seafood' | 'dairy' | 'raw' | 'fried' | 'bread'

export type ReactionValue = 'like' | 'maybe' | 'dislike'

export interface Reaction {
  foodId: string
  value: ReactionValue
}

export interface SessionInput {
  hunger: HungerLevel
  /** Set from the clock; nudges food that fits the hour. */
  daypart?: Daypart
  vetoes: VetoId[]
  preferences: PreferenceAnswers
  reactions: Reaction[]
}

/* ------------------------------------------------------------------ */
/* What the engine gives back                                          */
/* ------------------------------------------------------------------ */

/**
 * One reason a food gained or lost points. The results screen shows these
 * verbatim, so explanations always reflect the real scoring.
 */
export interface Contribution {
  source: string
  reason: string
  points: number
  max: number
}

export interface ScoredFood {
  food: Food
  score: number
  /** 0-100. How close this came to the best any food actually scored. */
  matchPercent: number
  contributions: Contribution[]
  reasons: string[]
}
