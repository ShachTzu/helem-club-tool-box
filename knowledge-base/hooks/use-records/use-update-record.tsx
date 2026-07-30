import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { MediaRecord, type PlainMediaRecord, type MediaType } from '@helemclub/knowledge-base.entities.media-record';

/**
 * input accepted to update an existing media record. all fields
 * are optional besides the id of the record to update.
 */
export type UpdateRecordInput = {
  labelId?: string;
  title?: string;
  description?: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  durationSec?: number;
  domains?: string[];
};

const UPDATE_RECORD_MUTATION = gql`
  mutation UpdateRecord($id: String!, $options: KnowledgeBaseUpdateRecordOptions) {
    updateRecord(id: $id, options: $options) {
      id
      slug
      labelId
      title
      description
      mediaType
      mediaUrl
      thumbnailUrl
      durationSec
      domains
      viewCount
      publishedAt
    }
  }
`;

/**
 * updates an existing media record in the knowledge base.
 */
export function useUpdateRecord() {
  const [mutate, results] = useMutation<{ updateRecord: PlainMediaRecord }>(UPDATE_RECORD_MUTATION);

  const updateRecord = async (id: string, input: UpdateRecordInput) => {
    const result = await mutate({ variables: { id, options: input } });
    return result.data?.updateRecord ? MediaRecord.from(result.data.updateRecord) : undefined;
  };

  return {
    updateRecord,
    loading: results.loading,
    error: results.error,
  };
}
