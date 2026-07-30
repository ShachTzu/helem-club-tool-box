import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './footer.js';
import styles from './footer.module.scss';

it('should render the default footer links grouped by heading', () => {
  const { container } = render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

  const headings = container.querySelectorAll(`.${styles.heading}`);
  const headingTexts = Array.from(headings).map((heading) => heading.textContent);

  expect(headingTexts).toContain(`האקוסיסטם`);
  expect(headingTexts).toContain(`קהילה`);
});

it('should render custom links passed via props', () => {
  const customLinks = [
    { label: `צור קשר`, href: `/contact`, group: `תמיכה` },
    { label: `שאלות נפוצות`, href: `/faq`, group: `תמיכה` },
  ];

  const { getByText } = render(
    <MemoryRouter>
      <Footer links={customLinks} />
    </MemoryRouter>
  );

  expect(getByText(`צור קשר`)).toBeTruthy();
  expect(getByText(`שאלות נפוצות`)).toBeTruthy();
});

it('should render the emergency contacts', () => {
  const emergencyContacts = [
    { label: `מד"א`, phone: `101` },
    { label: `ער"ן`, phone: `1201` },
  ];

  const { container } = render(
    <MemoryRouter>
      <Footer emergencyContacts={emergencyContacts} />
    </MemoryRouter>
  );

  expect(container.textContent).toContain(`101`);
  expect(container.textContent).toContain(`1201`);
});

it('should render the social links pointing to the provided urls', () => {
  const { container } = render(
    <MemoryRouter>
      <Footer facebookUrl="https://facebook.com/helamclub" instagramUrl="https://instagram.com/helamclub" />
    </MemoryRouter>
  );

  const socialLinks = container.querySelectorAll(`.${styles.socialLink}`);
  const hrefs = Array.from(socialLinks).map((link) => link.getAttribute(`href`) || ``);

  expect(hrefs.some((href) => href.includes(`facebook.com/helamclub`))).toBe(true);
  expect(hrefs.some((href) => href.includes(`instagram.com/helamclub`))).toBe(true);
});

it('should render the provided disclaimer text', () => {
  const { container } = render(
    <MemoryRouter>
      <Footer disclaimer="הצהרה מותאמת אישית לבדיקה." />
    </MemoryRouter>
  );

  expect(container.textContent).toContain(`הצהרה מותאמת אישית לבדיקה.`);
});
