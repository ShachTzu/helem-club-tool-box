import { renderHook, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { mockLabel } from '@helemclub/knowledge-base.entities.label';
import { UPSERT_LABEL_MUTATION, useUpsertLabel } from './use-upsert-label.js';

it('should upsert a label and return the saved label', async () => {
  const label = mockLabel();
  const mocks = [
    {
      request: {
        query: UPSERT_LABEL_MUTATION,
        variables: {
          options: {
            slug: label.slug,
            name: label.name,
            description: label.description,
            coverImage: label.coverImage,
          },
        },
      },
      result: {
        data: {
          upsertLabel: label.toObject(),
        },
      },
    },
  ];

  const { result } = renderHook(() => useUpsertLabel(), {
    wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
  });

  let savedLabel;
  await act(async () => {
    savedLabel = await result.current.upsertLabel({
      slug: label.slug,
      name: label.name,
      description: label.description,
      coverImage: label.coverImage,
    });
  });

  expect(savedLabel?.slug).toBe(label.slug);
  expect(result.current.loading).toBe(false);
});
