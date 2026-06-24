# PROJECT_STATE.md

## Project

Brainrot Kitchen is a simple mobile-friendly PWA hosted on GitHub Pages.

It uses a Cloudflare Worker to call Gemini and generate meal ideas.

The project should stay MVP/agile:

* one small change at a time;
* targeted commits;
* stability before new features;
* no unnecessary framework, database, or large recipe library for now.

## Current architecture

* Frontend: GitHub Pages
* Worker API: `https://brainrot-kitchen.eve-vinclair.workers.dev/api/recipes`
* Endpoint: `POST /api/recipes`
* Gemini model: `gemini-2.5-flash`
* Cloudflare secret: `GEMINI_API_KEY`

Main files:

* `index.html`: UI structure
* `styles.css`: UI styling
* `app.js`: frontend state, prompt construction, UI behavior, error display
* `worker/index.js`: Worker API logic and Gemini call
* `PROJECT_STATE.md`: current project state and next priorities
* `AGENTS.md`: stable project rules for AI agents

## Product direction

The app should remain:

* simple;
* mobile-friendly;
* readable;
* playful / brainrot / pixel-game inspired;
* useful even when Gemini is unstable.

Core priorities:

* stable recipe generation;
* clear family constraints;
* good mobile UX;
* language adapted to user context;
* graceful errors;
* small improvements, not large refactors.

## Current family constraints

Always apply in recipe generation:

* No pork.
* No alcohol in cooking.
* Mum: vegetarian by default, fish only when explicitly allowed, likes seeds and fat.
* Dad, 53: eats some meat, dislikes rice / peppers / chorizo, watching calories.
* Terence, 14: vegetarian by default, fish only when explicitly allowed, dislikes spinach.
* James, 12, ADHD: eats everything.

Default recipe behavior:

* vegetarian by default;
* fish only if explicitly requested or if the `shark approved` chip is active;
* family-friendly;
* low-effort weekday meals;
* max 40 minutes;
* prefer available stock;
* avoid shopping by default;
* Thermomix-friendly ideas are welcome but should not be forced.

## Latest session — Chips redesign with pixel icons

### What was checked

* Chip semantics vs. default Gemini prompt values.
* CSS organization and standards compliance.
* HTML structure for grid layout.
* Chip click behavior and Gemini prompt integration.
* Icon rendering after browser cache / service worker cache refresh.
* Gemini request behavior after selecting chips.

### What was changed

* `index.html`: wrapped chips in `<div id="chips">` container.
* `index.html`: replaced old `<span class="pixel-*">` chip icons with `<img class="chip-icon" src="assets/icons/chips/*.png">`.
* `styles.css`: removed old generated chip icon classes:

  * `.pixel-zap`
  * `.pixel-broccoli`
  * `.pixel-bucket`
  * `.pixel-salad`
  * `.pixel-kid`
* `styles.css`: added `.chip-icon` styling with pixelated rendering.
* `styles.css`: increased chip icon size for better readability:

  * 28×28 px by default;
  * 24×24 px on mobile.
* `styles.css`: kept grid layout with 2 columns and last chip spanning full width.
* Chip prompts updated for clearer Gemini instructions:

  * `quick` → very quick, 10 to 15 minutes total including cooking time;
  * `shark approved` → fish is allowed for this meal;
  * `protein buff` → more protein-rich meal;
  * `breakfast` → breakfast-style, savory, protein-rich and fiber-rich;
  * `cozy mode` → cozy comforting meal, warm and satisfying.
* Added PNG chip icons:

  * `assets/icons/chips/quick.png`
  * `assets/icons/chips/shark.png`
  * `assets/icons/chips/protein.png`
  * `assets/icons/chips/breakfast.png`
  * `assets/icons/chips/cozy.png`

### What was validated

* CSS cache / service worker cache issue was identified and resolved by clearing cache.
* Chip icons now load correctly.
* Chip icons display at the expected size.
* Chip layout is no longer broken.
* Clicking a chip toggles its selected state.
* Selected chip prompts are stored in `state.activeChips`.
* Selected chip prompts are included in `fullQuery`.
* `fullQuery` is included in the prompt sent to Gemini.
* The chip behavior works with the Gemini recipe request.

### Current status

* Chip redesign is complete.
* Chip icons are present and displayed.
* Chip prompts are correctly sent to Gemini.
* The chip work was committed locally and prepared for push.
* Push status should be checked with `git status` if unsure.

## Latest session — Random brainrot error messages

### Context

A `502` appeared in the frontend console when calling:

```txt
POST https://brainrot-kitchen.eve-vinclair.workers.dev/api/recipes
```

The Worker response was:

```json
{"error":"Gemini API 503"}
```

This means:

* the frontend call works;
* the Worker receives the request;
* the Worker calls Gemini;
* Gemini temporarily returns `503`.

This is not caused by the chip icons, GitHub Pages, or CORS.

### What was changed

* `app.js`: updated `ERROR_CONTENTS.AI_SERVICE_UNAVAILABLE`.
* Removed masculine wording such as “chef”.
* Added gender-neutral / non-personified brainrot messages.
* Added multiple random variants for unavailable AI errors.
* Added helper logic to select a random error variant.
* Added or planned support for treating `API 503` as `AI_SERVICE_UNAVAILABLE`.

