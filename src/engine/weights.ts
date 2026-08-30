/**
 * Every tunable number in the recommendation engine lives here.
 *
 * When a recommendation feels wrong, change a number here rather than the
 * scoring logic. The relative sizes matter more than the absolute ones.
 *
 * Guiding principle: what you say you want RIGHT NOW beats what you've liked
 * historically. That's why `history` numbers are roughly a tenth of the
 * preference numbers - they nudge ties, they don't decide sessions.
 */
export const WEIGHTS = {
  /** Answers from the craving questions. */
  preference: {
    temperature: 12,
    texture: 11,
    spice: 11,
    indulgence: 11,
    sweetness: 13,
    budget: 10,
  },

  /**
   * How hungry you are.
   *
   * This drives portion *and* heaviness. There used to be a separate
   * "how heavy do you want it?" question, but between that and the hunger
   * question the app was asking you the same thing twice.
   */
  appetite: {
    filling: 14,
    heaviness: 10,
  },

  /**
   * Time-of-day nudge. Small on purpose: it breaks ties between similar
   * dishes, it never overrules what you actually asked for.
   */
  daypart: 8,

  /** A standing dietary rule that only penalises rather than excluding. */
  vetoSoft: 26,

  /**
   * Reactions from the swipe deck are the strongest signal in the app,
   * because reacting to a real dish is more honest than answering a question
   * about texture in the abstract.
   */
  reaction: {
    likeExact: 34,
    likeSimilar: 26,
    maybeExact: 9,
    maybeSimilar: 6,
    dislikeExact: -60,
    dislikeSimilar: -30,
    /** Below this similarity, a reaction says nothing about this food. */
    similarityFloor: 0.34,
    /** Keeps a long swipe streak from drowning out the questions. */
    totalCap: 70,
  },

  /** Learned from past sessions. Deliberately small - see note above. */
  history: {
    traitBonus: 7,
    favoriteFood: 5,
    recentPickPenalty: 16,
    recentWindow: 3,
  },

  /** The results screen. */
  results: {
    /** Shown up front. */
    shown: 3,
    /** Computed, so "show me more" has somewhere to go. */
    computed: 6,
    /**
     * A hidden extra has to clear this match percentage to be worth showing.
     * Without it the fourth-best pick can be a 12% match, and offering that
     * as a recommendation makes the whole list look broken.
     */
    minExtraMatch: 45,
  },

  /** Deck building (which foods you get to swipe on). */
  deck: {
    size: 14,
    maxPerCategory: 2,
    maxPerCuisine: 2,
    /** Foods pulled from outside the top ranks, so you see something new. */
    wildcards: 2,
    /** Random spread applied to pre-scores so sessions aren't identical. */
    jitter: 5,
    /** You can stop swiping and get an answer after this many cards. */
    minBeforeFinish: 6,
  },
} as const

/** Reasons weaker than this aren't worth showing on a results card. */
export const REASON_THRESHOLD = 2.5
