import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockEvents } from '@helemclub/events.entities.event';
import { EventsPreview } from './events-preview.js';

const events = mockEvents().map((event) => event.toObject());

function renderPreview(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

describe('EventsPreview', () => {
  it('renders the section title', () => {
    renderPreview(<EventsPreview mockEvents={events} />);
    expect(screen.getByText('אירועים קרובים')).toBeInTheDocument();
  });

  it('shows a link to the full events page', () => {
    renderPreview(<EventsPreview mockEvents={events} />);
    const link = screen.getByText('לכל האירועים ←').closest('a');
    expect(link).toHaveAttribute('href', '/events');
  });
});
