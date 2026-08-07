# הוראות הפעלה — סיום פיצ'ר "ספריית הידע" (Knowledge Library)

מיועד ל-Claude שעובד בתוך סביבת Bit Cloud (בלי סקילים/אורקסטרציה מיוחדים)

מסמך זה נכתב כך שאפשר לבצע אותו שלב-אחר-שלב, עם פקודות מדויקות
להעתקה-הדבקה ותוצאה צפויה אחרי כל שלב. אין צורך בהבנה מוקדמת של
הפרויקט - כל ההקשר הדרוש נמצא כאן.

**Pull Request** (כל ההיסטוריה, הקוד, ה-diff המלא נמצאים כאן - זו
נקודת העיגון הקבועה בין סשנים):
https://github.com/ShachTzu/helem-club-tool-box/pull/3

תקציר במשפט אחד: פיצ'ר חדש ושלם ("ספריית הידע" - מערכת תוכן
היררכית עם עמוד אדמין) כבר כתוב, נבדק (60/60 טסטים עוברים) ונדחף
ל-GitHub. מה שנשאר לעשות הוא בעיקר עבודת Bit (snap+export) וזריעת
תוכן אמיתי - שני דברים שדורשים גישה לסביבה חיה עם Mongo, ש-Claude
שכתב את זה לא היה לו.

## שלב 0: משיכת הברנץ הנכון

הקוד נמצא ב-branch בשם:

```
claude/knowledge-library-admin-19b540
```

הוא כבר נדחף ל-origin (GitHub: ShachTzu/helem-club-tool-box) ויש
לו Pull Request פתוח: https://github.com/ShachTzu/helem-club-tool-box/pull/3

(אם צריך עוד הקשר על החלטות/דיון - ה-PR הזה נשאר נקודת העיגון
הקבועה גם בסשנים הבאים, גם אם המסמך הזה עצמו יאבד).

```bash
git fetch origin
git checkout claude/knowledge-library-admin-19b540
```

ודאי שאת על ה-lane הנכון של Bit:

```bash
bit lane list
```

אמור להראות "current lane - helemclub.marketplace/helam-club". אם
לא - תעברי אליו:

```bash
bit switch helemclub.marketplace/helam-club
```

## שלב 1: עקיפת prompts אינטראקטיביים של Bit

בפעם הראשונה שמריצים כמעט כל פקודת bit בסביבה חדשה, הוא שואל
אינטראקטיבית "האם לעזור עם אנליטיקס?" ו"האם לשתף שגיאות?" - ואם
מריצים אותו לא-אינטראקטיבית (למשל דרך סקריפט) הוא פשוט נתקע/תלוי
בלי סוף כי הוא מחכה לתשובה שלא מגיעה.

הפתרון שעבד (`bit config set` לא עבד באופן עקבי): להוסיף `CI=true`
לפני כל פקודת bit. למשל:

```bash
CI=true bit status
```

תריצי ככה לכל הפקודות בהמשך המסמך הזה - כל אחת עם קידומת `CI=true`.

## שלב 2: bit install (אם צריך)

אם ה-node_modules לא מעודכן (או שזו סביבה חדשה), תריצי:

```bash
CI=true bit install --skip-import
```

חשוב: תשתמשי בדגל `--skip-import`. בלעדיו, `bit install` מנסה
למשוך אובייקטים מרוחקים (remote objects) עבור סקופים כמו
`helemclub.blog` ו-`helemclub.marketplace`, ובסביבות מסוימות זה נכשל
עם שגיאת "the remote scope X was not found" (כנראה מגבלת רשת/
הרשאות בסנדבוקס מסוים - לא קשור לקוד עצמו). `--skip-import` עוקף
את זה לגמרי ועדיין עושה את החלק החשוב (pnpm install + linking +
compile).

תוצאה צפויה בסוף: "Successfully installed dependencies and
compiled 172 component(s)" (או מספר קרוב).

## שלב 3: אימות שהקוד תקין - compile + test

```bash
CI=true bit compile
```

תוצאה צפויה: "✔ NNN/NNN components compiled successfully" (בלי
שגיאות TypeScript).

אחר כך תריצי את הטסטים של 6 הקומפוננטות של הפיצ'ר החדש (חייבים
לרשום את השמות המדויקים בפסיקים - תבנית עם `**` לא עובדת בפקודות
`bit compile`/`test`, נותנת שגיאת "invalid" - צריך רשימה מפורשת):

