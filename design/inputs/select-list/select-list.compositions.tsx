import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { SelectList } from './select-list.js';
import { DEFAULT_SELECT_OPTIONS } from './select-list.mock.js';

export const SingleSelectDomain = () => {
  const [value, setValue] = useState(`anxiety`);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <SelectList
            label="בחירת תחום"
            options={DEFAULT_SELECT_OPTIONS}
            value={value}
            onChange={(next) => setValue(next as string)}
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const MultiSelectWithChips = () => {
  const [values, setValues] = useState<string[]>([`anxiety`, `sleep`, `mindfulness-breathing`]);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <SelectList
            label="סינון לפי תחומי התמודדות"
            options={DEFAULT_SELECT_OPTIONS}
            value={values}
            onChange={(next) => setValues(next as string[])}
            multiple
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const EmptySelectWithSearch = () => {
  const [values, setValues] = useState<string[]>([]);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <SelectList
            label="דומיינים רלוונטיים"
            placeholder="בחרו תחומים..."
            searchPlaceholder="חיפוש תחום..."
            options={DEFAULT_SELECT_OPTIONS}
            value={values}
            onChange={(next) => setValues(next as string[])}
            multiple
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
