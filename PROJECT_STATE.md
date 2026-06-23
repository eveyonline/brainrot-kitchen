## Latest session — Gemini JSON / Worker 502 fix

### What was checked

* `app.js` prompt sent to Gemini.
* `worker/index.js` CORS/error handling around the API response.
* UI behavior after retrying the failing generation case.

### What was changed

* `app.js`: strengthened the Gemini prompt to require a directly parseable JSON array of exactly 3 meal suggestions.
* `worker/index.js`: fixed one `corsHeaders()` call by passing `request` in the `Missing GEMINI_API_KEY secret` error branch.

### What was validated

* The previous `502` error no longer appears on the tested request.
* The UI displays meal suggestions correctly after the fix.

### Current project state

* Gemini generation is functional again.
* Worker response is OK on the tested case.
* Repository status, commit and push: not checked in this session.

### Known debt

* `share-modal.js` still throws `Cannot read properties of null (reading 'addEventListener')`.
* Worker parsing remains minimal if Gemini returns an unexpected JSON shape.

### Next recommended step

Fix only `share-modal.js` by adding a small guard when the targeted HTML element does not exist.
