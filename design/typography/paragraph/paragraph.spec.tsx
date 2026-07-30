import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Paragraph } from './paragraph.js';
import styles from './paragraph.module.scss';

describe('Paragraph', () => {
  it('should render the provided text content', () => {
    const { container } = render(
      <MemoryRouter>
        <Paragraph>טקסט לדוגמה לבדיקה</Paragraph>
      </MemoryRouter>
    );

    const paragraphElement = container.querySelector(`.${styles.paragraph}`);
    expect(paragraphElement?.textContent).toBe('טקסט לדוגמה לבדיקה');
  });

  it('should apply the medium size class by default', () => {
    const { container } = render(
      <MemoryRouter>
        <Paragraph>ברירת מחדל</Paragraph>
      </MemoryRouter>
    );

    const paragraphElement = container.querySelector(`.${styles.paragraph}`);
    expect(paragraphElement?.classList.contains(styles.md)).toBe(true);
  });

  it('should apply the requested size class', () => {
    const { container } = render(
      <MemoryRouter>
        <Paragraph size="lg">טקסט גדול</Paragraph>
      </MemoryRouter>
    );

    const paragraphElement = container.querySelector(`.${styles.paragraph}`);
    expect(paragraphElement?.classList.contains(styles.lg)).toBe(true);
  });

  it('should apply the muted class when muted is true', () => {
    const { container } = render(
      <MemoryRouter>
        <Paragraph muted>טקסט מושתק</Paragraph>
      </MemoryRouter>
    );

    const paragraphElement = container.querySelector(`.${styles.paragraph}`);
    expect(paragraphElement?.classList.contains(styles.muted)).toBe(true);
  });

  it('should not apply the muted class by default', () => {
    const { container } = render(
      <MemoryRouter>
        <Paragraph>טקסט רגיל</Paragraph>
      </MemoryRouter>
    );

    const paragraphElement = container.querySelector(`.${styles.paragraph}`);
    expect(paragraphElement?.classList.contains(styles.muted)).toBe(false);
  });

  it('should apply a custom className', () => {
    const { container } = render(
      <MemoryRouter>
        <Paragraph className="custom-class">טקסט</Paragraph>
      </MemoryRouter>
    );

    const paragraphElement = container.querySelector(`.${styles.paragraph}`);
    expect(paragraphElement?.classList.contains('custom-class')).toBe(true);
  });
});
