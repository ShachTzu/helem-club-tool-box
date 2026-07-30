import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { MediaRecord, type PlainMediaRecord, type MediaType } from '@helemclub/knowledge-base.entities.media-record';

/**
 * input required to create a new media record.
 */
export type CreateRecordInput = {
  labelId: string;
  title: string;
  description?: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  durationSec?: number;
  domains?: string[];
};

const CREATE_RECORD_MUTATION = gql`
  mutation CreateRecord($options: KnowledgeBaseCreateRecordOptions) {
    createRecord(options: $options) {
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
 * creates a new media record in the knowledge base.
 */
export function useCreateRecord() {
  const [mutate, results] = useMutation<{ createRecord: PlainMediaRecord }>(CREATE_RECORD_MUTATION);

  const createRecord = async (input: CreateRecordInput) => {
    const result = await mutate({ variables: { options: input } });
    return result.data?.createRecord ? MediaRecord.from(result.data.createRecord) : undefined;
  };

  return {
    createRecord,
    loading: results.loading,
    error: results.error,
  };
}
