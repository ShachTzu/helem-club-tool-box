import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ShareButtons } from './share-buttons.js';
import styles from './share-buttons.module.scss';

describe('ShareButtons', () => {
  it('renders all four networks by default', () => {
    const { container } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת לדוגמה" />
      </MemoryRouter>
    );

    const buttons = container.querySelectorAll(`.${styles.button}`);
    expect(buttons.length).toBe(4);
  });

  it('renders only the requested networks', () => {
    const { container } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת" networks={[`whatsapp`, `copy`]} />
      </MemoryRouter>
    );

    const buttons = container.querySelectorAll(`.${styles.button}`);
    expect(buttons.length).toBe(2);
  });

  it('renders the provided label', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת" label="שתפו את זה:" />
      </MemoryRouter>
    );

    expect(getByText(`שתפו את זה:`)).toBeTruthy();
  });

  it('does not render a label when set to an empty string', () => {
    const { container } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת" label="" />
      </MemoryRouter>
    );

    const label = container.querySelector(`.${styles.label}`);
    expect(label).toBeNull();
  });

  it('calls onShare with "whatsapp" when the WhatsApp button is clicked', () => {
    const onShare = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת" onShare={onShare} />
      </MemoryRouter>
    );

    const whatsappButton = container.querySelector(`.${styles.whatsapp}`) as HTMLButtonElement;
    fireEvent.click(whatsappButton);

    expect(onShare).toHaveBeenCalledWith(`whatsapp`);
  });

  it('calls onShare with "facebook" when the Facebook button is clicked', () => {
    const onShare = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת" onShare={onShare} />
      </MemoryRouter>
    );

    const facebookButton = container.querySelector(`.${styles.facebook}`) as HTMLButtonElement;
    fireEvent.click(facebookButton);

    expect(onShare).toHaveBeenCalledWith(`facebook`);
  });

  it('calls onShare with "x" when the X button is clicked', () => {
    const onShare = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת" onShare={onShare} />
      </MemoryRouter>
    );

    const xButton = container.querySelector(`.${styles.x}`) as HTMLButtonElement;
    fireEvent.click(xButton);

    expect(onShare).toHaveBeenCalledWith(`x`);
  });

  it('renders a copy link button', () => {
    const { container } = render(
      <MemoryRouter>
        <ShareButtons url="https://helam.club/x" title="כותרת" />
      </MemoryRouter>
    );

    const copyButton = container.querySelector(`.${styles.copy}`);
    expect(copyButton).toBeTruthy();
  });
});
