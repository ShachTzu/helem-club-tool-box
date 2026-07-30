import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { useDomains } from '@helemclub/knowledge-domains.hooks.use-domains';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn } from '@helemclub/design.content.table';
import type { TableRow } from '@helemclub/design.content.table';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Button } from '@helemclub/design.actions.button';
import type { DomainRecord } from './domain-record-type.js';
import type { AdminUserPreview } from './admin-user-preview-type.js';
import styles from './manage-domains.module.scss';

type DomainFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

const EMPTY_FORM: DomainFormState = {
  name: ``,
  slug: ``,
  description: ``,
  icon: ``,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05ff]+/g, `-`)
    .replace(/^-+|-+$/g, ``);
}

export type ManageDomainsProps = {
  /**
   * initial domain records, used to skip the network request and manage
   * data locally. useful for tests and previews.
   */
  mockDomains?: DomainRecord[];

  /**
   * mock data for the current admin user, bypasses the auth check.
   * pass null to simulate a signed-out state.
   */
  mockUser?: AdminUserPreview | null;

  /**
   * path to redirect anonymous users to.
   */
  redirectTo?: string;

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
 * admin CRUD panel for knowledge domains (name, slug, description, icon),
 * showing the content count tagged with each domain. registered as an
 * AdminPanel and restricted to admins. RTL.
 */
export function ManageDomains({
  mockDomains,
  mockUser,
  redirectTo = `/login`,
  className,
  style,
}: ManageDomainsProps) {
  const { domains, loading, error } = useDomains(mockDomains ? { mockData: mockDomains } : undefined);
  const [localDomains, setLocalDomains] = useState<DomainRecord[] | null>(
    mockDomains ? mockDomains : null
  );
  const [form, setForm] = useState<DomainFormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const records: DomainRecord[] = localDomains ?? domains.map((domain) => domain.toObject());

  const isEditing = Boolean(form.id);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setFormError(undefined);
  };

  const handleNameChange = (value: string) => {
    const nextForm = { ...form, name: value };
    if (!slugTouched) {
      nextForm.slug = slugify(value);
    }
    setForm(nextForm);
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setForm({ ...form, slug: value });
  };

  const handleSubmit = () => {
    const trimmedName = form.name.trim();
    const trimmedSlug = form.slug.trim() || slugify(trimmedName);

    if (!trimmedName || !trimmedSlug) {
      setFormError(`יש למלא שם ומזהה (slug) לדומיין`);
      return;
    }

    const duplicateSlug = records.some(
      (record) => record.slug === trimmedSlug && record.id !== form.id
    );
    if (duplicateSlug) {
      setFormError(`כבר קיים דומיין עם מזהה (slug) זהה`);
      return;
    }

    if (isEditing && form.id) {
      setLocalDomains(
        records.map((record) =>
          record.id === form.id
            ? {
                ...record,
                name: trimmedName,
                slug: trimmedSlug,
                description: form.description.trim() || undefined,
                icon: form.icon.trim() || undefined,
              }
            : record
        )
      );
    } else {
      const newRecord: DomainRecord = {
        id: trimmedSlug,
        slug: trimmedSlug,
        name: trimmedName,
        description: form.description.trim() || undefined,
        icon: form.icon.trim() || undefined,
        count: 0,
      };
      setLocalDomains([...records, newRecord]);
    }

    resetForm();
  };

  const handleEdit = (record: DomainRecord) => {
    setForm({
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description || ``,
      icon: record.icon || ``,
    });
    setSlugTouched(true);
    setFormError(undefined);
  };

  const handleDelete = (id: string) => {
    setLocalDomains(records.filter((record) => record.id !== id));
    setConfirmDeleteId(null);
    if (form.id === id) resetForm();
  };

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: `icon`,
        header: `סמל`,
        width: `56px`,
        renderCell: (row: TableRow) => <span className={styles.iconCell}>{String(row.icon || `🗂️`)}</span>,
      },
      {
        key: `name`,
        header: `שם ומזהה`,
        renderCell: (row: TableRow) => (
          <div className={styles.nameCell}>
            <span className={styles.nameLabel}>{String(row.name)}</span>
            <span className={styles.slugLabel}>{String(row.slug)}</span>
          </div>
        ),
      },
      {
        key: `description`,
        header: `תיאור`,
        renderCell: (row: TableRow) => (
          <span className={styles.descriptionCell}>{row.description ? String(row.description) : `—`}</span>
        ),
        hideOnMobile: true,
      },
      {
        key: `count`,
        header: `תכנים מתויגים`,
        align: `center`,
        renderCell: (row: TableRow) => <span className={styles.countCell}>{String(row.count ?? 0)}</span>,
      },
      {
        key: `actions`,
        header: `פעולות`,
        align: `end`,
        renderCell: (row: TableRow) => {
          const id = String(row.id);
          const record = records.find((item) => item.id === id);
          if (!record) return null;

          if (confirmDeleteId === id) {
            return (
              <div className={styles.actionsCell}>
                <span className={styles.confirmText}>למחוק לצמיתות?</span>
                <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>
                  אישור מחיקה
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                  ביטול
                </Button>
              </div>
            );
          }

          return (
            <div className={styles.actionsCell}>
              <Button variant="secondary" size="sm" onClick={() => handleEdit(record)}>
                עריכה
              </Button>
              <Button variant="danger" size="sm" onClick={() => setConfirmDeleteId(id)}>
                מחיקה
              </Button>
            </div>
          );
        },
      },
    ],
    [records, confirmDeleteId]
  );

  const tableRows: TableRow[] = records.map((record) => ({
    id: record.id,
    icon: record.icon || ``,
    name: record.name,
    slug: record.slug,
    description: record.description || ``,
    count: record.count,
  }));

  const content = (
    <div className={classNames(styles.manageDomains, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.eyebrow}>ניהול תוכן</div>
          <h1 className={styles.title}>ניהול דומיינים</h1>
          <p className={styles.subtitle}>
            הוספה, עריכה ומחיקה של תחומי התמודדות המשמשים לתיוג תוכן ברחבי האקוסיסטם.
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>{isEditing ? `עריכת דומיין` : `דומיין חדש`}</h2>
        <div className={styles.formGrid}>
          <TextInput
            label="שם הדומיין"
            placeholder="לדוגמה: חרדה"
            required
            value={form.name}
            onChange={(value) => handleNameChange(value)}
          />
          <TextInput
            label="מזהה (slug)"
            placeholder="anxiety"
            required
            value={form.slug}
            onChange={(value) => handleSlugChange(value)}
          />
          <TextInput
            label="סמל (אימוג'י)"
            placeholder="😰"
            value={form.icon}
            onChange={(value) => setForm({ ...form, icon: value })}
          />
          <TextInput
            className={styles.formGridFull}
            label="תיאור קצר"
            placeholder="תיאור קצר של תחום ההתמודדות"
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
          />
        </div>

        {formError ? <div className={classNames(styles.feedback, styles.feedbackError)}>{formError}</div> : null}

        <div className={styles.formActions}>
          {isEditing ? (
            <Button variant="ghost" onClick={() => resetForm()}>
              ביטול עריכה
            </Button>
          ) : null}
          <Button variant="primary" onClick={() => handleSubmit()}>
            {isEditing ? `שמירת שינויים` : `הוספת דומיין`}
          </Button>
        </div>
      </div>

      {loading && !mockDomains ? (
        <div className={styles.loadingState}>טוען דומיינים...</div>
      ) : error && !mockDomains ? (
        <div className={classNames(styles.feedback, styles.feedbackError)}>שגיאה בטעינת הדומיינים: {error}</div>
      ) : (
        <Table columns={columns} rows={tableRows} emptyMessage="לא נמצאו דומיינים במערכת" />
      )}
    </div>
  );

  const hasMockUser = mockUser !== undefined;

  if (hasMockUser) {
    return (
      <ProtectedRoute redirectTo={redirectTo} allowedRoles={[`admin`]} mockData={mockUser}>
        {content}
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute redirectTo={redirectTo} allowedRoles={[`admin`]}>
      {content}
    </ProtectedRoute>
  );
}
