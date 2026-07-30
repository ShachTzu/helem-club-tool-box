import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Table, type TableColumn, type TableRow } from '@helemclub/design.content.table';
import { DomainSelector, type DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';
import { useGallery } from '@helemclub/gallery.hooks.use-gallery';
import type { GalleryItemRecord } from './gallery-item-record-type.js';
import type { GalleryFormValues, GalleryFormMediaType } from './gallery-form-values-type.js';
import type { AdminUserRecord } from './admin-user-record-type.js';
import styles from './manage-gallery.module.scss';

const NEW_ITEM_ID = `new`;

const EMPTY_FORM_VALUES: GalleryFormValues = {
  title: ``,
  description: ``,
  mediaType: `image`,
  mediaUrl: ``,
  thumbnailUrl: ``,
  artistName: ``,
  domains: [],
};

function formatCreatedAt(isoDate: string) {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return `—`;
  return parsed.toLocaleDateString(`he-IL`);
}

function toFormValues(record: GalleryItemRecord): GalleryFormValues {
  return {
    title: record.title,
    description: record.description || ``,
    mediaType: record.mediaType,
    mediaUrl: record.mediaUrl,
    thumbnailUrl: record.thumbnailUrl || ``,
    artistName: record.artistName || ``,
    domains: record.domains || [],
  };
}

export type ManageGalleryProps = {
  /**
   * provide mock gallery items to bypass the network request, useful for tests and previews.
   */
  mockItems?: GalleryItemRecord[];

  /**
   * provide mock coping-domains to bypass the network request in the domain selector.
   */
  mockDomains?: DomainOption[];

  /**
   * provide mock data for the current user, bypassing the auth check. pass null to
   * simulate a signed-out state. useful for tests and previews.
   */
  mockUser?: AdminUserRecord | null;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

function ManageGalleryContent({ mockItems, mockDomains, className, style }: ManageGalleryProps) {
  const {
    items,
    loading,
    error,
    createItem,
    creating,
    createError,
    updateItem,
    updating,
    updateError,
    deleteItem,
    deleting,
  } = useGallery(undefined, { mockData: mockItems });

  const [records, setRecords] = useState<GalleryItemRecord[]>(() => mockItems || []);
  const [query, setQuery] = useState(``);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<GalleryFormValues>(EMPTY_FORM_VALUES);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setRecords(items.map((item) => item.toObject()));
  }, [items]);

  const filteredRecords = records.filter((record) => {
    if (!query.trim()) return true;
    const haystack = `${record.title} ${record.artistName || ``}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const openCreateForm = () => {
    setFormValues(EMPTY_FORM_VALUES);
    setFormError(undefined);
    setEditingId(NEW_ITEM_ID);
  };

  const openEditForm = (record: GalleryItemRecord) => {
    setFormValues(toFormValues(record));
    setFormError(undefined);
    setEditingId(record.id);
  };

  const closeForm = () => {
    setEditingId(null);
    setFormValues(EMPTY_FORM_VALUES);
    setFormError(undefined);
  };

  const handleDelete = async (id: string) => {
    const deleted = await deleteItem(id);
    if (deleted !== false) {
      setRecords((current) => current.filter((record) => record.id !== id));
    }
    if (editingId === id) {
      closeForm();
    }
  };

  const handleSubmit = async () => {
    if (!formValues.title.trim() || !formValues.mediaUrl.trim()) {
      setFormError(`יש למלא כותרת וקישור למדיה`);
      return;
    }

    setFormError(undefined);

    const input = {
      title: formValues.title.trim(),
      description: formValues.description.trim() || undefined,
      mediaType: formValues.mediaType,
      mediaUrl: formValues.mediaUrl.trim(),
      thumbnailUrl: formValues.thumbnailUrl.trim() || undefined,
      artistName: formValues.artistName.trim() || undefined,
      domains: formValues.domains,
    };

    if (editingId === NEW_ITEM_ID) {
      const created = await createItem(input);
      const nextRecord: GalleryItemRecord = created
        ? created.toObject()
        : {
            id: `local-${Date.now()}`,
            slug: input.title.trim().replace(/\s+/g, `-`),
            createdAt: new Date().toISOString(),
            ...input,
          };
      setRecords((current) => [nextRecord, ...current]);
    } else if (editingId) {
      const updated = await updateItem(editingId, input);
      setRecords((current) =>
        current.map((record) =>
          record.id === editingId
            ? updated ? updated.toObject() : { ...record, ...input }
            : record
        )
      );
    }

    closeForm();
  };

  const tableRows: TableRow[] = filteredRecords.map((record) => ({
    id: record.id,
    title: record.title,
    mediaType: record.mediaType === `video` ? `🎬 וידאו` : `🖼️ תמונה`,
    artistName: record.artistName || `—`,
    domains: record.domains && record.domains.length > 0 ? record.domains.join(`, `) : `—`,
    createdAt: formatCreatedAt(record.createdAt),
  }));

  const columns: TableColumn[] = [
    { key: `title`, header: `כותרת` },
    { key: `mediaType`, header: `סוג מדיה`, hideOnMobile: true },
    { key: `artistName`, header: `אמן/ית` },
    { key: `domains`, header: `תחומים`, hideOnMobile: true },
    { key: `createdAt`, header: `תאריך יצירה`, align: `end`, hideOnMobile: true },
    {
      key: `actions`,
      header: `פעולות`,
      align: `end`,
      renderCell: (row) => {
        const recordId = String(row.id);
        const record = records.find((item) => item.id === recordId);
        return (
          <span className={styles.rowActions}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => record && openEditForm(record)}
            >
              עריכה
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleting}
              onClick={() => handleDelete(recordId)}
            >
              מחיקה
            </Button>
          </span>
        );
      },
    },
  ];

  const isFormOpen = editingId !== null;
  const isSaving = creating || updating;
  const mutationError = createError || updateError;

  return (
    <div className={classNames(styles.panel, className)} style={style}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>ניהול תוכן</div>
          <h2 className={styles.title}>ניהול גלריית PTSDART</h2>
          <p className={styles.subtitle}>
            הוספה, עריכה ומחיקה של יצירות בגלריה — כותרת, קישור למדיה, אמן/ית ותחומי התמודדות.
          </p>
        </div>
        {!isFormOpen && (
          <Button variant="accent" onClick={() => openCreateForm()}>
            + יצירה חדשה
          </Button>
        )}
      </div>

      {isFormOpen && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>
            {editingId === NEW_ITEM_ID ? `יצירה חדשה` : `עריכת יצירה`}
          </h3>
          <div className={styles.formGrid}>
            <div className={styles.fieldFull}>
              <TextInput
                label="כותרת"
                required
                value={formValues.title}
                onChange={(value) => setFormValues((current) => ({ ...current, title: value }))}
                placeholder="שם היצירה"
              />
            </div>

            <div className={classNames(styles.fieldGroup, styles.fieldFull)}>
              <span className={styles.fieldLabel}>תיאור</span>
              <textarea
                className={styles.textarea}
                value={formValues.description}
                placeholder="תארו את היצירה בקצרה"
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>סוג מדיה</span>
              <span className={styles.mediaTypeToggle}>
                {(['image', 'video'] as GalleryFormMediaType[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={classNames(
                      styles.mediaTypeButton,
                      formValues.mediaType === option && styles.mediaTypeButtonActive
                    )}
                    onClick={() => setFormValues((current) => ({ ...current, mediaType: option }))}
                  >
                    {option === `image` ? `🖼️ תמונה` : `🎬 וידאו`}
                  </button>
                ))}
              </span>
            </div>

            <TextInput
              label="אמן/ית"
              value={formValues.artistName}
              onChange={(value) => setFormValues((current) => ({ ...current, artistName: value }))}
              placeholder="שם האמן/ית (אופציונלי)"
            />

            <TextInput
              label="קישור למדיה"
              type="url"
              required
              value={formValues.mediaUrl}
              onChange={(value) => setFormValues((current) => ({ ...current, mediaUrl: value }))}
              placeholder="https://example.com/artwork.png"
            />

            <TextInput
              label="קישור לתמונה ממוזערת"
              type="url"
              value={formValues.thumbnailUrl}
              onChange={(value) => setFormValues((current) => ({ ...current, thumbnailUrl: value }))}
              placeholder="https://example.com/thumbnail.png"
            />

            <div className={styles.fieldFull}>
              <DomainSelector
                label="תחומי התמודדות"
                helperText="בחרו תחום אחד או יותר שרלוונטיים ליצירה."
                value={formValues.domains}
                onChange={(domains) => setFormValues((current) => ({ ...current, domains }))}
                mockDomains={mockDomains}
              />
            </div>

            {formValues.thumbnailUrl && (
              <div className={styles.fieldFull}>
                <img
                  className={styles.thumbPreview}
                  src={formValues.thumbnailUrl}
                  alt={formValues.title || `תצוגה מקדימה`}
                />
              </div>
            )}
          </div>

          {(formError || mutationError) && (
            <p className={styles.formError}>{formError || `אירעה שגיאה בשמירת היצירה`}</p>
          )}

          <div className={styles.formActions}>
            <Button variant="primary" loading={isSaving} onClick={() => handleSubmit()}>
              שמירה
            </Button>
            <Button variant="ghost" onClick={() => closeForm()}>
              ביטול
            </Button>
          </div>
        </div>
      )}

      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <TextInput
            placeholder="חיפוש לפי כותרת או אמן/ית..."
            value={query}
            onChange={(value) => setQuery(value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.stateCard}>טוען יצירות...</div>
      ) : error ? (
        <div className={styles.stateCard}>אירעה שגיאה בטעינת הגלריה.</div>
      ) : (
        <Table
          columns={columns}
          rows={tableRows}
          emptyMessage="לא נמצאו יצירות בגלריה"
        />
      )}
    </div>
  );
}

/**
 * admin panel for full CRUD management of the PTSDART gallery: create,
 * edit and delete items (title, media url/type, artist, domains). guarded
 * behind the admin role and registered through the platform's AdminPanel
 * slot. RTL.
 */
export function ManageGallery({ mockItems, mockDomains, mockUser, className, style }: ManageGalleryProps) {
  return (
    <ProtectedRoute redirectTo="/login" allowedRoles={['admin']} mockData={mockUser}>
      <ManageGalleryContent
        mockItems={mockItems}
        mockDomains={mockDomains}
        className={className}
        style={style}
      />
    </ProtectedRoute>
  );
}
