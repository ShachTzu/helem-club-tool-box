# Helam Club — Go-Live Plan (v4)

**מוכן עבור:** Shachar Tzuk (@shacharoli) · **חשבון:** helemclub · **תאריך:** 2026-07-31
**Repo (Bit workspace):** `github.com/ShachTzu/helem-club-tool-box` (private)
**Lane קיים:** `helemclub.marketplace/helam-club` — **165 קומפוננטות, 88 מהן ב-4 ה-scopes הרלוונטיים.**
**סטטוס:** 🟡 v4 — §10 הוחלף במסלול ההגשה של האקתון 1 (מבוסס על ביקורת hopeAI + בדיקת `submit-tool.tsx` בפועל). ממתין ל-re-review לפני ביצוע.

> **מה השתנה מ-v3:** §10 הוחלף ב**מסלול ההגשה להאקתון 1** — הרשמה + הגשה ראשונים, כדי שרואי ישתף לינק ומשתתפי ההאקתון (ש**כבר קרה**) יגישו את הכלים שכבר בנו → נתוני אמת. Google **נכנס עכשיו עם אימות id_token מלא**. מגיש יחיד + שם צוות כטקסט. שני מודרטורים (רואי + Shachar). `status` default משתנה מ-`approved` ל-`pending`.

---

## 0. איך לקרוא (handoff ל-hopeAI)

| מעגל | מי | איך | על מה |
|---|---|---|---|
| 1. ביקורת תוכנית | hopeAI | Shachar מדביקה את הקובץ; הערות כטקסט, קלוד מיישם | המסמך הזה |
| 2. ביקורת קוד | hopeAI | קלוד מפיק diff → Shachar מדביקה → הערות לפי קובץ+שורה → קלוד מיישם | כל שלב |
| 3. שער פונקציונלי | Shachar | להירשם, לקבל קוד, להיכנס, להגיש | §10 |

> **hopeAI קוראת בלבד — אין אינטגרציית GitHub.** הריפו הוא ה-Bit workspace, לא ממשק הביקורת. **קלוד הוא נקודת הממשק.** הדבר הראשון שהיא בודקת בכל diff: שאין קומפוננטה חדשה שמשכפלת קיימת, ושה-env נעוץ.

---

## 1. מטרה

מרקטפלייס production של אפליקציות התמודדות: הגשה, מודרציה, wishlist, מנטורים. עברית RTL. עיון חופשי בלי הרשמה; חשבון (OTP/Google) רק לפעולות.

**היעד הקרוב (§10):** הרשמה + הגשה, כדי שרואי ישתף לינק עם משתתפי **האקתון 1 (שכבר קרה)** שיגישו את הכלים האמיתיים שכבר בנו. הקטלוג מתאכלס אמת — **בלי שום נתון בדוי ב-prod**.

---

## 2. סביבת ועקרונות העבודה

- **הריפו עצמו הוא ה-Bit workspace** (`bit init` בתוכו). branches + PRs ל-CI/גרסאות. **ביקורת hopeAI בהדבקה.**
- **`bit` CLI:** מותקן (v2.0.26), מחובר `shacharoli`, `defaultScope = helemclub.marketplace`.
- **עיקרון-על:** **reuse/extend לפני build.** 88 קומפוננטות קיימות — משתמשים בהן. קומפוננטה חדשה נוצרת עם `bit create` (env נעוץ + spec + compositions + docs) → החזרה פנימה = `bit export` ל-lane, לא מיגרציה.
- **סודות:** `.env` ב-`.gitignore` + Bit Cloud env. אף סוד לא ב-repo/frontend.

---

## 3. הרעיון הארכיטקטוני (✅ אושר)

flow אחד בשלושה כובעים: `draft → pending → approved | changes_requested | rejected`, עם הערת מודרטור והיסטוריה append-only. הפלטפורמה מחזיקה את ה-lifecycle וקונסולת המודרציה, וחושפת `ModerationQueue` slot. features רושמים את עצמם — הפלטפורמה לא מייבאת feature.

---

## 4. ההחלטות שננעלו

