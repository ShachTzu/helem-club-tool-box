import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { useGallery } from './use-gallery.js';

it('should return the provided mock items', async () => {
  const mockItems = [
    mockGalleryItem({ id: '1', slug: 'a', title: 'א' }).toObject(),
    mockGalleryItem({ id: '2', slug: 'b', title: 'ב' }).toObject(),
  ];

  const { result } = renderHook(() => useGallery(undefined, { mockData: mockItems }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.items).toHaveLength(2);
  expect(result.current.items[0].title).toBe('א');
});

it('should return an empty list when no mock data is provided and no items were fetched', () => {
  const { result } = renderHook(() => useGallery(undefined, { mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.items).toHaveLength(0);
  expect(result.current.loading).toBe(false);
});

it('should expose create, update and delete functions', () => {
  const { result } = renderHook(() => useGallery(undefined, { mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(typeof result.current.createItem).toBe('function');
  expect(typeof result.current.updateItem).toBe('function');
  expect(typeof result.current.deleteItem).toBe('function');
  expect(typeof result.current.getItem).toBe('function');
});
