import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SaveButton } from './save-button.js';
import styles from './save-button.module.scss';

it('should render the unsaved label by default', () => {
  const { container } = render(
    <MemoryRouter>
      <SaveButton
        targetType="app"
        targetId="calm-space"
        title="Calm Space"
        url="/app/calm-space"
        mockDeviceId="spec-device-1"
      />
    </MemoryRouter>
  );

  const label = container.querySelector(`.${styles.saveLabel}`);
  expect(label?.textContent).toBe(`שמירה למאוחר`);
});

it('should toggle to the saved label when clicked', () => {
  const { container } = render(
    <MemoryRouter>
      <SaveButton
        targetType="app"
        targetId="calm-space-2"
        title="Calm Space"
        url="/app/calm-space-2"
        mockDeviceId="spec-device-2"
      />
    </MemoryRouter>
  );

  const button = container.querySelector(`button`);
  fireEvent.click(button as HTMLButtonElement);

  const label = container.querySelector(`.${styles.saveLabel}`);
  expect(label?.textContent).toBe(`נשמר`);
});

it('should toggle back to the unsaved label on a second click', () => {
  const { container } = render(
    <MemoryRouter>
      <SaveButton
        targetType="article"
        targetId="article-99"
        title="Article 99"
        url="/blog/article-99"
        mockDeviceId="spec-device-3"
      />
    </MemoryRouter>
  );

  const button = container.querySelector(`button`) as HTMLButtonElement;
  fireEvent.click(button);
  fireEvent.click(button);

  const label = container.querySelector(`.${styles.saveLabel}`);
  expect(label?.textContent).toBe(`שמירה למאוחר`);
});

it('should call onToggle with the resulting saved state', () => {
  let toggledState: boolean | undefined;
  const handleToggle = (isSaved: boolean) => {
    toggledState = isSaved;
  };

  const { container } = render(
    <MemoryRouter>
      <SaveButton
        targetType="event"
        targetId="event-55"
        title="Event 55"
        url="/events/event-55"
        mockDeviceId="spec-device-4"
        onToggle={(isSaved) => handleToggle(isSaved)}
      />
    </MemoryRouter>
  );

  const button = container.querySelector(`button`) as HTMLButtonElement;
  fireEvent.click(button);

  expect(toggledState).toBe(true);
});

it('should not render a label when showLabel is false', () => {
  const { container } = render(
    <MemoryRouter>
      <SaveButton
        targetType="gallery"
        targetId="gallery-10"
        title="Gallery 10"
        url="/gallery/gallery-10"
        showLabel={false}
        mockDeviceId="spec-device-5"
      />
    </MemoryRouter>
  );

  const label = container.querySelector(`.${styles.saveLabel}`);
  expect(label).toBeNull();
});