```bash
CI=true bit test helemclub.knowledge-library/knowledge-library,helemclub.knowledge-library/entities/knowledge-page,helemclub.knowledge-library/hooks/use-knowledge-pages,helemclub.knowledge-library/admin/manage-knowledge-library,helemclub.knowledge-library/pages/knowledge-library-lobby,helemclub.knowledge-library/pages/knowledge-library-page
```

תוצאה צפויה בדיוק:

```
✔ helemclub.knowledge-library/admin/manage-knowledge-library — 7 passed
✔ helemclub.knowledge-library/entities/knowledge-page — 1 passed
✔ helemclub.knowledge-library/hooks/use-knowledge-pages — 3 passed
✔ helemclub.knowledge-library/knowledge-library — 42 passed
✔ helemclub.knowledge-library/pages/knowledge-library-lobby — 3 passed
✔ helemclub.knowledge-library/pages/knowledge-library-page — 4 passed
✔ 60/60 tests passed across 6 components
```

אם משהו נכשל כאן - תעצרי ותחקרי לפני שממשיכים הלאה. אל תמשיכי
ל-snap/export עם טסטים אדומים.

## שלב 4: בדיקת circular dependencies (חשוב מאוד!)

בסשן הקודם התגלתה כאן בעיה אמיתית: תלות מעגלית בין הקומפוננטה
הראשית (`knowledge-library`) לבין קומפוננטות ה-admin/pages שלה
(היא תלויה בהן כדי לרשום routes, והן היו תלויות בה בחזרה כדי
לקבל טיפוסים). זה כבר תוקן (הטיפוסים הוצאו לקומפוננטה נפרדת
`entities/knowledge-page`), אבל חשוב לוודא שזה עדיין נכון:

```bash
CI=true bit status
```

בפלט, תחפשי סעיף בשם "components with issues". אם `knowledge-library`
מופיע שם עם "circular dependencies" - זו בעיה שחזרה, ואפשר לראות
את השרשרת המדויקת עם:

```bash
CI=true bit deps circular
```

