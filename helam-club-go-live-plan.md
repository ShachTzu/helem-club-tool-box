# Helam Club — Go-Live Plan (v3)

**מוכן עבור:** Shachar Tzuk (@shacharoli) · **חשבון:** helemclub · **תאריך:** 2026-07-30
**Repo (Bit workspace):** `github.com/ShachTzu/helem-club-tool-box` (private)
**Lane קיים:** `helemclub.marketplace/helam-club` — **165 קומפוננטות, 88 מהן ב-4 ה-scopes הרלוונטיים.**
**סטטוס:** 🟡 v3 — משלב את ביקורת hopeAI (מעגל 1). ממתין ל-re-review שלה לפני ביצוע.

> **מה השתנה מ-v2:** לא greenfield — רוב הבנייה כבר קיימת ב-lane, בונים מעליה. auth = OTP+Google בלי סיסמאות. בלי נתוני דמו ב-prod. §8/§9/§10 נכתבו מחדש לפי בדיקת ה-lane בפועל של hopeAI. נוסף **Milestone A — האקתון 1**: הרשמה + הגשה, כדי שרואי ישתף לינק ומשתתפים יגישו אפליקציות אמיתיות.

---

## 0. איך לקרוא (handoff ל-hopeAI)

מעגלי ביקורת:

| מעגל | מי | איך | על מה |
|---|---|---|---|
| 1. ביקורת תוכנית | hopeAI | Shachar מדביקה את הקובץ; הערות חוזרות כטקסט, קלוד מיישם | המסמך הזה |
| 2. ביקורת קוד | hopeAI | קלוד מפיק diff → Shachar מדביקה → hopeAI מחזירה הערות לפי קובץ+שורה → קלוד מיישם | כל שלב |
| 3. שער פונקציונלי | Shachar | להתחבר ולנסות | אחרי סגירת ה-auth bypass (§10 step 2) |

> **hopeAI קוראת בלבד — אין אינטגרציית GitHub** (לא push/PR/approve). הריפו הוא ה-Bit workspace, לא ממשק הביקורת שלה. **קלוד הוא נקודת הממשק.** הדבר הראשון שהיא בודקת בכל diff: שאין קומפוננטה חדשה שמשכפלת קיימת, ושה-env נעוץ.

---

## 1. מטרה

להפוך את הפרוטוטייפ למרקטפלייס production של אפליקציות התמודדות, עם: הגשת אפליקציה, מודרציה, wishlist, ומנטורים. עברית RTL, מותג הפרוטוטייפ.

**עיון חופשי בלי הרשמה.** חשבון (OTP/Google) נדרש רק להגיש, לדרג, להעלות upvote, לתפוס רעיון, או לפנות למנטור.

**היעד הקרוב (Milestone A):** להעמיד **הרשמה + הגשה** כך שרואי ישתף לינק עם משתתפי **האקתון 1**, והם יגישו את האפליקציות האמיתיות שלהם. כך הקטלוג מתאכלס בנתוני אמת — **בלי שום נתון בדוי ב-prod**.

---

## 2. סביבת ועקרונות העבודה

- **הריפו עצמו הוא ה-Bit workspace** (`bit init` בתוכו). branches + PRs ל-CI/גרסאות. **ביקורת hopeAI בהדבקה**, לא ב-GitHub.
- **`bit` CLI:** מותקן (v2.0.26), מחובר `shacharoli`, `defaultScope = helemclub.marketplace`.
- **עיקרון-על:** **reuse/extend לפני build.** 88 קומפוננטות כבר קיימות — משתמשים בהן, לא בונים מחדש. כל קומפוננטה חדשה נוצרת עם `bit create` (env נעוץ + spec + compositions + docs), לא כקובץ React בודד → החזרה פנימה = `bit export` ל-lane, לא מיגרציה.
- **סודות/env:** `MONGO_URL` (מ-hopeAI/Atlas), `GOOGLE_CLIENT_ID`/`SECRET`, `RESEND_API_KEY`, `CLOUDINARY_URL`, `SESSION_SECRET`, admin seed. `.env` ב-`.gitignore` + Bit Cloud env. **אף סוד לא ב-repo ולא ב-frontend.**

---

## 3. הרעיון הארכיטקטוני (✅ אושר ע"י hopeAI)