1. **כניסה:** **OTP למייל + Google OAuth (עם אימות id_token מלא). בלי סיסמאות.** מי שאין לו Google נכנס בקוד למייל.
2. **מייל (Resend):** OTP + התראות מודרציה.
3. **מדיה:** Cloudinary uploads (signed), עוברים ביקורת בתור.
4. **מנטורים:** CTA מאחורי login → ערוץ חיצוני. אין תיאום on-platform.
5. **דירוגים/תגובות:** כוכבים ציבוריים, דירוג רק למחוברים; תגובות רק למחוברים + דיווח/הסרה. **מרחיבים את `app-review`, לא מפצלים.**
6. **Wishlist:** עולה מיד + content-safety + רצועת סיוע. claim 60 יום, on-read בשאילתה.
7. **נתוני דמו:** מגודרים ל-dev. **prod ריק.**
8. **אירוח:** Bit Cloud + MongoDB Atlas.
9. **הגשה:** מגיש יחיד; שם צוות/חברים כשדה טקסט. סימון `submissionSource: 'hackathon-1'`.
10. **מודרציה:** שני admin (רואי + Shachar). `status` default משתנה מ-`approved` ל-**`pending`**.

---

## 5. מפרטי הזרימות

### 5.1 הגשת אפליקציה — ⭐ מסלול ההאקתון (§10)
`/submit`, חברים בלבד. `toolbox/pages/submit-tool` **כבר קיים** (8 שדות, מוגן ב-ProtectedRoute, מחובר ל-`useApps().submitApp`). מרחיבים: תמונות (Cloudinary), פרטי צוות+קשר, טיוטות, preview, עמוד תודה. **ההגשות שלי** (`/my-submissions`) עם tabs לפי סטטוס.

### 5.2 אישור / מודרציה
`toolbox/admin/review-submissions` **קיים** (approve/reject). משלימים: `changes_requested` + הערה, migration ל-lifecycle, מיילים. רק `approved` קריא לציבור — **ב-resolvers, לא בצד לקוח.**

### 5.3 Wishlist — גל הבא
upvote (אטומי), claim (on-read בשאילתה), fulfillment + קרדיט, content-safety. `open → claimed → fulfilled`. דירוג `upvotes / (hoursSince + 2)^1.5`.

### 5.4 מנטורים — גל הבא (scope חדש)
מדריך ציבורי, CTA מאחורי login, בקשה 4 שלבים, תור אדמין, verified, cross-linking.

---

## 6. טופולוגיית ה-Scopes (מול הקיים)

| Scope | קיים | מצב |
|---|---|---|
| `helemclub.design` | 27 | ✅ button, star-rating, table, modal, tabs, select-list… |
| `helemclub.platform` | 32 | ✅ header, footer, **signup (OTP+Google), login**, admin-dashboard, admin-shell, protected-route, helam-platform, אפליקציית helam |
| `helemclub.knowledge-domains` | 13 | ✅ domain-filter, domain-selector |
| `helemclub.toolbox` | 16 | ✅ catalog, app-detail, **submit-tool**, review-submissions, rating-summary, **app-repository (createApp+slug)** |
| `helemclub.mentors` | 0 | ❌ net-new — ליצור scope ב-Bit Cloud ידנית (גל הבא) |

---

## 7. חוזה הפלטפורמה (✅ אושר)

**Roles:** `visitor` · `member` · `admin`.
**Slots:** `Route`(+guard), `NavigationItem`, `HeaderAction`, `UserMenuItem`, `ModerationQueue`(+badge), `FooterLink`, `BackendServer`, `OnStartHook`.
**עוזרים:** `getCurrentUser(req)` → `null` לאנונימי; `requireRole(user, role)` על mutations.
**מודל מודרציה:** `ModerationRecord` (status, submittedBy/At, reviewedBy/At, moderatorNote, `history` append-only). ⚠️ היום `status` string שטוח `default:'approved'` — נדרש migration ל-lifecycle + שינוי default ל-`pending` (§10 step 5).

---

## 8. מודל הנתונים — MongoDB (תשובות hopeAI, מוסמך)

- **DB אחד משותף.** `mongoose.connect(mongoUrl)` פעם אחת ב-provider; features עושים `getModelForClass` בלבד — **לא `connect` שוב.**
- **Pooling:** ברירת מחדל mongoose (100), מנוהל ע"י הקריאה היחידה.
- **Session:** cookie (`express-session` + `connect-mongo`) — נשאר, לא JWT.
- **claim on-read בשאילתה:** `{ $or: [ {status:'open'}, {status:'claimed', 'claim.expiresAt': {$lt: new Date()}} ] }` — לא ב-JS.

