import React from 'react';
import { render } from '@testing-library/react';
import { DefaultPlanToProduction } from './plan-to-production.compositions.js';
import { roadmapSummary } from './roadmap-data.js';

it('should render the page title', () => {
  const { getByText } = render(<DefaultPlanToProduction />);
  expect(getByText('מהתוכנית לפרודקשן')).toBeTruthy();
});

it('should render the critical path section', () => {
  const { getByText } = render(<DefaultPlanToProduction />);
  expect(getByText('🎯 המסלול הקריטי לפרודקשן')).toBeTruthy();
});

it('should compute a consistent roadmap summary', () => {
  const summary = roadmapSummary();
  expect(summary.total).toBe(summary.done + summary.partial + summary.missing);
  expect(summary.total).toBeGreaterThan(0);
});
