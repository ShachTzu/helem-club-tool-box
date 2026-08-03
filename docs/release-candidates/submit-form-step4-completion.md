RELEASE CANDIDATE — Step 4 completion: live link validation + confirmation email

Ponytail mode used: full
Experts run: focused self-review (proportionate to size — see note below)
Skipped on purpose: full housekeep-il sweep — this is two small additions on top of
  an already-reviewed feature (Cloudinary upload, see submit-form-cloudinary-image-upload
  RC). Reviewed directly for the one real risk each change carries (see below) instead of
  re-running the full 4-skill sweep for ~30 lines of change.

WHAT SHIPPED
1. Live https validation on the submit form's external-link field: shows the error as
   the member types (debounced 500ms, same idiom as the existing autosave), instead of
   only after clicking submit. Submit-time validation is still there too (defense in
   depth, not replaced).
2. Submission confirmation email: once a member's submission actually goes to "pending"
   (not on autosave draft saves), they get a Hebrew email at their contact address
   confirming it was received. Built on a new `helamPlatform.sendEmail(to, subject, text)`
   hopeAI added to HelamPlatformNode for this purpose (delegates to her existing Mailer/
   Resend setup — no new mail-sending code, no new dependency).

DATA            no new personal data collected. contactEmail (already PII, already
                moderator-only) is now also used as an email recipient — same field,
                new use, not a new collection point.
SECURITY NOTE   `sendEmail` wraps its text straight into `<p>${text}</p>` with no
                escaping. The app name is free text a member chose, so it's HTML-escaped
                before being embedded in the confirmation text — otherwise a crafted app
                name could inject markup into the outbound email's HTML body. Covered by
                a test (toolbox.node.runtime.spec.ts) that submits a name containing
                `<script>` and asserts it never reaches the email unescaped.
CONFIG          none new — sendEmail falls back to console-log mode when RESEND_API_KEY
                isn't set (same behavior as the existing OTP emails), so this works in
                any environment without extra setup.
MIGRATION       none.
BREAKING        none.
ROLLBACK        revert the two commits (Step 4g live validation, Step 4h confirmation
                email). Nothing external to undo — a failed/successful email send has
                no state that needs unwinding.
WATCH           a mail failure is caught and logged (`[toolbox] confirmation email
                failed for app <id>: ...`) but never fails the submission itself — the
                app record is already saved by the time the email is attempted. If
                confirmation emails silently stop arriving, check server logs for that
                line rather than assuming submissions are failing.
KNOWN OPEN
  - contactEmail has no server-side format validation (client validates it, server
    doesn't) — pre-existing, not introduced here. A malformed address just means the
    best-effort email fails silently (logged, not surfaced to the member).
  - Rapid double-click on submit could in theory fire two submissions before the
    loading state disables the button — pre-existing UI race, not introduced or
    worsened here, not fixed here either.
NOT TESTED
  - Never run against a live browser or a real Resend account this session — bit
    check-types/bit test only, same constraint as the rest of this session's work
    (no MONGO_URL locally). hopeAI verification still needed before this is
    considered done end to end.
