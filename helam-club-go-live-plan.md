# Helam Club — Go-Live Plan (v5)

**מוכן עבור:** Shachar Tzuk (@shacharoli) · **חשבון:** helemclub · **תאריך:** 2026-07-31
**Repo (Bit workspace):** `github.com/ShachTzu/helem-club-tool-box` (private)
**Lane קיים:** `helemclub.marketplace/helam-club` — **165 קומפוננטות, 88 מהן ב-4 ה-scopes הרלוונטיים.**
**סטטוס:** 🟢 **מאושר לביצוע (hopeAI sign-off על v4).** v5 קולט את ה-re-review. Step 1 (Mongo) הושלם. קלוד מתחיל מ-Step 0.

> **מה השתנה מ-v4 (re-review של hopeAI):** Step 1 (חיבור Mongo) ✅ הושלם. `defaultConfig` שורה 137 מתווסף ל-§9. הסרת `mockUsers()` seed נכנסת ל-step 2. `UserModel` מקבל `emailVerified`+`googleSub`+collection `otpCodes`. נוסף משפט מפורש "אין לבנות מחדש" ל-Step 0. §11 עודכן.

---

## 0. איך לקרוא (handoff ל-hopeAI)

| מעגל | מי | איך | על מה |
|---|---|---|---|
| 1. ביקורת תוכנית | hopeAI | ✅ הושלם — sign-off על v4 | המסמך הזה |
| 2. ביקורת קוד | hopeAI | קלוד מפיק diff → Shachar מדביקה → הערות לפי קובץ+שורה → קלוד מיישם | כל שלב |
| 3. שער פונקציונלי | Shachar | להירשם, לקבל קוד, להיכנס, להגיש | §10 |

> **hopeAI קוראת בלבד — אין אינטגרציית GitHub.** קלוד הוא נקודת הממשק. הדבר הראשון שהיא בודקת בכל diff: שאין קומפוננטה חדשה שמשכפלת קיימת, ושה-env נעוץ בגרסה המדויקת.

---

## 1. מטרה

מרקטפלייס production של אפליקציות התמודדות: הגשה, מודרציה, wishlist, מנטורים. עברית RTL. עיון חופשי בלי הרשמה; חשבון (OTP/Google) רק לפעולות.
**היעד הקרוב (§10):** הרשמה + הגשה. מי שנרשם הופך ל**חבר קהילה** (role `member`). **כדי להגיש כלי לארגז הכלים חובה להיות חבר קהילה רשום.** הסיינים הראשונים יהיו חברי קהילה שהם גם משתתפי **האקתון 1 (שכבר קרה)** — רואי משתף איתם לינק, הם נרשמים כחברי קהילה ומגישים את הכלים שבנו → נתוני אמת. *(אפשר להשתתף בהאקתון בלי להיות חבר קהילה; אבל הגשה לארגז הכלים דורשת הרשמה.)* **בלי נתון בדוי ב-prod.**

---

## 2. סביבת ועקרונות העבודה

- **הריפו עצמו הוא ה-Bit workspace** (`bit init` בתוכו). branches + PRs ל-CI/גרסאות. **ביקורת hopeAI בהדבקה.**
- **`bit` CLI:** מותקן (v2.0.26), מחובר `shacharoli`, `defaultScope = helemclub.marketplace`.
- **עיקרון-על:** **reuse/extend לפני build.** 88 קומפוננטות קיימות. קומפוננטה חדשה נוצרת עם `bit create` (env נעוץ + spec + compositions + docs) → החזרה פנימה = `bit export` ל-lane.
- **סודות:** `.env` ב-`.gitignore` + Bit Cloud env. אף סוד ב-repo/frontend.

---

## 3. הרעיון הארכיטקטוני (✅ אושר)

flow אחד בשלושה כובעים: `draft → pending → approved | changes_requested | rejected`, עם הערת מודרטור והיסטוריה append-only. הפלטפורמה מחזיקה את ה-lifecycle וקונסולת המודרציה, חושפת `ModerationQueue` slot; features רושמים את עצמם.

---

## 4. ההחלטות שננעלו (✅ נעולות וקוהרנטיות)

