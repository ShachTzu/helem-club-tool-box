# Knowledge Unification — absorbing מאגר הידע into ספריית הידע

**Status:** implemented (2026-08-07), commit `22e5081`.
**Supersedes** parts of [`2026-08-06-knowledge-library-design.md`](./2026-08-06-knowledge-library-design.md) — specifically its "keep the two scopes separate" decision.

## Scope boundary (explicit)

**In scope** — `knowledge-library` absorbs `knowledge-base`: content model,
routes, navigation, admin panels, home section, demo seeding.

**Out of scope, deliberately untouched** — the community-wisdom feed
(`knowledge-domains/hooks/use-wisdom-feed`, `ui/community-wisdom`). It keeps
its existing data source, its internal `'record'` key, its link targets and
its `מאגר ידע` display label. It is a different feature with a different
owner, and this work does not get to reshape it.

An earlier draft of this change *did* migrate the feed onto the library. That
was scope creep and was reverted; `knowledge-domains` is byte-identical to its
pre-merge state. If the feed should ever move to the library as its source,
that is its own feature with its own decision — not a side effect of this one.

## Why this reverses yesterday's decision

The original design explicitly asked the question "separate or merged?" and chose
**separate**: build `knowledge-library` as a new sibling scope, leave
`knowledge-base` untouched. That was the right call *on the information available
at the time* — `knowledge-base` was a working, shipped feature and nothing
justified destabilising it.

What changed is not an opinion, it is evidence. Once the app actually ran against
a live database (which nothing could do until 2026-08-07 — see the RESUME note),
the two features were visible **side by side in the navigation for the first
time**, and the overlap was obvious to the person who has to explain this product
to a community manager:

- Two nav items, "מאגר ידע" and "ספריית הידע", that a non-technical admin cannot
  reliably choose between.
- Both contained an item literally called **"עזרה ראשונה"** — the same name, in
  two different systems, meaning two different things.

The original spec had already flagged this risk in its own "Which system does
content go in?" section and tried to solve it with *copy* (a rule of thumb next
to each entry point). Seeing it live proved copy was not enough. The overlap was
structural, not a labelling problem.

**Decision: one content system. `knowledge-library` absorbs what `knowledge-base`
did; `knowledge-base` is retired from the running app.**

## What made this cheap enough to do now

Three facts, all verified against the live database rather than assumed:

1. **`knowledge-base` held no real content.** All 5 media records and 5 labels in
   the dev DB matched `MEDIA_RECORD_MOCKS` exactly — invented demo text about
   post-trauma, auto-seeded on boot. There was nothing of the organisation's to
   migrate. (It was also content the project's own "no fake data" rule already
   ruled out, on a site for trauma survivors.)
2. **`knowledge-library` was already a near-superset.** It had hierarchy (vs. flat
   labels), text bodies, images, video URLs, validated embeds, domain tagging and
   backdatable publish dates. Only three capabilities were missing.
3. **Nothing else read `knowledge-base` from the database.** The one other
   consumer, the community-wisdom feed, uses `knowledge-base`'s in-code *mock*
   exports rather than live queries — so deleting the seeded rows and stopping
   the seed could not break it. (That feed is out of scope here and was left
   alone; the only thing it needed was its old URLs to keep resolving, which
   the forwarding routes handle.)

Had any of these been false — especially (1) — the answer would have been
different, and a real data migration would have been required first.

## What was actually moved

| Capability | Resolution |
|---|---|
| `mediaType` (video/audio) | added to `KnowledgePage` |
| `durationSec` | added to `KnowledgePage` |
| `viewCount` + increment | added, incl. `incrementKnowledgePageView` mutation |
| `thumbnailUrl` | already covered by the existing `image` field |
| Labels (flat grouping) | already covered by `parentId` hierarchy (a superset) |
| `MediaPlayer` UI | **reused in place**, not copied — see below |
| Admin panels, routes, home section, seed | dropped with the aspect |
| Old `/knowledge*` URLs | forwarded to `/knowledge-library` (see below) |

### Deliberately NOT moved: `MediaPlayer`

`knowledge-library` still imports `MediaPlayer` / `formatDurationSec` from
`knowledge-base/ui/media-player`. This is intentional. That component is pure UI
with no backend, no aspect and no data of its own; copying it would have
duplicated working, tested code to satisfy a naming tidiness that has no
behavioural benefit. The *aspect* is retired; a shared presentational component
living in a neighbouring scope is ordinary reuse.

If `knowledge-base` is ever deleted from the repo outright (it currently stays,
unreferenced), `MediaPlayer` must move to `knowledge-library/ui/` first. That is
the one thing that would break.

## How the retirement works

