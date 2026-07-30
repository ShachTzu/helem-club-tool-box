import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './button.js';
import { ArrowIcon } from './arrow-icon.js';
import { TrashIcon } from './trash-icon.js';

export const ButtonVariants = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Button variant="primary">שמור שינויים</Button>
        <Button variant="accent">הצטרפו עכשיו</Button>
        <Button variant="secondary">למדו עוד</Button>
        <Button variant="ghost">ביטול</Button>
        <Button variant="danger">מחיקת חשבון</Button>
      </div>
    </MemoryRouter>
  );
};

export const ButtonSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Button variant="accent" size="sm">
          כפתור קטן
        </Button>
        <Button variant="accent" size="md">
          כפתור בינוני
        </Button>
        <Button variant="accent" size="lg">
          כפתור גדול
        </Button>
      </div>
    </MemoryRouter>
  );
};

export const ButtonWithIconsAndStates = () => {
  const [loading, setLoading] = useState(false);

  return (
    <MemoryRouter>
      <div style={{ padding: 24, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="primary" leadingIcon={<ArrowIcon />}>
          המשך לתשלום
        </Button>
        <Button variant="danger" trailingIcon={<TrashIcon />}>
          מחק פריט
        </Button>
        <Button
          variant="accent"
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          שלח טופס
        </Button>
        <Button variant="secondary" disabled>
          לא זמין כרגע
        </Button>
        <Button variant="primary" href="https://helam.club" external>
          קישור חיצוני
        </Button>
      </div>
    </MemoryRouter>
  );
};
