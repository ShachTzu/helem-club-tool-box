import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockLabels } from '@helemclub/knowledge-base.entities.label';
import { KnowledgePreview } from './knowledge-preview.js';

const labels = mockLabels().map((label) => label.toObject());

/**
 * the knowledge preview populated with the default mock labels.
 */
export const BasicKnowledgePreview = () => (
  <MockProvider>
    <KnowledgePreview mockLabels={labels} />
  </MockProvider>
);

/**
 * the knowledge preview limited to three project labels.
 */
export const LimitedLabels = () => (
  <MockProvider>
    <KnowledgePreview mockLabels={labels} limit={3} />
  </MockProvider>
);
