import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Table } from '@helemclub/design.content.table';
import type { TableColumn, TableRow } from '@helemclub/design.content.table';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { useApps, mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { DomainSelector } from '@helemclub/knowledge-domains.ui.domain-selector';
import type { ManageAppRecord } from './manage-app-record-type.js';
import type { ManageAppFormValues } from './manage-app-form-values-type.js';
import type { DomainTagOption } from './domain-tag-option-type.js';
import styles from './manage-apps.module.scss';

const EMPTY_FORM_VALUES: ManageAppFormValues = {
  name: ``,
  subtitle: ``,
  fullDescription: ``,
  externalLink: ``,
  icon: `🧰`,
  costType: `חינם לחברי הקהילה`,
  platform: `iOS, Android`,
  language: `עברית`,
  domains: [],
  isFeatured: false,
};

function generateAppId(): string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toFormValues(record: ManageAppRecord): ManageAppFormValues {
  return {
    name: record.name,
    subtitle: record.subtitle,
    fullDescription: record.fullDescription,
    externalLink: record.externalLink,
    icon: record.icon,
    costType: record.costType,
    platform: record.platform.join(`, `),
    language: record.language,
    domains: record.domains,
    isFeatured: record.isFeatured,
  };
}

export type ManageAppsProps = {
  /**
   * provide mock apps to skip the network request, useful for tests and previews.
   */
  mockApps?: ReturnType<typeof mockAppsData>;

  /**
   * provide mock coping domains for the domain-tagging control, useful for tests and previews.
   */
  mockDomains?: DomainTagOption[];

  /**
   * provide mock data for the current user, bypassing the auth check. useful
   * for tests and previews. pass null to simulate a signed-out state.
   */
  mockUser?: React.ComponentProps<typeof ProtectedRoute>['mockData'];

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
 * full CRUD admin panel for toolbox apps: create, edit and delete apps,
 * toggle the featured flag, and tag apps with coping domains. protected to
 * admin users only. RTL by default. registered as an AdminPanel entry in
 * the platform admin shell.
 */
export function ManageApps({ mockApps, mockDomains, mockUser, className, style }: ManageAppsProps) {
  const { apps, loading, error } = useApps({ mockData: mockApps });

  const [records, setRecords] = useState<ManageAppRecord[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || apps.length === 0) return;
    hasInitialized.current = true;
    setRecords(
      apps.map((app) => ({
        id: app.id,
        name: app.name,
        subtitle: app.subtitle,
        fullDescription: app.fullDescription,
        externalLink: app.externalLink,
        icon: app.icon,
        costType: app.costType,
        platform: app.platform,
        language: app.language,
        domains: app.domains,
        isFeatured: app.isFeatured,
        avgRating: app.avgRating,
        ratingCount: app.ratingCount,
        clickCount: app.clickCount,
      }))
    );
  }, [apps]);

  const [searchQuery, setSearchQuery] = useState(``);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ManageAppFormValues>(EMPTY_FORM_VALUES);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredRecords = records.filter((record) => {
    if (searchQuery.trim() === ``) return true;
    const query = searchQuery.trim();
    return record.name.includes(query) || record.subtitle.includes(query);
  });

  const featuredCount = records.filter((record) => record.isFeatured).length;

  const handleOpenCreateForm = () => {
    setEditingId(null);
    setFormValues(EMPTY_FORM_VALUES);
    setIsFormOpen(true);
    setConfirmDeleteId(null);
  };

  const handleOpenEditForm = (record: ManageAppRecord) => {
    setEditingId(record.id);
    setFormValues(toFormValues(record));
    setIsFormOpen(true);
    setConfirmDeleteId(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormValues(EMPTY_FORM_VALUES);
  };

  const handleFormFieldChange = (field: keyof ManageAppFormValues, value: string | boolean | string[]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveForm = () => {
    const platformList = formValues.platform
      .split(`,`)
      .map((entry) => entry.trim())
      .filter((entry) => entry !== ``);

    if (editingId) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === editingId
            ? {
                ...record,
                name: formValues.name,
                subtitle: formValues.subtitle,
                fullDescription: formValues.fullDescription,
                externalLink: formValues.externalLink,
                icon: formValues.icon,
                costType: formValues.costType,
                platform: platformList,
                language: formValues.language,
                domains: formValues.domains,
                isFeatured: formValues.isFeatured,
              }
            : record
        )
      );
    } else {
      const newRecord: ManageAppRecord = {
        id: generateAppId(),
        name: formValues.name,
        subtitle: formValues.subtitle,
        fullDescription: formValues.fullDescription,
        externalLink: formValues.externalLink,
        icon: formValues.icon,
        costType: formValues.costType,
        platform: platformList,
        language: formValues.language,
        domains: formValues.domains,
        isFeatured: formValues.isFeatured,
        avgRating: 0,
        ratingCount: 0,
        clickCount: 0,
      };
      setRecords((prev) => [newRecord, ...prev]);
    }

    handleCancelForm();
  };

  const handleToggleFeatured = (id: string) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, isFeatured: !record.isFeatured } : record))
    );
  };

  const handleRequestDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = () => {
    setRecords((prev) => prev.filter((record) => record.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const columns: TableColumn[] = [
    {
      key: `name`,
      header: `אפליקציה`,
      renderCell: (row: TableRow) => {
        const record = filteredRecords.find((item) => item.id === row.id);
        if (!record) return null;
        return (
          <div className={styles.appCell}>
            <span className={styles.appIcon}>{record.icon}</span>
            <div>
              <p className={styles.appName}>{record.name}</p>
              <p className={styles.appSubtitle}>{record.subtitle}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: `costType`,
      header: `עלות`,
      hideOnMobile: true,
    },
    {
      key: `domainsLabel`,
      header: `תחומים`,
      renderCell: (row: TableRow) => {
        const record = filteredRecords.find((item) => item.id === row.id);
        if (!record) return null;
        return (
          <div className={styles.domainChips}>
            {record.domains.length > 0 ? (
              record.domains.map((domain) => (
                <span key={domain} className={styles.domainChip}>
                  {domain}
                </span>
              ))
            ) : (
              <span className={styles.domainChip}>ללא תיוג</span>
            )}
          </div>
        );
      },
    },
    {
      key: `isFeatured`,
      header: `מומלץ`,
      align: `center`,
      renderCell: (row: TableRow) => {
        const record = filteredRecords.find((item) => item.id === row.id);
        if (!record) return null;
        return (
          <button
            type="button"
            className={classNames(styles.featuredToggle, record.isFeatured && styles.featuredToggleActive)}
            onClick={() => handleToggleFeatured(record.id)}
          >
            {record.isFeatured ? `⭐ מומלץ` : `הוספה למומלצים`}
          </button>
        );
      },
    },
    {
      key: `avgRating`,
      header: `דירוג`,
      align: `center`,
      renderCell: (row: TableRow) => {
        const record = filteredRecords.find((item) => item.id === row.id);
        if (!record) return null;
        return (
          <div className={styles.ratingCell}>
            <span className={styles.ratingValue}>{record.avgRating.toFixed(1)} ⭐</span>
            <span className={styles.ratingCount}>{record.ratingCount} דירוגים</span>
          </div>
        );
      },
    },
    {
      key: `clickCount`,
      header: `קליקים`,
      align: `end`,
      hideOnMobile: true,
    },
    {
      key: `actions`,
      header: ``,
      align: `end`,
      renderCell: (row: TableRow) => {
        const record = filteredRecords.find((item) => item.id === row.id);
        if (!record) return null;
        return (
          <div className={styles.actionsCell}>
            <Button variant="secondary" size="sm" onClick={() => handleOpenEditForm(record)}>
              עריכה
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleRequestDelete(record.id)}>
              מחיקה
            </Button>
          </div>
        );
      },
    },
  ];

  const rows: TableRow[] = filteredRecords.map((record) => ({
    id: record.id,
    name: record.name,
    costType: record.costType,
    domainsLabel: record.domains.join(`, `),
    isFeatured: record.isFeatured,
    avgRating: record.avgRating,
    clickCount: record.clickCount,
  }));

  const deletingRecord = records.find((record) => record.id === confirmDeleteId);

  return (
    <ProtectedRoute allowedRoles={[`admin`]} mockData={mockUser}>
      <div className={classNames(styles.manageApps, className)} style={style}>
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>ניהול ארגז הכלים</div>
            <h1 className={styles.title}>ניהול אפליקציות</h1>
            <p className={styles.subtitle}>
              יצירה, עריכה ומחיקה של אפליקציות בקטלוג, סימון אפליקציות מומלצות ותיוג תחומי התמודדות.
            </p>
          </div>
          <Button variant="accent" onClick={() => handleOpenCreateForm()}>
            ➕ הוספת אפליקציה
          </Button>
        </div>

        {error && <div className={styles.errorBanner}>אירעה שגיאה בטעינת האפליקציות. נסו לרענן את הדף.</div>}

        {loading && records.length === 0 && (
          <div className={styles.loadingState}>טוען אפליקציות...</div>
        )}

        {isFormOpen && (
          <div className={styles.formPanel}>
            <h2 className={styles.formTitle}>{editingId ? `עריכת אפליקציה` : `הוספת אפליקציה חדשה`}</h2>
            <div className={styles.formGrid}>
              <TextInput
                label="שם האפליקציה"
                name="name"
                value={formValues.name}
                onChange={(value) => handleFormFieldChange(`name`, value)}
                required
              />
              <TextInput
                label="כתובת חיצונית"
                name="externalLink"
                type="url"
                value={formValues.externalLink}
                onChange={(value) => handleFormFieldChange(`externalLink`, value)}
                required
              />
              <TextInput
                label="כותרת משנה"
                name="subtitle"
                value={formValues.subtitle}
                onChange={(value) => handleFormFieldChange(`subtitle`, value)}
                required
              />
              <TextInput
                label="אייקון (אמוג'י)"
                name="icon"
                value={formValues.icon}
                onChange={(value) => handleFormFieldChange(`icon`, value)}
              />
              <TextInput
                label="מודל עלות"
                name="costType"
                value={formValues.costType}
                onChange={(value) => handleFormFieldChange(`costType`, value)}
              />
              <TextInput
                label="שפה"
                name="language"
                value={formValues.language}
                onChange={(value) => handleFormFieldChange(`language`, value)}
              />
              <TextInput
                label="פלטפורמות (מופרדות בפסיק)"
                name="platform"
                value={formValues.platform}
                onChange={(value) => handleFormFieldChange(`platform`, value)}
              />
              <div className={styles.featuredField}>
                <button
                  type="button"
                  className={classNames(
                    styles.featuredToggle,
                    formValues.isFeatured && styles.featuredToggleActive
                  )}
                  onClick={() => handleFormFieldChange(`isFeatured`, !formValues.isFeatured)}
                >
                  {formValues.isFeatured ? `⭐ מסומן כמומלץ` : `סימון כמומלץ`}
                </button>
              </div>
              <div className={styles.fieldFull}>
                <div className={styles.textareaWrapper}>
                  <span className={styles.textareaLabel}>תיאור מלא</span>
                  <textarea
                    className={styles.textarea}
                    name="fullDescription"
                    value={formValues.fullDescription}
                    onChange={(event) => handleFormFieldChange(`fullDescription`, event.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldFull}>
                <DomainSelector
                  value={formValues.domains}
                  onChange={(domains) => handleFormFieldChange(`domains`, domains)}
                  label="תחומי התמודדות"
                  helperText="תייגו תחומים רלוונטיים כדי לשפר את הסינון בארגז הכלים."
                  mockDomains={mockDomains}
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => handleCancelForm()}>
                ביטול
              </Button>
              <Button
                variant="primary"
                disabled={!formValues.name || !formValues.subtitle || !formValues.externalLink}
                onClick={() => handleSaveForm()}
              >
                שמירה
              </Button>
            </div>
          </div>
        )}

        {confirmDeleteId && deletingRecord && (
          <div className={styles.confirmBar}>
            <p className={styles.confirmText}>למחוק לצמיתות את &quot;{deletingRecord.name}&quot;?</p>
            <div className={styles.confirmActions}>
              <Button variant="ghost" size="sm" onClick={() => handleCancelDelete()}>
                ביטול
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleConfirmDelete()}>
                אישור מחיקה
              </Button>
            </div>
          </div>
        )}

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <TextInput
              label="חיפוש אפליקציה"
              name="search"
              placeholder="חיפוש לפי שם או כותרת משנה..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </div>
          <div className={styles.statsRow}>
            <span className={styles.statChip}>סה&quot;כ {records.length} אפליקציות</span>
            <span className={styles.statChip}>⭐ {featuredCount} מומלצות</span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {filteredRecords.length === 0 ? (
            <div className={styles.emptyState}>לא נמצאו אפליקציות התואמות את החיפוש.</div>
          ) : (
            <Table columns={columns} rows={rows} emptyMessage="לא נמצאו אפליקציות" />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
