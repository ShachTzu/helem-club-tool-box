import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { UserRole } from './role-option-type.js';
import { RoleSelector } from './role-selector.js';

export const BasicRoleSelector = () => {
  const [role, setRole] = useState<UserRole>(`member`);

  return (
    <MemoryRouter>
      <div style={{ padding: 40, background: `#F6F8FA`, display: `flex`, flexDirection: `column`, gap: 12 }}>
        <h3 style={{ margin: 0, color: `#0B1A30`, fontFamily: `'Assistant', sans-serif` }}>
          ניהול משתמש — דנה כהן
        </h3>
        <RoleSelector value={role} onChange={(next) => setRole(next)} />
        <p style={{ color: `#5C6B76`, fontSize: 14, fontFamily: `'Assistant', sans-serif` }}>
          התפקיד הנוכחי: {role}
        </p>
      </div>
    </MemoryRouter>
  );
};

export const UsersTableRoleSelectors = () => {
  const [roles, setRoles] = useState<Record<string, UserRole>>({
    sam: `member`,
    noa: `writer`,
    dan: `moderator`,
    admin: `admin`,
  });

  const rows: { id: string; name: string }[] = [
    { id: `sam`, name: `Sam Doe` },
    { id: `noa`, name: `Noa Writer` },
    { id: `dan`, name: `Dan Moderator` },
    { id: `admin`, name: `Helem Admin` },
  ];

  return (
    <MemoryRouter>
      <div style={{ padding: 40, background: `#FFFFFF`, fontFamily: `'Assistant', sans-serif` }}>
        <h3 style={{ margin: `0 0 16px`, color: `#0B1A30` }}>ניהול משתמשים</h3>
        <div style={{ display: `flex`, flexDirection: `column`, gap: 12 }}>
          {rows.map((row) => (
            <div
              key={row.id}
              style={{
                display: `flex`,
                alignItems: `center`,
                justifyContent: `space-between`,
                border: `1px solid #DDE4E9`,
                borderRadius: 14,
                padding: `12px 16px`,
              }}
            >
              <span style={{ color: `#1A1A1A`, fontWeight: 600 }}>{row.name}</span>
              <RoleSelector
                value={roles[row.id]}
                onChange={(next) => setRoles({ ...roles, [row.id]: next })}
              />
            </div>
          ))}
        </div>
      </div>
    </MemoryRouter>
  );
};

export const DisabledRoleSelector = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 40, background: `#F6F8FA` }}>
        <RoleSelector value="admin" disabled />
      </div>
    </MemoryRouter>
  );
};
