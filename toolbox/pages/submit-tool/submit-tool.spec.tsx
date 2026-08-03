import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { SubmitTool } from './submit-tool.js';
import styles from './submit-tool.module.scss';

const MOCK_MEMBER_USER = {
  id: `user-1`,
  displayName: `דנה לוי`,
  email: `dana@example.com`,
  role: `member` as const,
  provider: `google` as const,
  createdAt: `2024-01-01T00:00:00.000Z`,
};

const MOCK_DOMAINS = [
  { id: `anxiety`, slug: `anxiety`, name: `חרדה`, icon: `😰`, count: 5 },
  { id: `sleep`, slug: `sleep`, name: `שינה`, icon: `🌙`, count: 4 },
];

it('should render the submission form title for a signed-in member', () => {
  const { container } = render(
    <MockProvider>
      <SubmitTool mockUser={MOCK_MEMBER_USER} mockDomains={MOCK_DOMAINS} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toContain(`הצעת כלי לארגז הכלים`);
});

it('should not render the form for a signed-out visitor', () => {
  const { container } = render(
    <MockProvider>
      <SubmitTool mockUser={null} mockDomains={MOCK_DOMAINS} />
    </MockProvider>
  );

  const card = container.querySelector(`.${styles.card}`);
  expect(card).toBeFalsy();
});

it('should show a validation error when submitting an empty form', () => {
  const { container } = render(
    <MockProvider>
      <SubmitTool mockUser={MOCK_MEMBER_USER} mockDomains={MOCK_DOMAINS} />
    </MockProvider>
  );

  const form = container.querySelector(`.${styles.card}`) as HTMLFormElement;
  fireEvent.submit(form);

  const errorBanner = container.querySelector(`.${styles.errorBanner}`);
  expect(errorBanner?.textContent).toContain(`נא למלא את כל השדות`);
});

it('should render both name and subtitle inputs', () => {
  const { container } = render(
    <MockProvider>
      <SubmitTool mockUser={MOCK_MEMBER_USER} mockDomains={MOCK_DOMAINS} />
    </MockProvider>
  );

  const inputs = container.querySelectorAll(`.${styles.row} input`);
  expect(inputs.length).toBeGreaterThanOrEqual(2);
});

it('should render icon and screenshot image upload buttons for a signed-in member', () => {
  const { container } = render(
    <MockProvider>
      <SubmitTool mockUser={MOCK_MEMBER_USER} mockDomains={MOCK_DOMAINS} />
    </MockProvider>
  );

  expect(container.textContent).toContain(`העלאת תמונת אייקון`);
  expect(container.textContent).toContain(`הוספת צילום מסך`);
});

it('should show a live validation error on an invalid external link, before submit is clicked', async () => {
  const { container } = render(
    <MockProvider>
      <SubmitTool mockUser={MOCK_MEMBER_USER} mockDomains={MOCK_DOMAINS} />
    </MockProvider>
  );

  const linkInput = container.querySelector(`input[type="url"]`) as HTMLInputElement;
  fireEvent.change(linkInput, { target: { value: `not-a-link` } });

  await waitFor(() => {
    expect(container.textContent).toContain(`קישור חיצוני חייב להתחיל ב-http:// או https://`);
  });
});

it('should clear the live link error once the value becomes a valid https url', async () => {
  const { container } = render(
    <MockProvider>
      <SubmitTool mockUser={MOCK_MEMBER_USER} mockDomains={MOCK_DOMAINS} />
    </MockProvider>
  );

  const linkInput = container.querySelector(`input[type="url"]`) as HTMLInputElement;
  fireEvent.change(linkInput, { target: { value: `not-a-link` } });
  await waitFor(() => {
    expect(container.textContent).toContain(`קישור חיצוני חייב להתחיל ב-http:// או https://`);
  });

  fireEvent.change(linkInput, { target: { value: `https://example.com` } });
  await waitFor(() => {
    expect(container.textContent).not.toContain(`קישור חיצוני חייב להתחיל ב-http:// או https://`);
  });
});
