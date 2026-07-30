import React from 'react';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { PlanToProduction } from './plan-to-production.js';

/**
 * The full plan-to-production roadmap, wrapped in the Helam theme (RTL).
 */
export function DefaultPlanToProduction() {
  return (
    <HelamTheme>
      <PlanToProduction />
    </HelamTheme>
  );
}

/**
 * The roadmap rendered on a constrained mobile-width surface, to preview the
 * responsive single-column layout.
 */
export function MobilePlanToProduction() {
  return (
    <HelamTheme>
      <div style={{ maxWidth: 390, margin: '0 auto', border: '1px solid #dde4e9' }}>
        <PlanToProduction />
      </div>
    </HelamTheme>
  );
}
