import { gql } from '@apollo/client';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';

/**
 * GraphQL fragment listing every field of a Draft returned by the review
 * mutations.
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

/**
 * raw shape of a Draft as returned by the GraphQL server. the payload field
 * is served as a JSON-encoded string.
 */
export type RawDraft = {
  id: string;
  contentType: string;
  contentRef?: string | null;
  title: string;
  payload?: string | null;
  domains?: string[] | null;
  status: PlainDraft['status'];
  authorId: string;
  authorName: string;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string | null;
  publishedAt?: string | null;
  lastReviewerId?: string | null;
  lastReviewNote?: string | null;
};

function parsePayload(payload?: string | null): Record<string, any> {
  if (!payload) return {};
  try {
    return JSON.parse(payload);
  } catch {
    return {};
  }
}

/**
 * builds a Draft entity from the raw GraphQL response, parsing the
 * JSON-encoded payload field.
 */
export function toDraft(raw: RawDraft): Draft {
  return Draft.from({
    id: raw.id,
    contentType: raw.contentType,
    contentRef: raw.contentRef || undefined,
    title: raw.title,
    payload: parsePayload(raw.payload),
    domains: raw.domains || [],
    status: raw.status,
    authorId: raw.authorId,
    authorName: raw.authorName,
    currentVersion: raw.currentVersion,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    submittedAt: raw.submittedAt || undefined,
    publishedAt: raw.publishedAt || undefined,
    lastReviewerId: raw.lastReviewerId || undefined,
    lastReviewNote: raw.lastReviewNote || undefined,
  });
}
