import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Dropdown } from './dropdown.js';
import type { DropdownItemType } from './dropdown-item-type.js';

const USER_ITEMS: DropdownItemType[] = [
  { id: `profile`, label: `הפרופיל שלי`, icon: `👤` },
  { id: `saved`, label: `שמורים`, icon: `🔖` },
  { id: `settings`, label: `הגדרות`, icon: `⚙️` },
  { id: `logout`, label: `התנתקות`, icon: `🚪`, danger: true },
];

export const UserBarDropdown = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 40, background: `#0B1A30`, display: `flex`, justifyContent: `flex-end` }}>
        <Dropdown
          trigger={
            <button
              type="button"
              style={{
                display: `flex`,
                alignItems: `center`,
                gap: 8,
                background: `transparent`,
                border: `1px solid rgba(255,255,255,0.4)`,
                borderRadius: 999,
                padding: `6px 14px`,
                color: `#FFFFFF`,
                fontWeight: 700,
                cursor: `pointer`,
              }}
            >
              דנה כהן ▾
            </button>
          }
          items={USER_ITEMS}
          align="end"
        />
      </div>
    </MemoryRouter>
  );
};

export const SortMenuDropdown = () => {
  const [sortLabel, setSortLabel] = useState(`לפי דירוג`);

  const sortItems: DropdownItemType[] = [
    { id: `rating`, label: `⭐ לפי דירוג`, onSelect: () => setSortLabel(`לפי דירוג`) },
    { id: `clicks`, label: `👆 לפי קליקים`, onSelect: () => setSortLabel(`לפי קליקים`) },
    { id: `recent`, label: `🆕 החדשים ביותר`, onSelect: () => setSortLabel(`החדשים ביותר`) },
  ];

  return (
    <MemoryRouter>
      <div style={{ padding: 40, background: `#F6F8FA`, display: `flex`, flexDirection: `column`, gap: 16 }}>
        <h3 style={{ margin: 0, color: `#0B1A30`, fontFamily: `'Assistant', sans-serif` }}>
          {sortLabel}
        </h3>
        <Dropdown label={sortLabel} items={sortItems} align="start" />
      </div>
    </MemoryRouter>
  );
};

export const HeaderActionsDropdown = () => {
  const actionItems: DropdownItemType[] = [
    { id: `submit`, label: `הגשת כלי`, icon: `➕` },
    { id: `wishlist`, label: `רשימת משאלות`, icon: `💡` },
    { id: `disabled`, label: `פעולה חסומה`, icon: `🚫`, disabled: true },
  ];

  return (
    <MemoryRouter>
      <div style={{ padding: 40, background: `#0B1A30`, display: `flex`, justifyContent: `space-between` }}>
        <Dropdown label="ארגז כלים" items={actionItems} align="start" />
        <Dropdown label="פעולות נוספות" items={actionItems} align="end" />
      </div>
    </MemoryRouter>
  );
};
