import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MediaPlayer } from './media-player.js';
import styles from './media-player.module.scss';

it('renders the poster image with the given title as alt text', () => {
  const { container } = render(
    <MemoryRouter>
      <MediaPlayer
        mediaUrl="https://www.youtube.com/watch?v=abc12345678"
        title="כותרת בדיקה"
        posterUrl="https://example.com/poster.jpg"
      />
    </MemoryRouter>
  );

  const poster = container.querySelector(`.${styles.poster}`) as HTMLImageElement;
  expect(poster).toBeTruthy();
  expect(poster.getAttribute('alt')).toBe('כותרת בדיקה');
});

it('shows the formatted duration badge when durationSec is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <MediaPlayer mediaUrl="https://example.com/media/file.mp3" mediaType="audio" durationSec={125} />
    </MemoryRouter>
  );

  const badge = container.querySelector(`.${styles.durationBadge}`);
  expect(badge).toBeTruthy();
  expect(badge?.textContent).toBe('2:05');
});

it('switches to a youtube iframe after clicking play', () => {
  const { container } = render(
    <MemoryRouter>
      <MediaPlayer mediaUrl="https://www.youtube.com/watch?v=abc12345678" mediaType="video" />
    </MemoryRouter>
  );

  const button = container.querySelector(`.${styles.posterButton}`) as HTMLButtonElement;
  fireEvent.click(button);

  const iframe = container.querySelector(`.${styles.frame}`) as HTMLIFrameElement;
  expect(iframe).toBeTruthy();
  expect(iframe.getAttribute('src')).toContain('youtube.com/embed/abc12345678');
});

it('invokes onPlay when playback starts', () => {
  let playCount = 0;
  const handlePlay = () => {
    playCount += 1;
  };

  const { container } = render(
    <MemoryRouter>
      <MediaPlayer mediaUrl="https://example.com/media/file.mp4" mediaType="video" onPlay={() => handlePlay()} />
    </MemoryRouter>
  );

  const button = container.querySelector(`.${styles.posterButton}`) as HTMLButtonElement;
  fireEvent.click(button);

  expect(playCount).toBe(1);
});

it('renders an audio element for audio media urls', () => {
  const { container } = render(
    <MemoryRouter>
      <MediaPlayer mediaUrl="https://example.com/media/file.mp3" mediaType="audio" autoPlay />
    </MemoryRouter>
  );

  const audioElement = container.querySelector(`.${styles.audioElement}`);
  expect(audioElement).toBeTruthy();
});