### ⚠️ שמות שדות — לא משנים אף קיים (רק מוסיפים)
`externalLink`(לא link) · `icon`(לא iconRef) · `fullDescription`(לא description) · `avgRating`(לא ratingAvg) · `status`+`submittedBy` שטוחים · `originatorName` (מוסיפים `creditsIdeaId` לצידו) · `photoRef` חדש.
- **ratings/comments:** לא לפצל — מרחיבים את `app-review` (stars+comment) ב-`reports[]`+`removed`.
- **מזהים:** כל model קיים עם `id:string` ייחודי בנוסף ל-`_id`; models חדשים שומרים על הדפוס.

---

## 9. אבטחה — ⚠️ שלושה bypasses חיים, חוסמים כל פיצ'ר (§10 step 2)

`helam-platform.node.runtime.ts`:
- **`verifyEmailOtp` מקבל כל קוד** → OTP אמיתי: 6 ספרות, hashed at rest, TTL 10 דק', single-use, rate-limited.
- **`signInWithGoogle` לא מאמת** → **לאמת `id_token` מול Google** (נכלל בגל הזה — לא להסיר).
- **`issueToken` לא חתום/נחיש** → להישען על ה-cookie session בלבד.
- session/boot: `saveUninitialized:false`, `sameSite:'lax'`, **fail-fast** על `SESSION_SECRET` ו-`MONGO_URL`.

PII ישראלי — שער `ran-bar-zik` + `israeli-appsec` לפני go-live.

---

## 10. מסלול ההגשה — האקתון 1  🎯 (מחליף את §10 של v2)

**מטרה:** קישור אחד לרואי לשתף עם משתתפי האקתון 1 (שכבר קרה) → הם נרשמים ומגישים את הכלים שכבר בנו → נתוני אמת מאכלסים את הקטלוג. **מאושר לביצוע אחרי Step 0.**

**כבר קיים ובנוי ל-lane:** signup (OTP+Google), login, submit-tool (8 שדות, מוגן, `pending`), app-repository (`createApp`+slug), review-submissions (approve/reject), קטלוג+פירוט, shell/guards/roles.
**חוסם בפועל — שלושה:** חיבור Mongo, פרצת ה-auth, ניקוי seeds. אחריהם — השלמות לטופס.
**התאריך כבר עבר → אין לחץ דדליין:** רצים על המסלול המלא כולל שלב 5.

### רצף השלבים
| # | שלב | תלוי | שער |
|---|---|---|---|
| 0 | Repo + `bit init` + import מה-lane + env | — | `bit status` נקי |
| 1 | חיבור Mongo אמיתי | 0 | הקטלוג נטען מ-Atlas |
| 2 | סגירת ה-auth ⛔ | 1 | 🚦 Shachar נרשמת ונכנסת (OTP + Google) |
| 3 | ניקוי seeds + הפרדת dev/prod | 1 | הקטלוג ריק בנקי |
| 4 | השלמת טופס ההגשה + `/my-submissions` | 2, 3 | 🚦 Shachar מגישה אפליקציה אמיתית |
| 5 | השלמת מודרציה + מיילים | 4 | הגשה עוברת לקטלוג |
| 6 | ליטוש `/submit` לשיתוף | 5 | 🚦 רואי משתף |

**מקביליות:** 2 ו-3 מקבילים (תלויים רק ב-1). 4 חייב את שניהם.

