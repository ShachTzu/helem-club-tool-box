RELEASE CANDIDATE — Knowledge Library (ספריית הידע)

Ponytail mode used: full
Experts run: superpowers:brainstorming, red-team-product, red-team-engineering (on the
  built code), housekeep-il (security-review, code-review, ponytail-review,
  israeli-appsec-scanner)
Blocking: 0 open (1 found and fixed during red-team-engineering)
Non-blocking: 0 open (2 found and fixed during housekeep-il)
Deferred on purpose: content seeding (see KNOWN OPEN), avatar image hosting (see KNOWN OPEN)

WHAT SHIPPED
A new "knowledge library" section — a hierarchical text/article CMS, sibling to the
existing knowledge-base (video/audio) and knowledge-domains (tag taxonomy) scopes, not
touching either:

1. Admin panel (ניהול ספריית הידע): page CRUD with unlimited-depth parent/child
   hierarchy, coping-domain tagging (reuses the existing 14-domain taxonomy), image
   upload (own Cloudinary signed-upload flow) or URL, video via URL or a restricted
   YouTube/Spotify-only embed field, a publish-date field that can be backdated (and
   drives sort order too), and an isPublished on/off toggle. Gated to staff
   (moderator/admin) or a new feature-scoped editor allowlist.
2. CSV bulk import: drop a CSV + the image files it references, pick an optional
   top-level parent to anchor the batch under, run the import. Rows referencing the
   same not-yet-existing parent title resolve to one auto-created page, not a
   duplicate per row. Import summary shows matched-vs-created parents and any
   per-row rejections.
3. Public site: a root lobby + one generic page component that covers any hierarchy
   depth (a page is both content and, when it has children, an index of its children)
   — breadcrumb, media, domain tags, children grid or prev/next chapter nav, an
   author byline under the fixed "הלם קלאב" identity (no real user account, matches
   how blog's isStaffAuthor pattern already works).
4. A new access-control primitive (KnowledgeLibraryEditor allowlist) scoped entirely
   inside this feature — deliberately not a field on the shared platform User entity,
   since those files are hopeAI's ownership per the auth-hardening split.

PLATFORMS       web only (no mobile-specific work). UAT not run this session — see
                NOT TESTED.
DATA            no new PII. Content is public educational text (title/body/media/tags),
                authored under a fixed display identity, not real user records. The one
                new data type referencing a real user is KnowledgeLibraryEditor, which
                stores a bare userId + grant timestamp — visible only to admins
                (assertIsAdmin-gated query), never exposed publicly. Retention: deleted
                via the revoke mutation; no automatic expiry (matches how the platform's
                own role field has no expiry either).
MIGRATION       none — entirely new collections (KnowledgePageModel,
                KnowledgeLibraryEditorModel), nothing existing changed shape.
BREAKING        none — new scope, new routes (/knowledge-library, /knowledge-library/:slug),
                new admin route. Nothing existing was modified except a repository
                sort-order fix scoped to this feature's own new collection.
CONFIG          reuses CLOUDINARY_URL if already set (same env var toolbox uses) —
                image upload degrades gracefully (logs a warning, upload signature
                mutation fails) if it isn't, same pattern as toolbox's own upload.
                No new env vars required to ship without image upload.
ROLLBACK        revert the commits on this branch (spec + 6 implementation commits +
                2 fix commits). The new scope is additive and route-isolated — nothing
                else depends on it, so reverting is a clean removal.
WATCH           the embed-allowlist validator is the one place a real security failure
                would be a public-facing headline (PTSD-support content, trauma-survivor
                audience) — it has 17 adversarial tests (lookalike hosts, data:/javascript:
                URIs, on* attributes, srcdoc, userinfo tricks) and was independently
                re-verified by a security-focused review agent, but if any future change
                touches embed-allowlist.ts, re-run those tests before merging, don't just
                trust the diff looks small.
KNOWN OPEN
  - Content seeding not done: the design's first real content batch (a manually-created
    "עזרה ראשונה" landing page, then CSV-importing the sample PTSD-series CSV under it)
    needs to happen through the live admin UI once this is deployed and reachable —
    this session had no MONGO_URL/running app to do it through (same constraint as
    every prior session on this project). hopeAI or the community manager should do
    this as the first real use of the admin panel, which doubles as its own UAT.
  - Avatar has no real hosted URL yet: HELEM_CLUB_AVATAR_URL in
    knowledge-library/entities/knowledge-page/knowledge-page.ts is `undefined` — the
    byline degrades to initials (Avatar component's existing fallback) until someone
    with the CLOUDINARY_URL credential uploads docs/assets/helem-club-author.png
    (already resized to 480px, down from the 3134×2062 source) and the constant is
    updated with the real URL.
  - CSV import has no row-count cap — acceptable for now since the endpoint is
    editor/staff-gated only, not public; a very large file just makes the mutation
    slow, not a DoS vector. Worth a UI row-count warning if usage ever reaches
    hundreds of rows per import.
  - grantKnowledgeLibraryEditor(userId) doesn't validate the userId is a real platform
    user — harmless (an inert allowlist entry nobody's session will match), not
    fixed since there's no real cost to leaving it.
NOT TESTED
  - Never run against a live browser or a real MongoDB this session — bit
    compile/test only (60/60 unit + component tests passing across 6 components),
    same constraint as every prior session on this project (no MONGO_URL locally).
    hopeAI's live verification (per the established workflow: Claude writes+tests,
    hopeAI runs it live) is the next real gate, and doubles as the acceptance test
    for the community-manager and public-facing UAT requested in the original ask.
  - bit snap/export to the shared lane was NOT done this session: a `bit snap` run
    swept up 153 components across unrelated scopes (blog, events, gallery, toolbox,
    platform...) due to pre-existing workspace-wide version drift, not this feature's
    changes. It was reset (safe — nothing was exported) rather than pushed, to avoid
    exporting version bumps for components outside this feature's scope onto the
    shared lane without review. hopeAI (or whoever owns the Bit/lane side of this
    project) should snap+export just the 6 knowledge-library components from a
    workspace where the pre-existing drift is understood, rather than this being
    forced through blind from an isolated worktree.
