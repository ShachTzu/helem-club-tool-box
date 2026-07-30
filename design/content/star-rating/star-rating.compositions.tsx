import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { StarRating } from './star-rating.js';

export const ReadOnlyAverageRating = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StarRating value={4.5} ratingCount={128} showValue />
        <StarRating value={3.2} ratingCount={57} showValue size={22} />
        <StarRating value={5} ratingCount={9} showValue size={14} />
      </div>
    </MemoryRouter>
  );
};

export const AppRatingSummary = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          padding: 24,
          background: 'var(--colors-surface-primary)',
          borderRadius: 'var(--borders-radius-medium)',
          maxWidth: 320,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: 'var(--colors-primary-default)' }}>4.6</div>
          <StarRating value={4.6} size={18} />
          <div style={{ fontSize: 13, color: 'var(--colors-text-muted)', marginTop: 4 }}>312 מדרגים</div>
        </div>
      </div>
    </MemoryRouter>
  );
};

export const InteractiveRatingInput = () => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <MemoryRouter>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
        <p style={{ margin: 0, fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-primary)' }}>
          איך הייתה חוויתכם עם האפליקציה?
        </p>
        <StarRating
          value={rating}
          interactive
          size={28}
          onChange={(newValue) => {
            setRating(newValue);
            setSubmitted(true);
          }}
        />
        {submitted && (
          <span style={{ fontSize: 13, color: 'var(--colors-status-positive-default)' }}>
            תודה! דירגתם {rating} מתוך 5
          </span>
        )}
      </div>
    </MemoryRouter>
  );
};

export const DisabledInteractiveRating = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24 }}>
        <StarRating value={3} interactive disabled size={26} />
      </div>
    </MemoryRouter>
  );
};
