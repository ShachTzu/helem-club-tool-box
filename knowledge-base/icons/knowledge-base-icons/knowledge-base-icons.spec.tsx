import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VideoIcon } from './video-icon.js';
import { AudioIcon } from './audio-icon.js';
import { PlayIcon } from './play-icon.js';
import { LabelIcon } from './label-icon.js';

describe('knowledge-base-icons', () => {
  it('should render the video icon with an accessible label', () => {
    const { container } = render(
      <MemoryRouter>
        <VideoIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-label')).toBe('וידאו');
  });

  it('should render the audio icon with an accessible label', () => {
    const { container } = render(
      <MemoryRouter>
        <AudioIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-label')).toBe('אודיו');
  });

  it('should render the play icon as a filled variant by default', () => {
    const { container } = render(
      <MemoryRouter>
        <PlayIcon />
      </MemoryRouter>
    );
    const path = container.querySelector('path');
    expect(path?.getAttribute('fill')).toBe('currentColor');
  });

  it('should render the label icon with a custom title', () => {
    const { container } = render(
      <MemoryRouter>
        <LabelIcon title="פרויקט" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('פרויקט');
  });

  it('should apply a custom class name to the icon svg', () => {
    const { container } = render(
      <MemoryRouter>
        <VideoIcon className="custom-video-icon" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('custom-video-icon')).toBe(true);
  });
});
