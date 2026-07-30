import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TagChip } from './tag-chip.js';

const DOMAINS = [`חרדה`, `דיכאון`, `PTSD`, `בדידות`, `שינה`, `כעס`];

export const BasicTagChip = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 8, padding: 24, flexWrap: 'wrap' }}>
        <TagChip label="חרדה" />
        <TagChip label="דיכאון" active />
        <TagChip label="PTSD" count={12} />
      </div>
    </MemoryRouter>
  );
};

export const ToggleableFilterList = () => {
  const [activeTags, setActiveTags] = useState<string[]>([`חרדה`]);

  const toggleTag = (name: string) => {
    setActiveTags((prev) => (prev.includes(name) ? prev.filter((tag) => tag !== name) : [...prev, name]));
  };

  return (
    <MemoryRouter>
      <div style={{ padding: 24 }}>
        <h3 style={{ marginTop: 0 }}>סינון לפי תחומי התמודדות</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DOMAINS.map((domain) => (
            <TagChip
              key={domain}
              label={domain}
              active={activeTags.includes(domain)}
              onToggle={() => toggleTag(domain)}
            />
          ))}
        </div>
      </div>
    </MemoryRouter>
  );
};

export const RemovableSelectedTags = () => {
  const [selected, setSelected] = useState<string[]>([`חרדה`, `שינה`, `כעס`]);

  const removeTag = (name: string) => {
    setSelected((prev) => prev.filter((tag) => tag !== name));
  };

  return (
    <MemoryRouter>
      <div style={{ padding: 24 }}>
        <h3 style={{ marginTop: 0 }}>תגיות נבחרות</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {selected.length === 0 && <span>לא נבחרו תגיות</span>}
          {selected.map((tag) => (
            <TagChip key={tag} label={tag} active removable onRemove={() => removeTag(tag)} />
          ))}
        </div>
      </div>
    </MemoryRouter>
  );
};
