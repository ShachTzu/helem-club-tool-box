RELEASE CANDIDATE — Admin engagement dashboard

WHAT SHIPPED
An overall summary at the top of `/admin` (total + registered-member views and comments across the whole platform, replacing hardcoded placeholder numbers), plus two new per-component admin dashboards: **toolbox** (`/admin/toolbox/dashboard` — views split registered/anonymous, plus star-rating average/count and an 8-week new-review trend chart) and **knowledge-base** (`/admin` panel "דשבורד מאגר הידע" — views split registered/anonymous). The existing blog dashboard's comment count now comes from real data instead of a hand-maintained mock counter.

Along the way, fixed a real pre-existing bug: blog's post page and knowledge-base's record page never actually called their own view-increment mutations — `viewCount` was frozen at seed values in production. Both are now wired (deduped per page-load via a new shared `useTrackViewOnce` hook). Toolbox app pages had no view tracking at all before this — it's net new.

PLATFORMS
Web only (this app has no other platform). UAT NOT run — see NOT TESTED below.

DATA
No new personal-data fields. Each view-tracking counter now also splits into "was the viewer signed in" (`registeredViewCount`), derived server-side from the session on every request — never client-supplied, never tied back to which specific user viewed what. All new aggregate endpoints (`getToolboxViewStats`, `getToolboxRatingStats`, `getKnowledgeBaseViewStats`, `getCommentStats`, `getBlogStats`) return counts/averages only — no individual comment text, no user lists, no device IDs. Retention: same as the counters they extend (indefinite, matches existing `viewCount`). No deletion path needed — nothing here is personal data about an identifiable person.

MIGRATION
Additive-only schema changes, all with safe defaults:
- `blog.PostModel` — added `registeredViewCount: number` (default 0)
- `knowledge-base.MediaRecordModel` — added `registeredViewCount: number` (default 0)
- `toolbox.AppModel` — added `viewCount: number`, `registeredViewCount: number` (both default 0; toolbox apps had no view tracking before)
- `blog.entities.BlogStats` — added `registeredViews?: number` (optional, backward-compatible; only caller is `BlogStats.from()`, already updated)
No backfill needed — existing documents just read 0 for the new counters going forward. Fully reversible: dropping the fields loses only the new counters, nothing else depends on them.

BREAKING
None. No existing public GraphQL type gained or lost a field. `incrementPostView`/`incrementRecordView` mutations are unchanged client-side (server now also reads session internally — old clients keep working identically). One internal-only mutation signature changed before it shipped anywhere: `incrementToolboxAppView` dropped an unused `deviceId` arg during this same round (never released, no old client exists).

CONFIG
None. No new env vars, keys, or feature flags.

ROLLBACK
Revert the branch. No data migration to undo — the new counter fields simply stop being read/written; existing `viewCount`/`clickCount`/etc. behavior is untouched. `getBlogStats` reverts to its old (unauthenticated, mock-comment-count) behavior, which is a real regression to be aware of if only *this* commit is reverted rather than the whole branch — call it out if that ever happens.

WATCH
- Toolbox `viewCount`/`registeredViewCount` should start climbing from 0 as soon as `app-detail` pages are visited — if they stay at 0 after a day of real traffic, the mutation isn't firing (check the browser network tab for `incrementToolboxAppView`).
- Blog/knowledge-base `viewCount` should resume climbing (it was frozen before this fix) — if it doesn't move, the `useTrackViewOnce` wiring broke.
- `getBlogStats` now requires moderator/admin auth server-side — if the blog dashboard suddenly shows "אירעה שגיאה בטעינת נתוני הבלוג" for an admin, check that their session actually carries `moderator`/`admin` role (this is a real behavior change: the endpoint used to be open to anyone).

KNOWN OPEN
- Gallery, events, and knowledge-domains have no view tracking or dashboard — explicit user decision to scope this round to blog/toolbox/knowledge-base only.
- Reactions and saves (already tracked by the engagement aspect) are not surfaced on any dashboard — deferred by explicit user choice.
- Views are all-time totals only, no time-series — the underlying counter has no per-view timestamp (comments/ratings do have one, hence their weekly trend). Turning views into a time-series would mean switching from a running counter to an event log — a bigger change, not attempted here.
- The unmerged Knowledge Library (text-page CMS) branch is untouched — no tracking exists there yet. Natural next step once that branch lands.
- Toolbox's `incrementToolboxAppView`/blog's/knowledge-base's view-increment endpoints have no ownership/status check on the target id (e.g. a client could increment a draft or pending app's view count by guessing its id) — pre-existing pattern in blog, now also present in toolbox. Low severity: no data is exposed, and the toolbox dashboard's aggregate query already filters to `status: 'approved'` apps only, so this can't skew what admins see.

NOT TESTED
- Never run against a live MongoDB — this session has no `MONGO_URL` (same constraint as every prior session on this project). All verification was a strict `tsc --noEmit --noResolve --skipLibCheck` pass over every changed/new file (clean) plus manual trace of every new resolver's auth path and every new query's field selections against its schema.
- `bit add`/`bit compile`/`bit test`/`bit snap` not run — this worktree's local Bit scope objects are stale/missing (`bit status` reports "component objects are missing from the scope" for ~166 components) and `bit import` needs network access this sandbox doesn't have. New spec files were written (`knowledge-base-dashboard.spec.tsx`, `toolbox-dashboard.spec.tsx`, `use-track-view-once.spec.tsx`) but never executed.
- No browser/UI verification — nobody has clicked through `/admin`, `/admin/toolbox/dashboard`, or the new knowledge-base panel in a running app.
- Cross-user/IDOR testing on the new endpoints not run live (traced the auth code path manually instead, same limitation as always noted in this project's prior RCs).
- Whoever picks this up next (hopeAI's usual role): pull to the live workspace, run the seeded dev DB, click through `/admin` as an admin and as a plain member (member should be redirected/blocked from all three new dashboard routes), and confirm the toolbox app-detail page's view count actually increments on repeat visits.
