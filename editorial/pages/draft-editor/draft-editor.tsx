import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { Link } from '@helemclub/design.navigation.link';
import { Spinner } from '@helemclub/design.loaders.spinner';
import { DomainSelector } from '@helemclub/knowledge-domains.ui.domain-selector';
import { DraftStatusBadge } from '@helemclub/editorial.ui.draft-status-badge';
import { ReviewActions } from '@helemclub/editorial.ui.review-actions';
import { RevisionTimeline } from '@helemclub/editorial.ui.revision-timeline';
import { useDraft, useSaveDraft } from '@helemclub/editorial.hooks.use-drafts';
import { useRevisions } from '@helemclub/editorial.hooks.use-revisions';
import { useApprovalTrail } from '@helemclub/editorial.hooks.use-approvals';
import type { PlainDraft } from '@helemclub/editorial.entities.draft';
import { Revision, type PlainRevision } from '@helemclub/editorial.entities.revision';
import type { PlainApprovalEntry } from '@helemclub/editorial.entities.approval-entry';
import { GenericPayloadEditor, type ContentTypeField } from './generic-payload-editor.js';
import type { DraftEditorUser } from './draft-editor-user-type.js';
import styles from './draft-editor.module.scss';

/**
 * the props a content type editor component receives from the library.
 */
export type ContentTypeEditorProps = {
  /**
   * the current draft payload.
   */
  payload: Record<string, any>;

  /**
   * called with the full updated payload whenever a field changes.
   */
  onChange: (payload: Record<string, any>) => void;

  /**
   * renders the editor in read-only mode.
   */
  readOnly?: boolean;
};