Removing `KnowledgeBaseAspect` from `platform/helam/helam.bit-app.ts` is the
single lever. Because every feature in this codebase self-registers through the
platform (`registerRoute` / `registerNavigationItem` / `registerAdminRoute` /
`registerHomeSection` / `registerSeed`), dropping it from the aspect list removes
**all** of them at once: `/knowledge*` routes, the nav item, the home preview
section, both admin panels, and the demo seed.

That last one matters: it is why deleting the demo rows from the database sticks
instead of being re-seeded on the next boot.

## The trap this exposed

Retiring the aspect was necessary but **not sufficient**. Five user-facing
references to `/knowledge` and "מאגר ידע" lived at the **platform** level, not
inside the retired feature:

- the hero CTA (`platform/sections/hero`)
- the footer link list (`platform/layout/footer`)
- the header's fallback nav (`platform/layout/header`)
- the global-search category label (`platform/ui/global-search`)
- the ecosystem pillar on the home page (`platform/sections/ecosystem-overview`)

Removing the aspect alone would have left five dead links on the home page. All
now point at `/knowledge-library`.

**Generalised lesson:** in this codebase, a self-registering feature is *not*
self-contained. The platform hardcodes references to features it does not own.
Retiring any feature requires grepping the platform scope for its routes and
Hebrew labels, not just unregistering the aspect.

## Keeping old links alive: mail-forwarding

Retiring the `/knowledge*` routes and leaving the feed untouched are both
required — but together they would have left the feed's cards pointing at
dead URLs. Verified, not assumed: `/knowledge/record/:slug` rendered the
"הדף הזה איננו" page after the aspect was dropped.

Resolution: `knowledge-library` registers forwarding routes for `/knowledge`,
`/knowledge/record/:slug` and `/knowledge/:labelSlug`, all landing on
`/knowledge-library`. The forwarding lives in the scope that *absorbed* the
content, so no out-of-scope feature is edited to make it work.

Two implementation details that are easy to get wrong:

- **Not `<Navigate>`.** It is a no-op during server-side rendering
  (react-router warns "must not be used on the initial render in a
  StaticRouter") and would serve a blank page to anyone whose JS has not run.
  `LegacyKnowledgeRedirect` renders a real readable message server-side and
  forwards on mount instead.
- **One `registerRoute` call, not two.** See below — this one cost real time.

## Discovered the hard way: the route slot is keyed by aspect

Adding the forwarding routes in a *second* `helamPlatform.registerRoute([...])`
call silently 404'd `/knowledge-library` itself. `routeSlot.register()` is keyed
by the calling aspect id, so a second call from the same aspect **replaces** the
first rather than appending to it.

There is no error and no warning — the earlier routes simply stop existing.

**Rule for any aspect in this codebase: register all of your routes in a single
`registerRoute` call.** The same almost certainly applies to the other slots
(`registerNavigationItem`, `registerAdminRoute`, `registerFooterLink`,
`registerHomeSection`), which share the mechanism.

## Data boundary (unchanged by this work)

Nothing about authorization changed. `isPublished` is still enforced server-side
from the session (`canManage`), never from client input; mutations are still
gated by staff role or the feature's own editor allowlist. The one new mutation,
`incrementKnowledgePageView`, is **intentionally unauthenticated** — it mirrors
`knowledge-base`'s `incrementRecordView`, only ever bumps an integer, and can
neither read nor modify page content.

## What was verified, and what was not

**Verified live** against the dev database and the running app:
- home page shows only ספריית הידע; no `מאגר ידע` string anywhere in the rendered page
- a real chapter renders with breadcrumb, backdated 2023 date, body, byline and its YouTube embed
- `listRecords` / `getRecord` / `listLabels` / `getLabel` are gone from the GraphQL schema
- the 7 real library pages survived the demo-data deletion
- old `/knowledge*` URLs forward to the library; the feed's links resolve again
- the wisdom feed still renders and still shows its original `מאגר ידע` label
- 65/65 tests across 8 components

**Not verified:**
- audio playback and the duration/view-count display have **no real content
  exercising them yet** — every seeded page is a YouTube video with no duration.
  The first genuinely audio page is the real test.
- view counting was not observed incrementing in a browser; the once-per-visit
  ref guard is reasoned, not measured.
- nothing has been `bit snap`/`export`ed to the lane yet.

## Open follow-ups

- Upload the author avatar (`CLOUDINARY_URL` is now configured) and set
  `HELEM_CLUB_AVATAR_URL`.
- Decide whether to delete the `knowledge-base` components from the repo
  entirely. If yes, move `MediaPlayer` first.
- Two feature ideas raised during this work and deliberately deferred to their
  own `/idea` pass: rich-text editing for page bodies, and an admin dashboard
  splitting visitors/engagement between registered-and-verified users and
  everyone else.