1. **כניסה:** OTP למייל + Google OAuth (אימות `id_token` מלא). בלי סיסמאות.
2. **מייל (Resend):** OTP + התראות מודרציה.
3. **מדיה:** Cloudinary uploads (signed), עוברים ביקורת בתור.
4. **מנטורים:** CTA מאחורי login → ערוץ חיצוני. אין תיאום on-platform.
5. **דירוגים/תגובות:** כוכבים ציבוריים, דירוג/תגובה רק למחוברים + דיווח/הסרה. מרחיבים את `app-review`, לא מפצלים.
6. **Wishlist:** מיד + content-safety + רצועת סיוע. claim 60 יום, on-read בשאילתה.
7. **נתוני דמו:** מגודרים ל-dev. prod ריק.
8. **אירוח:** Bit Cloud + MongoDB Atlas.
9. **הגשה:** מגיש יחיד; שם צוות כשדה טקסט. `submissionSource:'hackathon-1'`.
10. **מודרציה:** שני admin (רואי + Shachar). `status` default `approved` → **`pending`**.

---

## 5. מפרטי הזרימות

### 5.1 הגשה — ⭐ מסלול ההאקתון (§10)
`toolbox/pages/submit-tool` **קיים** (8 שדות, מוגן ProtectedRoute, מחובר `useApps().submitApp`). מרחיבים: תמונות (Cloudinary), פרטי צוות+קשר, טיוטות, preview, עמוד תודה. `/my-submissions` עם tabs.

### 5.2 מודרציה
`toolbox/admin/review-submissions` **קיים** (approve/reject). משלימים: `changes_requested`+הערה, migration, מיילים. רק `approved` קריא — ב-resolvers.

### 5.3 Wishlist — גל הבא
upvote/claim אטומיים (on-read בשאילתה), fulfillment+קרדיט, content-safety. דירוג `upvotes/(hoursSince+2)^1.5`.

### 5.4 מנטורים — גל הבא (scope חדש)
מדריך, CTA מאחורי login, בקשה 4 שלבים, תור אדמין, verified, cross-linking.

---

## 6. טופולוגיית ה-Scopes (מול הקיים)

| Scope | קיים | מצב |
|---|---|---|
| `helemclub.design` | 27 | ✅ button, star-rating, table, modal, tabs, select-list… |
| `helemclub.platform` | 32 | ✅ header, footer, **signup (OTP+Google), login**, admin-dashboard, admin-shell, protected-route, helam-platform |
| `helemclub.knowledge-domains` | 13 | ✅ domain-filter, domain-selector |
| `helemclub.toolbox` | 16 | ✅ catalog, app-detail, **submit-tool**, review-submissions, rating-summary, **app-repository** |
| `helemclub.mentors` | 0 | ❌ net-new — ליצור scope ב-Bit Cloud ידנית (גל הבא) |

---

## 7. חוזה הפלטפורמה (✅ אושר)

**Roles:** `visitor` (גולש) · `member` (= חבר קהילה רשום — נדרש להגשה/דירוג/תגובה) · `admin` (רואי/Shachar).
**Slots:** `Route`(+guard), `NavigationItem`, `HeaderAction`, `UserMenuItem`, `ModerationQueue`(+badge), `FooterLink`, `BackendServer`, `OnStartHook`.
**עוזרים:** `getCurrentUser(req)` → `null` לאנונימי; `requireRole(user, role)` על mutations.
**מודל מודרציה:** `ModerationRecord`. ⚠️ היום `status` שטוח `default:'approved'` — migration ל-lifecycle + default → `pending` (§10 step 5).

---

## 8. מודל הנתונים — MongoDB (✅ תשובות hopeAI)

- **DB אחד משותף.** `mongoose.connect` פעם אחת ב-provider; features עושים `getModelForClass` בלבד — **לא `connect` שוב.**
- **Pooling:** ברירת מחדל mongoose (100).
- **Session:** cookie (`express-session`+`connect-mongo`) — נשאר, לא JWT.
- **claim on-read בשאילתה:** `{ $or:[ {status:'open'}, {status:'claimed','claim.expiresAt':{$lt:new Date()}} ] }`.

