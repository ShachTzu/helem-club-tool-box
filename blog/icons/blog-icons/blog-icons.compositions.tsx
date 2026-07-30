import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ArticleIcon, EditIcon, SubmitIcon, MembersOnlyIcon, StatsIcon } from './blog-icons.js';

export const AllBlogIcons = () => {
  return (
    <MemoryRouter>
      <div style={{ display: `flex`, gap: 24, alignItems: `center`, padding: 24 }}>
        <ArticleIcon size="large" color="primary" />
        <EditIcon size="large" color="secondary" />
        <SubmitIcon size="large" color="accent" />
        <MembersOnlyIcon size="large" color="accent" />
        <StatsIcon size="large" color="primary" />
      </div>
    </MemoryRouter>
  );
};

export const BlogIconsInContext = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: `flex`,
          gap: 16,
          flexWrap: `wrap`,
          padding: 24,
          background: `var(--colors-surface-background)`,
        }}
      >
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            gap: 8,
            background: `var(--colors-surface-primary)`,
            border: `1px solid var(--colors-border)`,
            borderRadius: `var(--borders-radius-medium)`,
            padding: `10px 16px`,
          }}
        >
          <ArticleIcon size="small" color="secondary" />
          <span style={{ fontSize: 14, color: `var(--colors-text-secondary)` }}>128 כתבות</span>
        </div>
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            gap: 8,
            background: `var(--colors-surface-primary)`,
            border: `1px solid var(--colors-border)`,
            borderRadius: `var(--borders-radius-medium)`,
            padding: `10px 16px`,
          }}
        >
          <EditIcon size="small" color="secondary" />
          <span style={{ fontSize: 14, color: `var(--colors-text-secondary)` }}>עריכת כתבה</span>
        </div>
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            gap: 8,
            background: `var(--colors-accent-default)`,
            borderRadius: `var(--borders-radius-pill)`,
            padding: `10px 16px`,
          }}
        >
          <SubmitIcon size="small" color="primary" />
          <span style={{ fontSize: 14, fontWeight: `var(--typography-font-weight-bold)`, color: `var(--colors-primary-default)` }}>
            הגשת כתבה
          </span>
        </div>
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            gap: 8,
            background: `var(--colors-surface-primary)`,
            border: `1px solid var(--colors-border)`,
            borderRadius: `var(--borders-radius-pill)`,
            padding: `6px 14px`,
          }}
        >
          <MembersOnlyIcon size="small" color="muted" />
          <span style={{ fontSize: 12.5, color: `var(--colors-text-muted)` }}>לחברי קהילה</span>
        </div>
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            gap: 8,
            background: `var(--colors-surface-primary)`,
            border: `1px solid var(--colors-border)`,
            borderRadius: `var(--borders-radius-medium)`,
            padding: `10px 16px`,
          }}
        >
          <StatsIcon size="small" color="secondary" />
          <span style={{ fontSize: 14, color: `var(--colors-text-secondary)` }}>סטטיסטיקות</span>
        </div>
      </div>
    </MemoryRouter>
  );
};

export const BlogIconVariants = () => {
  return (
    <MemoryRouter>
      <div style={{ display: `flex`, gap: 24, alignItems: `center`, padding: 24 }}>
        <ArticleIcon size={40} color="primary" variant="stroke" title="כתבה - קווי מתאר" />
        <SubmitIcon size={40} color="accent" variant="fill" title="הגשה - מלא" />
      </div>
    </MemoryRouter>
  );
};
