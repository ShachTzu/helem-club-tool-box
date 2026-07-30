import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CtaButton } from './cta-button.js';
import styles from './cta-button.module.scss';

it('should render the button label', () => {
  const { container } = render(
    <MemoryRouter>
      <CtaButton>הצטרפו עכשיו</CtaButton>
    </MemoryRouter>
  );
  const rendered = container.querySelector('button');
  expect(rendered?.textContent).toContain('הצטרפו עכשיו');
});

it('should render the wrapper class name', () => {
  const { container } = render(
    <MemoryRouter>
      <CtaButton>הצטרפו עכשיו</CtaButton>
    </MemoryRouter>
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`);
  expect(wrapper).toBeTruthy();
});

it('should call onClick when clicked', () => {
  let clicked = false;
  const handleClick = () => {
    clicked = true;
  };
  const { container } = render(
    <MemoryRouter>
      <CtaButton onClick={() => handleClick()}>לחצו כאן</CtaButton>
    </MemoryRouter>
  );
  const button = container.querySelector('button');
  if (button) fireEvent.click(button);
  expect(clicked).toBe(true);
});

it('should render as a link when href is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <CtaButton href="/toolbox">גלו את ארגז הכלים</CtaButton>
    </MemoryRouter>
  );
  const link = container.querySelector('a');
  expect(link?.getAttribute('href')).toBe('/toolbox');
});

it('should apply the fullWidth class when fullWidth is set', () => {
  const { container } = render(
    <MemoryRouter>
      <CtaButton fullWidth>הרשמה</CtaButton>
    </MemoryRouter>
  );
  const wrapper = container.querySelector(`.${styles.fullWidth}`);
  expect(wrapper).toBeTruthy();
});