ארבעת ה-flows הם flow אחד בשלושה כובעים: `draft → pending → approved | changes_requested | rejected`, עם הערת מודרטור והיסטוריה append-only.
הפלטפורמה מחזיקה את ה-lifecycle ואת קונסולת המודרציה, וחושפת `ModerationQueue` slot. כל feature רושם את התור שלו. הפלטפורמה לא מייבאת feature.

---

## 4. ההחלטות שננעלו

1. **כניסה:** **OTP למייל + Google OAuth. בלי סיסמאות.** מי שאין לו Google נכנס בקוד למייל. פחות PII, פחות משטח תקיפה. (מבטל את כל סעיפי הסיסמה מ-v2.)
2. **תשתית מייל (Resend):** OTP + התראות מודרציה (אושר/דרוש תיקון/נדחה).
3. **מדיה:** Cloudinary uploads (אייקונים + צילומי מסך), עוברים ביקורת בתור האישור.
4. **מנטורים:** CTA "צור קשר/תאם" מאחורי login, פותח ערוץ חיצוני. אין תיאום on-platform.
5. **דירוגים/תגובות:** כוכבים — צפייה ציבורית, דירוג רק למחוברים. תגובות — צפייה+כתיבה רק למחוברים + דיווח והסרה. **מרחיבים את `app-review` הקיימת (stars+comment), לא מפצלים.**
6. **Wishlist:** עולה מיד + שער content-safety (שפת משבר) + רצועת מוקדי סיוע. claim 60 יום, auto-expire on-read.
7. **נתוני דמו:** **מגודרים ל-dev בלבד. prod מתחיל ריק** ומתמלא מהגשות אמיתיות (האקתון).
8. **אירוח:** Bit Cloud + MongoDB Atlas.

---

## 5. מפרטי הזרימות

*(ליבת המפרט מ-v2 נשמרת. עדכונים: 5.1 auth = OTP; ההגשה היא Milestone A.)*

