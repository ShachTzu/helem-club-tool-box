# RC — אונבורדינג חברי קהילה + פלטפורמת אישור

ענף: `claude/form-member-onboarding-451813` (worktree נפרד, לא נגע ב‑`main`)

מבוסס על שאלות 1‑9 ו‑12 בטופס המונדיי "בניית ארגון המתנדבים של הלם קלאב".

---

## מה נבנה

**זרימת חבר:** נרשם (מייל או גוגל) → מופנה ל‑`/onboarding` → ממלא 4 מסכים →
עובר לסטטוס "ממתין לאישור" → אדמין מאשר ב‑`/admin/members` → מקבל מייל → חבר קהילה.

**שלושת הסטטוסים** (בדיוק כפי שביקשת, פלוס הבחנה פנימית):

| סטטוס | מה זה | תווית |
|-------|-------|-------|
| `none` | נרשם לאתר, לא מילא את השאלון | לא חבר קהילה |
| `pending` | מילא, מחכה להחלטה | חבר קהילה ממתין לאישור |
| `approved` | אושר | חבר קהילה |
| `rejected` | נדחה או שבוטלה חברותו | לא חבר קהילה |

`none` ו‑`rejected` נראים אותו דבר כלפי חוץ, אבל אדמין חייב להבדיל ביניהם —
"עוד לא מילא" זה לא "החלטנו שלא".

**מייל וגוגל — אותו מסלול בדיוק.** האשף אחד, וכל מה שכבר ידוע על החשבון מולא מראש:
מגוגל מגיעים שם ומייל, ממייל מגיע רק מייל. שום דבר בקוד לא מתפצל לפי דרך ההרשמה.

---

## הקבצים

**קומפוננטה חדשה — `helemclub.platform/membership`** (`platform/membership/`)
אוסף `memberprofiles` נפרד + GraphQL + החלטות האדמין.

**קומפוננטה חדשה — `helemclub.platform/admin/approve-members`** (`platform/admin/approve-members/`)
פאנל האישור, נרשם אוטומטית ל‑`/admin/members` בדשבורד הקיים.

**קבצים ששונו:**
- `platform/hooks/use-onboarding` — היה localStorage, עכשיו GraphQL.
- `platform/ui/onboarding-wizard` — שאלות אמיתיות במקום ה‑placeholder.
- `platform/pages/onboarding-page` — מסך "ממתין לאישור" אחרי שליחה.
- `platform/helam/helam.bit-app.ts` — רישום ה‑aspect.

**לא נגעתי** באף קובץ של hopeAI (`user.model.ts`, `user-repository.ts`,
`helam-platform.node.runtime.ts`, `helam-platform.graphql.ts`, `hooks/use-auth`,
`onboarding-gate.tsx`). ה‑gate שלה ממשיך לעבוד כמו שהוא — `useOnboarding().completed`
נשאר אותו חוזה, רק המקור השתנה.

---

## פרטיות

שאלות 8 ו‑9 (פציעה, הכרה בביטוח לאומי) הן **מידע רפואי**. לכן:

- אוסף נפרד, לא שדות על רשומת המשתמש.
- שני טיפוסי GraphQL בלבד: `MyMembership` (הסטטוס והשם של עצמך) ו‑`AdminMemberProfile`
  (הכול, אדמין בלבד). אין שאילתה ציבורית שמגיעה לשם.
- הבעלים של פרופיל נלקח תמיד מה‑session, אף פעם לא מהקלט — אין דרך לכתוב על פרופיל של
  מישהו אחר (אותו דפוס IDOR‑safe כמו בטיוטות של ארגז הכלים).
- הפאנל מוגבל ל‑`admin` בלבד — מחמיר יותר מתור המודרציה של ארגז הכלים, שגם מודרטור נכנס אליו.
- אין `registerSeed` — לזרוע פרופילים מומצאים זה להמציא פציעות ומספרי טלפון.

---

## מה צריך להריץ (בתיקיית העבודה הראשית, לא ב‑worktree)

הקומפוננטות החדשות עדיין לא רשומות ב‑Bit — אין `node_modules` ב‑worktree אז לא יכולתי.

```bash
export PATH="$HOME/bin:$PATH"
bit add platform/membership --id membership --scope helemclub.platform --env bitdev.symphony/envs/symphony-env
bit add platform/admin/approve-members --id admin/approve-members --scope helemclub.platform --env helemclub.design/envs/helam-env
bit install
bit compile
bit check-types helemclub.platform/membership helemclub.platform/admin/approve-members
bit test helemclub.platform/membership helemclub.platform/admin/approve-members helemclub.platform/hooks/use-onboarding helemclub.platform/ui/onboarding-wizard helemclub.platform/pages/onboarding-page
```

⚠️ לוודא שגרסת ה‑`helam-env` תואמת לשאר הקומפוננטות (`bit envs`) — פין שגוי שובר את
בניית הקפסולה.

**מה שכן נבדק כאן:** typecheck מלא (strict) על כל הקבצים החדשים והמשונים — נקי.
**מה שלא:** הרצה חיה. אין `MONGO_URL` אצלי, כרגיל — זה עובר ל‑hopeAI.

---

## מה שנשאר להחלטה שלך

**האם חברות מאושרת חוסמת הגשה לארגז הכלים?**
כרגע **לא** — `/toolbox/submit` עדיין דורש רק התחברות, כמו היום. לא שיניתי את זה
כי משתתפי האקתון 1 כבר בזרימה, ונעילה פתאומית תחסום אותם באמצע.
זה מתג של שורה אחת (`useOnboarding().isMember` כבר קיים ומחזיר את התשובה).
תגידי מילה ואני מחבר.

**שאלות 10‑11 (מקצוע, עולמות תוכן)** — לא נכללו, ביקשת 1‑9 ו‑12. שדה של דקה להוסיף.

**מסך "תחומי עניין"** נשאר כמסך רביעי — הוא כבר היה שם והפלטפורמה מתאימה תוכן לפיו,
למחוק אותו זה שינוי גדול יותר מלהשאיר. אם הוא מיותר, אומרים ומורידים.
