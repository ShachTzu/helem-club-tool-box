# Helam Club — Go-Live Plan (v2, honed)

**מוכן עבור:** Shachar Tzuk (@shacharoli) · **חשבון:** helemclub
**פרוטוטייפ:** `helemclub.marketplace/helam-prototype`
**תאריך:** 2026-07-30
**סטטוס:** 🟡 **לביקורת של hopeAI לפני כל ביצוע.** קלוד לא כותב שורת קוד עד sign-off על המסמך הזה (בעיקר §8 — שכבת ה-Mongo).

---

## 0. איך לקרוא את המסמך הזה (handoff ל-hopeAI)

זו תוכנית ביצוע, לא רק חזון. מה שאני צריך שתעברי עליו ותעירי:

1. **§8 — מודל הנתונים ב-MongoDB.** את הכנת את שכבת ה-Mongo, אז זה החלק הכי קריטי. אישרי/תקני את הישויות, השדות, האינדקסים, וההנחות. סימנתי כל הנחה ב-`⚠️ לאישור hopeAI`.
2. **§9 — אבטחה ופרטיות.** במיוחד סביב סיסמאות, sessions, והרשאות בצד שרת.
3. **§10 — סדר וכיוון העבודה.** האם רצף הבנייה והתלויות נכונים, ומה אפשר להריץ במקביל.

**שלושה מעגלי ביקורת** (זה עונה על "לוודא את הסדר והכיוון"):

| מעגל | מי | מתי | על מה |
|---|---|---|---|
| 1. ביקורת תוכנית | hopeAI | **עכשיו, לפני קוד** | המסמך הזה — בעיקר Mongo (§8) |
| 2. ביקורת PR | hopeAI | כל שלב בנייה | כל שלב יוצא כ-PR ב-GitHub; Ripple CI מריץ build/test |
| 3. שער פונקציונלי | Shachar | אחרי שלב 4 | להתחבר ולנסות את ה-shell בפועל |

קלוד מבצע רק אחרי מעגל 1, וכל PR ממתין למעגל 2.

---

## 1. מטרה

להפוך את הפרוטוטייפ של מרקטפלייס אפליקציות ההתמודדות של Helam Club לפלטפורמת production עם ארבעה flows עובדים:

1. **הגשת אפליקציה** — איך חבר קהילה מגיש אפליקציית התמודדות.
2. **אישור / מודרציה** — איך הגשה הופכת לגלויה לציבור.
3. **Wishlist** — איך רעיונות לאפליקציות שעוד לא קיימות נפתחים, מקבלים upvote, נתפסים (claim) ומקבלים קרדיט.
4. **מנטורים** — איך מידע על מנטורים נוסף, מאושר ומוצג.

**עיון חופשי לגמרי, בלי הרשמה.** חשבון נדרש רק כדי להגיש, לדרג, להעלות upvote, לתפוס רעיון, לפנות למנטור, או לבצע מודרציה.

עברית RTL לכל אורך הדרך, שימוש חוזר במותג הפרוטוטייפ: navy עמוק `#0B1A30`, steel blue `#4F6D7A`, amber `#E89F4B`, פונט Assistant, פינות pill, צללי כרטיס רכים.

---

## 2. סביבת ועקרונות העבודה  ⭐ חדש

**עובדים ב-Claude Code בדסקטופ מול Git repo — לא בעורך הווב של Bit.**

- **משטח האמת:** Git repo (GitHub) שבתוכו יושב ה-Bit workspace. כל השינויים עוברים דרך branches ו-PRs. hopeAI עוברת על ה-PRים לפני merge.
- **כלי הפיתוח:** ה-`bit` CLI — כבר מותקן (v2.0.26), מחובר כ-`shacharoli`, scope `helemclub`.
- **זרימת עבודה לכל שינוי:**
  1. `git checkout -b <feature>` — branch לכל שלב.
  2. `bit create` / עריכת קוד הקומפוננטות מקומית; `bit start` לתצוגה מקומית חיה.
  3. `bit status` + `bit tag`/`bit snap` — snapshot מגורסֵן של הקומפוננטות.
  4. `git push` → **PR ב-GitHub** → **hopeAI review** → merge.
  5. אחרי merge: `bit export` מפרסם את הקומפוננטות ל-scopes של `helemclub` + **Ripple CI** בונה/פורס ל-Bit Cloud.