### ⚠️ שמות שדות — לא משנים אף קיים
`externalLink` · `icon` · `fullDescription` · `avgRating` · `status`+`submittedBy` שטוחים · `originatorName` (מוסיפים `creditsIdeaId` לצידו) · `photoRef` חדש.
- **ratings/comments:** לא לפצל — מרחיבים את `app-review` (stars+comment) ב-`reports[]`+`removed`.
- **מזהים — לא לאחד:** `UserModel` משתמש ב-`userId`, `AppModel` ב-`id`. GraphQL mappings נשענים על שניהם — לא לאחד, לא להניח דפוס אחיד. models חדשים: `id:string` ייחודי בנוסף ל-`_id`.
- **`UserModel` ל-OTP — להוסיף:** `emailVerified: boolean` (§4 דורש אימות לפני הגשה) · `googleSub: string` (unique, sparse — בלעדיו זיהוי Google נשען על מייל, שביר). **ה-OTP עצמו ב-collection נפרד `otpCodes` עם TTL index על `expiresAt`** — לא שדה על המשתמש.

---

## 9. אבטחה — ⚠️ שלושה bypasses חיים, חוסמים כל פיצ'ר (§10 step 2)

`helam-platform.node.runtime.ts`:
- **`verifyEmailOtp` מקבל כל קוד** → OTP אמיתי: 6 ספרות, hashed at rest, TTL 10 דק', single-use, rate-limited.
- **`signInWithGoogle` לא מאמת** → **לאמת `id_token` מול Google** (נכלל בגל הזה — לא להסיר).
- **`issueToken` לא חתום/נחיש** → להישען על ה-cookie session בלבד.
- **session/boot:** `saveUninitialized:false` · `sameSite:'lax'`.
- **`sessionSecretKey` — לתקן בשני מקומות:** `defaultConfig` **שורה 137** עדיין `'SESSION_SECRET'` מילולי → `process.env.SESSION_SECRET`; וגם שורה 173. **fail-fast** אם חסר. (אחרת התנאי לעולם לא נכשל.)
- **`MONGO_URL`:** `throw` מפורש (§10 step 1).

PII ישראלי — שער `ran-bar-zik` + `israeli-appsec` לפני go-live.

---

## 10. מסלול ההגשה — האקתון 1  🎯 (מחליף את §10 של v2)

**מטרה:** קישור אחד לרואי לשתף → משתתפי האקתון 1 (שכבר קרה) נרשמים ומגישים את הכלים שכבר בנו → נתוני אמת. **מאושר לביצוע.**

**כבר קיים:** signup (OTP+Google), login, submit-tool, app-repository, review-submissions, קטלוג+פירוט, shell/guards/roles.
**חוסם:** ~~Mongo~~ (הושלם), פרצת auth, ניקוי seeds. **התאריך עבר → אין לחץ דדליין; מסלול מלא.**

### רצף השלבים
| # | שלב | תלוי | סטטוס / שער |
|---|---|---|---|
| 0 | Repo + `bit init` + import + env | — | ⬜ **הבא** — `bit status` נקי |
| 1 | חיבור Mongo | 0 | ✅ **הושלם** (נותר: `throw` שורה 144) |
| 2 | סגירת ה-auth ⛔ + הסרת seed המשתמשים | 1 | ⬜ 🚦 Shachar נרשמת ונכנסת |
| 3 | ניקוי seeds + dev/prod | 1 | ⬜ הקטלוג ריק בנקי |
| 4 | טופס הגשה + `/my-submissions` | 2,3 | ⬜ 🚦 Shachar מגישה אפליקציה |
| 5 | מודרציה + מיילים | 4 | ⬜ הגשה עוברת לקטלוג |
| 6 | ליטוש `/submit` לשיתוף | 5 | ⬜ 🚦 רואי משתף |

**מקביליות:** 2 ו-3 מקבילים (תלויים רק ב-1). 4 חייב את שניהם.

