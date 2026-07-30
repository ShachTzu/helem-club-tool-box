---
description: Warm up the Helam Club session — verify bit + git + plan state, then report and wait
---

You are resuming work on the **Helam Club go-live** project. Run the warm-up below, then give a short Hebrew status report. **Do NOT start building or run any `bit tag`/`bit export`/write action** — this command only orients. Execution waits for hopeAI's plan sign-off (see the review gates in the plan).

## 1. Warm up the environment (one Bash call)

```bash
export PATH="$HOME/bin:$PATH"
echo "=== bit ==="; bit --version 2>&1 | tail -1; bit whoami 2>&1 | tail -1
echo "=== git ==="; git -C "$HOME/Developer/helemclubmarketplace" branch --show-current 2>&1; git -C "$HOME/Developer/helemclubmarketplace" status --short 2>&1 | head
echo "=== bit workspace? ==="; ls "$HOME/Developer/helemclubmarketplace/workspace.jsonc" 2>&1
```

## 2. Reload project context

- Read `helam-club-go-live-plan.md` (the source-of-truth spec) — at least §10 (build order) and §11 (open questions).
- Recall from memory: repo is `github.com/ShachTzu/helem-club-tool-box` (private) and IS the Bit workspace; `hopeAI` prepped Mongo and reviewed the plan. **hopeAI has NO GitHub access** — she reviews pasted files/diffs and returns text comments; Claude applies. Build only after her plan sign-off.
- **Not greenfield:** 88 components already exist on lane `helemclub.marketplace/helam-club`. Step 0 is `bit init` + import from the lane BEFORE any build. Reuse/extend existing components — never rebuild design/platform/toolbox.

## 3. Report back (Hebrew, short)

Tell the user:
- ✅/❌ bit logged in + version, current git branch + dirty files, whether a Bit workspace exists yet.
- Where we are in the plan: which build step is next, and whether we're still on hold for hopeAI's sign-off.
- Then ask: **"מה עושים היום?"** — and wait. If she says hopeAI approved, proceed to the next step as PR; otherwise hold.

Remember: hopeAI reviews by pasted diff (no GitHub access) — Claude produces the diff, Shachar pastes it, hopeAI returns file+line comments, Claude applies. PRs still exist for CI/versioning; never push to `main` directly for feature work — branch → PR. Near-term target is **Milestone A**: registration (OTP+Google) + submission, so hackathon participants submit real apps.
