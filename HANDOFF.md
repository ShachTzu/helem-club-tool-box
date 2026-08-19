# Helam Club — Session Handoff

Read this first. It's the fast onboard for a fresh session (Claude) picking up the
Helam Club go-live work. Last updated: 2026-07-31.

> TL;DR: We're turning a Bit prototype into a production marketplace of coping-app
> tools, starting with a **submission track for Hackathon 1**. Auth + login are
> done (by hopeAI). The submission flow (form, PII handling, drafts, preview,
> "my submissions") is done and on the lane. The one open build item is
> **image upload via Cloudinary (#1)**. The full spec is `helam-club-go-live-plan.md`.

---

## 1. The project

Helam Club is a Hebrew (RTL) community. We're building a **toolbox**: a public
catalog of "coping" apps/tools that community members submit and moderators
approve. Free to browse without an account; an account (community member) is
required to submit, rate, comment.

**Near-term goal (what we're actually building now):** a registration + submission
flow so **Roi** can share one link with **Hackathon 1** participants (who already
built tools), they register as community members and submit their real tools, and
moderators approve them into the catalog. Real data, no fake seed data in prod.

Terminology that matters: whoever registers becomes a **community member** (role
`member`). Submitting to the toolbox requires being a registered member. Hackathon
participants are the first cohort of members to submit — but "hackathon
participant" ≠ "member" by itself.

**The spec is `helam-club-go-live-plan.md`** (in this repo). Read it for the full
picture. This handoff is the working context around it.

---

## 2. The people & who does what

- **Shachar (the user / product owner).** Israeli, works in Hebrew. Communication
  preferences that matter: **plain language, no jargon floods, be decisive.** She
  says "you're responsible / אתה אחראי" — take ownership and make the call rather
  than asking her to choose small things. When a status update gets long she gets
  overwhelmed ("הצפת אותי") — keep updates short, concrete, in plain Hebrew, and
  lead with what's done + what's next. She relays messages between Claude and
  hopeAI. **She will not paste secrets to Claude** (correctly) — she puts them in
  `.env` / the running env herself.

- **hopeAI (the collaborator).** Another AI, works in her own environment. She:
  - **Owns the auth layer** and built it end to end (Google OAuth + email OTP,
    user model, login/signup, sessions). Files she owns: `helam-platform.node.runtime.ts`,
    `user.model.ts`, `entities/user`, `hooks/use-auth`, `pages/login`, `pages/signup`,
    plus `google.ts`, the mailer, and the `DISABLE_SEED_DATA`/`registerSeed` mechanism.
    **Claude does not edit these.**
  - **Runs the app live** (she has `MONGO_URL` + a browser for Google login) and
    **tests Claude's work** end to end, then reports file+line feedback via Shachar.
  - **Has NO GitHub access** — she cannot push, open PRs, or review in GitHub. She
    reviews by reading pasted diffs / the repo, and by running the app.

- **Claude (you, the next session).** Build the **toolbox** side: submission,
  moderation, drafts, catalog, "my submissions". Write code, `bit check-types` +
  `bit test` it, snap + export to the lane, and mirror to git. You **cannot run the
  app locally** (no `MONGO_URL` in the local `.env` — Shachar won't paste it, and
  the app runs in hopeAI's env). So your verification is type-check + unit tests +
  compile; **hopeAI does the live verification.**

---

## 3. How we work (the workflow)

- **Source of truth is the Bit lane** `helemclub.marketplace/helam-club`. The git
  repo (`github.com/ShachTzu/helem-club-tool-box`, **public** — that is how hopeAI
  reads the code; verified public on 2026-08-17) **mirrors** the lane —
  Claude keeps git in sync because hopeAI can't push to GitHub. Git is the record /
  fallback; the lane (bit.cloud + Ripple CI) is what actually deploys.

- **Every slice, in order:**
  1. `bit checkout head` (pull hopeAI's latest — she pushes lane updates between slices).
  2. Build in the workspace. **Reuse/extend existing components — never rebuild.**
     88+ components already exist; a `bit create` of an existing primitive is a bug.
  3. `bit check-types <component>` and `bit test <component>`.
     ⚠️ Run **`bit compile`** before `bit test` on a component that depends on
     another you just edited — otherwise the test imports stale `dist`.
  4. `bit snap -m "..."` then `bit export` (ship to the lane; Ripple CI builds).
     **Ripple is the CI gate — the export is not done until its build is green.**
     Check the lane build on bit.cloud before step 5. A red Ripple build that gets
     mirrored to git and handed off reads as "done" and is not.
  5. `git add -A && git commit && git push` (mirror to git). Verify `.env` is never staged.
     GitHub secret scanning + push protection are on (enabled 2026-08-17), so a
     known-provider token in a push is blocked at the server. That is a backstop,
     not the check — the repo is public, so a leaked secret is public the moment
     it lands. `.gitignore` covers `.env`/`.env.*`; nothing covers a key typed
     straight into a `.ts` file.
  6. Hand off to hopeAI (via Shachar) with a short "what to test" list.

- **Ownership split:** hopeAI = auth files (§2). Claude = toolbox (submission,
  moderation, drafts, catalog, my-submissions). No overlap.

- **Secrets:** never ask for or accept a pasted secret. Read from env in code
  (`process.env.X`). Shachar/hopeAI put values in the running env.

- **New component recipe** (env pinning matters — a wrong env version breaks the
  capsule build):
  ```
  bit create react pages/<name> --scope helemclub.toolbox
  bit env set helemclub.toolbox/pages/<name> helemclub.design/envs/helam-env
  bit install
  ```
  Env pins: UI/pages/hooks → `helemclub.design/envs/helam-env@275621ea…` ·
  aspects → `bitdev.symphony/envs/symphony-env` · entities → `bitdev.node/node-env`.

---

## 4. Security & privacy conventions (non-negotiable — this is regulated Israeli PII)

- **Submitter PII (contact email) never touches a public shape.** Pattern used:
  a separate GraphQL type (`PendingToolboxApp`) for moderator queries + a
  `moderatorMeta` side-channel in the hook, so the shared public `App` entity /
  `ToolboxApp` type / `toPlainApp` never carry PII. Keep doing this everywhere
  submitter data appears.
- **IDOR: enforce ownership in the Mongo query itself**, e.g. `{ id, submittedBy: userId }`
  — never fetch-then-filter. Covered by `app-repository.spec.ts` ("no IDOR").
- **Authorization is server-side** on every mutation/owner query (`requireUser` /
  `requireModerator`). Only `approved` records are public — enforced in resolvers,
  not client filtering.
- **No fake data in production.** Demo seeds are gated by `DISABLE_SEED_DATA` /
  `registerSeed`; production starts empty by default (fail-safe).

---

## 5. Environment & tooling

- Repo / Bit workspace: `/Users/shachartzuk-bazak/Developer/helemclubmarketplace`
  (this dir **is** the Bit workspace; `bit init` was run in it).
- Bit CLI: `~/bin/bit` (installed via bvm), logged in as `shacharoli`,
  `defaultScope = helemclub.marketplace`. Add `~/bin` to PATH:
  `export PATH="$HOME/bin:$PATH"`.
- `.env` (gitignored) holds: `GOOGLE_CLIENT_ID` (public, safe), `SESSION_SECRET`
  (generated), `CLOUDINARY_URL` (Shachar added). **`MONGO_URL` is NOT here** — the
  app runs in hopeAI's env, so Claude can't run it locally.
- **`/go-go-bit`** slash command warms up a session (checks bit login + git state,
  reloads context). Run it at the start of a new session.

---

## 6. Where we are (status, 2026-07-31)

**Done & on the lane** (git `main` is synced; lane exported):
- **Step 0** — workspace + imported the 165-component lane.
- **Step 1** — Mongo connected (hopeAI).
- **Step 2 (auth)** — Google OAuth (real `verifyIdToken`) + email OTP + sessions +
  admin-by-`ADMIN_EMAILS`. **hopeAI's.** Verified live.
- **Step 3** — demo seeds fenced to non-prod; hackathon-aware empty catalog copy.
- **Step 4 submission track (Claude):**
  - Submit form collects developer/team name + **contact email (PII, moderator-only)**
    + `submissionSource:'hackathon-1'`; `status` default flipped to `pending`.
  - Moderator review queue shows the contact email as a `mailto` column.
  - **Drafts:** debounced autosave, `?id=` resume, submit-from-draft, all with
    **IDOR-safe ownership**; verified live + unit-tested.
  - **Live catalog preview** + emoji icon field in the form.
  - **"My submissions" page** (`/toolbox/my-submissions`, `requiresAuth`) — owner-
    scoped list by status, with "המשך עריכה" links back into the draft form.

**Open build item (next):**
- **#1 — Cloudinary image upload** (app icon + screenshots). Not started. Plan:
  signed server-side upload so the secret never reaches the client. **Blocked only
  on `CLOUDINARY_URL` being in hopeAI's running env** (Shachar saved it to the local
  `.env`; hopeAI needs it where the app runs). Once there, wire the icon +
  screenshot upload into the submit form (and surface images in the catalog/detail).

**Known debt for a later wave (documented, not yet done):**
- `rateToolboxApp` currently has **no auth** — rating should require login, and the
  reviewer name should come from the authed user, not the input.
- `reviewToolboxApp` only does approve/reject — the plan wants
  `changes_requested` + moderator note + append-only history.
- Wishlist (still on mock) and Mentors (scope `helemclub.mentors` not created yet)
  are next-wave, not part of the hackathon submission track.
- Platform has **no user-menu slot** yet (only route/nav/admin-route registration) —
  "my submissions" is surfaced via a nav item for now.

---

## 7. Reference branches

- `main` — mirrors the lane; the live record.
- `feat/step2-auth-hardening` — Claude's early auth reference (superseded by
  hopeAI's implementation; kept for reference, not merged).
- `feat/step3-seeds` — Claude's early seed-fence (superseded by hopeAI's
  `DISABLE_SEED_DATA`; not merged).
  These two can be deleted; they hold no live work.

---

## 8. What to do at the start of the next session

1. Run `/go-go-bit` (or manually: `export PATH="$HOME/bin:$PATH"; bit whoami; bit status`).
2. `bit checkout head` to pull hopeAI's latest from the lane.
3. Read `helam-club-go-live-plan.md` (the spec) and this file.
4. Instructions will come from **hopeAI via Shachar.** Likely next: wire **#1
   (Cloudinary image upload)** once `CLOUDINARY_URL` is confirmed in the running env.
5. Keep updates to Shachar short and plain. Build → check-types + test → snap +
   export → git push → hand hopeAI a short "what to test".
