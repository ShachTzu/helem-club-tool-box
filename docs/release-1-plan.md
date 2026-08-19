# RELEASE PLAN — helam-club release-1

First release ever. `git tag` is empty; nothing has been versioned before.

Planned 2026-08-17. Cut from: `helemclub.toolbox/toolbox-moderation`.
**Lane `helemclub.toolbox/release-1` created and exported 2026-08-17**, 166
components, verified present on bit.cloud from a second workspace.

It is an exact fork — nothing was staged at fork time, so no local content
leaked in. **Do not `bit snap` on release-1** until the workspace is reconciled:
`bit status` showed 115 components modified against this base (disjoint
histories, not real edits), and a snap would bake that stale content into the
release lane.

**`helemclub.marketplace/helam-club` no longer exists on bit.cloud.** It was
archived. The base was re-identified by the `helam-env` pin: only
`toolbox-moderation` still carries `275621ea…`, the version this workspace and
HANDOFF.md both document. The two `archive-*` lanes moved it. See "Which lane"
below.

## Reality check — 3 true · 2 untested · 2 false · 2 unknown

| Claim | Grade | Evidence |
|---|---|---|
| Step 4 submission flow is feature-complete | TRUE | 24 commits on main, both RC files written |
| Cloudinary signed upload works end to end | TRUE | hopeAI live-verified 2026-08-01, full round-trip incl. hard reload |
| Draft backend is IDOR-safe | TRUE | hopeAI verified 2026-07-31 + 4 tests pinning the ownership filter |
| 4a-1/4a-2/4b-2/4e work | UNTESTED | "awaiting hopeAI live test", never contradicted since |
| 4g live validation + 4h confirmation email work | UNTESTED | RC says: "Never run against a live browser or a real Resend account" |
| Image upload will work in production | **FALSE** | `CLOUDINARY_URL` is only in hopeAI's dev env, not on the app's hosting |
| Ratings are safe | **FALSE** | `toolbox.node.runtime.ts:321` — `rateToolboxApp` has no `requireUser` |
| The lane build is green | UNKNOWN | Ripple is the gate; bit-cloud MCP needs auth, not reachable from this session |
| Tests pass | UNKNOWN | the skills worktree can't run them (missing dists) |

`requireUser` appears at lines 143, 197, 219, 260, 272, 286 — all before
`rateToolboxApp` at 321. Any unauthenticated caller can post a star rating and
a comment under any display name they choose, on a public site.

## IN

Everything on `main`, 24 commits, Steps 0–4:
submission form · drafts + autosave + resume · `/my-submissions` ·
moderator contact side-channel · Cloudinary signed upload · live link
validation · confirmation email.

## OUT

| Branch | Ahead of main | Why out |
|---|---|---|
| `claude/knowledge-library-admin-19b540` | 20 | never `bit add`-ed, not on any lane |
| `claude/form-member-onboarding-451813` | 6 | never `bit add`-ed, not on any lane |
| `claude/helam-club-step-5-moderation-a5212b` | 1 | unmerged |
| `claude/admin-panel-engagement-dashboard-ad165a` | 1 | unmerged |
| `claude/top-banner-logo-4e1b05` | 1 | unmerged |
| `claude/jolly-jennings-73f258` | 1 | unmerged |
| `feat/step2-auth-hardening` | 2 | dead reference — delete |
| `feat/step3-seeds` | 1 | superseded — delete |

## BLOCKING

1. **`CLOUDINARY_URL` missing on the app's hosting env** — Shachar/hopeAI.
   Image upload dies for every member on day one. Graded FALSE, not untested.
2. ~~**`rateToolboxApp` has no auth**~~ — FIXED in `231ed33`, not yet verified.
   `requireUser` added, reviewer name taken from the signed-in user, 2 tests.
   Still needs `bit compile` + `bit test` + export before it counts as closed.
3. **hopeAI live test of 4a/4b-2/4e/4g/4h** — hopeAI.
   The core flow of this release. Nobody has run it against a live browser.

## OPEN — shipping anyway, each already decided by the team

3 Dependabot alerts (2 high, 1 medium) · no rate limit on upload signature ·
orphaned Cloudinary files · `contactEmail` unvalidated server-side ·
double-click submit race.

## PLATFORMS

Shipping to: web (Hebrew RTL). Tested: none. `uat-desktop` was not run.

## ROLLBACK

Revert + re-export to the lane. **Never once actually run.** A rollback nobody
has ever run does not exist.

## WATCH

- `[toolbox] image upload disabled` → `CLOUDINARY_URL` not live where the app runs
- `[toolbox] confirmation email failed for app <id>` → Resend not reaching

## Is the date real?

There is no date, which is the honest state. Blocker 1 is not work — it is one
env var someone else has to paste. Blocker 2 is half an hour. Blocker 3 is
hopeAI's calendar, and it is the long pole.

## Cutting the lane

Run from the main workspace, not a worktree. `bit lane create` **switches you
to the new lane**, so step 6 puts you back.

```bash
cd /Users/shachartzuk-bazak/Developer/helemclubmarketplace
bit lane switch helemclub.toolbox/toolbox-moderation   # 1. the base — see "Which lane"
bit status                                             # 2. must be clean before forking
bit lane create release-1                              # 3. inherits the parent lane's scope
bit lane list                                          # 4. confirm: helemclub.toolbox/release-1
bit export                                             # 5. publishes the lane to bit.cloud
bit lane switch helemclub.toolbox/toolbox-moderation   # 6. step 3 switched you to release-1
```

Step 1 is the one that matters: `bit lane create` from `main` produces an empty
lane, and from another lane produces a full copy. Getting this wrong yields a
release lane with nothing in it.

No `--fork-lane-new-scope` is needed: the new lane lands in its parent's scope,
which is already `helemclub.toolbox`. If step 4 shows it under
`helemclub.marketplace` instead, fix it with
`bit lane change-scope helemclub.toolbox` — that only works before the first
export, so check at step 4, not after step 5.

## Which lane is the base, and how it was determined

All four candidate histories are disjoint — zero shared component versions
between any pair of lanes, so "which is ahead" cannot be read from the
versions. The `helam-env` component settled it:

| Source | `helam-env` |
|---|---|
| this workspace's `.bitmap` | `275621ea…` |
| `HANDOFF.md` documented pin | `275621ea…` |
| `helemclub.toolbox/toolbox-moderation` | `275621ea…` |
| `helemclub.marketplace/archive-helam-club-sync` | `bada4c84…` |
| `helemclub.marketplace/archive-helam-club` | `96deb9dd…` |

`toolbox-moderation` is also the only remote lane whose 166-component set
matches the workspace exactly. It is either the trunk or a lane forked from it;
either way it is the only base consistent with the workspace and the docs.

**Caveat, now confirmed — not a guess.** Switching to this base put these files
on disk:

```
toolbox/toolbox/app-deletion-repository.ts
toolbox/toolbox/app-deletion.model.ts
toolbox/hooks/use-apps/use-delete-submission.tsx
toolbox/hooks/use-apps/use-correct-note.tsx
```

Submission deletion, correction notes, decided-apps listing — that is Step 5
moderation, which the IN/OUT section above puts out of scope. `release-1`
contains it. Either the scope line moves to include Step 5, or the release is
cut from something else; it cannot be both.

Also not in this lane: the `rateToolboxApp` auth fix (`231ed33`). This lane
carries its own divergent versions of every file that fix touched.