export type DraftEditorProps = {
  /**
   * the draft id to edit. falls back to the `:id` route param.
   */
  draftId?: string;

  /**
   * the dedicated editor component registered by the content type. when
   * absent, a generic field editor is rendered instead.
   */
  editor?: ComponentType<ContentTypeEditorProps>;

  /**
   * field descriptors used by the generic editor fallback.
   */
  fields?: ContentTypeField[];

  /**
   * base path used to build the link to the full version history.
   */
  draftLinkBase?: string;

  /**
   * provide a mock draft, bypassing the GraphQL query.
   */
  mockDraft?: PlainDraft | null;

  /**
   * provide mock revisions for the sidebar timeline.
   */
  mockRevisions?: PlainRevision[];

  /**
   * provide a mock approval trail for the sidebar timeline.
   */
  mockApprovals?: PlainApprovalEntry[];

  /**
   * provide a mock signed-in user, bypassing the auth query.
   */
  mockUser?: DraftEditorUser | null;

  /**
   * simulates a loading state.
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
 * the draft editor at `/library/draft/:id`. edits the draft title, its
 * coping domains and its content-type specific payload, autosaving as the
 * writer types. the sidebar shows the current status, the editorial actions
 * available to the viewer, and a compact history of versions and approvals.
 */
export function DraftEditor({
  draftId,
  editor,
  fields,
  draftLinkBase = '/library/draft',
  mockDraft,
  mockRevisions,
  mockApprovals,
  mockUser,
  mockLoading = false,
  className,
  style,
}: DraftEditorProps) {
  return (
    <ProtectedRoute
      allowedRoles={['writer', 'moderator', 'admin']}
      mockData={mockUser === null ? undefined : (mockUser as never)}
    >
      <DraftEditorContent
        draftId={draftId}
        editor={editor}
        fields={fields}
        draftLinkBase={draftLinkBase}
        mockDraft={mockDraft}
        mockRevisions={mockRevisions}
        mockApprovals={mockApprovals}
        mockUser={mockUser}
        mockLoading={mockLoading}
        className={className}
        style={style}
      />
    </ProtectedRoute>
  );
}

function DraftEditorContent({
  draftId,
  editor: Editor,
  fields,
  draftLinkBase,
  mockDraft,
  mockRevisions,
  mockApprovals,
  mockUser,
  mockLoading,
  className,
  style,
}: DraftEditorProps) {
  const params = useParams();
  const resolvedId = draftId || params.id || '';

  const { draft, loading } = useDraft(
    resolvedId,
    mockDraft !== undefined ? { mockData: mockDraft } : undefined
  );
  const { saveDraft, saving } = useSaveDraft();
  const { revisions } = useRevisions(
    resolvedId,
    mockRevisions !== undefined
      ? { mockData: mockRevisions.map((revision) => Revision.from(revision)) }
      : undefined
  );
  const { entries } = useApprovalTrail(
    resolvedId,
    mockApprovals !== undefined ? { mockData: mockApprovals } : undefined
  );

  const [title, setTitle] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [payload, setPayload] = useState<Record<string, any>>({});
  const [changeSummary, setChangeSummary] = useState('');
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | undefined>(undefined);

  const hydratedFor = useRef<string | undefined>(undefined);

  /**
   * hydrates the local form state once per loaded draft, so autosave never
   * fights the incoming server data while the writer is typing.
   */
  useEffect(() => {
    if (!draft || hydratedFor.current === draft.id) return;
    hydratedFor.current = draft.id;
    setTitle(draft.title);
    setDomains(draft.domains);
    setPayload(draft.payload);
    setDirty(false);
  }, [draft]);

  const isEditable = Boolean(
    draft && (draft.status === 'draft' || draft.status === 'changes_requested')
  );

  const persist = useCallback(async () => {
    if (!draft) return;
    await saveDraft({
      id: draft.id,
      contentType: draft.contentType,
      contentRef: draft.contentRef,
      title,
      payload,
      domains,
      changeSummary: changeSummary || undefined,
    });
    setDirty(false);
    setSavedAt(new Date());
  }, [draft, saveDraft, title, payload, domains, changeSummary]);

  /**
   * autosaves the draft two seconds after the writer stops typing.
   */
  useEffect(() => {
    if (!dirty || !isEditable) return undefined;
    const timer = setTimeout(() => {
      void persist();
    }, 2000);
    return () => clearTimeout(timer);
  }, [dirty, isEditable, persist]);

  /**
   * warns the writer before leaving the page with unsaved changes.
   */
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const saveIndicator = useMemo(() => {
    if (saving) return 'שומר...';
    if (dirty) return 'יש שינויים שלא נשמרו';
    if (savedAt) return 'נשמר לפני רגע';
    return 'הכול שמור';
  }, [saving, dirty, savedAt]);

  const isLoading = Boolean(mockLoading) || loading;

  if (isLoading) {
    return (
      <PageLayout className={classNames(styles.editor, className)} style={style}>
        <div className={styles.stateBlock}>
          <Spinner />
          <Paragraph className={styles.loadingText}>טוענים את הטיוטה...</Paragraph>
        </div>
      </PageLayout>
    );
  }

  if (!draft) {
    return (
      <PageLayout className={classNames(styles.editor, className)} style={style}>
        <div className={styles.stateBlock}>
          <Heading level={2}>הטיוטה לא נמצאה</Heading>
          <Paragraph>ייתכן שהטיוטה נמחקה, או שאין לכם הרשאה לצפות בה.</Paragraph>
          <Link href="/library">חזרה לספריית הידע</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={classNames(styles.editor, className)} style={style}>
      <div className={styles.topBar}>
        <Link href="/library" className={styles.backLink}>
          → חזרה לספריית הידע
        </Link>
        <div className={styles.topBarMeta}>
          <DraftStatusBadge status={draft.status} />
          <span className={styles.saveIndicator}>{saveIndicator}</span>
        </div>
      </div>

      {draft.status === 'changes_requested' && draft.lastReviewNote && (
        <div className={styles.reviewNote}>
          <strong className={styles.reviewNoteTitle}>הערת המנחה</strong>
          <Paragraph className={styles.reviewNoteBody}>{draft.lastReviewNote}</Paragraph>
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          <TextInput
            label="כותרת"
            value={title}
            onChange={(value) => {
              setTitle(value);
              setDirty(true);
            }}
            disabled={!isEditable}
            placeholder="תנו לטיוטה כותרת ברורה..."
          />

          <DomainSelector
            value={domains}
            onChange={(value) => {
              setDomains(value);
              setDirty(true);
            }}
          />

          <div className={styles.payloadEditor}>
            {Editor ? (
              <Editor
                payload={payload}
                onChange={(next) => {
                  setPayload(next);
                  setDirty(true);
                }}
                readOnly={!isEditable}
              />
            ) : (
              <GenericPayloadEditor
                payload={payload}
                fields={fields}
                onChange={(next) => {
                  setPayload(next);
                  setDirty(true);
                }}
                readOnly={!isEditable}
              />
            )}
          </div>

          {isEditable && (
            <Textarea
              label="סיכום שינוי (אופציונלי)"
              helperText="תיאור קצר שיופיע בהיסטוריית הגרסאות ויעזור למנחה להבין מה השתנה."
              value={changeSummary}
              onChange={setChangeSummary}
              minRows={2}
            />
          )}
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.sidebarSection}>
            <h2 className={styles.sidebarTitle}>פעולות</h2>
            <ReviewActions draft={draft.toObject()} mockUser={mockUser as never} />
          </section>

          <section className={styles.sidebarSection}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>היסטוריה</h2>
              <Link href={`${draftLinkBase}/${draft.id}/history`} className={styles.historyLink}>
                היסטוריה מלאה
              </Link>
            </div>
            <RevisionTimeline
              revisions={revisions.map((revision) => revision.toObject())}
              approvals={entries.map((entry) => entry.toObject())}
              compact
            />
          </section>
        </aside>
      </div>
    </PageLayout>
  );
}
