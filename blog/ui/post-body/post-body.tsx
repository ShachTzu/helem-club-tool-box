import React from 'react';
import classNames from 'classnames';
import { Image } from '@helemclub/design.content.image';
import { AppEmbedBlock } from '@helemclub/toolbox.ui.app-embed-block';
import styles from './post-body.module.scss';

type PostBodySegment =
  | { kind: 'html'; content: string }
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'app'; appId: string };

const EMBED_PATTERN = /\{\{(app|image):([^}]+)\}\}/g;

const DEFAULT_EMBEDDED_APPS = ['ground-me', 'breathe-calm'];

const DEFAULT_BODY = `
<p>כמעט כל מי שחי עם פוסט-טראומה מכיר את הרגע הזה: הגוף נדרך, הנשימה מתקצרת, והעולם מרגיש פתאום מסוכן יותר משהיה רגע לפני. אלה טריגרים - וגם אם אי אפשר תמיד למנוע אותם, אפשר ללמוד להכיר אותם ולבנות ארגז כלים אישי שעוזר לעבור אותם בשלום.</p>
<p>בכתבה הזו ריכזנו כמה תובנות מתוך שיחות עם חברי הקהילה ועם אנשי מקצוע, יחד עם כלים דיגיטליים שיכולים לעזור ברגע האמת.</p>
<h2>לזהות את הסימנים המוקדמים</h2>
<p>לרוב יש רגע, שנייה או שתיים, שבהן הגוף כבר יודע לפני המחשבה. דופק שעולה, כפות ידיים קרות, תחושת צמצום בשדה הראייה. ללמוד לזהות את הסימנים האלה הוא הצעד הראשון - הוא מאפשר לעצור לפני שההצפה משתלטת לגמרי.</p>
{{image:https://storage.googleapis.com/bit-generated-images/images/image_a_warm__calming_editorial_phot_0_1785198010549.png|מפגש קהילתי תומך בשעת שקיעה}}
<p>אחד הכלים הפשוטים והיעילים ביותר הוא תרגיל הקרקוע 5-4-3-2-1: לזהות חמישה דברים שרואים, ארבעה ששומעים, שלושה שמרגישים במגע, שניים שמריחים ואחד שטועמים. זה נשמע פשוט, אבל בפועל זה מחזיר את תשומת הלב לרגע הנוכחי, הרחק מהזיכרון שמציף.</p>
<blockquote>&quot;השיתוף עצמו הוא חלק מהריפוי - כשמישהו אחר מרגיש פחות לבד, גם אנחנו.&quot;</blockquote>
<p>מלבד תרגילי קרקוע, יש היום גם כלים דיגיטליים שיכולים ללוות אתכם ברגעים כאלה - אפליקציה שפתוחה תמיד בכיס, עם תרגיל מוכן ברגע שצריך אותו:</p>
{{app:ground-me}}
<h2>נשימה כעוגן</h2>
<p>נשימה איטית ומודעת היא אחד הכלים הזמינים ביותר שיש לנו, אבל דווקא ברגעי הצפה קשה לזכור להשתמש בה. תרגול קבוע, גם בימים ה&quot;רגילים&quot;, בונה הרגל שהגוף יזכור גם ברגעים הקשים.</p>
{{app:breathe-calm}}
<p>אין דרך אחת נכונה להתמודד. מה שעוזר לאחד לא בהכרח יעבוד לשני, ולכן חשוב לבנות ארגז כלים אישי - ולזכור שגם לבקש עזרה, זה כלי.</p>
`;

function parseBody(body: string): PostBodySegment[] {
  const segments: PostBodySegment[] = [];
  const regex = new RegExp(EMBED_PATTERN);
  let lastIndex = 0;
  let match = regex.exec(body);

  while (match !== null) {
    if (match.index > lastIndex) {
      const html = body.slice(lastIndex, match.index);
      if (html.trim().length > 0) segments.push({ kind: 'html', content: html });
    }

    const [, embedKind, data] = match;
    if (embedKind === 'app') {
      segments.push({ kind: 'app', appId: data.trim() });
    } else {
      const [src, alt] = data.split('|');
      segments.push({ kind: 'image', src: (src || '').trim(), alt: (alt || '').trim() });
    }

    lastIndex = regex.lastIndex;
    match = regex.exec(body);
  }

  if (lastIndex < body.length) {
    const html = body.slice(lastIndex);
    if (html.trim().length > 0) segments.push({ kind: 'html', content: html });
  }

  return segments;
}

export type PostBodyProps = {
  /**
   * rich text body of the post, as html markup. supports inline embed
   * markers: `{{image:URL|ALT}}` for images and `{{app:APP_ID}}` for
   * toolbox app embeds.
   */
  body?: string;

  /**
   * toolbox app ids allowed to resolve as inline embeds. app markers
   * referencing ids outside this list are skipped.
   */
  embeddedApps?: string[];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * renders a blog post's rich-text body with comfortable Hebrew long-read
 * typography (RTL), inline images and inline toolbox app-embed blocks,
 * resolving embedded app ids against the post's allowed embeddedApps list.
 */
export function PostBody({
  body = DEFAULT_BODY,
  embeddedApps = DEFAULT_EMBEDDED_APPS,
  className,
  style,
}: PostBodyProps) {
  const segments = parseBody(body);

  return (
    <div className={classNames(styles.postBody, className)} style={style}>
      {segments.map((segment, index) => {
        if (segment.kind === 'image') {
          return (
            <div key={`image-${index}`} className={styles.imageBlock}>
              <Image src={segment.src} alt={segment.alt} aspectRatio="16 / 9" rounded="medium" />
            </div>
          );
        }

        if (segment.kind === 'app') {
          const isAllowed = embeddedApps.length === 0 || embeddedApps.includes(segment.appId);
          if (!isAllowed) return null;

          return (
            <div key={`app-${index}`} className={styles.appBlock}>
              <AppEmbedBlock appId={segment.appId} source="blog" />
            </div>
          );
        }

        return (
          <div
            key={`html-${index}`}
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: segment.content }}
          />
        );
      })}
    </div>
  );
}
