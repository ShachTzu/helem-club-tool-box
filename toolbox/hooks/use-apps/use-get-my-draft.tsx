import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

/**
 * a member's own submission, with the fields needed to repopulate the submit
 * form when resuming a draft. includes the member's own contact email (their
 * own PII) — this query is owner-gated on the server.
 */
export type MyDraft = {
  id: string;
  name?: string;
  subtitle?: string;
  fullDescription?: string;
  externalLink?: string;
  icon?: string;
  screenshots?: string[];
  costType?: string;
  platform?: string[];
  language?: string;
  domains?: string[];
  developerName?: string;
  contactEmail?: string;
  submissionSource?: string;
  status?: string;
};

/**
 * GraphQL query loading one of the current member's own submissions by id.
 */
export const GET_MY_TOOLBOX_DRAFT_QUERY = gql`
  query GetMyToolboxDraft($id: String!) {
    getMyToolboxDraft(id: $id) {
      id
      name
      subtitle
      fullDescription
      externalLink
      icon
      screenshots
      costType
      platform
      language
      domains
      developerName
      contactEmail
      submissionSource
      status
    }
  }
`;

/**
 * loads one of the current member's own submissions (draft or otherwise) by id,
 * to resume editing. skips the query when no id is given. the server enforces
 * ownership in the query itself — another member's record is never returned.
 */
export function useGetMyDraft(id?: string) {
  const { data, loading, error } = useQuery<{ getMyToolboxDraft: MyDraft | null }>(
    GET_MY_TOOLBOX_DRAFT_QUERY,
    { skip: !id, variables: { id: id || '' } }
  );

  return { draft: data?.getMyToolboxDraft || undefined, loading, error };
}
