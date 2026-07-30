import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InstallPrompt } from './install-prompt.js';
import styles from './install-prompt.module.scss';

function createMockBeforeInstallPromptEvent(outcome: `accepted` | `dismissed` = `accepted`) {
  const mockEvent = new Event(`beforeinstallprompt`, { cancelable: true }) as Event & {
    prompt?: () => Promise<void>;
    userChoice?: Promise<{ outcome: string; platform: string }>;
  };

  mockEvent.prompt = () => Promise.resolve();
  mockEvent.userChoice = Promise.resolve({ outcome, platform: `web` });

  return mockEvent;
}

it(`renders nothing before the beforeinstallprompt event fires`, () => {
  const { container } = render(
    <MemoryRouter>
      <InstallPrompt storageKey="install-prompt-spec-initial" />
    </MemoryRouter>
  );

  expect(container.querySelector(`.${styles.installPrompt}`)).toBeNull();
});

it(`shows the banner once the beforeinstallprompt event fires`, async () => {
  const { container } = render(
    <MemoryRouter>
      <InstallPrompt storageKey="install-prompt-spec-show" />
    </MemoryRouter>
  );

  await act(async () => {
    window.dispatchEvent(createMockBeforeInstallPromptEvent());
  });

  const banner = container.querySelector(`.${styles.installPrompt}`);
  expect(banner).toBeTruthy();
  expect(banner?.textContent).toContain(`הלם קלאב`);
});

it(`hides the banner and remembers the dismissal when the close button is clicked`, async () => {
  const { container } = render(
    <MemoryRouter>
      <InstallPrompt storageKey="install-prompt-spec-dismiss" />
    </MemoryRouter>
  );

  await act(async () => {
    window.dispatchEvent(createMockBeforeInstallPromptEvent());
  });

  const closeButton = container.querySelector(`.${styles.closeButton}`) as HTMLButtonElement;
  fireEvent.click(closeButton);

  expect(container.querySelector(`.${styles.installPrompt}`)).toBeNull();
  expect(window.localStorage.getItem(`install-prompt-spec-dismiss`)).toBe(`true`);
});

it(`calls onDismiss when the close button is clicked`, async () => {
  let dismissed = false;
  const { container } = render(
    <MemoryRouter>
      <InstallPrompt storageKey="install-prompt-spec-callback" onDismiss={() => { dismissed = true; }} />
    </MemoryRouter>
  );

  await act(async () => {
    window.dispatchEvent(createMockBeforeInstallPromptEvent());
  });

  const closeButton = container.querySelector(`.${styles.closeButton}`) as HTMLButtonElement;
  fireEvent.click(closeButton);

  expect(dismissed).toBe(true);
});

it(`calls onInstall with the user's choice when the install button is clicked`, async () => {
  let reportedOutcome: string | undefined;
  const { container } = render(
    <MemoryRouter>
      <InstallPrompt
        storageKey="install-prompt-spec-install"
        onInstall={(outcome) => { reportedOutcome = outcome; }}
      />
    </MemoryRouter>
  );

  await act(async () => {
    window.dispatchEvent(createMockBeforeInstallPromptEvent(`accepted`));
  });

  const installButton = Array.from(container.querySelectorAll(`button`)).find((button) =>
    button.textContent?.includes(`התקנה`)
  ) as HTMLButtonElement;

  await act(async () => {
    fireEvent.click(installButton);
  });

  expect(reportedOutcome).toBe(`accepted`);
});

it(`renders a custom app name and description when provided`, async () => {
  const { container } = render(
    <MemoryRouter>
      <InstallPrompt
        storageKey="install-prompt-spec-custom"
        appName="ארגז הכלים"
        description="תיאור מותאם אישית"
      />
    </MemoryRouter>
  );

  await act(async () => {
    window.dispatchEvent(createMockBeforeInstallPromptEvent());
  });

  const banner = container.querySelector(`.${styles.installPrompt}`);
  expect(banner?.textContent).toContain(`ארגז הכלים`);
  expect(banner?.textContent).toContain(`תיאור מותאם אישית`);
});