Current intended unavailable-AI variants:

```js
[
    {
        title: 'THE BRAINROT KITCHEN IS TAKING A POWER NAP',
        message: 'Impossible de générer une recette pour le moment. La marmite fait un reboot dans une tomate.',
    },
    {
        title: 'THE FRIDGE IS HAVING A SIDE QUEST',
        message: 'Impossible de générer une recette pour le moment. Le frigo est parti farmer de l’inspiration.',
    },
    {
        title: 'THE TOMATO IS IN CHARGE NOW',
        message: 'La génération a trébuché dans le placard. Réessaie dans un instant, la sauce revient.',
    },
    {
        title: 'THE BRAINROT KITCHEN IS BUFFERING',
        message: 'Les idées mijotent trop lentement. La marmite recharge ses neurones de courgette.',
    },
]
```

### What was validated

* `showError('AI_SERVICE_UNAVAILABLE')` should display a random title/message.
* Error display should not show `undefined`.
* Retry button should still appear.
* Other error types should still work:

  * `AI_RATE_LIMITED`
  * `NETWORK_ERROR`
  * `TIMEOUT`
  * `APP_ERROR`

### Current status

* Random error wording was implemented locally.
* Commit/push status for this latest `app.js` error-message change should be checked with:

```bash
git status
```

Recommended commit message if not committed yet:

```bash
git commit -m "Randomize unavailable AI error messages"
```

No `wrangler deploy` is needed for this change because it is frontend-only.

## Known technical behavior

### Gemini 503

Gemini can return temporary `503` errors depending on availability / time of day.

Current behavior:

* frontend receives an error from the Worker;
* error is shown to the user;
* retry button is available;
* no local fallback recipes yet.

Desired MVP behavior:

* if Gemini is unavailable, show a few local fallback recipes instead of only an error.

### Worker parsing

Worker parsing remains minimal if Gemini returns an unexpected JSON shape.

Known risk:

* Gemini may return valid text but invalid JSON;
* Worker may return an error instead of recovering.

Do not refactor the whole frontend to fix this.
Prefer:

* prompt improvement;
* Worker parsing hardening;
* clearer frontend error handling.

### `other ideas`

Known small debt:

* `btn-other` calls `askGemini(state.lastQuery + ' — give me different ideas from the previous ones')`.
* Since `state.lastQuery` may already include active chip prompts, `askGemini()` can append the same active chip prompts again.
* This may duplicate chip context in the prompt.
* Not blocking for MVP.

### `share-modal.js`

Known debt:

* `share-modal.js` still throws:

  * `Cannot read properties of null (reading 'addEventListener')`
* Likely fix:

  * add a null-guard before attaching event listeners.
* Should be handled as a separate small change.

## Roadmap courte

### MVP

* Text input.
* Recipe suggestions.
* Stable Gemini call.
* Clear chip behavior.
* Pixel chip icons.
* Friendly error messages.
* Local fallback recipes when Gemini does not respond or returns temporary errors such as `503`.

### V1

* Microphone.
* Favorites.
* History.
* Better handling of frequent Gemini errors.
* Small local fallback recipe set with 3 to 5 simple meals.

### V2

* Shopping list.

### V3

* Stock management.

### Future idea

* Brainrot School Furnitures.

## Recommended next steps

### Next 15-minute improvement

Add local fallback recipes when Gemini is unavailable.

Suggested scope:

* file: `app.js`;
* add `DEFAULT_FALLBACK_MEALS`;
* on `AI_SERVICE_UNAVAILABLE`, show 3 simple fallback recipes;
* keep the error wording or add a small note that Gemini is temporarily unavailable;
* do not modify Worker parsing in the same step.

Fallback recipe examples:

* veggie omelette / frittata;
* pasta with tomato and cheese;
* quick egg-cheese toast or quesadilla.

Rules for fallback recipes:

* vegetarian by default;
* no pork;
* no alcohol;
* no fish unless explicitly selected;
* simple ingredients;
* under 40 minutes;
* same object shape as Gemini meals:

  * `title`
  * `time`
  * `notes`
  * `ok_for`
  * `ingredients_needed`

### Then

1. Fix `share-modal.js` null-guard.
2. Improve Worker parsing robustness.
3. Fix `other ideas` chip-context duplication.
4. Improve language/i18n behavior.
5. Later: favorites/history.

## Git notes

Before any commit:

```bash
git status
```

For frontend-only changes:

* `index.html`
* `styles.css`
* `app.js`
* assets
* `PROJECT_STATE.md`

Use:

```bash
git add .
git commit -m "..."
git push
```

No `npx wrangler deploy` is needed for frontend-only changes.

Use `npx wrangler deploy` only when `worker/index.js` changes.

Do not commit:

* secrets;
* API keys;
* tokens;
* private env files;
* unexpected `.wrangler` content;
* unrelated package changes.

## Current caution

If `npx wrangler deploy` asks to install Wrangler, this is normal with `npx` when Wrangler is not installed locally/globally or cache was cleared.

Do not accept or commit Wrangler/package changes during a frontend-only task unless the project intentionally decides to add Wrangler as a dependency.
