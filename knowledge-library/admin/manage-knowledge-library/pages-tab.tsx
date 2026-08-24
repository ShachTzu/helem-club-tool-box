import React, { useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { SelectList } from '@helemclub/design.inputs.select-list';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { DomainSelector } from '@helemclub/knowledge-domains.ui.domain-selector';
import {
  useKnowledgePages,
  useCreateKnowledgePage,
  useUpdateKnowledgePage,
  useDeleteKnowledgePage,
  useUploadKnowledgeLibraryImage,
} from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import styles from './manage-knowledge-library.module.scss';

const TODAY = () => new Date().toISOString().slice(0, 10);

type FormValues = {
  title: string;
  parentId: string;
  body: string;
  domains: string[];
  image: string;
  videoUrl: string;
  videoEmbedHtml: string;
  mediaType: '' | 'video' | 'audio';
  durationSec: string;
  publishDate: string;
  isPublished: boolean;
};

function emptyForm(): FormValues {
  return {
    title: '',
    parentId: '',
    body: '',
    domains: [],
    image: '',
    videoUrl: '',
    videoEmbedHtml: '',
    mediaType: '',
    durationSec: '',
    publishDate: TODAY(),
    isPublished: true,
  };
}

export function PagesTab() {
  const { pages, loading, error, refetch } = useKnowledgePages();
  const { createPage, loading: creating } = useCreateKnowledgePage();
  const { updatePage, loading: updating } = useUpdateKnowledgePage();
  const { deletePage } = useDeleteKnowledgePage();
  const { uploadImage, uploading, error: uploadError, clearError } = useUploadKnowledgeLibraryImage();
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [formValues, setFormValues] = useState<FormValues>(emptyForm());
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>(undefined);
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkParentId, setBulkParentId] = useState<string>('');
  const [bulkError, setBulkError] = useState<string | undefined>(undefined);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const pageTitleById = useMemo(() => {
    const map: Record<string, string> = {};
    pages.forEach((page) => {
      map[page.id] = page.title;
    });
    return map;
  }, [pages]);

  const parentOptions = useMemo(
    () => [
      { value: '', label: 'ללא (עמוד עליון)' },
      ...pages
        // exclude the page itself and any of its own descendants — picking
        // either would always be rejected server-side (cyclic parent) since
        // the repository's assertNotCyclicParent blocks it; filtering here
        // means an editor never hits that error in the first place.
        .filter((page) => page.id !== editingId && !(editingId && page.ancestorIds.includes(editingId)))
        .map((page) => ({ value: page.id, label: page.title })),
    ],
    [pages, editingId]
  );

  // valid bulk-reparent targets: same cyclic-parent guard as the single-edit
  // form, generalized across every selected page — a target is excluded if it
  // IS one of the selected pages, or is a descendant of any of them.
  const bulkParentOptions = useMemo(
    () => [
      { value: '', label: 'ללא (עמוד עליון)' },
      ...pages
        .filter(
          (page) => !selectedIds.has(page.id) && !page.ancestorIds.some((ancestorId) => selectedIds.has(ancestorId))
        )
        .map((page) => ({ value: page.id, label: page.title })),
    ],
    [pages, selectedIds]
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allVisibleSelected = pages.length > 0 && pages.every((page) => selectedIds.has(page.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => (allVisibleSelected ? new Set() : new Set(pages.map((page) => page.id))));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setBulkParentId('');
    setBulkError(undefined);
  };

  // bulk actions run serially, one page at a time — the same conservative
  // pattern as the CSV importer's row-by-row execution — so a single failure
  // (e.g. a page deleted by someone else mid-batch) is reported clearly
  // instead of silently leaving a partially-applied batch.
  const handleBulkChangeParent = async () => {
    setBulkError(undefined);
    setBulkBusy(true);
    const failedTitles: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const id of selectedIds) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await updatePage(id, { parentId: bulkParentId || null });
      } catch (err) {
        failedTitles.push(pageTitleById[id] || id);
      }
    }
    setBulkBusy(false);
    if (failedTitles.length > 0) {
      setBulkError(`נכשל עדכון עמוד האב עבור: ${failedTitles.join(', ')}`);
    } else {
      clearSelection();
    }
    refetch();
  };

  const handleConfirmBulkDelete = async () => {
    setBulkError(undefined);
    setBulkBusy(true);
    const failedTitles: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const id of selectedIds) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await deletePage(id);
      } catch (err) {
        failedTitles.push(pageTitleById[id] || id);
      }
    }
    setBulkBusy(false);
    setPendingBulkDelete(false);
    if (failedTitles.length > 0) {
      setBulkError(`נכשלה מחיקה עבור: ${failedTitles.join(', ')}`);
    } else {
      clearSelection();
    }
    refetch();
  };

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: 'select',
        header: '',
        align: 'center',
        width: '40px',
        renderCell: (row) => (
          <input
            type="checkbox"
            aria-label={`בחירת העמוד ${String(row.title)}`}
            checked={selectedIds.has(String(row.id))}
            onChange={() => toggleSelected(String(row.id))}
          />
        ),
      },
      { key: 'title', header: 'כותרת' },
      {
        key: 'parentTitle',
        header: 'עמוד אב',
        hideOnMobile: true,
        renderCell: (row) => (row.parentId ? pageTitleById[String(row.parentId)] || '—' : '—'),
      },
      {
        key: 'publishDate',
        header: 'תאריך',
        hideOnMobile: true,
        renderCell: (row) => new Date(String(row.publishDate)).toLocaleDateString('he-IL'),
      },
      {
        key: 'isPublished',
        header: 'סטטוס',
        align: 'center',
        renderCell: (row) => (row.isPublished ? '✅ מפורסם' : '⏸️ מוסתר'),
      },
      {
        key: 'actions',
        header: 'פעולות',
        align: 'end',
        renderCell: (row) => (
          <div className={styles.rowActions}>
            <Button variant="secondary" size="sm" onClick={() => openEditForm(String(row.id))}>
              עריכה
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDeleteError(undefined);
                setPendingDeleteId(String(row.id));
              }}
            >
              מחיקה
            </Button>
          </div>
        ),
      },
    ],
    [pageTitleById, selectedIds]
  );

  const rows: TableRow[] = useMemo(
    () =>
      pages.map((page) => ({
        id: page.id,
        title: page.title,
        parentId: page.parentId,
        publishDate: page.publishDate,
        isPublished: page.isPublished,
      })),
    [pages]
  );

  const openCreateForm = () => {
    setEditingId(undefined);
    setFormValues(emptyForm());
    setFormError(undefined);
    clearError();
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    const page = pages.find((item) => item.id === id);
    if (!page) return;
    setEditingId(id);
    setFormValues({
      title: page.title,
      parentId: page.parentId || '',
      body: page.body,
      domains: page.domains,
      image: page.image || '',
      videoUrl: page.videoUrl || '',
      videoEmbedHtml: page.videoEmbedHtml || '',
      mediaType: (page.mediaType as '' | 'video' | 'audio') || '',
      durationSec: page.durationSec ? String(page.durationSec) : '',
      publishDate: page.publishDate.slice(0, 10),
      isPublished: page.isPublished,
    });
    setFormError(undefined);
    clearError();
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(undefined);
    setFormError(undefined);
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setFormValues((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = async () => {
    if (!formValues.title.trim()) {
      setFormError('יש למלא כותרת.');
      return;
    }

    const input = {
      title: formValues.title.trim(),
      body: formValues.body,
      parentId: formValues.parentId || null,
      domains: formValues.domains,
      image: formValues.image || undefined,
      videoUrl: formValues.videoUrl || undefined,
      videoEmbedHtml: formValues.videoEmbedHtml || undefined,
      mediaType: formValues.mediaType || undefined,
      durationSec: formValues.durationSec ? Number(formValues.durationSec) : undefined,
      publishDate: formValues.publishDate ? new Date(formValues.publishDate).toISOString() : undefined,
      isPublished: formValues.isPublished,
    };

    try {
      if (editingId) {
        await updatePage(editingId, input);
      } else {
        await createPage(input);
      }
      closeForm();
      refetch();
    } catch (err) {
      setFormError((err as Error).message || 'אירעה שגיאה בשמירת העמוד.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deletePage(pendingDeleteId);
      setPendingDeleteId(undefined);
      refetch();
    } catch (err) {
      setDeleteError((err as Error).message || 'אירעה שגיאה במחיקת העמוד.');
    }
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>עמודי ספריית הידע</h2>
          <p className={styles.subtitle}>יצירה, עריכה ומחיקה של עמודים — טקסט, מדיה, היררכיה ותיוג.</p>
        </div>
        <Button variant="accent" onClick={() => openCreateForm()}>
          + עמוד חדש
        </Button>
      </div>

      {error && <div className={styles.errorBanner}>אירעה שגיאה בטעינת העמודים.</div>}

      {selectedIds.size > 0 && (
        <div className={styles.bulkActionsBar}>
          <span className={styles.bulkActionsCount}>נבחרו {selectedIds.size} עמודים</span>

          <div className={styles.bulkActionsField}>
            <SelectList
              searchable
              options={bulkParentOptions}
              value={bulkParentId}
              onChange={(value) => setBulkParentId(value as string)}
            />
          </div>
          <Button variant="secondary" size="sm" loading={bulkBusy} onClick={() => handleBulkChangeParent()}>
            שינוי עמוד אב לנבחרים
          </Button>

          <Button
            variant="danger"
            size="sm"
            loading={bulkBusy}
            onClick={() => {
              setBulkError(undefined);
              setPendingBulkDelete(true);
            }}
          >
            מחיקת הנבחרים
          </Button>

          <Button variant="ghost" size="sm" onClick={() => clearSelection()}>
            ביטול בחירה
          </Button>
        </div>
      )}

      {bulkError && <div className={styles.errorBanner}>{bulkError}</div>}

      {loading ? (
        <div className={styles.loadingState}>טוען עמודים...</div>
      ) : (
        <Table columns={columns} rows={rows} emptyMessage="עדיין אין עמודים בספריית הידע." />
      )}

      {isFormOpen && (
        <div className={styles.formOverlay}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{editingId ? 'עריכת עמוד' : 'עמוד חדש'}</h3>

            <TextInput
              label="כותרת"
              placeholder="כותרת העמוד"
              value={formValues.title}
              onChange={(value) => setFormValues({ ...formValues, title: value })}
              required
            />

            <div className={styles.formField}>
              <SelectList
                label="עמוד אב (היררכיה)"
                searchable
                options={parentOptions}
                value={formValues.parentId}
                onChange={(value) => setFormValues({ ...formValues, parentId: value as string })}
              />
            </div>

            <TextInput
              label="תאריך פרסום"
              type="date"
              value={formValues.publishDate}
              onChange={(value) => setFormValues({ ...formValues, publishDate: value })}
            />

            <Textarea
              label="תוכן העמוד"
              placeholder="הטקסט של העמוד"
              value={formValues.body}
              onChange={(value) => setFormValues({ ...formValues, body: value })}
            />

            <DomainSelector
              value={formValues.domains}
              onChange={(domainIds) => setFormValues({ ...formValues, domains: domainIds })}
              label="תיוג לתחומי התמודדות"
              showSummary
            />

            <div className={styles.formField}>
              <span className={styles.formLabel}>תמונה</span>
              {formValues.image && <img className={styles.imagePreview} src={formValues.image} alt="" />}
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className={styles.hiddenFileInput}
              />
              <div className={styles.uploadRow}>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={uploading}
                  onClick={() => imageFileInputRef.current?.click()}
                >
                  העלאת תמונה
                </Button>
              </div>
              <TextInput
                placeholder="או קישור לתמונה (URL)"
                type="url"
                value={formValues.image}
                onChange={(value) => setFormValues({ ...formValues, image: value })}
              />
              {uploadError && <p className={styles.errorBanner}>{uploadError}</p>}
            </div>

            <TextInput
              label="קישור לוידאו (YouTube / Spotify)"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formValues.videoUrl}
              onChange={(value) => setFormValues({ ...formValues, videoUrl: value })}
            />

            <div className={styles.formField}>
              <span className={styles.formLabel}>סוג המדיה</span>
              <div className={styles.mediaTypeToggle}>
                {([
                  { value: '', label: 'ללא / טקסט בלבד' },
                  { value: 'video', label: '🎬 וידאו' },
                  { value: 'audio', label: '🎧 אודיו' },
                ] as const).map((option) => (
                  <button
                    key={option.value || 'none'}
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

            {formValues.mediaType && (
              <TextInput
                label="אורך ההקלטה בשניות (אופציונלי)"
                type="number"
                placeholder="למשל 504"
                value={formValues.durationSec}
                onChange={(value) => setFormValues({ ...formValues, durationSec: value })}
              />
            )}

            <Textarea
              label="קוד הטמעה (iframe מ-YouTube/Spotify בלבד)"
              placeholder='<iframe src="https://www.youtube.com/embed/..."></iframe>'
              helperText="מתקבל רק iframe בודד עם src מ-YouTube או Spotify — כל דבר אחר יידחה."
              value={formValues.videoEmbedHtml}
              onChange={(value) => setFormValues({ ...formValues, videoEmbedHtml: value })}
            />

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={formValues.isPublished}
                onChange={(event) => setFormValues({ ...formValues, isPublished: event.target.checked })}
              />
              מפורסם (נראה לגולשים)
            </label>

            {formError && <div className={styles.formError}>{formError}</div>}

            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => closeForm()}>
                ביטול
              </Button>
              <Button variant="primary" loading={creating || updating} onClick={() => handleSubmit()}>
                {editingId ? 'שמירת שינויים' : 'יצירת עמוד'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteId && (
        <div className={styles.formOverlay}>
          <div className={styles.confirmCard}>
            <h3 className={styles.formTitle}>מחיקת עמוד</h3>
            <p className={styles.subtitle}>
              פעולה זו תמחק את העמוד לצמיתות. עמודי-ילד לא יימחקו — יישארו ללא עמוד אב. להמשיך?
            </p>
            {deleteError && <div className={styles.formError}>{deleteError}</div>}
            <div className={styles.formActions}>
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteError(undefined);
                  setPendingDeleteId(undefined);
                }}
              >
                ביטול
              </Button>
              <Button variant="danger" onClick={() => handleConfirmDelete()}>
                מחיקה
              </Button>
            </div>
          </div>
        </div>
      )}

      {pendingBulkDelete && (
        <div className={styles.formOverlay}>
          <div className={styles.confirmCard}>
            <h3 className={styles.formTitle}>מחיקת {selectedIds.size} עמודים</h3>
            <p className={styles.subtitle}>
              פעולה זו תמחק לצמיתות את כל העמודים שנבחרו. עמודי-ילד לא יימחקו — יישארו ללא עמוד אב. להמשיך?
            </p>
            {bulkError && <div className={styles.formError}>{bulkError}</div>}
            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => setPendingBulkDelete(false)}>
                ביטול
              </Button>
              <Button variant="danger" loading={bulkBusy} onClick={() => handleConfirmBulkDelete()}>
                מחיקת {selectedIds.size} עמודים
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
