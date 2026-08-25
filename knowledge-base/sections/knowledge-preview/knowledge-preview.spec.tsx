import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockLabels } from '@helemclub/knowledge-base.entities.label';
import { KnowledgePreview } from './knowledge-preview.js';

const labels = mockLabels().map((label) => label.toObject());

function renderPreview(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

describe('KnowledgePreview', () => {
  it('renders the section title', () => {
    renderPreview(<KnowledgePreview mockLabels={labels} />);
    expect(screen.getByText('ספריית הידע')).toBeInTheDocument();
  });

  it('shows a link to the full knowledge base', () => {
    renderPreview(<KnowledgePreview mockLabels={labels} />);
    const link = screen.getByText('לכל הספרייה ←').closest('a');
    expect(link).toHaveAttribute('href', '/knowledge');
  });
});
