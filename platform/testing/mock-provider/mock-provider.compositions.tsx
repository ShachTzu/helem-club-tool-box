import React from 'react';
import { Link } from 'react-router-dom';
import { MockProvider } from './mock-provider.js';
import { useIsMock } from './use-is-mock.js';

export const BasicMockProvider = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <h2>שלום, קהילת הלם קלאב!</h2>
        <p>הרכיב עטוף בנתב, ב-Apollo MockedProvider ובעיצוב של הלם קלאב (RTL).</p>
      </div>
    </MockProvider>
  );
};

export const MockProviderWithNavigation = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <h2>ניווט לדוגמה</h2>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/domains">דומיינים</Link>
          <Link to="/events">אירועים</Link>
          <Link to="/blog">בלוג</Link>
        </nav>
      </div>
    </MockProvider>
  );
};

const IsMockIndicator = () => {
  const isMock = useIsMock();
  return <p>מצב הדמיה פעיל: {isMock ? 'כן' : 'לא'}</p>;
};

export const MockProviderIsMockIndicator = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <h2>בדיקת מצב הדמיה</h2>
        <IsMockIndicator />
      </div>
    </MockProvider>
  );
};
