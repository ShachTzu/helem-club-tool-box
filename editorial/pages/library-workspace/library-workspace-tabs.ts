import type { DraftStatus } from '@helemclub/editorial.entities.draft';

/**
 * the key identifying a workspace tab.
 */
export type LibraryWorkspaceTabKey =
  | 'mine'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'published';

/**
 * a single tab in the writer workspace, mapping a Hebrew label to the draft
 * statuses it displays. the `mine` tab shows every status.
 */
export type LibraryWorkspaceTab = {
  /**
   * unique key of the tab.
   */
  key: LibraryWorkspaceTabKey;

  /**
   * Hebrew label rendered on the tab.
   */
  label: string;

  /**
   * the draft statuses included in this tab. an empty list means all
   * statuses are included.
   */
  statuses: DraftStatus[];
};

/**
 * the tabs of the writer workspace, in display order.
 */
export const LIBRARY_WORKSPACE_TABS: LibraryWorkspaceTab[] = [
  { key: 'mine', label: 'הטיוטות שלי', statuses: [] },
  { key: 'in_review', label: 'בביקורת', statuses: ['in_review'] },
  { key: 'changes_requested', label: 'נדרשו תיקונים', statuses: ['changes_requested'] },
  { key: 'approved', label: 'אושרו', statuses: ['approved'] },
  { key: 'published', label: 'פורסמו', statuses: ['published'] },
];
