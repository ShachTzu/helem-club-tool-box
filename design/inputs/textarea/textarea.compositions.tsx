import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Textarea } from './textarea.js';

export const BasicTextarea = () => {
  const [value, setValue] = useState(``);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 24, maxWidth: 480 }}>
          <Textarea
            label="הוספת תגובה"
            placeholder="מה עלה לך מהכתבה? כתבו בעדינות ובכבוד..."
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            maxLength={800}
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const TextareaWithError = () => {
  const [value, setValue] = useState(`רעיון קצר מדי`);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 24, maxWidth: 480 }}>
          <Textarea
            label="תיאור הרעיון"
            required
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            error="התיאור חייב לכלול לפחות 30 תווים"
            placeholder="תארו את הרעיון — איזו בעיה הוא פותר ולמי הוא עוזר"
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const AutoGrowArticleTextarea = () => {
  const [value, setValue] = useState(
    `פתחתי את הבוקר עם תרגול נשימה קצר, וזה שינה לי את כל היום. רציתי לשתף את החוויה עם הקהילה כדי שגם אחרים ינסו.`
  );

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 24, maxWidth: 560 }}>
          <Textarea
            label="גוף הכתבה"
            helperText="ניתן להרחיב חופשי — השדה גדל אוטומטית עם הטקסט"
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            minRows={4}
            maxRows={12}
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
