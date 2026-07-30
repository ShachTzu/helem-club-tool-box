import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { InstallPrompt } from './install-prompt.js';

function dispatchMockInstallPrompt() {
  const mockEvent = new Event(`beforeinstallprompt`, { cancelable: true }) as Event & {
    prompt?: () => Promise<void>;
    userChoice?: Promise<{ outcome: string; platform: string }>;
  };

  mockEvent.prompt = () => Promise.resolve();
  mockEvent.userChoice = Promise.resolve({ outcome: `accepted`, platform: `web` });

  window.dispatchEvent(mockEvent);
}

export const BasicInstallPrompt = () => {
  useEffect(() => {
    const timer = window.setTimeout(() => dispatchMockInstallPrompt(), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MemoryRouter>
      <div style={{ position: `relative`, height: 320, background: `#F6F8FA`, overflow: `hidden` }}>
        <InstallPrompt />
      </div>
    </MemoryRouter>
  );
};

export const InstallPromptWithCallbacks = () => {
  useEffect(() => {
    const timer = window.setTimeout(() => dispatchMockInstallPrompt(), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MemoryRouter>
      <div style={{ position: `relative`, height: 320, background: `#F6F8FA`, overflow: `hidden` }}>
        <InstallPrompt
          storageKey="install-prompt-composition-callbacks"
          onInstall={(outcome) => window.alert(`תוצאה: ${outcome}`)}
          onDismiss={() => window.alert(`הבאנר נסגר`)}
        />
      </div>
    </MemoryRouter>
  );
};

export const CustomAppInstallPrompt = () => {
  useEffect(() => {
    const timer = window.setTimeout(() => dispatchMockInstallPrompt(), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MemoryRouter>
      <div style={{ position: `relative`, height: 320, background: `#0B1A30`, overflow: `hidden` }}>
        <InstallPrompt
          storageKey="install-prompt-composition-custom"
          appName="ארגז הכלים של הלם קלאב"
          description="התקינו עכשיו וקבלו גישה מיידית לתרגילי נשימה, מאמרים ותמיכה קהילתית — גם במצב לא מקוון."
        />
      </div>
    </MemoryRouter>
  );
};
