import { mockRevisions } from '@helemclub/editorial.entities.revision';
import { mockFieldDiffs } from '@helemclub/editorial.entities.field-diff';

/**
 * mock revision history used in compositions and specs. reuses the shared
 * revision entity mock, which represents 4 sequential revisions of the
 * same draft.
 */
export function mockRevisionHistory() {
  return mockRevisions();
}

/**
 * mock field-level diffs used in compositions and specs for the useDiff
 * hook, representing a comparison between two revisions.
 */
export function mockRevisionDiffs() {
  return mockFieldDiffs();
}
