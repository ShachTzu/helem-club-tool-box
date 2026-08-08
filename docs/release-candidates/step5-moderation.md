RELEASE CANDIDATE — Step 5: moderation lifecycle (changes_requested + notes + history), decision emails, rating auth

Ponytail mode used: full
Experts run: red-team-engineering (on the built code) + housekeep-il (security-review,
  code-review, ponytail-review, israeli-appsec-scanner)
Skipped on purpose: nothing — this touches submitter PII (contactEmail in outbound
  emails) so the full IL sweep ran, not a lighter pass.

WHAT SHIPPED
1. Moderation lifecycle, not a flat status flip: `reviewToolboxApp` now supports three
   actions — approve, reject, and changes_requested (new). Every decision appends to an
   append-only `moderationHistory` array on the app (action, note, moderator id+name,
   timestamp) instead of overwriting a single status field, so the full review trail
   survives a submitter's edit-and-resubmit cycle.
2. Moderator note: the admin review-submissions table has a per-row note field
   (optional, free text) that travels with the decision into history and into the
   decision email.
3. Moderation-decision email: once a moderator decides, the submitter gets a Hebrew
   email at their contactEmail explaining the outcome (approved / rejected / changes
   requested), including the moderator's note when one was left. Built on the same
   `helamPlatform.sendEmail` used for the Step 4 submission-confirmation email —
   best-effort, never fails the review mutation itself.
4. Closed the `rateToolboxApp` "rate as anyone" gap (known debt called out in
   HANDOFF.md): rating now requires a signed-in member (`requireUser`), and the
   reviewer's id + display name come from their session, never from client input. The
   GraphQL input no longer accepts a client-supplied `displayName` at all. The app-detail
   page now shows a sign-in prompt instead of the review form for signed-out visitors.
5. Fixed during red-team: `applyModerationDecision` now only matches an app whose status
   is currently `pending` (matching the `$in: ['draft','changes_requested']` guard
   pattern already used by saveDraft/submitDraft). Before this, a moderator mutation with
   any appId — including an already-approved, already-live app — could silently flip its
   status again with no guard, since the query only matched on id. Caught before it
   shipped, not a live incident.

DATA            contactEmail (already PII, already moderator-only) is now also used to
                send a second kind of best-effort email; no new personal data collected.
                moderationHistory stores the moderator's own id/displayName (staff
                operational data, not a data subject the law protects here) plus the
                note text — never exposed through any public GraphQL type or the
                submitter-facing "my submissions" query; the only place the note reaches
                the submitter is the outbound email.
SECURITY NOTE   `sendEmail` wraps `text` into `<p>${text}</p>` with no escaping. Both the
                app name (submitter-chosen) and the moderator's note (moderator-chosen)
                are free text that reaches this email — both are HTML-escaped with the
                existing `escapeHtml` helper before interpolation. Covered by a test that
                submits a note containing `<b>...</b>` and asserts it never reaches the
                email unescaped.
CONFIG          none new — same sendEmail path as Step 4, no new setup.
MIGRATION       additive schema change only (`moderationHistory: []` default on AppModel)
                — no backfill needed, no data to convert. Old documents just get the
                field the first time they're reviewed again.
BREAKING        `RateToolboxAppOptions` GraphQL input dropped the `displayName` field.
                A cached old client bundle that still sends it would get a GraphQL
                validation error on rate submission until it reloads — low risk in this
                single-workspace, not-yet-launched app (no store rollout lag to worry
                about).
ROLLBACK        revert this branch's commits. moderationHistory is purely additive so
                rolling back the code doesn't strand any data; existing changes_requested
                records (already supported since Step 4's AppStatus fix) just lose the
                admin UI path to reach that action again until re-deployed.
WATCH           moderation-decision email failures are caught and logged
                (`[toolbox] moderation decision email failed for app <id>: ...`) but
                never block the review mutation — same pattern as the Step 4
                confirmation email. If a submitter reports never hearing back after
                changes_requested, check server logs for that line before assuming the
                review itself failed.
KNOWN OPEN
  - The moderator's note is delivered to the submitter by email only — it is not shown
    anywhere in the "my submissions" UI. If the decision email bounces, is misfiled, or
    Resend is running on the unverified `onboarding@resend.dev` sender (still an open
    item in the go-live plan, §11), the submitter sees "requires fix" in "my submissions"
    with no visible reason. Kept out of scope for this session (email was the requested
    notification channel); worth a follow-up if moderators start relying on the note for
    anything beyond a one-line nudge.
  - rateToolboxApp still does not verify the target app exists or is approved before
    accepting a rating, and still allows unlimited ratings per member per app (no
    one-rating-per-user-per-app constraint). Pre-existing, not introduced or worsened —
    only the auth gap (rate as anyone) was in scope this session.
  - No length cap on the moderator note or on moderationHistory array growth. Not a near-
    term concern at hackathon scale (few dozen apps, a handful of review cycles each).
NOT TESTED
  - Never run against a live browser, a real Mongo instance, or a real Resend account —
    bit check-types + bit test only (compile: 166/166 clean; 4 modified components,
    47/47 tests passing), same constraint as the rest of this session's work (no
    MONGO_URL locally). hopeAI verification still needed before this is considered done
    end to end — specifically: the three-action review flow in the live admin UI, the
    decision email actually arriving, and the sign-in-gated rating flow.
