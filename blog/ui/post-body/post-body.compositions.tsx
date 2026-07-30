import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { PostBody } from './post-body.js';

const richBody = `
<p>כמעט כל מי שחי עם פוסט-טראומה מכיר את הרגע הזה: הגוף נדרך, הנשימה מתקצרת, והעולם מרגיש פתאום מסוכן יותר משהיה רגע לפני. אלה טריגרים - וגם אם אי אפשר תמיד למנוע אותם, אפשר ללמוד להכיר אותם ולבנות ארגז כלים אישי.</p>
<h2>לזהות את הסימנים המוקדמים</h2>
<p>לרוב יש רגע, שנייה או שתיים, שבהן הגוף כבר יודע לפני המחשבה. ללמוד לזהות את הסימנים האלה הוא הצעד הראשון - הוא מאפשר לעצור לפני שההצפה משתלטת לגמרי.</p>
{{image:https://storage.googleapis.com/bit-generated-images/images/image_a_warm__calming_editorial_phot_0_1785198010549.png|מפגש קהילתי תומך בשעת שקיעה}}
<p>אחד הכלים הפשוטים והיעילים ביותר הוא תרגיל הקרקוע 5-4-3-2-1: לזהות חמישה דברים שרואים, ארבעה ששומעים, שלושה שמרגישים במגע, שניים שמריחים ואחד שטועמים.</p>
<blockquote>&quot;השיתוף עצמו הוא חלק מהריפוי - כשמישהו אחר מרגיש פחות לבד, גם אנחנו.&quot;</blockquote>
<p>מלבד תרגילי קרקוע, יש היום גם כלים דיגיטליים שיכולים ללוות אתכם ברגעים כאלה:</p>
{{app:ground-me}}
<p>אין דרך אחת נכונה להתמודד. מה שעוזר לאחד לא בהכרח יעבוד לשני, ולכן חשוב לבנות ארגז כלים אישי.</p>
`;

const simpleBody = `
<p>יומן רגשי יומי הוא כלי פשוט שיכול לעזור לזהות דפוסים וטריגרים לאורך זמן, בלי לחץ ובלי שיפוטיות.</p>
<p>אפשר להתחיל בכמה מילים בכל ערב - איך היה היום, מה הרגשתי, ומה עזר לי.</p>
`;

const bodyWithMultipleApps = `
<p>ריכזנו כאן שני כלים דיגיטליים שהקהילה שלנו ממליצה עליהם במיוחד לימים קשים:</p>
{{app:ground-me}}
<p>וכלי נוסף, שמתאים במיוחד לרגעי חרדה לפני שינה:</p>
{{app:breathe-calm}}
<p>נסו את שניהם ותראו מה עובד יותר טוב עבורכם - אין תשובה אחת נכונה.</p>
`;

export const BasicPostBody = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
        <PostBody body={richBody} embeddedApps={['ground-me', 'breathe-calm']} />
      </div>
    </MockProvider>
  );
};

export const SimplePostBody = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
        <PostBody body={simpleBody} embeddedApps={[]} />
      </div>
    </MockProvider>
  );
};

export const PostBodyWithMultipleEmbeds = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
        <PostBody body={bodyWithMultipleApps} embeddedApps={['ground-me', 'breathe-calm']} />
      </div>
    </MockProvider>
  );
};
