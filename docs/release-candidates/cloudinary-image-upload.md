RELEASE CANDIDATE — Cloudinary signed image upload (#1)

Ponytail mode used: full
Experts run: red-team-engineering, security-review, code-review, ponytail-review, israeli-appsec-scanner
Skipped on purpose: none

WHAT SHIPPED
A member submitting a tool can now upload a real icon image and up to 5
screenshots, instead of only typing an emoji. The upload goes straight from
the browser to Cloudinary; our server only hands out a signed, time-limited
permission scoped to that member's own folder — the Cloudinary secret never
reaches the browser. Screenshots are wired end to end: submit form → draft
autosave/resume → stored on the app → already renders in the catalog and app
detail page (that display side was already built by the team).

PLATFORMS       touched: web (submit-tool page). UAT already run on: none — not run this session (see NOT TESTED).
DATA            no new personal data. icon/screenshots are public catalog fields, same as before.
                a member's uploads land in Cloudinary under toolbox/submissions/{their user id} —
                no deletion path yet if a submission is later rejected (see NOT TESTED).
MIGRATION       none. `screenshots` already existed on AppModel and in the GraphQL response shape
                (unused by submission until now) — only the *input* side changed. No backfill needed.
BREAKING        none. Old drafts with no screenshots simply resume with an empty screenshots list.
CONFIG          requires CLOUDINARY_URL in the running env. Missing/malformed → upload fails with a
                clear Hebrew error and a server-side console.warn; the rest of the toolbox (catalog,
                browsing, other submission fields) keeps working — this was a deliberate design
                choice, not an oversight (browsing shouldn't die because image upload isn't configured).
ROLLBACK        revert this commit. Nothing external needs undoing — Cloudinary uploads already made
                stay as orphaned files in the member's folder (harmless, no code depends on them once
                reverted).
WATCH           server logs for "[toolbox] image upload disabled" — means CLOUDINARY_URL isn't live
                where the app runs. If members report the upload buttons doing nothing, check that
                first.
KNOWN OPEN
  - No rate limit on requesting an upload signature (matches the plan's own open item, §11.2 —
    already deferred by the team, not new).
  - Orphaned Cloudinary files: an upload that never gets submitted/saved isn't cleaned up. Minor
    storage cost over time, no security impact.
  - icon/screenshots are restricted server-side to emoji-style strings or actual
    res.cloudinary.com URLs (added during the red-team pass on this change) — this also newly
    restricts the pre-existing icon field, which previously accepted any https:// URL. Intentional
    tightening, not a regression: no submission has ever needed an external icon host.
NOT TESTED
  - Never run against a live browser / live Cloudinary account — bit check-types and bit test only
    (I cannot run the app locally; MONGO_URL lives in hopeAI's env, per HANDOFF.md).
  - No live verification that CLOUDINARY_URL is actually reachable from where the app runs, or that
    an uploaded image round-trips correctly end to end (upload → secure_url → catalog render).
  - No UAT on any platform (uat-iphone/uat-desktop/etc. not run).
  - No test of what happens when Cloudinary itself rejects a request (quota, invalid file, network
    failure) beyond the generic Hebrew error path — not exercised against the real API.
