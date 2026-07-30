import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DomainFilter } from './domain-filter.js';
import { MOCK_FILTER_DOMAINS } from './domain-filter.mock.js';

it('should render a chip for every mocked domain', () => {
  const { container } = render(
    <MockProvider>
      <DomainFilter mockDomains={MOCK_FILTER_DOMAINS} />
    </MockProvider>
  );

  const buttons = container.querySelectorAll('button');
  expect(buttons).toHaveLength(MOCK_FILTER_DOMAINS.length);
});

it('should only render domains with content when onlyWithContent is set', () => {
  const { container, getByText, queryByText } = render(
    <MockProvider>
      <DomainFilter mockDomains={MOCK_FILTER_DOMAINS} onlyWithContent />
    </MockProvider>
  );

  const withContentCount = MOCK_FILTER_DOMAINS.filter((domain) => domain.count > 0).length;
  const buttons = container.querySelectorAll('button');
  expect(buttons).toHaveLength(withContentCount);
  expect(getByText(`חרדה`)).toBeTruthy();
  expect(queryByText(`תרופות ופסיכיאטריה`)).toBeFalsy();
});

it('should call onChange with the newly selected domain id when a chip is clicked', () => {
  let selected: string[] = [];
  const handleChange = (value: string[]) => {
    selected = value;
  };

  const { getByText } = render(
    <MockProvider>
      <DomainFilter mockDomains={MOCK_FILTER_DOMAINS} value={selected} onChange={handleChange} />
    </MockProvider>
  );

  fireEvent.click(getByText(`חרדה`));

  expect(selected).toEqual([`anxiety`]);
});

it('should call onChange without the domain id when an active chip is clicked again', () => {
  let selected: string[] = [`anxiety`];
  const handleChange = (value: string[]) => {
    selected = value;
  };

  const { getByText, rerender } = render(
    <MockProvider>
      <DomainFilter mockDomains={MOCK_FILTER_DOMAINS} value={selected} onChange={handleChange} />
    </MockProvider>
  );

  fireEvent.click(getByText(`חרדה`));
  rerender(
    <MockProvider>
      <DomainFilter mockDomains={MOCK_FILTER_DOMAINS} value={selected} onChange={handleChange} />
    </MockProvider>
  );

  expect(selected).toEqual([]);
});
