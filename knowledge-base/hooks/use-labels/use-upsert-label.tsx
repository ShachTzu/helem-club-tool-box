import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Label, type PlainLabel } from '@helemclub/knowledge-base.entities.label';

/**
 * GraphQL mutation creating or updating a knowledge base label by its slug.
 */
export const UPSERT_LABEL_MUTATION = gql`
  mutation UpsertLabel($options: KnowledgeBaseUpsertLabelOptions) {
    upsertLabel(options: $options) {
      id
      slug
      name
      description
      coverImage
      recordCount
    }
  }
`;

export type UpsertLabelInput = {
  /**
   * URL-friendly slug of the label. An existing label with the same slug will be updated.
   */
  slug: string;

  /**
   * display name of the label, in Hebrew.
   */
  name: string;

  /**
   * optional description of the label, in Hebrew.
   */
  description?: string;

  /**
   * optional cover image URL for the label.
   */
  coverImage?: string;
};

export type UseUpsertLabelResult = {
  /**
   * creates or updates a label with the given input, returning the saved label.
   */
  upsertLabel: (input: UpsertLabelInput) => Promise<Label | undefined>;

  /**
   * the label returned by the last successful mutation.
   */
  label?: Label;

  /**
   * whether the mutation is currently in flight.
   */
  loading: boolean;

  /**
   * an error message, if the mutation failed.
   */
  error?: string;
};

/**
 * creates or updates a knowledge base label ("project"). Intended for admin use,
 * as it allows managing labels used to group media records.
 */
export function useUpsertLabel(): UseUpsertLabelResult {
  const [upsertLabelMutation, { data, loading, error }] = useMutation<
    { upsertLabel: PlainLabel },
    { options: UpsertLabelInput }
  >(UPSERT_LABEL_MUTATION);

  const upsertLabel = async (input: UpsertLabelInput) => {
    const result = await upsertLabelMutation({ variables: { options: input } });
    return result.data?.upsertLabel ? Label.from(result.data.upsertLabel) : undefined;
  };

  return {
    upsertLabel,
    label: data?.upsertLabel ? Label.from(data.upsertLabel) : undefined,
    loading,
    error: error?.message,
  };
}
