import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  SignedOutGate,
  SignedInMemberGate,
  CustomJoinMessageGate,
} from './members-only-gate.compositions.js';
import styles from './members-only-gate.module.scss';

it('should render the members-only title for signed-out viewers', () => {
  const { container } = render(<SignedOutGate />);
  const title = container.querySelector(`.${styles.title}`);

  expect(title?.textContent).toBe('התוכן שמור לחברי הקהילה');
});

it('should render a join button for signed-out viewers', () => {
  const { container } = render(<SignedOutGate />);
  const button = container.querySelector(`.${styles.joinButton}`);

  expect(button).toBeTruthy();
  expect(button?.textContent).toContain('הצטרפות / התחברות');
});

it('should not render the gate title for signed-in members', () => {
  const { container } = render(<SignedInMemberGate />);
  const title = container.querySelector(`.${styles.title}`);

  expect(title).toBeFalsy();
});

it('should render the children content for signed-in members', () => {
  const { getByText } = render(<SignedInMemberGate />);
  const content = getByText(/מפגש תמיכה חודשי/);

  expect(content).toBeTruthy();
});

it('should render a custom title and join label when provided', () => {
  const { container, getByText } = render(<CustomJoinMessageGate />);
  const title = container.querySelector(`.${styles.title}`);

  expect(title?.textContent).toBe('הפרק המלא שמור לחברי הקהילה');
  expect(getByText('הצטרפו לקהילה בחינם')).toBeTruthy();
});

it('should link the join button to the provided join href', () => {
  const { container } = render(<CustomJoinMessageGate />);
  const button = container.querySelector(`.${styles.joinButton}`) as HTMLAnchorElement;

  expect(button.getAttribute('href')).toBe('/onboarding');
});

it('should keep the join button rendered after interaction', () => {
  const { container } = render(<SignedOutGate />);
  const button = container.querySelector(`.${styles.joinButton}`) as HTMLElement;
  fireEvent.click(button);

  expect(container.querySelector(`.${styles.joinButton}`)).toBeTruthy();
});
