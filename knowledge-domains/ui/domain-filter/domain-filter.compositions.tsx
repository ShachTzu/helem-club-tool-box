import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DomainFilter } from './domain-filter.js';
import { MOCK_FILTER_DOMAINS } from './domain-filter.mock.js';

export const BasicDomainFilter = () => {
  const [selected, setSelected] = useState<string[]>([`anxiety`, `sleep`]);

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <h3 style={{ marginTop: 0 }}>סינון לפי תחומי התמודדות</h3>
        <DomainFilter mockDomains={MOCK_FILTER_DOMAINS} value={selected} onChange={setSelected} />
      </div>
    </MockProvider>
  );
};

export const OnlyDomainsWithContent = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <h3 style={{ marginTop: 0 }}>מציג רק תחומים עם תוכן</h3>
        <DomainFilter
          mockDomains={MOCK_FILTER_DOMAINS}
          value={selected}
          onChange={setSelected}
          onlyWithContent
        />
      </div>
    </MockProvider>
  );
};

export const EmptySelectionDomainFilter = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 420 }}>
        <h3 style={{ marginTop: 0 }}>עוטף על פני שורות במובייל</h3>
        <DomainFilter mockDomains={MOCK_FILTER_DOMAINS} value={selected} onChange={setSelected} />
      </div>
    </MockProvider>
  );
};
