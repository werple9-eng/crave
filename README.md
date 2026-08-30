# Crave

An app for the specific problem of *not knowing what you want to eat*.

It doesn't ask what cuisine you're in the mood for — if you knew that, you
wouldn't need it. It asks about **properties** of food (hot or cold, crispy or
soft, how much heat), lets you react to fourteen real dishes, and gives you
three answers with the reasons they won.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5176.

| command | what it does |
| --- | --- |
| `npm run dev` | dev server, also exposed on your local network |
| `npm test` | engine and data tests (39 of them) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run build` | typecheck + production build into `dist/` |

## Live

**https://werple9-eng.github.io/crave/**

Open it on any phone, no wifi sharing needed. Then Share → *Add to Home Screen*
and it runs full-screen with no browser chrome, like an installed app.

### Deploying

Every push to `main` rebuilds and redeploys via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow
runs typecheck, build and tests first, so a broken commit fails the deploy
instead of shipping.

```bash
git add -A && git commit -m "your change" && git push
```

Two things make it portable to any static host (Netlify, Vercel, Cloudflare
Pages, an S3 bucket) with no changes:

- `base: './'` in `vite.config.ts` — GitHub Pages serves from a subpath
  (`/crave/`), so absolute `/assets/...` URLs would 404. Relative paths work
  on a subpath, at a domain root, and from a local `dist/` folder.
- No backend. Everything is static files plus `localStorage`.

To host it somewhere else, run `npm run build` and upload `dist/`.

### Using it on your own machine

`npm run dev` prints a **Network** URL (something like `http://192.168.x.x:5176`)
if you want to test on a phone on the same wifi without deploying. Your
preferences live in that browser's storage, so the local and hosted versions
keep separate history.

## How it works

The flow is: **seven questions → swipe fourteen dishes → three answers.**

```
src/
  data/foods.ts          314 dishes, hand-labeled with attributes
  data/questions.ts      the questionnaire, as data
  components/FoodArt.tsx vessels + forms
  components/foodParts.tsx the parts dishes are composed from
  components/icons.tsx   the UI icon set, one 24px grid
  engine/weights.ts      every tunable number, in one place
  engine/similarity.ts   how alike two foods are (0-1)
  engine/recommend.ts    the scoring engine
  engine/deck.ts         which fourteen foods you get to swipe on
  engine/daypart.ts      time-of-day nudge
  storage/history.ts     local learning (localStorage, never leaves the device)
  screens/               one file per screen (plus a dev-only #gallery)
```

### No duplicate questions

An earlier version asked "what are you NOT feeling?" (heavy / healthy / spicy /
sweet / hot / cold) and then immediately asked the same six things again as
craving questions. That's fixed structurally rather than by reordering:

- **Mood** lives in the questions, and only there.
- **Standing dietary rules** (no meat / seafood / dairy / raw / fried / bread)
  live in your profile. You set them once and they apply to every session,
  because "I don't eat seafood" isn't a mood.
- **Hunger** now drives both portion *and* heaviness, so the separate "how
  heavy do you want it?" question is gone.

A test asserts the two sets can never overlap again.

### The look

**Maximalist.** A saturated multi-colour ground under a dot screen, chunky ink
outlines on everything, hard offset shadows, and a different colour for every
option in a list. Buttons travel *into* their own shadow when pressed.

**Still built around appetite.** Warm hues — tomato, tangerine, mango, butter —
carry roughly two thirds of the surface area and always own the primary
actions. Lime, mint, berry and grape are pops, not the base. Cool blues and
greys stay out of it: they read clinical and are famously appetite-suppressing.
Outlines are a very dark warm brown (`--ink`), never black.

**Emoji on the option pickers**, drawn icons everywhere else. Emoji are big,
instantly readable and carry their own colour, which is exactly what a
maximalist picker wants; the chrome (back, undo, heart, trash) stays on the
drawn 24px icon set so it holds up small and inherits `currentColor`.

**Pictures.** Dishes are *composed*, not drawn one by one. This is the single
most important thing in the art, and getting it wrong is what made the app look
generated: the first version put one anonymous beige mound in a bowl and reused
it for fifty-nine dishes, so ramen, mac and cheese and açaí all came out
identical.

Real food photography reads instantly for a specific reason — a bowl of ramen
isn't a mound, it's four or five **distinct, high-contrast objects** arranged
around the bowl (a halved egg, folded chashu, a sheet of nori, a scatter of
scallion) sitting on a broth field. You identify the dish from the *toppings*,
not the vessel. So a dish is built from three layers:

| layer | where | what |
| --- | --- | --- |
| vessel | `FoodArt.tsx` | bowl, plate, pot, salad bowl, seen from steeply above |
| fill | `foodParts.tsx` | the field: broth, rice, greens, sauce, noodles |
| toppings | `foodParts.tsx` | 3-4 identifiable objects, picked from the dish's own data |

`toppingsFor()` reads a dish's category, cuisine and tags, so adding a dish to
`foods.ts` still needs nothing but its attributes — it composes its own picture.
Anything seafood-tagged gets a prawn, anything above spice 3 gets chilli slices,
Japanese and Korean dishes get sesame.

They load instantly, never 404, carry no licence, and match the palette exactly.
To move to real photography, add a `photo` field to `Food` and branch in
`FoodArt.tsx`; nothing else changes.