אם זה קורה, תבדקי אם מישהו הוסיף ייבוא (import) חדש בין
`knowledge-library/knowledge-library` לבין אחת מ-admin/hooks/pages -
הכלל הוא: טיפוסים משותפים (`PlainKnowledgePage` וכו') חייבים לבוא
מ-`@helemclub/knowledge-library.entities.knowledge-page`, אף פעם לא
מ-`@helemclub/knowledge-library.knowledge-library` (זה בדיוק מה
שיצר את המעגל בפעם הקודמת).

אם `bit status` לא מראה "components with issues" בכלל עבור
`knowledge-library` - מעולה, אפשר להמשיך.

## שלב 5: bit snap — !! אזהרה קריטית לגבי scope !!

זו הנקודה הכי מסוכנת בכל התהליך. בפעם הקודמת, הרצת `bit snap`
בלי לציין אילו קומפוננטות - עשתה snap לא רק ל-6 הקומפוננטות של
הפיצ'ר הזה, אלא ל-153(!) קומפוננטות בכל הפרויקט (blog, toolbox,
gallery, events, platform וכו') - כי היה במרחב-העבודה "חוב" ישן
של גרסאות ממתינות ל-tag משהו-לא-קשור-לפיצ'ר-הזה. זה נתפס
לפני export (אז זה בוטל בבטחה עם `bit reset` - "exported versions
cannot be reset" אבל גרסאות שלא יוצאו כן אפשר לבטל תמיד).

**הכלל: אף פעם אל תריצי `bit snap` בלי רשימת קומפוננטות מפורשת
בסביבת עבודה משותפת.** תריצי בדיוק ככה (שורה אחת, כל הקומפוננטות
בפסיקים, בלי רווח אחרי כל פסיק):

```bash
CI=true bit snap helemclub.knowledge-library/knowledge-library,helemclub.knowledge-library/entities/knowledge-page,helemclub.knowledge-library/hooks/use-knowledge-pages,helemclub.knowledge-library/admin/manage-knowledge-library,helemclub.knowledge-library/pages/knowledge-library-lobby,helemclub.knowledge-library/pages/knowledge-library-page --message "Knowledge library: hierarchical CMS, admin UI, CSV import, security-reviewed"
```

אחרי שזה רץ - תבדקי את הפלט. אם את רואה רק את 6 השמות של
`knowledge-library` (ואולי "auto-snapped dependents" - קומפוננטות
אחרות שבאמת תלויות בהן, שזה תקין) - מעולה, אפשר להמשיך.

אם את רואה עשרות/מאות קומפוננטות לא-קשורות ב-snap (blog, toolbox,
gallery...) - **עצרי! אל תעשי export.** תריצי:

```bash
CI=true bit reset -s
```

(זה מבטל את כל ה-snap המקומי שעדיין לא יוצא - בטוח לגמרי כל עוד
לא הרצת export). ואז תדווחי לשחר לפני שממשיכים - כנראה יש עוד
"חוב" ישן שצריך לטפל בו בנפרד, לא כחלק מהפיצ'ר הזה.

## שלב 6: bit export

רק אחרי ששלב 5 הצליח נקי (רק הקומפוננטות הרלוונטיות):

```bash
CI=true bit export
```

זה דוחף את הקומפוננטות ל-lane המשותף (`helemclub.marketplace/helam-club`)
בענן של Bit. אחרי זה, אפשר לראות אותן ב-Bit Cloud UI, ומשם באמת
לעבוד איתן (זה השלב שדרש גישה שלא הייתה לקלוד בסביבה המקומית).

## שלב 7: זריעת התוכן האמיתי הראשון (עזרה ראשונה)

זה השלב שדורש אפליקציה חיה עם Mongo אמיתי - בדיוק הדבר שחסר
בסביבה שבה נכתב הקוד. בסביבת Bit Cloud עם ה-preview/dev server
פועל, את יכולה לעשות את זה ידנית דרך ה-UI של האפליקציה:

1. תתחברי כאדמין (role admin/moderator, או שתבקשי משחר להוסיף
   אותך ל-allowlist הפנימי של הפיצ'ר - ראי "הרשאות" בהמשך).

2. תלכי לעמוד האדמין החדש: `/admin/knowledge-library`
   (מופיע בתפריט האדמין תחת השם "ניהול ספריית הידע").

3. בלשונית "עמודים": לחצי "+ עמוד חדש". תמלאי:
   - כותרת: `עזרה ראשונה`
   - עמוד אב: ללא (עמוד עליון)
   - שאר השדות: ריק/ברירת מחדל

   שמרי. זה יוצר את דף הנחיתה העליון של תת-התחום.

4. בלשונית "ייבוא CSV": תצטרכי את קובץ ה-CSV המקורי. הוא לא
   נמצא ב-repo הזה - הוא היה בקובץ מקומי אצל שחר בנתיב
   `Documents/Codex/2026-08-06/.../outputs/helem_ptsd_pages.csv`
   (6 שורות תוכן על "מה זה פוסט טראומה והאם יש לי כזו?").
   אם הקובץ הזה לא זמין לך - תבקשי משחר להעלות אותו.

   העמודות הצפויות בקובץ (headers מדויקים, חשוב שיהיו בדיוק ככה):
   `Text, Image filename, Video HTML embed, Video URL (YouTube/Spotify),
   Date, Current page title, Current page URL, Parent page title (hierarchy)`

   בשורה זו את גם צריכה את קבצי התמונה שה-CSV מפנה אליהם בעמודת
   "Image filename" (אם יש כאלה - בדוגמה המקורית עמודה זו הייתה
   ריקה בכל השורות, אז יכול להיות שאין צורך בתמונות בכלל).

5. בעמוד הייבוא: תגררי/תבחרי את קובץ ה-CSV, ואת קבצי התמונה (אם
   יש). בשדה "עמוד-אב עליון לכל האצווה" - תבחרי "עזרה ראשונה"
   (העמוד שיצרת בשלב 3). לחצי "הרצת ייבוא".

6. תבדקי את סיכום הייבוא שמופיע: אמור לכתוב "נוצרו עמודי-אב
   חדשים: מה זה פוסט טראומה והאם יש לי כזו?" (הסדרה נוצרת
   אוטומטית מהעמודה "Parent page title" בקובץ), ו-"6 עמודים
   נוצרו" (הפרקים).

7. תבדקי בצד הציבורי: `/knowledge-library` אמורה להראות אריח
   "עזרה ראשונה", לחיצה עליו מובילה לסדרה עם 6 הפרקים, וכל פרק
   מציג את הטקסט + תאריך + ניווט "פרק קודם/הבא".

## שלב 8: תמונת הפרופיל של "הלם קלאב" (לא חוסם, אפשר לדלג)

כרגע כל תוכן בספריית הידע מוצג עם שם המחבר "הלם קלאב" אבל בלי
תמונה אמיתית (רק ראשי-תיבות, fallback אוטומטי של קומפוננטת
`Avatar`). כדי להוסיף תמונה אמיתית:

1. צריך גישה ל-`CLOUDINARY_URL` (אותו סוד ששחר/hopeAI מחזיקות,
   לא נמצא בסביבה שכתבה את הקוד).

2. יש כבר קובץ תמונה מוכן ומוקטן (480 פיקסל רוחב, מקור היה
   3134×2062) בנתיב `docs/assets/helem-club-author.png`
   (זה האיור של דמויות מטפסות בהר עם סלע - נבחר במפורש ע"י שחר
   בשיחה הקודמת בתור אווטאר ל"הלם קלאב").

3. תעלי את הקובץ הזה ל-Cloudinary (או כל host אחר), ותקבלי URL.

4. תעדכני את הקבוע בקובץ
   `knowledge-library/entities/knowledge-page/knowledge-page.ts`
   את השורה:
   ```ts
   export const HELEM_CLUB_AVATAR_URL: string | undefined = undefined;
   ```
   ל:
   ```ts
   export const HELEM_CLUB_AVATAR_URL: string | undefined = 'https://.../the-real-url.png';
   ```

5. תריצי שוב bit compile + bit test (שלב 3), ואז snap+export
   מחדש רק לקומפוננטה הזו (או לכל 6 הקומפוננטות, זה תקין):

   ```bash
   CI=true bit snap helemclub.knowledge-library/entities/knowledge-page --message "Add הלם קלאב avatar URL"
   CI=true bit export
   ```

## נספח א: הרשאות - מי יכול לנהל את ספריית הידע

יש שתי דרכים לקבל גישה לעמוד האדמין:

1. תפקיד גלובלי `moderator` או `admin` (התפקיד הרגיל במערכת).
2. הרשמה ל-allowlist הפנימי של הפיצ'ר הזה (`KnowledgeLibraryEditor`) -
   מיועד למישהו שצריך לנהל רק את ספריית הידע, בלי הרשאות מנהל
   כלליות. רק `admin` יכול להוסיף/להסיר משתמשים מהרשימה הזו, דרך
   לשונית "הרשאות" בעמוד האדמין (מוצגת רק ל-admin), או ישירות
   ב-GraphQL עם ה-mutation `grantKnowledgeLibraryEditor(userId: "...")`
   (`userId` הוא ה-id של המשתמש במערכת, לא האימייל).

## נספח ב: קבצים חשובים לעיון נוסף

- `docs/superpowers/specs/2026-08-06-knowledge-library-design.md` -
  מסמך העיצוב המלא: כל ההחלטות, למה נבחרה כל צורה, מה נדחה
  ולמה. שווה לקרוא אם יש שאלה "למה זה בנוי ככה".
- `docs/release-candidates/knowledge-library.md` -
  סיכום ה-Release Candidate: מה נשלח, מה נבדק, מה לא נבדק,
  סיכונים ידועים, rollback.
- היסטוריית ה-commits בברנץ (`git log --oneline`) - כל commit מתעד
  בדיוק מה נעשה ולמה, כולל שני באגים אמיתיים שנתפסו ותוקנו
  (חשיפת תוכן מוסתר ב-API הציבורי, ותלות מעגלית).

## נספח ג: מה **לא** לעשות

- אל תריצי `bit snap` בלי רשימת קומפוננטות מפורשת (ראי שלב 5).
- אל תיגעי בקבצים `platform/entities/user/user.ts` או
  `platform/helam-platform/user.model.ts` - אלה בבעלות בלעדית של
  hopeAI, והפיצ'ר הזה נבנה במכוון כדי לא לגעת בהם בכלל.
- אל תשני את `embed-allowlist.ts` (הבודק הבטיחותי לקוד הטמעה של
  YouTube/Spotify) בלי להריץ מחדש את 17 הטסטים שלו - זו הנקודה
  היחידה בפיצ'ר שבאמת יכולה ליצור פרצת אבטחה (XSS) אם משהו שם
  משתנה בטעות.
- אל תוסיפי שדה אמיתי (email/id/מספרים) לטבלת `KnowledgeLibraryEditor`
  מעבר ל-`userId` עצמו - היא נשארת בכוונה "רשימה חשופה" מינימלית.
