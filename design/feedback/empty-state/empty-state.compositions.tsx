import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { EmptyState } from './empty-state.js';

export const NoSearchResults = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <EmptyState
            title="לא מצאנו כלים מתאימים"
            description="נסו לשנות את מילות החיפוש או להסיר חלק מהמסננים שבחרתם."
            actionLabel="איפוס סינון"
            onAction={() => console.log('reset filters')}
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const EmptyWishlistWithNavigation = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <EmptyState
            title="עדיין לא שמרתם תוכן"
            description="בכל כתבה, כלי או תוכן תמצאו כפתור שמירה. מה שתשמרו יופיע כאן."
            actionLabel="לגלות תוכן"
            actionHref="/toolbox"
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const EmptyStateWithoutAction = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <EmptyState
            title="אין תגובות עדיין"
            description="היו הראשונים להגיב ולשתף את המחשבות שלכם עם הקהילה."
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const EmptyStateWithCustomIcon = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <EmptyState
            icon={<span style={{ fontSize: 48 }}>🔖</span>}
            title="אין אירועים קרובים"
            description="ברגע שיתפרסמו אירועים חדשים בתחום שבחרתם, הם יופיעו כאן."
            actionLabel="לכל האירועים"
            actionHref="/events"
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