### Step 0 — תשתית
```
bit init                                     # defaultScope = helemclub.marketplace
bit lane switch helemclub.marketplace/helam-club
bit import "helemclub.design/**"
bit import "helemclub.platform/**"
bit import "helemclub.knowledge-domains/**"
bit import "helemclub.toolbox/**"
bit install
bit status                                   # חייב לצאת נקי — זה השער
```
**env נעוץ (חובה):** UI/pages/hooks → `helemclub.design/envs/helam-env@275621ea…` · Aspects → `bitdev.symphony/envs/symphony-env@5.0.20` · Entities → `bitdev.node/node-env@6.0.20`.
**סודות לגל 1:** `MONGO_URL`, `SESSION_SECRET`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`/`SECRET`, admin seed ×2 (רואי + Shachar). Cloudinary — שלב 4.

### Step 1 — חיבור Mongo אמיתי  *(Shachar + hopeAI עובדות על זה עכשיו)*
`MONGO_URL` נדחה ע"י ה-hosting: *"value contains characters not allowed"* — כנראה תו שמור ב-URI בסיסמה (`@ : / ? # %`).
**תיקון (Shachar, לא קלוד):** Atlas → Database Access → `helem_app` → Edit Password → Autogenerate עד שאותיות+ספרות בלבד. להרכיב `mongodb+srv://helem_app:PASSWORD@cluster0.xxxxx.mongodb.net/helam_dev?retryWrites=true&w=majority` — בלי גרשיים/רווח, `@` אחד.
**קוד:** להחליף `if (mongoUrl) connect` ב-**`throw`** מפורש. **שער:** הקטלוג נטען מ-Atlas.

### Step 2 — סגירת ה-auth ⛔
שלושת ה-bypasses (§9). **OTP אמיתי** + **אימות Google id_token מלא (כולל, לא להסיר)** + תיקוני session. **🚦 שער Shachar:** להירשם עם מייל אמיתי, לקבל קוד, להיכנס; קוד שגוי נדחה; כניסת Google עובדת.

### Step 3 — ניקוי seeds
לגדר `app.model.ts` ו-`wishlist.mock.ts` ב-`if (process.env.NODE_ENV !== 'production')`. `helam_dev` (seeds) נפרד מ-`helam_prod` (ריק). empty state בעברית: *"עוד רגע יתמלא. האפליקציות הראשונות בדרך מהאקתון."* **שער:** prod ריק.

### Step 4 — השלמת טופס ההגשה
| תוספת | למה |
|---|---|
| שם צוות/מגיש (טקסט) + מייל קשר | רואי צריך לדעת מי הגיש ואיך לחזור |
| אייקון + צילומי מסך (Cloudinary signed) | בלי תמונות הקטלוג ריק |
| `submissionSource: 'hackathon-1'` | לזהות ולסנן את המחזור |
| Autosave טיוטה + `?id=` | טופס ארוך — לא לאבד מילוי |
| ולידציית https חיה | קישור שבור = הגשה פסולה |
| preview + עמוד תודה + מייל אישור | סוגר את הלולאה למשתתף |

`/my-submissions` — סטטוס אישי. **🚦 שער Shachar:** להגיש אפליקציה אמיתית מקצה לקצה.

### Step 5 — מודרציה על אמת
`changes_requested` + הערה. migration של `status` ל-lifecycle + **default `approved` → `pending`** (רשומה חדשה לא מתפרסמת אוטומטית). מיילים על כל החלטה (Resend). רק `approved` קריא — ב-resolvers. שני admin (רואי + Shachar) נזרעים **אחרי** תיקון ה-OTP.

### Step 6 — ליטוש `/submit` לשיתוף
עמוד נחיתה קצר: מה מגישים ולמי, מפנה להרשמה. **זה מה שרואי משתף. 🚦**

**גל הבא (שאר v2):** Wishlist עם persistence, מנטורים, תגובות ודיווחים — אחרי שההאקתון הזרים תוכן אמיתי.

---

## 11. פתוח / לאישור

**נסגר:** OTP+Google(מאומת) בלי סיסמאות · prod ריק · claim 60 יום · wishlist מיד+safety · admin מאוחד · member ברירת מחדל · Resend · מגיש יחיד+שם צוות טקסט · שני מודרטורים · `status` default→`pending` · `submissionSource='hackathon-1'`.

**פתוח:**
1. re-review של v4 (hopeAI).
2. **חיבור Mongo** — בעבודה עכשיו (Shachar + hopeAI); ה-URI-encoding של סיסמת Atlas (§10 step 1).
3. Resend — SPF/DKIM לדומיין כדי ש-OTP לא ייפול לספאם.
4. כמה משתתפים צפויים? (rate limits — כרגע default שמרני; לעדכן אם ידוע).
5. סימון ויזואלי "מהאקתון 1" בקטלוג? (default מוצע: badge עדין).

---

*ממתין ל-re-review של hopeAI לפני ביצוע. אחרי sign-off: Step 0 → חיבור Mongo → סגירת auth → הגשה → לינק לרואי.*
