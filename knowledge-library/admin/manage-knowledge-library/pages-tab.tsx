import React, { useMemo, useRef, useState } from 'react';
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
        .filter((page) => page.id !== editingId)
        .map((page) => ({ value: page.id, label: page.title })),
    ],
    [pages, editingId]
  );

  const columns: TableColumn[] = useMemo(
    () => [
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
            <Button variant="danger" size="sm" onClick={() => setPendingDeleteId(String(row.id))}>
              מחיקה
            </Button>
          </div>
        ),
      },
    ],
    [pageTitleById]
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
    await deletePage(pendingDeleteId);
    setPendingDeleteId(undefined);
    refetch();
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