Two smaller traps worth remembering: a plate needs a **main mass** under the
toppings or a dish whose category yields only garnishes renders as an empty
plate; and a saucy dish should be filled with its *base* colour, not its accent
— the accent is the darker of the two and a dark field swallows everything
sitting on it.

Run the dev server and open **`#gallery`** to see every form on one contact
sheet. Drawing twenty-three silhouettes without that means fixing one and
breaking two others without noticing.

**Vessels have a specific draw order**, and getting it wrong is what made the
first version look broken — food was drawn as a dome *on top of* the bowl with
the rim ellipse slicing through it:

1. vessel body
2. the opening, filled dark (the inside, in shadow)
3. the full rim ring — this is the *back* rim
4. contents, clipped to (opening ∪ a shallow dome), so food can mound up past
   the rim without ever spilling out sideways
5. the *front* half of the rim only, drawn over the contents
6. gloss and foot

One more trap: stroke the vessel outline with a path that **excludes the flat
top edge**. Stroking the full body path after the contents draws that top edge
straight across the food as a stray line.

Food colours are contrast-checked: any `art.base` above 0.86 luminance vanishes
against the pale card, so those get pushed down toward a warm tan.

**Icons** are one family on a 24px grid with a 1.85 stroke, all inheriting
`currentColor` — never hardcode a colour in `icons.tsx`. They are drawn from
what the real object looks like: a flame is a teardrop with a cooler inner
core, a fork has tines and a collar, a leaf has an off-centre midrib.

### Motion

Animate `transform` and `opacity`. Those are the two properties the compositor
handles without a layout or paint pass; anything else (`width`, `filter`, `top`)
is a dropped frame waiting to happen. That's why progress bars use `scaleX`
rather than `width`.

**One deliberate exception:** the maximalist press effect transitions
`box-shadow` alongside `transform`, so a button appears to travel into its own
hard shadow. That's a paint on a single small element for 180ms on tap, which is
affordable — but it *is* an exception, so keep it to press states and never put
it on something large or continuously animating.

Two rules learned the hard way, both worth keeping:

- **Never animate a blur.** The background was briefly three blurred, drifting
  circles. `filter: blur()` on a moving element repaints a huge area every
  frame — it dropped the app to about one frame per second and made swipe
  timers fire *seconds* late. Baked radial gradients now.
- **Never hide content behind an animation.** Entrances use no
  `animation-fill-mode: both` and no `animation-delay`, because an animation
  that hasn't started yet then holds its first frame — `opacity: 0` — and the
  whole app renders blank. Staggering is done with duration instead, so the
  worst case is "no animation", never "no app".

### The scoring

No AI model and no API — just a transparent weighted score. Each rule returns
both its points **and** the sentence explaining them, so the reasons on the
results screen can never be invented after the fact. Roughly in order of
influence:

1. **Swipe reactions** — reacting to a real dish is more honest than answering
   a question about texture in the abstract. Liking one food also lifts foods
   similar to it, so fourteen swipes teach the engine about all 314.
2. **The questions** — hot/cold, crispy/soft, spice, healthy vs indulgent,
   sweet vs savoury, and budget (which uses the priceLevel on every dish).
3. **Hunger** — drives both how filling and how heavy the dish is.
4. **Dietary rules** — meat, seafood, dairy and raw remove foods entirely;
   fried and bread are heavy penalties a great match can climb back out of.
5. **History** — deliberately worth about a tenth of the rest. What you say you
   want *right now* always beats what you usually like.
6. **Time of day** — smallest weight of all; it breaks ties, never overrules.

### Why time of day is in here

Two effects worth designing around, neither of them a growth trick:

- **Appetite is contextual.** What sounds good at 8am and at 11pm are genuinely
  different foods. An app that offers pancakes at midnight feels broken; one
  that reads the clock feels like it knows you.
- **Relevance drives return use far better than nagging.** The app earns a
  second visit by being right at 7pm, not by guilt-tripping a streak. There is
  deliberately **no** "don't lose your streak" prompt anywhere in this app.

The nudge is also stated out loud on the home screen ("Leaning toward comfort
food, obviously") rather than applied silently — it changes what you're shown,
so you should be able to see that it's happening.

Two rules shape the final three: at most two dishes from the same category, and
at least one dish you didn't already swipe on — handing back only the things you
just said yes to is a ranking, not a recommendation.

Six are computed but only three are shown. "Show me more" reveals the rest, and
only the ones still above `results.minExtraMatch` — offering a 12% match as a
recommendation makes the whole list look broken.

## Tuning it

When a recommendation feels wrong, the fix is almost always in one of two files:

- **`src/data/foods.ts`** — the labels. The engine can only be as smart as this
  data. If ramen keeps showing up when you asked for light food, check its
  `heaviness` and `fillingLevel`.
- **`src/engine/weights.ts`** — how much each rule matters. Relative sizes
  matter more than absolute ones.

Adding a dish is one object in `foods.ts` — pick any `art.form` and two colours
and it draws itself. Adding or rewording a question is one entry in
`questions.ts`.

Run `npm test` after either — the tests assert things like "starving plus savoury
returns filling meals", "no spice keeps spicy food away", and "anything tagged
cheesy is also tagged dairy", so they catch a mislabeled dish surprisingly often.

## What it deliberately doesn't have

No accounts, no backend, no restaurant API, no third-party assets, no icon or
animation library. "Find it near me" just opens a Google Maps search for the
dish, which needs no API key and works today.