- **אירוח:** Bit Cloud (Ripple) לאפליקציה + **MongoDB Atlas** לנתונים (`MONGO_URL`).

**סודות/env נדרשים לפני שלב 4** (ראה §10, Step 0):
`MONGO_URL` · `GOOGLE_CLIENT_ID` · `GOOGLE_CLIENT_SECRET` · `RESEND_API_KEY` · `CLOUDINARY_URL` · `SESSION_SECRET` · פרטי admin ל-seed.
נשמרים ב-`.env` (ב-`.gitignore`) לפיתוח מקומי, וב-Bit Cloud env vars ל-deploy. **אף סוד לא נכנס ל-repo ולא ל-frontend.**

---

## 3. הרעיון הארכיטקטוני המרכזי

ארבעת ה-flows הם באמת **flow אחד שחובש שלושה כובעים**. הגשת אפליקציה, בקשת מנטור, ורעיון wishlist — כולם נעים באותו lifecycle:

```
draft → pending → approved | changes_requested | rejected
```

…תמיד עם הערת מודרטור והיסטוריה append-only.

לכן:

- ה-**platform** מחזיק את מודל ה-lifecycle המשותף ו-**קונסולת מודרציה אחת** לאדמין.
- הקונסולה חושפת **ModerationQueue slot**.
- כל feature (apps, mentors) **רושם את התור שלו** ל-slot הזה.

הפלטפורמה אף פעם לא מייבאת feature. Features רושמים את עצמם לתוך הפלטפורמה. התוצאה המעשית: קונסולת המודרציה מציגה אפליקציות ומנטורים זה לצד זה כבר היום, וכל סוג תוכן עתידי (בלוג, אירועים, גלריה) מתחבר בהמשך בלי לגעת ב-shell.

---

## 4. ההחלטות שננעלו בסבב ההזנה (delta מהתוכנית המקורית)

הליבה הארכיטקטונית לא השתנתה. אלה שבע ההחלטות שהתחדדו + ה-defaults:

1. **כניסה:** Google OAuth **וגם** אימייל+סיסמה, שניהם מ-v1. המשתמש נשמר ב-Mongo תמיד.
   → גורר: `argon2id` לסיסמאות, rate-limiting על login/reset, טוקני reset מאובטחים, ותשתית מייל.
2. **תשתית מייל נכנסת פנימה** (אימות מייל + איפוס סיסמה) — ולכן גם **התראות מייל על החלטות מודרציה** (אושר / דרוש תיקון / נדחה) הופכות לכמעט-חינם. v1 כבר לא pull-only: גם מייל וגם "ההגשות שלי".
3. **מדיה:** העלאה אמיתית עם **Cloudinary** (אייקונים + צילומי מסך). התמונות עוברות ביקורת תוכן דרך תור האישור הקיים.
4. **מנטורים:** ה-CTA "צור קשר / תאם" **מאחורי login**, פותח את הערוץ החיצוני של המנטור. אין תיאום/תשלום on-platform.
5. **דירוגים/תגובות:** כוכבים — צפייה **ציבורית**, דירוג עצמו רק למחוברים (מניעת כפילויות). תגובות טקסט — צפייה **וכתיבה** רק למחוברים, + כפתור **דיווח** והסרה ע"י אדמין.
6. **Wishlist:** מעבר ל"spam check" — מוסיף שער **content-safety** על שפת משבר/פגיעה-עצמית + **רצועת מוקדי סיוע** (קווי חירום בישראל) גלויה בעמוד. קהל רגיש, לא UGC רגילה.
7. **אירוח:** Bit Cloud + MongoDB Atlas.

**Defaults נעולים (ניתן לשנות):**
- **ספק מייל:** Resend (free tier), מאחורי interface אחד → swappable.
- **אימות מייל:** משתמשי אימייל/סיסמה חייבים לאמת מייל לפני **הגשה / הרשמה כמנטור**; upvote ודירוג מותרים מיד. משתמשי Google מאומתים אוטומטית.
- **מרוצים (races):** `claim` ו-`upvote` כ-mutations אטומיות (`findOneAndUpdate` עם בדיקת status) — שניים לא יתפסו את אותו רעיון.
- **demand score:** `upvotes / (hoursSince + 2)^1.5` (Hacker-News-style), נוסחה מפורשת ב-§5.3.

---

## 5. מפרטי הזרימות

