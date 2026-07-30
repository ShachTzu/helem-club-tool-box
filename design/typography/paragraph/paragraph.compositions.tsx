import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Paragraph } from './paragraph.js';

const articleBody = `כשהתחלנו לבנות את הלם קלאב, רצינו ליצור מרחב שבו אפשר לדבר בגלוי על החוויה שאחרי הטראומה - בלי שיפוטיות ובלי צורך להסביר את עצמך מההתחלה. הקהילה שלנו כוללת בוגרי קרב, ניצולי אירועים קשים ובני משפחה, וכולם מוזמנים לשתף, לשאול ולתמוך.`;

const longBody = `התהליך הטיפולי הוא לעיתים ארוך ולא ליניארי. יש ימים טובים ויש ימים קשים, ולכן חשוב לבנות מערכת תמיכה שמבינה את זה. בהלם קלאב פיתחנו כלים דיגיטליים שמלווים את החברים לאורך הדרך: מיומן רגשי יומי, דרך קבוצות תמיכה מקוונות, ועד ספריית תוכן מקצועית שנכתבה בשיתוף פסיכולוגים ואנשי מקצוע.

אנחנו מאמינים שידע הוא כוח, ושהשיתוף בין חברי הקהילה יכול לקצר את הדרך עבור מי שרק מתחיל את המסע שלו.`;

export const BasicParagraph = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 32, maxWidth: 640 }}>
        <Paragraph>{articleBody}</Paragraph>
      </div>
    </MemoryRouter>
  );
};

export const ParagraphSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 32, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Paragraph size="lg">פסקה בגודל גדול - מתאימה לפתיחת כתבה או תקציר בולט.</Paragraph>
        <Paragraph size="md">פסקה בגודל בינוני - גודל ברירת המחדל לגוף כתבה רגיל.</Paragraph>
        <Paragraph size="sm">פסקה בגודל קטן - מתאימה להערות שוליים או מידע משני.</Paragraph>
      </div>
    </MemoryRouter>
  );
};

export const MutedArticleParagraph = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 32, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Paragraph>{longBody.split('\n\n')[0]}</Paragraph>
        <Paragraph muted size="sm">
          פורסם על ידי צוות הלם קלאב · 6 דקות קריאה · עודכן לאחרונה השבוע
        </Paragraph>
      </div>
    </MemoryRouter>
  );
};
