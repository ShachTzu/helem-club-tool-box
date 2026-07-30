import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { AuthorByline } from './author-byline.js';

export const BasicAuthorByline = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 480 }}>
        <AuthorByline
          authorName="ד״ר מיכל ברק"
          authorPhoto="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
          date="12 במאי 2026"
          readTime="6 דק׳ קריאה"
        />
      </div>
    </MockProvider>
  );
};

export const AuthorBylineWithBio = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 520 }}>
        <AuthorByline
          authorName="רון אבני"
          authorPhoto="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
          date="28 באפריל 2026"
          readTime="4 דק׳ קריאה"
          bio="מתמודד ופעיל קהילתי, כותב על טריגרים וכלים יומיומיים לוויסות רגשי."
          size="lg"
        />
      </div>
    </MockProvider>
  );
};

export const AnonymousAuthorByline = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
        <AuthorByline anonymous date="3 במאי 2026" readTime="9 דק׳ קריאה" size="sm" />
        <AuthorByline
          authorName="תמר גל"
          date="19 באפריל 2026"
          size="md"
        />
      </div>
    </MockProvider>
  );
};