### Step 0 — תשתית
> ⛔ **אין לבנות מחדש.** שלבי v2 המקוריים **1–6 הושלמו וקיימים על ה-lane** (design foundation, form primitives, content primitives, platform shell, domains, catalog). כל `bit create` שיוצר button/card/modal/table/tabs/header/footer/login/signup/catalog/app-detail/submit-tool — **שגיאה**. קודם import, ואז extend בלבד.
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
**סודות לגל 1:** `MONGO_URL` (✅), `SESSION_SECRET`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`/`SECRET`, admin seed ×2. Cloudinary — שלב 4.

### Step 1 — חיבור Mongo  ✅ הושלם
`MONGO_URL` תקין ומאומת: `helem_app` → `helam_dev` על `helemclub.5l1lzvd.mongodb.net`, חיבור ~2s, DB ריק (0 collections — הרצוי לפתיחה).
*לפרוטוקול: השורש לא היה תו בסיסמה — אלא `<db_username>` placeholder שלא הוחלף + חוסר `/helam_dev` אחרי ה-host (נפלנו על DB `test`). הסיסמה תקינה.*
**נותר (החלק היחיד):** `helam-platform.node.runtime.ts` שורות 144–147 — `if (mongoUrl){connect}` → **`throw`** מפורש.

### Step 2 — סגירת ה-auth ⛔
שלושת ה-bypasses (§9) + תיקוני session (כולל `defaultConfig` שורה 137).
⚠️ **באותו PR: להסיר את `mockUsers()` seed** ב-`registerOnStart` (שורות 190+) — לא רק להימנע מהוספה. ה-collection ריק; הרצה הבאה תזרע admin, וכל עוד OTP פתוח כל מי שיודע את המייל נכנס כאדמין. סוגרים את הדלת *ומוציאים את המפתח*.
**🚦 שער Shachar:** להירשם עם מייל אמיתי, לקבל קוד, להיכנס; קוד שגוי נדחה; Google עובד.

### Step 3 — ניקוי seeds
לגדר `app.model.ts` ו-`wishlist.mock.ts` ב-`NODE_ENV !== 'production'`. `helam_dev` (seeds) נפרד מ-`helam_prod` (ריק). empty state עברית: *"עוד רגע יתמלא. האפליקציות הראשונות בדרך מהאקתון."*

### Step 4 — השלמת טופס
שם צוות (טקסט)+מייל · אייקון+צילומי מסך (Cloudinary signed) · `submissionSource:'hackathon-1'` · autosave טיוטה+`?id=` · ולידציית https חיה · preview+עמוד תודה+מייל. `/my-submissions`. **🚦 שער Shachar.**

### Step 5 — מודרציה על אמת
`changes_requested`+הערה · migration של `status` + **default → `pending`** · מיילים (Resend) · רק `approved` קריא (resolvers). שני admin נזרעים **אחרי** תיקון OTP.

### Step 6 — ליטוש `/submit`
עמוד נחיתה: מה מגישים ולמי, מפנה להרשמה. **זה מה שרואי משתף. 🚦**

**גל הבא:** Wishlist, מנטורים, תגובות/דיווחים.

---

## 11. פתוח / לאישור

**נסגר:** v4 מאושר · OTP+Google(מאומת) בלי סיסמאות · prod ריק · claim 60 יום · wishlist מיד+safety · admin מאוחד · member ברירת מחדל · Resend · מגיש יחיד+שם צוות · שני מודרטורים · `status` default→`pending` · **חיבור Mongo הושלם.**

**פתוח:**
1. **Resend:** אם אין דומיין מאומת — ל-OTP של האקתון `onboarding@resend.dev` עובד בלי DNS (פחות מקצועי, לא חוסם).
2. כמה משתתפים צפויים? (rate limits — כרגע default שמרני).
3. סימון ויזואלי "מהאקתון 1" בקטלוג? (default מוצע: badge עדין).
4. `mongo-check` — למחוק או לשמור ככלי אבחון ל-`helam_prod`? (המלצה: לשמור.)

---

*מאושר לביצוע. קלוד מתחיל מ-Step 0; שער: `bit status` נקי אחרי import. כל שלב → diff ל-hopeAI.*
