import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { Table, type TableColumn, type TableRow } from '@helemclub/design.content.table';
import { DomainSelector, type DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';
import { useLabels, type UseLabelsOptions } from '@helemclub/knowledge-base.hooks.use-labels';
import {
  useEvents,
  type UseListEventsOptions,
  type CreateEventInput,
  type UpdateEventInput,
  type PublishRecordingInput,
} from '@helemclub/events.hooks.use-events';
import { EVENT_TYPE_OPTIONS, MEDIA_TYPE_OPTIONS, labelForEventType } from './manage-events.mock.js';
import type { EventFormValues } from './event-form-values-type.js';
import type { PublishRecordingValues } from './publish-recording-values-type.js';
import type { AdminUserRecord } from './admin-user-type.js';
import styles from './manage-events.module.scss';

type EventRecord = NonNullable<UseListEventsOptions['mockData']>[number];
type LabelRecord = NonNullable<UseLabelsOptions['mockData']>[number];

type EventsTab = `all` | `upcoming` | `past`;

const EMPTY_FORM_VALUES: EventFormValues = {
  title: ``,
  description: ``,
  type: `round_table`,
  coverImage: ``,
  startAt: ``,
  endAt: ``,
  location: ``,
  isOnline: true,
  joinUrl: ``,
  domains: [],
};

const EMPTY_PUBLISH_VALUES: PublishRecordingValues = {
  labelId: ``,
  title: ``,
  mediaType: `video`,
  mediaUrl: ``,
  thumbnailUrl: ``,
  domains: [],
};

function pad(value: number): string {
  return String(value).padStart(2, `0`);
}

function formatEventDate(iso: string): string {
  if (!iso) return `-`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return `-`;
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isoToLocalInput(iso?: string): string {
  if (!iso) return ``;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return ``;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function localInputToIso(value: string): string {
  if (!value) return ``;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return ``;
  return date.toISOString();
}

export type ManageEventsProps = {
  /**
   * provide mock events to bypass the network request, useful for tests and previews.
   */
  mockEvents?: EventRecord[];

  /**
   * provide mock knowledge-base labels to bypass the network request, used when
   * publishing a recording.
   */
  mockLabels?: LabelRecord[];

  /**
   * provide mock domains to the domain selector, bypassing the network request.
   */
  mockDomains?: DomainOption[];

  /**
   * provide mock data for the current user, bypassing the auth check. useful
   * for tests and previews. pass null to simulate a signed-out state.
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

type ManageEventsPanelProps = {
  mockEvents?: EventRecord[];
  mockLabels?: LabelRecord[];
  mockDomains?: DomainOption[];
  className?: string;
  style?: React.CSSProperties;
};

function ManageEventsPanel({ mockEvents, mockLabels, mockDomains, className, style }: ManageEventsPanelProps) {
  const [tab, setTab] = useState<EventsTab>(`all`);
  const listOptions = useMemo(
    () => ({
      when: tab === `all` ? undefined : tab,
      mockData: mockEvents,
    }),
    [tab, mockEvents]
  );

  const {
    list,
    createEvent,
    creating,
    updateEvent,
    updating,
    deleteEvent,
    deleting,
    publishRecording,
    publishingRecording,
  } = useEvents(listOptions);
  const { events, loading, error, refetch } = list;
  const { labels } = useLabels(mockLabels ? { mockData: mockLabels } : undefined);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<`create` | `edit`>(`create`);
  const [editingId, setEditingId] = useState<string>(``);
  const [formValues, setFormValues] = useState<EventFormValues>(EMPTY_FORM_VALUES);
  const [formError, setFormError] = useState<string>(``);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string>(``);

  const [publishOpen, setPublishOpen] = useState(false);
  const [publishEventId, setPublishEventId] = useState<string>(``);
  const [publishValues, setPublishValues] = useState<PublishRecordingValues>(EMPTY_PUBLISH_VALUES);
  const [publishError, setPublishError] = useState<string>(``);

  const [notice, setNotice] = useState<string>(``);

  const openCreateForm = () => {
    setFormMode(`create`);
    setEditingId(``);
    setFormValues(EMPTY_FORM_VALUES);
    setFormError(``);
    setFormOpen(true);
  };

  const openEditForm = (eventId: string) => {
    const target = events.find((event) => event.id === eventId);
    if (!target) return;
    setFormMode(`edit`);
    setEditingId(target.id);
    setFormValues({
      title: target.title,
      description: target.description,
      type: target.type,
      coverImage: target.coverImage || ``,
      startAt: isoToLocalInput(target.startAt),
      endAt: isoToLocalInput(target.endAt),
      location: target.location || ``,
      isOnline: target.isOnline,
      joinUrl: target.joinUrl || ``,
      domains: target.domains,
    });
    setFormError(``);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormError(``);
  };

  const handleSubmitForm = async () => {
    if (!formValues.title.trim() || !formValues.description.trim() || !formValues.startAt) {
      setFormError(`יש למלא כותרת, תיאור ותאריך התחלה.`);
      return;
    }

    const startAtIso = localInputToIso(formValues.startAt);
    const endAtIso = formValues.endAt ? localInputToIso(formValues.endAt) : undefined;

    if (formMode === `create`) {
      const input: CreateEventInput = {
        title: formValues.title,
        description: formValues.description,
        type: formValues.type,
        coverImage: formValues.coverImage || undefined,
        startAt: startAtIso,
        endAt: endAtIso,
        location: formValues.location || undefined,
        isOnline: formValues.isOnline,
        joinUrl: formValues.joinUrl || undefined,
        domains: formValues.domains,
      };
      const created = await createEvent(input);
      if (!created) {
        setFormError(`יצירת האירוע נכשלה, נסו שוב.`);
        return;
      }
      setNotice(`האירוע נוצר בהצלחה.`);
    } else {
      const input: UpdateEventInput = {
        title: formValues.title,
        description: formValues.description,
        type: formValues.type,
        coverImage: formValues.coverImage || undefined,
        startAt: startAtIso,
        endAt: endAtIso,
        location: formValues.location || undefined,
        isOnline: formValues.isOnline,
        joinUrl: formValues.joinUrl || undefined,
        domains: formValues.domains,
      };
      const updated = await updateEvent(editingId, input);
      if (!updated) {
        setFormError(`עדכון האירוע נכשל, נסו שוב.`);
        return;
      }
      setNotice(`האירוע עודכן בהצלחה.`);
    }

    setFormOpen(false);
    refetch();
  };

  const requestDelete = (eventId: string) => {
    setConfirmDeleteId(eventId);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(``);
  };

  const confirmDelete = async (eventId: string) => {
    const success = await deleteEvent(eventId);
    setConfirmDeleteId(``);
    if (success) {
      setNotice(`האירוע נמחק בהצלחה.`);
      refetch();
    }
  };

  const openPublish = (eventId: string) => {
    const target = events.find((event) => event.id === eventId);
    if (!target) return;
    setPublishEventId(target.id);
    setPublishValues({
      labelId: labels[0]?.id || ``,
      title: `הקלטת: ${target.title}`,
      mediaType: `video`,
      mediaUrl: ``,
      thumbnailUrl: target.coverImage || ``,
      domains: target.domains,
    });
    setPublishError(``);
    setPublishOpen(true);
  };

  const closePublish = () => {
    setPublishOpen(false);
    setPublishError(``);
  };

  const handleSubmitPublish = async () => {
    if (!publishValues.labelId || !publishValues.title.trim() || !publishValues.mediaUrl.trim()) {
      setPublishError(`יש לבחור פרויקט ולמלא כותרת וקישור למדיה.`);
      return;
    }

    const input: PublishRecordingInput = {
      labelId: publishValues.labelId,
      title: publishValues.title,
      mediaType: publishValues.mediaType,
      mediaUrl: publishValues.mediaUrl,
      thumbnailUrl: publishValues.thumbnailUrl || undefined,
      domains: publishValues.domains,
    };

    const success = await publishRecording(publishEventId, input);
    if (!success) {
      setPublishError(`פרסום ההקלטה נכשל, נסו שוב.`);
      return;
    }

    setNotice(`ההקלטה פורסמה לספריית הידע בהצלחה.`);
    setPublishOpen(false);
    refetch();
  };

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: `title`,
        header: `אירוע`,
        renderCell: (row: TableRow) => {
          const target = events.find((event) => event.id === row.id);
          if (!target) return String(row.title || ``);
          return (
            <div className={styles.titleCell}>
              {target.coverImage ? (
                <img src={target.coverImage} alt={target.title} className={styles.thumb} />
              ) : null}
              <span className={styles.titleText}>{target.title}</span>
            </div>
          );
        },
      },
      { key: `type`, header: `סוג` },
      { key: `startAt`, header: `תאריך`, hideOnMobile: true },
      { key: `format`, header: `פורמט`, align: `center`, hideOnMobile: true },
      { key: `domains`, header: `תחומים`, hideOnMobile: true },
      { key: `rsvpCount`, header: `נרשמים`, align: `center` },
      {
        key: `recording`,
        header: `הקלטה`,
        align: `center`,
        renderCell: (row: TableRow) => {
          const target = events.find((event) => event.id === row.id);
          if (!target) return `-`;
          if (target.hasRecording) {
            return <span className={classNames(styles.badge, styles.badgePositive)}>פורסמה</span>;
          }
          if (target.isPast) {
            return <span className={classNames(styles.badge, styles.badgeMuted)}>לא פורסמה</span>;
          }
          return `-`;
        },
      },
      {
        key: `actions`,
        header: `פעולות`,
        align: `end`,
        renderCell: (row: TableRow) => {
          const eventId = String(row.id);
          const target = events.find((event) => event.id === eventId);
          if (!target) return null;

          if (confirmDeleteId === eventId) {
            return (
              <div className={styles.confirmGroup}>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleting}
                  onClick={() => confirmDelete(eventId)}
                >
                  אישור מחיקה
                </Button>
                <Button variant="ghost" size="sm" onClick={() => cancelDelete()}>
                  ביטול
                </Button>
              </div>
            );
          }

          return (
            <div className={styles.rowActions}>
              {target.isPast && !target.hasRecording ? (
                <Button variant="accent" size="sm" onClick={() => openPublish(eventId)}>
                  פרסום הקלטה
                </Button>
              ) : null}
              <Button variant="secondary" size="sm" onClick={() => openEditForm(eventId)}>
                עריכה
              </Button>
              <Button variant="ghost" size="sm" onClick={() => requestDelete(eventId)}>
                מחיקה
              </Button>
            </div>
          );
        },
      },
    ],
    [events, confirmDeleteId, deleting, labels]
  );

  const rows: TableRow[] = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        type: labelForEventType(event.type),
        startAt: formatEventDate(event.startAt),
        format: event.isOnline ? `מקוון` : `פרונטלי`,
        domains: event.domains.join(`, `) || `-`,
        rsvpCount: event.rsvpCount,
      })),
    [events]
  );

  const labelOptions = labels;

  return (
    <div className={classNames(styles.manageEvents, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>ניהול תוכן</div>
        <h1 className={styles.title}>ניהול אירועים</h1>
        <p className={styles.subtitle}>
          יצירה, עריכה ומחיקה של אירועי הקהילה, ופרסום הקלטות של אירועים שהסתיימו לספריית הידע.
        </p>
        <div className={styles.headerActions}>
          <Button variant="accent" onClick={() => openCreateForm()}>
            + אירוע חדש
          </Button>
        </div>
      </div>

      <div className={styles.tabs}>
        {(
          [
            { key: `all` as const, label: `כל האירועים` },
            { key: `upcoming` as const, label: `אירועים קרובים` },
            { key: `past` as const, label: `אירועים שהיו` },
          ]
        ).map((option) => (
          <button
            key={option.key}
            type="button"
            className={classNames(styles.tabButton, tab === option.key && styles.tabButtonActive)}
            onClick={() => setTab(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {notice ? (
        <div className={styles.noticeBanner}>
          <span>{notice}</span>
          <button type="button" className={styles.noticeClose} onClick={() => setNotice(``)}>
            ×
          </button>
        </div>
      ) : null}

      {error ? <div className={styles.errorBanner}>שגיאה בטעינת האירועים: {error.message}</div> : null}

      {loading ? <p className={styles.loadingText}>טוען אירועים...</p> : null}

      {!loading ? (
        <Table
          columns={columns}
          rows={rows}
          emptyMessage="אין אירועים להצגה בקטגוריה זו"
        />
      ) : null}

      {formOpen ? (
        <div className={styles.overlay}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>{formMode === `create` ? `אירוע חדש` : `עריכת אירוע`}</h2>

            {formError ? <p className={styles.formError}>{formError}</p> : null}

            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <TextInput
                  label="כותרת האירוע"
                  required
                  value={formValues.title}
                  onChange={(value) => setFormValues({ ...formValues, title: value })}
                />
              </div>

              <div className={styles.formField}>
                <Textarea
                  label="תיאור"
                  required
                  value={formValues.description}
                  onChange={(value) => setFormValues({ ...formValues, description: value })}
                  minRows={3}
                />
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>סוג אירוע</span>
                <select
                  className={styles.selectInput}
                  value={formValues.type}
                  onChange={(event) => setFormValues({ ...formValues, type: event.target.value })}
                >
                  {EVENT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <TextInput
                label="תמונת שער (קישור)"
                type="url"
                value={formValues.coverImage}
                onChange={(value) => setFormValues({ ...formValues, coverImage: value })}
              />

              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>תאריך ושעת התחלה *</span>
                <input
                  type="datetime-local"
                  className={styles.dateInput}
                  value={formValues.startAt}
                  onChange={(event) => setFormValues({ ...formValues, startAt: event.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>תאריך ושעת סיום</span>
                <input
                  type="datetime-local"
                  className={styles.dateInput}
                  value={formValues.endAt}
                  onChange={(event) => setFormValues({ ...formValues, endAt: event.target.value })}
                />
              </div>

              <TextInput
                label="מיקום"
                value={formValues.location}
                onChange={(value) => setFormValues({ ...formValues, location: value })}
              />

              <TextInput
                label="קישור להצטרפות (זום וכד')"
                type="url"
                value={formValues.joinUrl}
                onChange={(value) => setFormValues({ ...formValues, joinUrl: value })}
              />
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={formValues.isOnline}
                onChange={(event) => setFormValues({ ...formValues, isOnline: event.target.checked })}
              />
              אירוע מקוון
            </label>

            <div className={styles.domainField}>
              <DomainSelector
                label="תחומים רלוונטיים"
                value={formValues.domains}
                onChange={(next) => setFormValues({ ...formValues, domains: next })}
                mockDomains={mockDomains}
              />
            </div>

            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => closeForm()}>
                ביטול
              </Button>
              <Button
                variant="primary"
                loading={formMode === `create` ? creating : updating}
                onClick={() => handleSubmitForm()}
              >
                {formMode === `create` ? `יצירת אירוע` : `שמירת שינויים`}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {publishOpen ? (
        <div className={styles.overlay}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>פרסום הקלטה לספריית הידע</h2>

            {publishError ? <p className={styles.formError}>{publishError}</p> : null}

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>פרויקט (Label) *</span>
                <select
                  className={styles.selectInput}
                  value={publishValues.labelId}
                  onChange={(event) => setPublishValues({ ...publishValues, labelId: event.target.value })}
                >
                  <option value="">בחרו פרויקט...</option>
                  {labelOptions.map((label) => (
                    <option key={label.id} value={label.id}>
                      {label.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>סוג מדיה</span>
                <select
                  className={styles.selectInput}
                  value={publishValues.mediaType}
                  onChange={(event) => setPublishValues({ ...publishValues, mediaType: event.target.value })}
                >
                  {MEDIA_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formField}>
                <TextInput
                  label="כותרת ההקלטה"
                  required
                  value={publishValues.title}
                  onChange={(value) => setPublishValues({ ...publishValues, title: value })}
                />
              </div>

              <div className={styles.formField}>
                <TextInput
                  label="קישור למדיה"
                  type="url"
                  required
                  value={publishValues.mediaUrl}
                  onChange={(value) => setPublishValues({ ...publishValues, mediaUrl: value })}
                />
              </div>

              <div className={styles.formField}>
                <TextInput
                  label="תמונה ממוזערת (קישור, אופציונלי)"
                  type="url"
                  value={publishValues.thumbnailUrl}
                  onChange={(value) => setPublishValues({ ...publishValues, thumbnailUrl: value })}
                />
              </div>
            </div>

            <div className={styles.domainField}>
              <DomainSelector
                label="תחומים רלוונטיים להקלטה"
                value={publishValues.domains}
                onChange={(next) => setPublishValues({ ...publishValues, domains: next })}
                mockDomains={mockDomains}
              />
            </div>

            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => closePublish()}>
                ביטול
              </Button>
              <Button variant="primary" loading={publishingRecording} onClick={() => handleSubmitPublish()}>
                פרסום ההקלטה
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * admin CRUD panel for community events: create, edit and delete events
 * (all fields, including domains), plus a publish-recording action that
 * pushes a past event's recording into a knowledge-base label. Restricted
 * to admins. Intended to be registered as an AdminPanel entry. RTL.
 */
export function ManageEvents({
  mockEvents,
  mockLabels,
  mockDomains,
  mockUser,
  className,
  style,
}: ManageEventsProps) {
  return (
    <ProtectedRoute allowedRoles={[`admin`]} mockData={mockUser}>
      <ManageEventsPanel
        mockEvents={mockEvents}
        mockLabels={mockLabels}
        mockDomains={mockDomains}
        className={className}
        style={style}
      />
    </ProtectedRoute>
  );
}
