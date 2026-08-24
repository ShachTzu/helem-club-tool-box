import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Tabs } from '@helemclub/design.navigation.tabs';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { CtaButton } from '@helemclub/design.actions.cta-button';
import { Button } from '@helemclub/design.actions.button';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { Spinner } from '@helemclub/design.loaders.spinner';
import { Modal } from '@helemclub/design.overlays.modal';
import { DomainFilter } from '@helemclub/knowledge-domains.ui.domain-filter';
import { DraftCard } from '@helemclub/editorial.ui.draft-card';
import { LibraryIcon } from '@helemclub/editorial.icons.library-icons';
import { useDrafts } from '@helemclub/editorial.hooks.use-drafts';
import type { PlainDraft } from '@helemclub/editorial.entities.draft';
import { LIBRARY_WORKSPACE_TABS, type LibraryWorkspaceTabKey } from './library-workspace-tabs.js';
import type { LibraryWorkspaceUser } from './library-workspace-user-type.js';
import styles from './library-workspace.module.scss';

/**
 * a content type the writer can start a new draft for. in the running
 * platform these are injected from the knowledge-library ContentType slot.
 */
export type LibraryWorkspaceContentType = {
  /**
   * unique key of the content type, e.g. 'post'.
   */
  contentType: string;

  /**
   * Hebrew label of the content type, e.g. 'מאמר בבלוג'.
   */
  label: string;
};

const DEFAULT_CONTENT_TYPES: LibraryWorkspaceContentType[] = [
  { contentType: 'post', label: 'מאמר בבלוג' },
  { contentType: 'media-record', label: 'רשומת מדיה' },
];