### 5.1 הגשת אפליקציה
Route `/submit`, חברים בלבד. אנונימיים מופנים ל-login וחוזרים לכאן.

טופס ארבעה שלבים עם טיוטות autosave:

| שלב | שם | שדות |
|---|---|---|
| 1 | זהות וקישור | שם, כותרת משנה, קישור https חיצוני (ולידציה חיה), אייקון (emoji או **העלאת תמונה**), שם מפתח |
| 2 | תיאור ומדיה | תיאור מלא (80–2000 תווים, מונה חי), **העלאת צילומי מסך** — הוספה/הסרה/סידור עם thumbnails חיים |
| 3 | סיווג | בורר תגיות coping-domain (1–4), סוג עלות, פלטפורמות, שפה, requires-signup |
| 4 | קרדיטים ואישור | קרדיט אופציונלי לרעיון wishlist, אישור תקנון, preview מלא ("כך זה ייראה"), שליחה לביקורת |

התנהגות: autosave בכל מעבר שלב (resumable דרך `?id=`); שלב לא-תקין חוסם התקדמות עם שגיאות inline בעברית; הגעה מרעיון wishlist נתפס מסמנת אותו מראש בשלב 4; בהצלחה — אישור + ניתוב ל**ההגשות שלי**.

**ההגשות שלי** (`/my-submissions`): כרטיסי סטטוס ב-tabs — הכל / טיוטות / ממתין / דורש תיקון / פורסם / נדחה, כל אחד עם מונה. הערת המודרטור בולטת על מה שדורש תיקון.

### 5.2 אישור / מודרציה
תור אדמין רשום כ-tab **אפליקציות** בקונסולה `/admin`.

- טבלת RTL: שם+אייקון, מגיש, domains, תאריך, זמן המתנה, badge סטטוס. סינון + מיון לפי הכי-ותיק (שום דבר לא נרעב). badge מונה pending חי.
- מסך ביקורת `/admin/submissions/:id` — שני panes: **שמאל** ההגשה כפי שתיראה מפורסמת (כולל אזהרת https); **ימין** checklist למבקר, שדה הערה, ושלוש החלטות: **אשרו ופרסמו** (מפרסם; אם יש קרדיט ל-wishlist — הרעיון מסומן fulfilled והמחבר מוטבע כמקור), **בקשו תיקון** (הערה חובה, חוזר למגיש), **דחו** (סיבה חובה).
- timeline מלא + ניווט מהיר next-in-queue.
- **כלל ברזל:** רק רשומות approved קריאות לציבור. domain בלי פריטים מפורסמים מוסתר מסרגלי הסינון. **האכיפה בשרת (resolvers), לא סינון בצד לקוח.**

### 5.3 Wishlist
עיון/קריאה ציבוריים ב-`/wishlist`; פרסום/upvote/claim דורשים חשבון.

