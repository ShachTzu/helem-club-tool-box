import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ManageGallery } from './manage-gallery.js';
import {
  mockManageGalleryItems,
  mockManageGalleryDomains,
  mockManageGalleryAdmin,
  mockManageGalleryMember,
} from './manage-gallery.mock.js';

export const AdminViewingGalleryItems = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, maxWidth: 1100 }}>
        <ManageGallery
          mockItems={mockManageGalleryItems}
          mockDomains={mockManageGalleryDomains}
          mockUser={mockManageGalleryAdmin}
        />
      </div>
    </MemoryRouter>
  );
};

export const EmptyGalleryForAdmin = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, maxWidth: 1100 }}>
        <ManageGallery
          mockItems={[]}
          mockDomains={mockManageGalleryDomains}
          mockUser={mockManageGalleryAdmin}
        />
      </div>
    </MemoryRouter>
  );
};

export const AccessDeniedForNonAdmin = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, maxWidth: 1100 }}>
        <ManageGallery
          mockItems={mockManageGalleryItems}
          mockDomains={mockManageGalleryDomains}
          mockUser={mockManageGalleryMember}
        />
      </div>
    </MemoryRouter>
  );
};
