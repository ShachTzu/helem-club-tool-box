import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { SubmitArticle } from './submit-article.js';
import { mockDomainOptions } from './submit-article.mock.js';
import styles from './submit-article.module.scss';

it('should render the form title and subtitle', () => {
  const { container } = render(
    <MockProvider>
      <SubmitArticle mockDomains={mockDomainOptions()} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(`הגשת כתבה לבלוג`);
});

it('should show a validation error when submitting an empty form', () => {
  const { container } = render(
    <MockProvider>
      <SubmitArticle mockDomains={mockDomainOptions()} />
    </MockProvider>
  );

  const form = container.querySelector(`form`) as HTMLFormElement;
  fireEvent.submit(form);

  const errorText = container.querySelector(`.${styles.errorText}`);
  expect(errorText?.textContent).toBe(`נא למלא את כל השדות המסומנים בכוכבית`);
});

it('should render the success state when previewSubmitted is true', () => {
  const { container } = render(
    <MockProvider>
      <SubmitArticle mockDomains={mockDomainOptions()} previewSubmitted />
    </MockProvider>
  );

  const successTitle = container.querySelector(`.${styles.successTitle}`);
  expect(successTitle?.textContent).toBe(`תודה שהגשתם כתבה!`);
});

it('should disable the display name field when the anonymous checkbox is checked', () => {
  const { container } = render(
    <MockProvider>
      <SubmitArticle mockDomains={mockDomainOptions()} />
    </MockProvider>
  );

  const checkbox = container.querySelector(`.${styles.checkbox}`) as HTMLInputElement;
  fireEvent.click(checkbox);

  const displayNameInput = container.querySelectorAll(`input[type="text"]`)[2] as HTMLInputElement;
  expect(displayNameInput.disabled).toBe(true);
});