- Tabs: מבוקשים / חדשים / בפיתוח / יצאו לאור + סינון domain משותף.
- **כרטיסי רעיון:** upvote בקצה המוביל (RTL), כותרת, גוף מקוצר, domain pills, מחבר ותאריך.
- **Upvote:** קול אחד לחבר, optimistic (מתגלגל אחורה בשגיאה), חסום למחבר עצמו, מבקש התחברות מאנונימי.
- **Claim:** נועל רעיון למפתח אחד ל-**60 יום**. הכרטיס מציג "בפיתוח ע״י …" + תוקף. לתופס: countdown, פעולת שחרור, קישור ישיר לטופס ההגשה pre-filled. claims שפגו חוזרים לבריכה אוטומטית **on read**.
- **Fulfillment:** רעיון נתפס שיצא כאפליקציה מאושרת → flips ל-fulfilled, מקשר לאפליקציה, המחבר מופיע כ"הרעיון של …" בעמוד האפליקציה.
- סטטוסים: `open` → `claimed` → `fulfilled`. דירוג ברירת מחדל: `upvotes / (hoursSince + 2)^1.5`.
- **content-safety:** שער קל על שפת משבר/פגיעה-עצמית לפני פרסום + **רצועת מוקדי סיוע** גלויה (ער"ן, סה"ר וכו').

### 5.4 מנטורים
מדריך ציבורי `/mentors`, ניתן לעיון בלי חשבון.

- Hero navy שמסביר מה מנטור Helam **כן ולא** — תמיכת עמיתים, לא טיפול.
- סרגל סינון: domain (רק כאלה עם מנטורים מאושרים), שפה, זמינות, חיפוש שם. מסונכרן ל-URL, sheet במובייל.
- **כרטיסי מנטור:** avatar עם טבעת verified, שם, headline, bio מקוצר, domain pills, אייקוני שפה/פורמט, badge זמינות (ירוק/amber/אפור).

פרופיל `/mentors/:slug`: תמונה, headline, badges, bio מלא, תחומים (מקשרים חזרה לסינון), שפות, פורמטים, credentials, ו-**CTA amber ליצירת קשר — מאחורי login** שסופר את הקליק לפני שהוא פותח את ערוץ הבוקינג/קשר **של המנטור עצמו** ב-tab חדש. אין תשלומים/תיאום בפלטפורמה. disclaimer: תמיכת עמיתים, לא תחליף לטיפול מקצועי.

**בקשה** `/mentors/apply` (חברים בלבד), ארבעה שלבים: (1) מי אתם — שם, headline, **העלאת תמונה**, credentials; (2) הסיפור — bio 100–1500 עם הכוונה לשפת תמיכה; (3) תחומים וזמינות — domains (1–5), שפות, פורמטים, זמינות; (4) קשר ואישור — קישור+תווית כפתור, code-of-conduct, preview, שליחה.
אותו טופס = **עריכת פרופיל** למנטור מאושר: עריכות קוסמטיות מתפרסמות מיד; שינויים מהותיים (bio/domains/קישור) חוזרים ל-pending.

תור אדמין **מנטורים** + מסך `/admin/mentors/:id` — אותן החלטות, checklist מותאם, toggle "סמנו כמנטור מאומת".
**Cross-linking:** aspect המנטורים רושם section "מנטורים בתחומים האלה" לתוך עמוד האפליקציה, לפי ה-domains.

---

## 6. טופולוגיית ה-Scopes

| Scope | סוג | אחריות | תלוי ב |
|---|---|---|---|
| `helemclub.design` | design | מותג, theme, RTL UI primitives | — |
| `helemclub.platform` | platform | shell, auth, roles, guards, מודל מודרציה, קונסולת אדמין | design |
| `helemclub.knowledge-domains` | feature | טקסונומיית domains, counts, filters | platform, design |
| `helemclub.toolbox` | feature | קטלוג, הגשה, אישור, wishlist, reviews | platform, design, knowledge-domains |
| `helemclub.mentors` | feature | מדריך, בקשות, אישור, cross-linking | platform, design, knowledge-domains, toolbox |

התלויות אציקליות ומצביעות **אל** הפלטפורמה. לא נגענו: `blog`, `events`, `gallery`, `knowledge-base`, `engagement`, `marketplace`.

---

## 7. חוזה הפלטפורמה

**Roles:** `visitor` (עיון בלבד) · `member` (הגשה, דירוג, upvote, claim, בקשת מנטור) · `admin` (אישור/דחייה של הכל).

**Slots ל-features:** `Route` (עם `requiresAuth`/`allowedRoles` שעוטפים ב-guard) · `NavigationItem` · `HeaderAction` (הגישו אפליקציה — amber) · `UserMenuItem` · `ModerationQueue` (tab בקונסולה + badge) · `FooterLink` · `BackendServer` (schema+resolvers של feature על ה-gateway) · `OnStartHook` (seeding).

**עוזרי Node ל-features:** `getCurrentUser(req)` מחזיר `null` לאנונימי (queries ציבוריות עוברות) · `requireRole(user, role)` שומר על mutations.

**מודל מודרציה משותף:** `ModerationRecord` — status, submittedBy/At, reviewedBy/At, moderatorNote, `history` append-only. מעברים נאכפים: `pending → approved | changes_requested | rejected`, `changes_requested → pending`, `approved → rejected`.

---

## 8. מודל הנתונים — MongoDB  ⚠️ מוקד הביקורת של hopeAI

MongoDB Atlas דרך `process.env.MONGO_URL`, מודלים ב-typegoose, GraphQL מ-node runtime של כל aspect.

> **⚠️ לאישור hopeAI:** מה כבר הכנת? DB אחד משותף לכל ה-aspects, או DB per-aspect? אילו collections כבר קיימים? יש connection-pooling ב-gateway? האם השמות/השדות למטה תואמים למה שהקמת?

**Collections מוצעים** (סימון `PII` = מידע אישי תחת חוק הגנת הפרטיות):

| Collection | שדות מפתח | אינדקסים |
|---|---|---|
| `users` `PII` | `email`(unique), `emailVerified`, `googleSub`(unique, sparse), `passwordHash`(argon2id, אופציונלי), `displayName`, `avatarUrl`, `role`, `createdAt` | unique email, unique googleSub |
| `apps` | `slug`, `name`, `link`(https), `iconRef`, `developerName`, `description`, `screenshots[]`, `domains[]`, `costType`, `platforms[]`, `language`, `requiresSignup`, `creditsIdeaId?`, `moderation{...}`, `submittedBy`, `ratingAvg`, `ratingCount`, `clickCount`, timestamps | `moderation.status`+`submittedAt` (מיון ותיק), `domains`, text(`name`) |
| `ratings` | `appId`, `userId`, `stars`(1–5), `createdAt` | unique (`appId`,`userId`) |
| `comments` `PII` | `appId`, `userId`, `text`, `reports[]`, `removed`, `createdAt` | `appId`+`createdAt` |
| `wishlistIdeas` | `title`, `body`, `domains[]`, `authorId`, `status`, `upvoteCount`, `claim{byUserId,at,expiresAt}`, `fulfilledAppId?`, timestamps | `status`, `domains`, `claim.expiresAt` |
| `votes` | `ideaId`, `userId` | unique (`ideaId`,`userId`) |
| `mentors` `PII` | `slug`, `userId`, `displayName`, `headline`, `photoRef`, `credentials`, `bio`, `domains[]`, `languages[]`, `formats[]`, `availability`, `contactLink`, `contactLabel`, `verified`, `moderation{...}`, `clickCount`, timestamps | `moderation.status`, `domains`, text(`displayName`) |
| `domains` | `slug`, `nameHe`, `order`, `counts{apps,mentors,ideas}` | unique slug |
| sessions | ראה §9 — cookie session מאובטח (או JWT), החלטה לאישור | — |

**הערות מודל:**
- **הגשה = רשומת ה-app עצמה** שנעה ב-lifecycle (`draft`…`approved`). אין collection נפרד ל-submissions.
- `ratingAvg`/`ratingCount` **cached** על ה-app, מתעדכן בכתיבת rating.
- `claim` שפג מזוהה **on read** (`expiresAt < now` → מטופל כ-`open`), ללא cron. `⚠️` — אישור שזה קביל.
- שדות `iconRef`/`photoRef`/`screenshots[]` = מזהי/כתובות Cloudinary, לא bytes.

---

## 9. אבטחה ופרטיות — Definition of Done

מחייב לפני go-live (PII ישראלי: חשבונות + פרטי קשר של מנטורים):

- **סיסמאות:** `argon2id`. hash לא נכתב ל-log ולא חוזר ב-API אף פעם.
- **Google OAuth:** אימות `id_token` בצד שרת; שומרים `sub` בלבד, לא access/refresh tokens.
- **Sessions:** cookie `httpOnly` + `Secure` + `SameSite=Lax`; הגנת CSRF על כל mutation.  `⚠️ לאישור` — cookie session מול JWT.
- **Rate limiting:** login, signup, reset, upvote, submit.
- **טוקני reset:** single-use, TTL קצר, hashed at rest.
- **אימות מייל** כתנאי לפעולות רגישות (הגשה/בקשת מנטור).
- **הרשאה בצד שרת בכל mutation** (`requireRole`) — לא סומכים על הלקוח (Ran Bar-Zik).
- **רק approved קריא לציבור** — נאכף ב-resolvers, **לא סינון בצד לקוח**. הלקוח מקבל רק שורות שמותר לו.
- **Cloudinary:** signed uploads, ולידציית content-type/גודל; תמונות עוברות את תור האישור.
- **קישורים חיצוניים:** https בלבד, `rel="noopener noreferrer"`, אזהרה על http, **בלי fetch בצד שרת** ל-URLs של משתמש (מניעת SSRF).
- **Wishlist:** content-safety + רצועת מוקדי סיוע.
- **שער סופי:** מעבר `ran-bar-zik` + `israeli-appsec` לפני go-live.

---

## 10. סדר וכיוון העבודה  ⭐ (וידוא הסדר)

### Step 0 — תשתית ותנאים מקדימים (לפני קוד)
1. **יצירת Git repo (GitHub)** + `bit init` workspace בתוכו, `defaultScope = helemclub`, commit ראשון.  ← הצעד הראשון בביצוע.
2. **סודות/env** (§2): `MONGO_URL` (מ-hopeAI), Google OAuth, Resend, Cloudinary, session secret, admin seed. `.env` ב-`.gitignore` + Bit Cloud env.
3. **אישור שכבת Mongo מול hopeAI** (§8) — sign-off לפני backend work.
4. **Ripple CI** מחובר ל-PRs (build/test אוטומטי).

### Steps 1–9 — הבנייה
בונים לפי ה-DAG (design → platform → knowledge-domains → toolbox → mentors). כל שלב = branch → PR → ביקורת hopeAI → merge.

| # | שלב | מה נוחת | שער |
|---|---|---|---|
| 1 | Design foundation | theme + dev env, heading, paragraph, link, button, card, layout, spinner | — |
| 2 | Form & feedback primitives | field, input, textarea, select, checkbox, steps, modal, toast, dropdown | — |
| 3 | Content & data primitives | badge, tag, avatar, icon, logo, image, star rating, empty state, table, tabs | — |
| 4 | **Platform shell + auth + מודל מודרציה** | header, footer, user bar, layout, **auth (Google+סיסמה) + roles + guards**, home/login/signup, קונסולת אדמין, platform aspect, Harmony app | **✅ שער Shachar — להתחבר ולנסות** |
| 5 | Coping domains | domain entity, counts, hide-when-empty, filter + tag picker | — |
| 6 | App catalog | קטלוג, עמוד פירוט בסגנון App Store, גלריה, סיכום דירוג, תגובות, click tracking | — |
| 7 | Submission & approval | טופס הגשה, preview, my-submissions, תור אדמין, מסך ביקורת, **התראות מייל** | — |
| 8 | Community wishlist | רעיונות, upvote, claims, fulfillment + קרדיט, content-safety, toolbox aspect | — |
| 9 | Mentors | מדריך, פרופיל, בקשה, my-application, תור+ביקורת, mentors aspect, cross-linking | — |

**כיוון ומקביליות:**
- שלבים 1–3 (primitives ב-`design`) הם התשתית של כל השאר — קודם.
- שלב 4 חייב את 1–3 + את סודות/Mongo של Step 0.
- אחרי שלב 4: 5 קודם (domains), ואז **6–7 (toolbox) ו-9 (mentors) יכולים לרוץ במקביל** בברנצ'ים/lanes נפרדים, כי mentors תלוי ב-toolbox רק ל-cross-linking (שלב אחרון בתוך 9).
- **שער בודד לבדיקה ידנית של Shachar אחרי שלב 4** — הנקודה הראשונה שאפשר להתחבר. פרטי admin ל-seed נחשפים שם.

**Demo data ל-seed:** הקטלוג/תגובות/תגיות של הפרוטוטייפ, אפליקציה מאושרת אחת שמקרדטת רעיון wishlist, שתי הגשות pending, שישה מנטורים דוברי עברית בתחומים שונים, ושתי בקשות מנטור pending — כדי ששני התורים demoable בהרצה ראשונה.

---

## 11. שאלות פתוחות / הנחות לאישור

**ל-hopeAI (Mongo + תשתית):**
1. מה כבר קיים ב-Atlas? DB משותף או per-aspect? (§8)
2. connection pooling ב-gateway — מי מנהל?
3. cookie session מול JWT (§9)?
4. `claim` שפג מטופל on-read בלי cron — קביל? (§8)

**ל-Shachar (מוצר) — הוחלט, ניתן לשנות:**
5. חלון claim 60 יום, auto-expire.
6. מנטורים מקשרים החוצה, CTA מאחורי login — אין תיאום on-platform.
7. קונסולת אדמין אחת מאוחדת.
8. מגישים עורכים ומגישים מחדש כל מה שחזר changes-requested.
9. רעיונות wishlist עולים מיד (spam + content-safety), רק apps/mentors ב-gate מלא.
10. חשבון חדש = `member`; admin מוקצה, לא self-served.
11. עריכת פרופיל מנטור חוזרת ל-review רק בשינוי מהותי.
12. ספק מייל = Resend (swappable).

---

*מסמך זה ממתין לביקורת hopeAI (מעגל 1) לפני כל ביצוע. אחרי sign-off: Step 0 (repo + env + אישור Mongo), ואז בנייה שלב-שלב ב-PRs.*
