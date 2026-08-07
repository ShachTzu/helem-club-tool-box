# RESUME HERE — Knowledge Library (ספריית הידע)

_Fast pickup for the next session (desktop Claude). Last updated: 2026-08-07._

## Status: BUILT & SAVED. Only live-env steps remain.

The feature is **fully coded, tested, and committed on this branch**
(`claude/knowledge-library-admin-19b540` = PR #3). Nothing is lost.

- 6 components, **60/60 unit/component tests passing**.
- Red-teamed + security-reviewed (embed-allowlist has 17 adversarial tests).
- New sibling scope `helemclub.knowledge-library` — additive, route-isolated.
  Does **not** touch `knowledge-base` (video/audio) or `knowledge-domains` (tags).

Detailed docs already in this branch:
- Design spec: `docs/superpowers/specs/2026-08-06-knowledge-library-design.md`
- Release-candidate report: `docs/release-candidates/knowledge-library.md`
- Project handoff / workflow / ownership: `HANDOFF.md`

## What remains — all 3 need the LIVE env (Mongo + Cloudinary + running app)

A code-only session (no `MONGO_URL`/`CLOUDINARY_URL`) cannot do these. hopeAI /
whoever runs the app owns the live gate.

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

### 2. Seed the first real content (through the live admin UI — doubles as UAT)
1. Manually create **"עזרה ראשונה"** as a top-level landing page.
2. CSV-import the sample PTSD series (`מה זה פוסט טראומה והאם יש לי כזו?`, 6
   chapters) with "עזרה ראשונה" selected as the top-anchor parent. The import
   auto-creates the series page as its child and the 6 chapters under it.

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