### 5.1 הגשת אפליקציה — ⭐ Milestone A
`/submit`, חברים בלבד. אנונימי → הרשמה/כניסה (OTP או Google) → חוזר לכאן.
טופס 4 שלבים עם autosave: (1) זהות וקישור — שם, כותרת משנה, `externalLink` https, אייקון (emoji/**Cloudinary upload**), שם מפתח; (2) תיאור ומדיה — `fullDescription` 80–2000, **העלאת צילומי מסך** (Cloudinary); (3) סיווג — domains (1–4), עלות, פלטפורמות, שפה, requires-signup; (4) קרדיטים ואישור — `creditsIdeaId` אופציונלי, תקנון, preview, שליחה.
`toolbox/pages/submit-tool` **כבר קיים** — מרחיבים אותו, לא בונים מחדש. **ההגשות שלי** (`/my-submissions`) עם tabs לפי סטטוס.

### 5.2 אישור / מודרציה
תור `אפליקציות` בקונסולה `/admin` (`toolbox/admin/review-submissions` **קיים**). מסך ביקורת: preview מלא + checklist + הערה + אשרו/בקשו-תיקון/דחו. רק `approved` קריא לציבור — **נאכף ב-resolvers, לא בצד לקוח.**

### 5.3 Wishlist — Milestone B
`/wishlist`. כרטיסי רעיון, upvote (קול אחד, optimistic, אטומי), claim (60 יום, אטומי, expiry on-read **בשאילתה**), fulfillment + קרדיט. content-safety + רצועת סיוע. סטטוס: `open → claimed → fulfilled`. דירוג: `upvotes / (hoursSince + 2)^1.5`.

### 5.4 מנטורים — Milestone C (scope חדש, net-new)
מדריך `/mentors` ציבורי, פרופיל, CTA מאחורי login לערוץ חיצוני, בקשה `/mentors/apply` (4 שלבים), תור+ביקורת אדמין, toggle verified, cross-linking לעמוד האפליקציה.

---

## 6. טופולוגיית ה-Scopes (מול הקיים ב-lane)

| Scope | קיים | מצב |
|---|---|---|
| `helemclub.design` | 27 | ✅ design system מוכן (button, star-rating, table, modal, tabs, select-list…) |
| `helemclub.platform` | 32 | ✅ shell מוכן (header, footer, login, admin-dashboard, admin-shell, protected-route, helam-platform, אפליקציית helam) |
| `helemclub.knowledge-domains` | 13 | ✅ domains מוכן (domain-filter, domain-selector) |
| `helemclub.toolbox` | 16 | ✅ קטלוג/פירוט/הגשה/review/rating-summary; wishlist חסר |
| `helemclub.mentors` | 0 | ❌ **net-new — צריך ליצור את ה-scope ב-Bit Cloud ידנית (לא דרך CLI)** |

לא נוגעים: `blog`, `events`, `gallery`, `knowledge-base`, `engagement`, `marketplace`.

---

## 7. חוזה הפלטפורמה (✅ אושר)

**Roles:** `visitor` · `member` · `admin`.
**Slots:** `Route`(+guard), `NavigationItem`, `HeaderAction`, `UserMenuItem`, `ModerationQueue`(+badge), `FooterLink`, `BackendServer`, `OnStartHook`.
**עוזרים:** `getCurrentUser(req)` → `null` לאנונימי; `requireRole(user, role)` על mutations.
**מודל מודרציה:** `ModerationRecord` — status, submittedBy/At, reviewedBy/At, moderatorNote, `history` append-only. ⚠️ **היום `status` הוא string שטוח `default:'approved'` בלי enum ובלי history — נדרש migration של הרשומות הקיימות ל-lifecycle (§10 step 4).**

---

## 8. מודל הנתונים — MongoDB (תשובות hopeAI, מוסמך)

MongoDB Atlas דרך `MONGO_URL`, typegoose, GraphQL מכל aspect.

- **DB אחד משותף.** `helam-platform.node.runtime.ts` קורא `mongoose.connect(mongoUrl)` **פעם אחת** ב-provider; כל aspect עושה `getModelForClass` על אותו חיבור. **כלל מחייב:** feature חדש (mentors כלול) **לא קורא ל-`mongoose.connect` שוב** — רק `getModelForClass`.
- **Pooling:** ברירת מחדל mongoose (100), מנוהל ע"י אותה קריאה יחידה. אין קונפיג נוסף.
- **Session:** cookie session (`express-session` + `connect-mongo`, collection `sessions` חי) — **נשאר, לא JWT.**
- **claim פג — on-read, בשאילתה:** `{ $or: [ {status:'open'}, {status:'claimed', 'claim.expiresAt': {$lt: new Date()}} ] }` — הסינון ב-Mongo, **לא ב-JS אחרי שליפה.**

### ⚠️ שמות שדות — לא משנים אף שדה קיים (רק מוסיפים)

| §v2 הציע | קיים בפועל | הכרעה |
|---|---|---|
| `link` | `externalLink` | השאר קיים |
| `iconRef` | `icon` | השאר קיים |
| `description` | `fullDescription` | השאר קיים |
| `ratingAvg` | `avgRating` | השאר קיים |
| `moderation{}` מקונן | `status`+`submittedBy` שטוחים | השאר שטוח; הוסף lifecycle+history בזהירות |
| `creditsIdeaId` | `originatorName` | הוסף `creditsIdeaId`, השאר גם הקיים |
| `photoRef` (mentors) | — | חדש, בסדר |

- **ratings/comments:** לא לפצל — `app-review` הקיימת מחזיקה stars+comment; מרחיבים ב-`reports[]` + `removed`.
- **דפוס מזהים:** לכל model קיים יש `id: string` ייחודי בנוסף ל-`_id`. כל model חדש (`WishlistIdeaModel`, `MentorModel`) שומר על זה.

---

## 9. אבטחה — ⚠️ שלושה bypasses חיים, חוסמים כל פיצ'ר חדש

hopeAI קראה את `helam-platform.node.runtime.ts`. שלושה חורים פתוחים **היום** (כולל לחשבון האדמין הנזרע):

- **א. `verifyEmailOtp` מקבל כל קוד** — אין יצירה/אחסון/השוואה. → לממש **OTP אמיתי:** קוד 6 ספרות, **hashed at rest**, TTL 10 דק', single-use, rate-limited, השוואה בשרת.
- **ב. `signInWithGoogle` לא מאמת** — `emailFromGoogleToken` ממציא מייל ממחרוזת. → **לאמת `id_token` בצד שרת** (ספריית Google), להשתמש ב-email/sub מאומתים בלבד.
- **ג. `issueToken` → `helam.${id}.${Date.now()}`** — לא חתום, נחיש. → לא לסמוך עליו; להישען על ה-cookie session בלבד (או לחתום).

**תיקוני session/boot (חובה):**
- `saveUninitialized: true → false` (אחרת session לכל בוט).
- `sameSite: true(strict) → 'lax'` (strict שובר את redirect ה-OAuth).
- `secret: … || 'SESSION_SECRET'` → **fail-fast** אם המשתנה חסר (לא ברירת מחדל מילולית).
- Mongo: `if (mongoUrl) connect` → **`throw` מפורש** אם `MONGO_URL` חסר.

**אין סיסמאות** → אין argon2id/reset/rate-limit-סיסמה. **PII ישראלי** (מיילים, פרטי מנטורים) — שער `ran-bar-zik` + `israeli-appsec` לפני go-live. content-safety + רצועת סיוע ב-wishlist.

---

## 10. סדר וכיוון העבודה (מתוקן — hopeAI)

### Step 0 — Repo + import + env (לפני שורת קוד; `bit status` נקי = שער)
```
bit init                                     # defaultScope = helemclub.marketplace
bit lane switch helemclub.marketplace/helam-club
bit import helemclub.design/**
bit import helemclub.platform/**
bit import helemclub.knowledge-domains/**
bit import helemclub.toolbox/**
bit install
bit status                                   # חייב לצאת נקי
```
+ למפות קומפוננטות קיימות מול §5–§8 (מה extend, מה חסר). + env/secrets. + Ripple CI על PRs.
**נעיצת env (חובה):** UI → `helemclub.design/envs/helam-env@275621ea…` · Aspects → `bitdev.symphony/envs/symphony-env@5.0.20` · Entities → `bitdev.node/node-env@6.0.20`. env חדש יותר שובר את ה-capsule build.

### רצף השלבים
| # | שלב | תלוי | הערה |
|---|---|---|---|
| 0 | Repo + bit init + import + env | — | `bit status` נקי = שער |
| 1 | אימות חיבור Mongo | 0 | הקטלוג נטען מ-Atlas |
| 2 | **סגירת ה-auth bypass** (OTP אמיתי + אימות Google + session flags) | 1 | **חוסם.** ← שער Shachar כאן |
| 3 | הפרדת dev/prod + גידור seeds (`NODE_ENV !== 'production'`) | 1 | prod מתחיל ריק |
| 4 | מודל מודרציה משותף + `ModerationQueue` slot + **migration של `status`** | 2 | **חוסם את 5 ו-6** |
| 5 | Wishlist: model, repository, GraphQL, upvote, claim, fulfillment | 4 | Milestone B |
| 6 | Mentors: scope חדש + aspect מלא | 4 | Milestone C, net-new |
| 7 | השלמת אישור: changes_requested + history + מיילים | 4 | |

**מקביליות:** 5 ו-6 מקבילים **רק אחרי** ש-4 נוחת (שניהם נשענים על מודל המודרציה + slot). לא לפני.

### Milestones (מיפוי ליעד שלך)
- **🎯 Milestone A — האקתון 1 (הרשמה + הגשה):** steps 0→1→2→3 + החלק של 4/7 שמספיק ל-`submit → pending → approve → publish` + `my-submissions`. **תוצאה:** רואי משתף לינק, משתתפים נרשמים (OTP/Google) ומגישים אפליקציות אמיתיות, אדמין מאשר, הקטלוג מתמלא אמת. **זה מה שבונים ראשון.**
- **Milestone B — Wishlist** (step 5).
- **Milestone C — מנטורים** (step 6).

---

## 11. הכרעות — סטטוס

**נסגר:** auth = OTP+Google בלי סיסמאות · בלי נתוני דמו ב-prod · claim 60 יום · wishlist עולה מיד + content-safety · קונסולת אדמין מאוחדת · member בברירת מחדל · עריכת מנטור חוזרת ל-review בשינוי מהותי · Resend.

**פתוח / לאישור hopeAI:**
1. re-review של v3 — במיוחד §8/§9/§10.
2. מי ה-admin שמאשר הגשות בהאקתון (רואי? Shachar?) ואיך זורעים אותו בבטחה אחרי תיקון ה-OTP.
3. deliverability של OTP דרך Resend (SPF/DKIM לדומיין).

---

*ממתין ל-re-review של hopeAI (מעגל 1, סבב 2) לפני ביצוע. אחרי sign-off: Step 0 → Milestone A.*
