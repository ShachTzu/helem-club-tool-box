import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppIcon } from './app-icon.js';
import { SubmitIcon } from './submit-icon.js';
import { FeaturedIcon } from './featured-icon.js';
import { ExternalLinkIcon } from './external-link-icon.js';

export const ToolboxIconsGallery = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <AppIcon size="large" color="primary" title="אפליקציה" />
          <div style={{ marginTop: 8, fontSize: 13 }}>אפליקציה</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <SubmitIcon size="large" color="secondary" title="הגשת כלי" />
          <div style={{ marginTop: 8, fontSize: 13 }}>הגשת כלי</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <FeaturedIcon size="large" title="מומלץ ע״י הקהילה" />
          <div style={{ marginTop: 8, fontSize: 13 }}>מומלץ</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <ExternalLinkIcon size="large" color="primary" title="קישור חיצוני" />
          <div style={{ marginTop: 8, fontSize: 13 }}>קישור חיצוני</div>
        </div>
      </div>
    </MemoryRouter>
  );
};

export const AppCardIconsUsage = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          maxWidth: 340,
          border: '1px solid #dfe3ea',
          borderRadius: 16,
          padding: 18,
          fontFamily: 'Assistant, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AppIcon size="medium" color="primary" title="אפליקציה" />
          <h3 style={{ margin: 0, fontSize: 17 }}>נשימה רגועה</h3>
          <FeaturedIcon size="small" title="מומלץ ע״י הקהילה" />
        </div>
        <p style={{ color: '#6b7280', fontSize: 13.5, lineHeight: 1.4 }}>
          תרגילי נשימה מודרכים להפחתת חרדה ולחץ.
        </p>
        <a
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#12294a' }}
        >
          לאפליקציה <ExternalLinkIcon size="small" />
        </a>
      </div>
    </MemoryRouter>
  );
};

export const SubmitToolCallToAction = () => {
  return (
    <MemoryRouter>
      <button
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          border: 'none',
          borderRadius: 999,
          padding: '10px 20px',
          background: '#e89f4b',
          color: '#12294a',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        <SubmitIcon size="small" color="primary" />
        הגשת כלי
      </button>
    </MemoryRouter>
  );
};
