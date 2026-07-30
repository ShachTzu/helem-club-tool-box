import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Avatar } from './avatar.js';
import styles from './avatar.module.scss';

describe('Avatar', () => {
  it('should render an image when imageUrl is provided', () => {
    const { container } = render(
      <MockProvider>
        <Avatar name="מיכל רבין" imageUrl="https://i.pravatar.cc/150?img=32" />
      </MockProvider>
    );

    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://i.pravatar.cc/150?img=32');
  });

  it('should render initials when no imageUrl is provided', () => {
    const { container } = render(
      <MockProvider>
        <Avatar name="דניאל כהן" />
      </MockProvider>
    );

    const initials = container.querySelector(`.${styles.initials}`);
    expect(initials?.textContent).toBe('דכ');
  });

  it('should fall back to initials when the image fails to load', () => {
    const { container } = render(
      <MockProvider>
        <Avatar name="דניאל כהן" imageUrl="https://broken.example/avatar.png" />
      </MockProvider>
    );

    const img = container.querySelector('img');
    expect(img).toBeTruthy();

    if (img) fireEvent.error(img);

    const updatedImg = container.querySelector('img');
    const initials = container.querySelector(`.${styles.initials}`);
    expect(updatedImg).toBeNull();
    expect(initials?.textContent).toBe('דכ');
  });

  it('should render the anonymous placeholder when anonymous is set', () => {
    const { container } = render(
      <MockProvider>
        <Avatar name="שם כלשהו" anonymous />
      </MockProvider>
    );

    const anonymousEl = container.querySelector(`.${styles.anonymous}`);
    const initials = container.querySelector(`.${styles.initials}`);
    expect(anonymousEl).toBeTruthy();
    expect(initials).toBeNull();
  });

  it('should apply the ring class name when ring is set', () => {
    const { container } = render(
      <MockProvider>
        <Avatar name="נועה לוי" ring />
      </MockProvider>
    );

    const avatarEl = container.querySelector(`.${styles.avatar}`);
    expect(avatarEl?.classList.contains(styles.ring)).toBe(true);
  });

  it('should apply the correct size class name', () => {
    const { container } = render(
      <MockProvider>
        <Avatar name="נועה לוי" size="large" />
      </MockProvider>
    );

    const avatarEl = container.querySelector(`.${styles.avatar}`);
    expect(avatarEl?.classList.contains(styles.large)).toBe(true);
  });
});
