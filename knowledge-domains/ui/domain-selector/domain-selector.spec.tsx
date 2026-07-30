import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DomainSelector } from './domain-selector.js';
import styles from './domain-selector.module.scss';

const MOCK_DOMAINS = [
  { id: `anxiety`, slug: `anxiety`, name: `חרדה`, icon: `😰`, count: 5 },
  { id: `sleep`, slug: `sleep`, name: `שינה`, icon: `🌙`, count: 4 },
];

describe(`DomainSelector`, () => {
  it(`renders the provided label`, () => {
    const { container } = render(
      <MockProvider>
        <DomainSelector mockDomains={MOCK_DOMAINS} label="תחומי מאמר" />
      </MockProvider>
    );

    expect(container.textContent).toContain(`תחומי מאמר`);
  });

  it(`renders selected domains in the summary list`, () => {
    const { container } = render(
      <MockProvider>
        <DomainSelector mockDomains={MOCK_DOMAINS} value={[`anxiety`]} />
      </MockProvider>
    );

    const summaryItems = container.querySelectorAll(`.${styles.summaryChip}`);
    expect(summaryItems.length).toBe(1);
    expect(summaryItems[0].textContent).toContain(`חרדה`);
  });

  it(`does not render a summary list when no domain is selected`, () => {
    const { container } = render(
      <MockProvider>
        <DomainSelector mockDomains={MOCK_DOMAINS} value={[]} />
      </MockProvider>
    );

    const summaryItems = container.querySelectorAll(`.${styles.summary}`);
    expect(summaryItems.length).toBe(0);
  });

  it(`calls onChange with the selected domain id when an option is clicked`, () => {
    const handleChange = vi.fn();
    const { container } = render(
      <MockProvider>
        <DomainSelector mockDomains={MOCK_DOMAINS} value={[]} onChange={handleChange} />
      </MockProvider>
    );

    const trigger = container.querySelector(`div[class*="trigger"]`) as HTMLElement;
    fireEvent.click(trigger);

    const options = container.querySelectorAll(`button[class*="option"]`);
    fireEvent.click(options[0]);

    expect(handleChange).toHaveBeenCalledWith([`anxiety`]);
  });

  it(`renders the required mark when required is true`, () => {
    const { container } = render(
      <MockProvider>
        <DomainSelector mockDomains={MOCK_DOMAINS} required label="תחומים" />
      </MockProvider>
    );

    expect(container.textContent).toContain(`תחומים *`);
  });
});
