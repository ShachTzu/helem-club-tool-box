import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { DomainSelector } from '@helemclub/knowledge-domains.ui.domain-selector';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { useLabels } from '@helemclub/knowledge-base.hooks.use-labels';
import {
  useRecords,
  useCreateRecord,
  useUpdateRecord,
  useDeleteRecord,
} from '@helemclub/knowledge-base.hooks.use-records';
import type { CreateRecordInput } from '@helemclub/knowledge-base.hooks.use-records';
import type { ManageRecordFormValues } from './manage-record-form-values-type.js';
import type { ManageRecordsMockRecord } from './manage-records-mock-record-type.js';
import type { ManageRecordsMockLabel } from './manage-records-mock-label-type.js';
import styles from './manage-records.module.scss';

const EMPTY_FORM_VALUES: ManageRecordFormValues = {
  labelId: ``,
  title: ``,
  mediaType: `video`,
  mediaUrl: ``,
  thumbnailUrl: ``,
  domains: [],
};

const MEDIA_TYPE_OPTIONS: { value: CreateRecordInput['mediaType']; label: string }[] = [
  { value: `video`, label: `🎬 וידאו` },
  { value: `audio`, label: `🎧 אודיו` },
];

/**
 * plain, serializable shape of the current user, matching the platform's
 * user entity, used to bypass the auth request in tests and compositions.
 */
export type ManageRecordsMockUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'member' | 'writer' | 'moderator' | 'admin';
  provider: 'email' | 'google';
  createdAt: string;
};

export type ManageRecordsProps = {
  /**
   * roles allowed to access this admin panel.
   */
  allowedRoles?: ('member' | 'writer' | 'moderator' | 'admin')[];

  /**
   * provide a mock signed-in user to bypass the auth request. useful for tests
   * and compositions. pass null to simulate a signed-out state.
   */
  mockUser?: ManageRecordsMockUser | null;

  /**
   * provide mock records to bypass the network request, useful for tests and compositions.
   */
  mockRecords?: ManageRecordsMockRecord[];

  /**
   * provide mock labels to bypass the network request, useful for tests and compositions.
   */
  mockLabels?: ManageRecordsMockLabel[];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_ALLOWED_ROLES: ManageRecordsProps['allowedRoles'] = [`admin`];

/**
 * admin CRUD screen for knowledge-base media records: create, edit and
 * delete video/audio records, assigning a label (project) and domains.
 * protected to admin users. RTL.
 */
export function ManageRecords({
  allowedRoles = DEFAULT_ALLOWED_ROLES,
  mockUser,
  mockRecords,
  mockLabels,
  className,
  style,
}: ManageRecordsProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles} mockData={mockUser}>
      <ManageRecordsPanel mockRecords={mockRecords} mockLabels={mockLabels} className={className} style={style} />
    </ProtectedRoute>
  );
}

type ManageRecordsPanelProps = {
  mockRecords?: ManageRecordsMockRecord[];
  mockLabels?: ManageRecordsMockLabel[];
  className?: string;
  style?: React.CSSProperties;
};

