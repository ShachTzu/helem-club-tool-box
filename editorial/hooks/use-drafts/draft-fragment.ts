import { gql } from '@apollo/client';

/**
 * shared set of fields fetched for a draft across the list, single-item and
 * save operations, keeping the three GraphQL documents in sync.
 */
export const DRAFT_FIELDS_FRAGMENT = gql`
  fragment DraftFields on Draft {
    id
    contentType
    contentRef
    title
    payload
    domains
    status
    authorId
    authorName
    currentVersion
    createdAt
    updatedAt
    submittedAt
    publishedAt
    lastReviewerId
    lastReviewNote
  }
`;