export type LibraryWorkspaceProps = {
  /**
   * content types the writer can create a new draft for, registered by
   * feature aspects into the library's ContentType slot.
   */
  contentTypes?: LibraryWorkspaceContentType[];

  /**
   * base path used to build links to the draft editor.
   */
  draftLinkBase?: string;

  /**
   * provide mock drafts, bypassing the GraphQL query.
   */
  mockDrafts?: PlainDraft[];

  /**
   * provide a mock signed-in user, bypassing the auth query.
   */
  mockUser?: LibraryWorkspaceUser | null;

  /**
   * simulates a loading state, regardless of the underlying data.
   */
  mockLoading?: boolean;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * the writer workspace at `/library`: the drafts a writer is working on,
 * grouped by editorial status, with free text search and domain filtering,
 * plus an entry point for starting a new draft. moderators and admins can
 * toggle to see every draft in the system. RTL and responsive.
 */
export function LibraryWorkspace({
  contentTypes = DEFAULT_CONTENT_TYPES,
  draftLinkBase = '/library/draft',
  mockDrafts,
  mockUser,
  mockLoading = false,
  className,
  style,
}: LibraryWorkspaceProps) {
  return (
    <ProtectedRoute
      allowedRoles={['writer', 'moderator', 'admin']}
      mockData={mockUser === null ? undefined : (mockUser as never)}
    >
      <LibraryWorkspaceContent
        contentTypes={contentTypes}
        draftLinkBase={draftLinkBase}
        mockDrafts={mockDrafts}
        mockUser={mockUser}
        mockLoading={mockLoading}
        className={className}
        style={style}
      />
    </ProtectedRoute>
  );
}

type LibraryWorkspaceContentProps = Required<
  Pick<LibraryWorkspaceProps, 'contentTypes' | 'draftLinkBase'>
> &
  Pick<LibraryWorkspaceProps, 'mockDrafts' | 'mockUser' | 'mockLoading' | 'className' | 'style'>;

function LibraryWorkspaceContent({
  contentTypes,
  draftLinkBase,
  mockDrafts,
  mockUser,
  mockLoading,
  className,
  style,
}: LibraryWorkspaceContentProps) {
  const navigate = useNavigate();
  const auth = useAuth(mockUser !== undefined ? { mockData: mockUser as never } : undefined);
  const user = auth.user;
  const isModerator = Boolean(user && (user.role === 'moderator' || user.role === 'admin'));

  const [activeTab, setActiveTab] = useState<LibraryWorkspaceTabKey>('mine');
  const [search, setSearch] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [creating, setCreating] = useState(false);

  const hasMock = mockDrafts !== undefined;
  const { drafts, loading } = useDrafts(hasMock ? { mockData: mockDrafts } : { limit: 100 });

  /**
   * the drafts visible to the current viewer: writers always see their own,
   * moderators and admins can opt into seeing everyone's.
   */
  const visibleDrafts = useMemo(() => {
    if (isModerator && showAll) return drafts;
    if (!user) return drafts;
    return drafts.filter((draft) => draft.authorId === user.id);
  }, [drafts, isModerator, showAll, user]);

  const counts = useMemo(() => {
    const map: Record<LibraryWorkspaceTabKey, number> = {
      mine: visibleDrafts.length,
      in_review: 0,
      changes_requested: 0,
      approved: 0,
      published: 0,
    };
    visibleDrafts.forEach((draft) => {
      if (draft.status === 'in_review') map.in_review += 1;
      if (draft.status === 'changes_requested') map.changes_requested += 1;
      if (draft.status === 'approved') map.approved += 1;
      if (draft.status === 'published') map.published += 1;
    });
    return map;
  }, [visibleDrafts]);

  const tabItems = useMemo(
    () =>
      LIBRARY_WORKSPACE_TABS.map((tab) => ({
        key: tab.key,
        label: `${tab.label} (${counts[tab.key]})`,
      })),
    [counts]
  );

  const filteredDrafts = useMemo(() => {
    const tab = LIBRARY_WORKSPACE_TABS.find((item) => item.key === activeTab);
    const statuses = tab?.statuses || [];
    const normalizedSearch = search.trim().toLowerCase();

    return visibleDrafts.filter((draft) => {
      if (statuses.length > 0 && !statuses.includes(draft.status)) return false;
      if (normalizedSearch && !draft.title.toLowerCase().includes(normalizedSearch)) return false;
      if (
        selectedDomains.length > 0 &&
        !selectedDomains.some((domain) => draft.domains.includes(domain))
      ) {
        return false;
      }
      return true;
    });
  }, [visibleDrafts, activeTab, search, selectedDomains]);

  const startDraft = (contentType: string) => {
    setCreating(false);
    navigate(`${draftLinkBase}/new?contentType=${encodeURIComponent(contentType)}`);
  };

  const isLoading = Boolean(mockLoading) || loading;
  const hasFilters = Boolean(search.trim()) || selectedDomains.length > 0 || activeTab !== 'mine';

  return (
    <PageLayout className={classNames(styles.workspace, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>
            <LibraryIcon size="small" />
            שכבת העריכה
          </span>
          <Heading level={1} className={styles.title}>
            ספריית הידע
          </Heading>
          <Paragraph className={styles.subtitle}>
            כאן נכתב התוכן לפני שהוא מתפרסם: טיוטות, גרסאות ומעקב אחרי מי אישר ומתי.
          </Paragraph>
        </div>
        <CtaButton onClick={() => setCreating(true)}>טיוטה חדשה</CtaButton>
      </div>

      <div className={styles.controls}>
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={(key: string) => setActiveTab(key as LibraryWorkspaceTabKey)}
        />

        <div className={styles.filterRow}>
          <TextInput
            placeholder="חיפוש בטיוטות..."
            value={search}
            onChange={setSearch}
            className={styles.searchInput}
          />
          {isModerator && (
            <label className={styles.showAllToggle}>
              <input
                type="checkbox"
                checked={showAll}
                onChange={(event) => setShowAll(event.target.checked)}
              />
              <span>הצג את כל הטיוטות</span>
            </label>
          )}
        </div>

        <DomainFilter value={selectedDomains} onChange={setSelectedDomains} />
      </div>

      {isLoading && (
        <div className={styles.stateBlock}>
          <Spinner />
          <Paragraph className={styles.loadingText}>טוענים את הטיוטות שלך...</Paragraph>
        </div>
      )}

      {!isLoading && filteredDrafts.length === 0 && (
        <div className={styles.stateBlock}>
          <EmptyState
            title={hasFilters ? 'לא נמצאו טיוטות תואמות' : 'עוד לא התחלתם לכתוב'}
            description={
              hasFilters
                ? 'נסו לשנות את החיפוש או את סינון התחומים כדי לראות טיוטות נוספות.'
                : 'כל תוכן שמתפרסם באתר מתחיל כאן, כטיוטה. אפשר לשמור, לחזור אליה ולערוך כמה שצריך לפני שליחה לביקורת.'
            }
            actionLabel="התחלת טיוטה חדשה"
            onAction={() => setCreating(true)}
          />
        </div>
      )}

      {!isLoading && filteredDrafts.length > 0 && (
        <div className={styles.grid}>
          {filteredDrafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft.toObject()} draftLinkBase={draftLinkBase} />
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="איזה סוג תוכן תרצו ליצור?"
        size="small"
      >
        <div className={styles.contentTypeList}>
          {contentTypes.map((type) => (
            <Button
              key={type.contentType}
              variant="secondary"
              onClick={() => startDraft(type.contentType)}
            >
              {type.label}
            </Button>
          ))}
          {contentTypes.length === 0 && (
            <Paragraph>עדיין לא נרשמו סוגי תוכן לספרייה.</Paragraph>
          )}
        </div>
      </Modal>
    </PageLayout>
  );
}