function ManageRecordsPanel({ mockRecords, mockLabels, className, style }: ManageRecordsPanelProps) {
  const { labels } = useLabels(mockLabels ? { mockData: mockLabels } : undefined);
  const { records, loading, error, refetch } = useRecords(
    mockRecords ? { mockData: mockRecords.map((record) => toMediaRecordLike(record)) } : undefined
  );
  const { createRecord, loading: creating } = useCreateRecord();
  const { updateRecord, loading: updating } = useUpdateRecord();
  const { deleteRecord } = useDeleteRecord();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [formValues, setFormValues] = useState<ManageRecordFormValues>(EMPTY_FORM_VALUES);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>(undefined);

  const labelNameById = useMemo(() => {
    const map: Record<string, string> = {};
    labels.forEach((label) => {
      map[label.id] = label.name;
    });
    return map;
  }, [labels]);

  const columns: TableColumn[] = useMemo(
    () => [
      { key: `title`, header: `כותרת` },
      { key: `labelName`, header: `פרויקט`, hideOnMobile: true },
      {
        key: `mediaType`,
        header: `סוג מדיה`,
        align: `center`,
        renderCell: (row) => (row.mediaType === `video` ? `🎬 וידאו` : `🎧 אודיו`),
      },
      { key: `domainsLabel`, header: `תחומים`, hideOnMobile: true },
      {
        key: `viewCount`,
        header: `צפיות`,
        align: `end`,
        renderCell: (row) => Number(row.viewCount || 0).toLocaleString(`he-IL`),
      },
      {
        key: `actions`,
        header: `פעולות`,
        align: `end`,
        renderCell: (row) => (
          <div className={styles.rowActions}>
            <Button variant="secondary" size="sm" onClick={() => openEditForm(String(row.id))}>
              עריכה
            </Button>
            <Button variant="danger" size="sm" onClick={() => setPendingDeleteId(String(row.id))}>
              מחיקה
            </Button>
          </div>
        ),
      },
    ],
    [records, labelNameById]
  );

  const rows: TableRow[] = useMemo(
    () =>
      records.map((record) => ({
        id: record.id,
        title: record.title,
        labelName: labelNameById[record.labelId] || record.labelId,
        mediaType: record.mediaType,
        domainsLabel: record.domains.length > 0 ? record.domains.join(`, `) : `—`,
        viewCount: record.viewCount,
      })),
    [records, labelNameById]
  );

  const openCreateForm = () => {
    setEditingId(undefined);
    setFormValues({
      ...EMPTY_FORM_VALUES,
      labelId: labels[0]?.id || ``,
    });
    setFormError(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    const record = records.find((item) => item.id === id);
    if (!record) return;
    setEditingId(id);
    setFormValues({
      labelId: record.labelId,
      title: record.title,
      mediaType: record.mediaType,
      mediaUrl: record.mediaUrl,
      thumbnailUrl: record.thumbnailUrl || ``,
      domains: record.domains,
    });
    setFormError(undefined);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(undefined);
    setFormError(undefined);
  };

  const handleSubmit = async () => {
    if (!formValues.labelId || !formValues.title || !formValues.mediaUrl) {
      setFormError(`יש למלא פרויקט, כותרת וכתובת מדיה.`);
      return;
    }

    const input: CreateRecordInput = {
      labelId: formValues.labelId,
      title: formValues.title,
      mediaType: formValues.mediaType,
      mediaUrl: formValues.mediaUrl,
      thumbnailUrl: formValues.thumbnailUrl || undefined,
      domains: formValues.domains,
    };

    if (editingId) {
      await updateRecord(editingId, input);
    } else {
      await createRecord(input);
    }

    closeForm();
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    await deleteRecord(pendingDeleteId);
    setPendingDeleteId(undefined);
    refetch();
  };

  return (
    <div className={classNames(styles.manageRecords, className)} style={style}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>ניהול תכני ספריית הידע</h2>
          <p className={styles.subtitle}>יצירה, עריכה ומחיקה של רשומות מדיה — וידאו ואודיו — המתויגות לפרויקטים ותחומים.</p>
        </div>
        <Button variant="accent" onClick={() => openCreateForm()}>
          + רשומה חדשה
        </Button>
      </div>

      {error && <div className={styles.errorBanner}>אירעה שגיאה בטעינת הרשומות.</div>}

      {loading ? (
        <div className={styles.loadingState}>טוען רשומות...</div>
      ) : (
        <Table columns={columns} rows={rows} emptyMessage="עדיין אין רשומות מדיה בספרייה." />
      )}

      {isFormOpen && (
        <div className={styles.formOverlay}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{editingId ? `עריכת רשומה` : `רשומה חדשה`}</h3>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="manage-records-label">
                פרויקט
              </label>
              <select
                id="manage-records-label"
                className={styles.select}
                value={formValues.labelId}
                onChange={(event) => setFormValues({ ...formValues, labelId: event.target.value })}
              >
                <option value="">בחרו פרויקט...</option>
                {labels.map((label) => (
                  <option key={label.id} value={label.id}>
                    {label.name}
                  </option>
                ))}
              </select>
            </div>

            <TextInput
              label="כותרת"
              placeholder="כותרת הרשומה"
              value={formValues.title}
              onChange={(value) => setFormValues({ ...formValues, title: value })}
              required
            />

            <div className={styles.formField}>
              <span className={styles.formLabel}>סוג מדיה</span>
              <div className={styles.mediaTypeToggle}>
                {MEDIA_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={classNames(
                      styles.mediaTypeOption,
                      formValues.mediaType === option.value && styles.mediaTypeOptionActive
                    )}
                    onClick={() => setFormValues({ ...formValues, mediaType: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <TextInput
              label="כתובת מדיה (URL)"
              type="url"
              placeholder="https://..."
              value={formValues.mediaUrl}
              onChange={(value) => setFormValues({ ...formValues, mediaUrl: value })}
              required
            />

            <TextInput
              label="כתובת תמונה ממוזערת (אופציונלי)"
              type="url"
              placeholder="https://..."
              value={formValues.thumbnailUrl}
              onChange={(value) => setFormValues({ ...formValues, thumbnailUrl: value })}
            />

            <DomainSelector
              value={formValues.domains}
              onChange={(domainIds) => setFormValues({ ...formValues, domains: domainIds })}
              label="תחומים רלוונטיים"
              showSummary
            />

            {formError && <div className={styles.formError}>{formError}</div>}

            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => closeForm()}>
                ביטול
              </Button>
              <Button variant="primary" loading={creating || updating} onClick={() => handleSubmit()}>
                {editingId ? `שמירת שינויים` : `יצירת רשומה`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteId && (
        <div className={styles.formOverlay}>
          <div className={styles.confirmCard}>
            <h3 className={styles.formTitle}>מחיקת רשומה</h3>
            <p className={styles.subtitle}>פעולה זו תמחק את הרשומה לצמיתות. להמשיך?</p>
            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => setPendingDeleteId(undefined)}>
                ביטול
              </Button>
              <Button variant="danger" onClick={() => handleConfirmDelete()}>
                מחיקה
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function toMediaRecordLike(record: ManageRecordsMockRecord) {
  const domains = record.domains || [];
  const viewCount = record.viewCount || 0;
  const plainRecord = {
    id: record.id,
    slug: record.slug,
    labelId: record.labelId,
    title: record.title,
    mediaType: record.mediaType,
    mediaUrl: record.mediaUrl,
    thumbnailUrl: record.thumbnailUrl,
    domains,
    viewCount,
    publishedAt: record.publishedAt,
  };

  return {
    ...plainRecord,
    description: undefined,
    durationSec: undefined,
    isVideo: record.mediaType === `video`,
    isAudio: record.mediaType === `audio`,
    formattedDuration: undefined,
    toObject: () => plainRecord,
  };
}
