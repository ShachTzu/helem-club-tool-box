import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { NotFoundPage } from './not-found-page.js';

export const BasicNotFoundPage = () => {
  return (
    <MockProvider>
      <NotFoundPage />
    </MockProvider>
  );
};

export const CustomMessageNotFoundPage = () => {
  return (
    <MockProvider>
      <NotFoundPage
        title="לא מצאנו את הדומיין הזה"
        message="ייתכן שהקישור שגוי או שהתחום הוסר מהמאגר. אפשר לחזור לדף הבית ולנסות שוב מהתפריט."
        homeLabel="לדף הבית"
      />
    </MockProvider>
  );
};

export const NotFoundPageWithCallback = () => {
  return (
    <MockProvider>
      <NotFoundPage
        title="הדף לא נמצא"
        homeLabel="קחו אותי הביתה"
        onNavigateHome={() => console.log(`navigating home`)}
      />
    </MockProvider>
  );
};
