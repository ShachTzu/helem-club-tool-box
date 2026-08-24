import { Revision } from '@helemclub/editorial.entities.revision';
import { FieldDiff, diffPayloads } from '@helemclub/editorial.entities.field-diff';

/**
 * compares the payloads of the two latest revisions in a list, returning the
 * field-level differences between them. revisions are compared by
 * versionNumber, so the input order does not matter. returns an empty array
 * when fewer than two revisions are provided.
 */
export function compareLatest(revisions: Revision[]): FieldDiff[] {
  if (revisions.length < 2) return [];

  const sorted = [...revisions].sort((a, b) => a.versionNumber - b.versionNumber);
  const previous = sorted[sorted.length - 2];
  const latest = sorted[sorted.length - 1];

  return diffPayloads(previous.payload, latest.payload);
}
