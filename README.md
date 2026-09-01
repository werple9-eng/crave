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

### How it looks when you send the link

`index.html` carries a real `<title>`, description, Open Graph and Twitter card
tags, plus a drawn 1200×630 share image, so pasting the link into iMessage,
WhatsApp, Discord or Slack renders a proper card instead of a bare URL.

**`og:image` and `og:url` must be absolute URLs.** Most link scrapers won't
resolve a relative one and you'll get a blank gray card. Those two are the only
host-specific values in the app — update them if it ever moves.

Icons live in `public/`: an SVG favicon for browser tabs, PNG fallbacks, an
`apple-touch-icon.png` for iOS, and a web manifest so Add to Home Screen picks
up the right name, icon and theme color rather than a screenshot.

Regenerating them: they were drawn on a `<canvas>` and POSTed straight to disk
by a throwaway local server, which avoids needing an image toolchain. There's
no build step for them — they're committed as static files.

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
  data/foods.ts          312 dishes, hand-labeled with attributes
  data/photos.ts         283 dish photographs (generated)
  data/photoCredits.ts   attribution, lazy-loaded (generated)
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

### The questions

**How many you get asked varies, and that's the point.** A fixed
questionnaire is wrong in both directions: answer "starving", "not doing
spicy" and "nothing soggy" and 314 dishes are already down to about 15, so
three more questions are pure tax - but shrug at everything and six questions
have told us nothing.

So after each answer the planner scores every remaining question against what
is *still plausible* and asks whichever one splits it best. It stops when the
pool is small enough, when nothing left to ask would move it, or at a hard
ceiling. In practice that lands between three and five questions.

Two things a pure information-gain planner gets wrong, both corrected here:

- **A floor and a ceiling.** One question then an answer reads as a guess even
  when the maths says we know enough, and nobody wants nine. Three to seven.
- **Shrugging is an answer.** If you have answered "whatever" to everything,
  the pool is still the whole library and every remaining question still
  scores well, so the planner would happily ask all seven. But you are telling
  us you are not fussy, and the honest response to that is food, not another
  question.

The step label never says "3 of 8", because that would become a lie the
moment the count changes. It counts dishes down instead - "147 still in play",
then "down to 36" - which is the thing actually happening.

**It never asks the same thing twice**, and never asks what cuisine you
want. An earlier build asked "not feeling spicy?" on one screen and "do you
want heat?" on the next, plus the same duplicate pair for hot/cold, heaviness,
healthiness and sweetness. Mood questions live in one place; standing dietary
rules live in your profile where you set them once.

### The look

**Maximalist, delivery-app red.** A saturated multi-color ground under a dot
screen, chunky ink outlines on everything, hard offset shadows, and a different
color for every option in a list. Buttons travel *into* their own shadow when
pressed. The palette is anchored on a hot red (#eb1700) over clean white cards,
taking its cue from food-delivery apps — inspired by that look, not copying it:
no borrowed logo, wordmark or brand asset appears anywhere.


The theme needs three tokens, not one, because they do not move together:

| token | is | in dark |
| --- | --- | --- |
| `--ink` | text *and* the chunky outline | flips to cream |
| `--shadow-ink` | the hard offset shadow | stays dark — it has to be darker than the card or the shadow vanishes |
| `--on-accent` | text sitting on a pastel fill | **unchanged** — a cream label on a pastel chip is unreadable |

That last one is the trap: most color on this page sits on a pastel, so if
text just inherits `--ink` it becomes invisible the moment the theme flips.

**Still built around appetite.** Warm hues — watermelon, papaya, mango, custard —
carry roughly two thirds of the surface area and always own the primary
actions. Lime, mint, berry and grape are pops, not the base. Cool blues and
grays stay out of it: they read clinical and are famously appetite-suppressing.
Outlines are a very dark warm brown (`--ink`), never black.

**Emoji on the option pickers**, drawn icons everywhere else. Emoji are big,
instantly readable and carry their own color, which is exactly what a
maximalist picker wants; the chrome (back, undo, heart, trash) stays on the
drawn 24px icon set so it holds up small and inherits `currentColor`.

**Pictures.** Three tiers, best first: 87 dishes have a vendored CC0 studio
photograph in `src/assets/food/`, 192 keep a Wikimedia Commons photo, and the
remaining 33 are drawn. `FoodArt` also falls back to the drawing when an image
fails to load, so a card is never empty.

The Commons-only version had a problem no filter could fix. These all matched
the dish name on every significant word and were still wrong:

| Dish | What the photo actually showed |
| --- | --- |
| Khao Soi | Vogel's pit viper, at the Khao Soi Dao Wildlife Sanctuary |
| Apple Pie | an album cover - a portrait of the musician Kelly Lee Owens |
| Kofta Kebab | a lamb in a field, from the geograph.org.uk survey |
| Korean BBQ | a restaurant building and its car park |
| Smashburger | a storefront |
| Hot Chocolate | people at a party |
| Cold Brew | the Oji brewing apparatus |
| Beignets | a beignet-making machine |

Word overlap proves the subject is *named*, not that it is food. Neither does
the metadata: Openverse reports `category: photograph` for a William Blake
engraving. The only check that worked was rendering every image to a contact
sheet and looking at it, which is what `_sheet.html` in the scratch scripts is
for. 19 Commons photos and 15 stock picks were removed that way.

So the source matters more than the filter. StockSnap and Rawpixel are CC0 and
their food photography is studio-lit, which is why they are tier one - though
Rawpixel also hosts digitized museum artwork, so its results still need eyes.
Coverage is the trade: CC0 stock has plenty of pizza and pancakes and nothing
at all for Tteokbokki or Bouillabaisse, which is why Commons still carries the
long tail.

Stock photos are vendored rather than hotlinked. Each CDN serves exactly one
rendition - 40KB to 460KB, no smaller variant, and StockSnap 404s every width
but 960w - while a card only ever shows about 400px. Resizing locally with
`sharp` turns a 22MB dependency on someone else's bandwidth into 2.4MB we own.
They go in `src/assets/` so Vite hashes them and rewrites the `/crave/` base
path. Commons photos are still hotlinked, and attribution for them lives in
`photoCredits.ts`, imported on demand so it stays out of the initial bundle.

Two things worth knowing if you regenerate them. Openverse allows 200
anonymous requests a day, so `stock.js` paces itself and saves state as it
goes. And filtering by `category=photograph` returns *zero* results for
gnocchi - most records simply have no category - so it filters on the title
instead.
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

Food colors are contrast-checked: any `art.base` above 0.86 luminance vanishes
against the pale card, so those get pushed down toward a warm tan.

**Icons** are one family on a 24px grid with a 1.85 stroke, all inheriting
`currentColor` — never hardcode a color in `icons.tsx`. They are drawn from
what the real object looks like: a flame is a teardrop with a cooler inner
core, a fork has tines and a collar, a leaf has an off-center midrib.

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
   sweet vs savory, and budget (which uses the priceLevel on every dish).
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

Adding a dish is one object in `foods.ts` — pick any `art.form` and two colors
and it draws itself. Adding or rewording a question is one entry in
`questions.ts`.

Run `npm test` after either — the tests assert things like "starving plus savory
returns filling meals", "no spice keeps spicy food away", and "anything tagged
cheesy is also tagged dairy", so they catch a mislabeled dish surprisingly often.

## What it deliberately doesn't have

No accounts, no backend, no restaurant API, no third-party assets, no icon or
animation library. "Find it near me" just opens a Google Maps search for the
dish, which needs no API key and works today.
