import { Draft, type PlainDraft, type DraftStatus } from '@helemclub/editorial.entities.draft';

/**
 * shape of a draft as it travels over the wire: the payload is a JSON
 * string on the GraphQL schema rather than a free-form object.
 */
export type RawDraft = {
  id: string;
  contentType: string;
  contentRef?: string | null;
  title: string;
  payload?: string | null;
  domains?: (string | null)[] | null;
  status: DraftStatus;
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

/**
 * parses the JSON-encoded payload field returned by the GraphQL API,
 * falling back to an empty object when it is missing or malformed.
 */
function parsePayload(payload?: string | null): Record<string, any> {
  if (!payload) return {};

  try {
    return JSON.parse(payload);
  } catch {
    return {};
  }
}

/**
 * converts a raw GraphQL draft into a Draft entity, decoding its
 * JSON-encoded payload.
 */
export function toDraft(raw: RawDraft): Draft {
  const plain: PlainDraft = {
    id: raw.id,
    contentType: raw.contentType,
    contentRef: raw.contentRef || undefined,
    title: raw.title,
    payload: parsePayload(raw.payload),
    domains: (raw.domains || []).filter((domain): domain is string => Boolean(domain)),
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
  };

  return Draft.from(plain);
}

/**
 * encodes a payload object into the JSON string expected by the
 * SaveDraftOptions input.
 */
export function serializePayload(payload?: Record<string, any>): string | undefined {
  if (!payload) return undefined;
  return JSON.stringify(payload);
}
