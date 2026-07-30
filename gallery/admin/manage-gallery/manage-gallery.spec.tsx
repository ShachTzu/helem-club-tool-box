import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageGallery } from './manage-gallery.js';
import {
  mockManageGalleryItems,
  mockManageGalleryDomains,
  mockManageGalleryAdmin,
  mockManageGalleryMember,
} from './manage-gallery.mock.js';
import styles from './manage-gallery.module.scss';

it('renders the gallery items table for an admin user', () => {
  const { container } = render(
    <MockProvider>
      <ManageGallery
        mockItems={mockManageGalleryItems}
        mockDomains={mockManageGalleryDomains}
        mockUser={mockManageGalleryAdmin}
      />
    </MockProvider>
  );

  expect(container.textContent).toContain('שקט אחרי הסערה');
  expect(container.textContent).toContain('אור בקצה');
});

it('shows an access-denied message for a non-admin user', () => {
  const { container } = render(
    <MockProvider>
      <ManageGallery
        mockItems={mockManageGalleryItems}
        mockDomains={mockManageGalleryDomains}
        mockUser={mockManageGalleryMember}
      />
    </MockProvider>
  );

  expect(container.textContent).not.toContain('שקט אחרי הסערה');
  expect(container.textContent).toContain('אין לך הרשאה');
});

it('opens the creation form when clicking the new item button', () => {
  const { container, getByText } = render(
    <MockProvider>
      <ManageGallery
        mockItems={mockManageGalleryItems}
        mockDomains={mockManageGalleryDomains}
        mockUser={mockManageGalleryAdmin}
      />
    </MockProvider>
  );

  const createButton = getByText('+ יצירה חדשה');
  fireEvent.click(createButton);

  const formCard = container.querySelector(`.${styles.formCard}`);
  expect(formCard).not.toBeNull();
  expect(container.textContent).toContain('יצירה חדשה');
});

it('shows a validation error when submitting an empty form', async () => {
  const { container, getByText } = render(
    <MockProvider>
      <ManageGallery
        mockItems={mockManageGalleryItems}
        mockDomains={mockManageGalleryDomains}
        mockUser={mockManageGalleryAdmin}
      />
    </MockProvider>
  );

  fireEvent.click(getByText('+ יצירה חדשה'));
  fireEvent.click(getByText('שמירה'));

  await waitFor(() => {
    const formError = container.querySelector(`.${styles.formError}`);
    expect(formError).not.toBeNull();
  });
});

it('closes the form when clicking cancel', () => {
  const { container, getByText } = render(
    <MockProvider>
      <ManageGallery
        mockItems={mockManageGalleryItems}
        mockDomains={mockManageGalleryDomains}
        mockUser={mockManageGalleryAdmin}
      />
    </MockProvider>
  );

  fireEvent.click(getByText('+ יצירה חדשה'));
  expect(container.querySelector(`.${styles.formCard}`)).not.toBeNull();

  fireEvent.click(getByText('ביטול'));
  expect(container.querySelector(`.${styles.formCard}`)).toBeNull();
});

it('filters the table rows by the search query', () => {
  const { container } = render(
    <MockProvider>
      <ManageGallery
        mockItems={mockManageGalleryItems}
        mockDomains={mockManageGalleryDomains}
        mockUser={mockManageGalleryAdmin}
      />
    </MockProvider>
  );

  const searchInput = container.querySelector(`.${styles.searchField} input`) as HTMLInputElement;
  fireEvent.change(searchInput, { target: { value: 'נשימה' } });

  expect(container.textContent).toContain('נשימה והתחלה');
  expect(container.textContent).not.toContain('שקט אחרי הסערה');
});
