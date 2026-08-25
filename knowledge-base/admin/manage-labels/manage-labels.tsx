import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { useLabels, useUpsertLabel } from '@helemclub/knowledge-base.hooks.use-labels';
import type { ManageLabelsLabel } from './manage-labels-label-type.js';
import type { ManageLabelsFormValues } from './manage-labels-form-values-type.js';
import styles from './manage-labels.module.scss';

const EMPTY_FORM: ManageLabelsFormValues = {
  slug: ``,
  name: ``,
  description: ``,
  coverImage: ``,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05FF\s-]/g, ``)
    .replace(/\s+/g, `-`)
    .replace(/-+/g, `-`);
}

export type ManageLabelsProps = {
  /**
   * provide mock data for the labels list, bypassing the network request.
   * useful for tests and previews.
   */
  mockLabels?: ManageLabelsLabel[];

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
 * admin CRUD panel for knowledge base labels ("projects"): name, slug,
 * description and cover image. lists existing labels in a table and
 * allows creating a new one or editing an existing one through a form. RTL.
 */
export function ManageLabels({ mockLabels, className, style }: ManageLabelsProps) {
  const hasMockLabels = mockLabels !== undefined;
  const { labels, loading, refetch } = useLabels(hasMockLabels ? { mockData: mockLabels } : undefined);
  const { upsertLabel, loading: saving, error: saveError } = useUpsertLabel();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | undefined>(undefined);
  const [formValues, setFormValues] = useState<ManageLabelsFormValues>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const columns: TableColumn[] = [
    {
      key: `name`,
      header: `שם הפרויקט`,
      renderCell: (row) => (
        <div className={styles.nameCell}>
          <span className={styles.nameCellName}>{String(row.name)}</span>
          <span className={styles.nameCellSlug}>{String(row.slug)}</span>
        </div>
      ),
    },
    {
      key: `coverImage`,
      header: `תמונת שער`,
      hideOnMobile: true,
      renderCell: (row) =>
        row.coverImage ? (
          <img className={styles.thumb} src={String(row.coverImage)} alt={String(row.name)} />
        ) : (
          <span className={styles.thumbFallback} />
        ),
    },
    {
      key: `description`,
      header: `תיאור`,
      hideOnMobile: true,
      renderCell: (row) => (
        <span className={styles.description}>{row.description ? String(row.description) : `ללא תיאור`}</span>
      ),
    },
    { key: `recordCount`, header: `תכנים`, align: `center` },
    {
      key: `actions`,
      header: `פעולות`,
      align: `end`,
      renderCell: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            openEditForm(
              String(row.slug),
              String(row.name),
              row.description ? String(row.description) : ``,
              row.coverImage ? String(row.coverImage) : ``
            )
          }
        >
          עריכה
        </Button>
      ),
    },
  ];

  const rows: TableRow[] = useMemo(
    () =>
      labels.map((label) => ({
        id: label.id,
        slug: label.slug,
        name: label.name,
        description: label.description || ``,
        coverImage: label.coverImage || ``,
        recordCount: label.recordCount,
      })),
    [labels]
  );

  function openCreateForm() {
    setEditingSlug(undefined);
    setFormValues(EMPTY_FORM);
    setSlugTouched(false);
    setFormError(undefined);
    setSuccessMessage(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(slug: string, name: string, description: string, coverImage: string) {
    setEditingSlug(slug);
    setFormValues({ slug, name, description, coverImage });
    setSlugTouched(true);
    setFormError(undefined);
    setSuccessMessage(undefined);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setFormError(undefined);
  }

  function handleNameChange(name: string) {
    setFormValues((previous) => ({
      ...previous,
      name,
      slug: slugTouched ? previous.slug : slugify(name),
    }));
  }

  function handleSlugChange(slug: string) {
    setSlugTouched(true);
    setFormValues((previous) => ({ ...previous, slug: slugify(slug) }));
  }

  function handleDescriptionChange(description: string) {
    setFormValues((previous) => ({ ...previous, description }));
  }

  function handleCoverImageChange(coverImage: string) {
    setFormValues((previous) => ({ ...previous, coverImage }));
  }

  async function handleSubmit() {
    setFormError(undefined);
    setSuccessMessage(undefined);

    if (!formValues.name.trim()) {
      setFormError(`יש להזין שם לפרויקט`);
      return;
    }

    if (!formValues.slug.trim()) {
      setFormError(`יש להזין כתובת (slug) לפרויקט`);
      return;
    }

    const saved = await upsertLabel({
      slug: formValues.slug,
      name: formValues.name,
      description: formValues.description || undefined,
      coverImage: formValues.coverImage || undefined,
    });

    if (!saved) {
      setFormError(`שמירת הפרויקט נכשלה, נסו שוב`);
      return;
    }

    setSuccessMessage(editingSlug ? `הפרויקט "${saved.name}" עודכן בהצלחה` : `הפרויקט "${saved.name}" נוצר בהצלחה`);
    setIsFormOpen(false);
    refetch();
  }

  return (
    <div className={classNames(styles.manageLabels, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.eyebrow}>ניהול ספריית הידע</div>
          <h2 className={styles.title}>ניהול תוויות (פרויקטים)</h2>
          <p className={styles.subtitle}>
            יצירה, עריכה וניהול של תוויות המקבצות תכנים בספריית הידע — שם, כתובת, תיאור ותמונת שער.
          </p>
        </div>
        {!isFormOpen && (
          <Button variant="accent" onClick={() => openCreateForm()}>
            + תווית חדשה
          </Button>
        )}
      </div>

      {successMessage && <div className={classNames(styles.banner, styles.bannerSuccess)}>{successMessage}</div>}
      {saveError && <div className={classNames(styles.banner, styles.bannerError)}>{`שגיאה: ${saveError}`}</div>}

      {isFormOpen && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>{editingSlug ? `עריכת תווית` : `יצירת תווית חדשה`}</h3>
          {formError && <p className={styles.formError}>{formError}</p>}
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <TextInput label="שם הפרויקט" required value={formValues.name} onChange={(value) => handleNameChange(value)} placeholder="לדוגמה: עזרה ראשונה" />
            </div>
            <div className={styles.formField}>
              <TextInput
                label="כתובת (slug)"
                required
                value={formValues.slug}
                onChange={(value) => handleSlugChange(value)}
                placeholder="first-aid"
                helperText="באנגלית, ללא רווחים. משמש בכתובת ה-URL"
              />
            </div>
            <div className={classNames(styles.formField, styles.formFieldWide)}>
              <span className={styles.label}>תיאור</span>
              <textarea
                className={styles.textarea}
                value={formValues.description}
                placeholder="תיאור קצר של הפרויקט, בעברית"
                onChange={(event) => handleDescriptionChange(event.target.value)}
              />
            </div>
            <div className={classNames(styles.formField, styles.formFieldWide)}>
              <TextInput
                label="קישור לתמונת שער"
                value={formValues.coverImage}
                onChange={(value) => handleCoverImageChange(value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {formValues.coverImage && (
            <div className={styles.preview}>
              <img className={styles.previewImage} src={formValues.coverImage} alt="תצוגה מקדימה" />
            </div>
          )}

          <div className={styles.formActions}>
            <Button variant="ghost" onClick={() => closeForm()}>
              ביטול
            </Button>
            <Button variant="primary" loading={saving} onClick={() => handleSubmit()}>
              {editingSlug ? `שמירת שינויים` : `יצירת תווית`}
            </Button>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loadingState}>טוען תוויות...</div>
        ) : (
          <Table columns={columns} rows={rows} emptyMessage="לא נמצאו תוויות בספריית הידע" />
        )}
      </div>
    </div>
  );
}
