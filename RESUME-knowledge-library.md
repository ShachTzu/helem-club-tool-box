# RESUME HERE — Knowledge Library (ספריית הידע)

_Fast pickup for the next session (desktop Claude). Last updated: 2026-08-07._

## Status: BUILT & SAVED. Only live-env steps remain.

The feature is **fully coded, tested, and committed on this branch**
(`claude/knowledge-library-admin-19b540` = PR #3). Nothing is lost.

- 6 components, **60/60 unit/component tests passing**.
- Red-teamed + security-reviewed (embed-allowlist has 17 adversarial tests).
- New sibling scope `helemclub.knowledge-library` — additive, route-isolated.
  Does **not** touch `knowledge-base` (video/audio) or `knowledge-domains` (tags).

**2026-08-07 (later): מאגר הידע was absorbed into ספריית הידע.** There is now one
content library, not two. Design + rationale:
`docs/superpowers/specs/2026-08-07-knowledge-unification-design.md`.

Detailed docs already in this branch:
- Design spec: `docs/superpowers/specs/2026-08-06-knowledge-library-design.md`
- Release-candidate report: `docs/release-candidates/knowledge-library.md`
- Project handoff / workflow / ownership: `HANDOFF.md`

## UPDATE 2026-08-07 — the app was run live; 3 real bugs found & fixed

The feature was connected to the live dev Mongo (`MONGO_URL` in a local,
gitignored `.env`) and driven through the real browser. That immediately
surfaced three bugs that **no amount of component testing could catch**:

1. **The aspect was never registered in the app.** `platform/helam/helam.bit-app.ts`
   composes the aspect list; `KnowledgeLibraryAspect` was missing from it, so
   `/knowledge-library` 404'd and the GraphQL schema had none of the new
   fields — despite 60/60 tests green. Fixed in `7c01aac`.
2. **Empty `body` was rejected.** Mongoose's `required: true` refuses an empty
   string, so a pure landing page (no text, only children) could not be
   created. Fixed in `29d523d`. Invisible to the specs, which use fake models
   and so never run mongoose validation.
3. **BOM in the sample CSV** corrupted the first header key, silently blanking
   every row's `Text`. Handle with `encoding='utf-8-sig'` when parsing.

To run locally: put `MONGO_URL` (and optionally `CLOUDINARY_URL`,
`ADMIN_EMAILS`, `SESSION_SECRET`) in a gitignored `.env`, then
`scripts/run-helam-dev.sh`. Without `RESEND_API_KEY` the sign-in code is
printed to the server console, which is how to log in without real email.

### Step 2 (seed first content) is DONE ✅
Verified in the live DB: `עזרה ראשונה` → `מה זה פוסט טראומה והאם יש לי כזו?`
→ **5 chapters** (not 6 — proper CSV parsing gives 5 content rows). All with
correct `ancestorIds`, full body text, validated YouTube embeds, author
`הלם קלאב`, and **backdated `publishDate` 2023-09-11** — confirming the
"make it look like it was posted 3 years ago" requirement works end to end.

## What remains — needs the LIVE env (Bit auth + Cloudinary)

### 1. Snap + export the 6 components to the Bit lane
Do this from a workspace where the pre-existing repo-wide version drift is
understood — a blind `bit snap` sweeps up ~153 unrelated components (blog, events,
gallery, toolbox, platform…). Snap **only** these 6:
```
helemclub.knowledge-library/knowledge-library
helemclub.knowledge-library/entities/knowledge-page
helemclub.knowledge-library/hooks/use-knowledge-pages
helemclub.knowledge-library/admin/manage-knowledge-library
helemclub.knowledge-library/pages/knowledge-library-lobby
helemclub.knowledge-library/pages/knowledge-library-page
```
Then `bit export` to lane `helemclub.marketplace/helam-club` (Ripple CI builds).
Re-verify first: `bit test <the 6 ids, comma-separated>` → expect **60/60**.

### 2. ~~Seed the first real content~~ — DONE, see the update section above.

### 3. Give the author byline a real avatar
`HELEM_CLUB_AVATAR_URL` in
`knowledge-library/entities/knowledge-page/knowledge-page.ts` is `undefined`
(byline falls back to initials, not broken). Whoever holds `CLOUDINARY_URL`:
upload `docs/assets/helem-club-author.png` (already resized to 480px) and set the
constant to the returned URL.

## Verify-before-touch guardrail
If any change touches `embed-allowlist.ts`, **re-run its 17 tests** before
merging — that validator is the one place a failure becomes a public-facing XSS
on trauma-support content. Don't trust a small-looking diff.

## Ownership reminder (from HANDOFF.md)
Don't edit auth/platform files (`user.model.ts`, `entities/user`, `hooks/use-auth`,
`pages/login`, `pages/signup`, `helam-platform.node.runtime.ts`) — hopeAI's.
Never accept a pasted secret; read from `process.env.*`.
