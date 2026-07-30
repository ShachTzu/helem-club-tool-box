import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { Button } from '@helemclub/design.actions.button';
import { DomainSelector, type DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';
import { useApps } from '@helemclub/toolbox.hooks.use-apps';
import type { PlainApp } from '@helemclub/toolbox.entities.app';
import { useCreatePost } from '@helemclub/blog.hooks.use-posts';
import { MembersOnlyIcon } from '@helemclub/blog.icons.blog-icons';
import type { PostEditorUser } from './post-editor-user-type.js';
import styles from './post-editor.module.scss';

export type PostEditorProps = {
  /**
   * provide mock domains to the domain selector, useful for tests and previews.
   */
  mockDomains?: DomainOption[];

  /**
   * provide mock toolbox apps available for embedding, useful for tests and previews.
   */
  mockApps?: PlainApp[];

  /**
   * provide mock data for the current user, gating the editor behind the
   * writer/admin roles. pass null to simulate a signed-out state.
   */
  mockUser?: PostEditorUser | null;

  /**
   * called after a post was published successfully, with the id of the new post.
   */
  onPublished?: (postId: string) => void;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_DOMAINS: string[] = [];
const DEFAULT_EMBEDDED_APPS: string[] = [];

/**
 * a protected editor for writers and admins to compose and publish blog
 * posts: title, excerpt, cover image, a rich body with image and app-block
 * insertion, domain tagging, a members-only toggle and SEO metadata.
 * publishes immediately upon submission. RTL.
 */
export function PostEditor({
  mockDomains,
  mockApps,
  mockUser,
  onPublished = () => {},
  className,
  style,
}: PostEditorProps) {
  const navigate = useNavigate();
  const { apps } = useApps({ mockData: mockApps });
  const { createPost, loading, error } = useCreatePost();

  const [title, setTitle] = useState(``);
  const [excerpt, setExcerpt] = useState(``);
  const [coverImage, setCoverImage] = useState(``);
  const [body, setBody] = useState(``);
  const [imageUrlDraft, setImageUrlDraft] = useState(``);
  const [domains, setDomains] = useState<string[]>(DEFAULT_DOMAINS);
  const [embeddedApps, setEmbeddedApps] = useState<string[]>(DEFAULT_EMBEDDED_APPS);
  const [membersOnly, setMembersOnly] = useState(false);
  const [metaDescription, setMetaDescription] = useState(``);
  const [validationError, setValidationError] = useState(``);
  const [successMessage, setSuccessMessage] = useState(``);

  const handleInsertImage = () => {
    const url = imageUrlDraft.trim();
    if (!url) return;
    setBody((prev) => `${prev}${prev ? `\n\n` : ``}<img src="${url}" alt="${title || `תמונה בכתבה`}" />\n\n`);
    setImageUrlDraft(``);
  };

  const handleToggleApp = (app: PlainApp) => {
    const isSelected = embeddedApps.includes(app.id);
    setEmbeddedApps((prev) => (isSelected ? prev.filter((id) => id !== app.id) : [...prev, app.id]));
    if (!isSelected) {
      setBody((prev) => `${prev}${prev ? `\n\n` : ``}[אפליקציה: ${app.name}]\n\n`);
    }
  };

  const handlePublish = async () => {
    setValidationError(``);
    setSuccessMessage(``);

    if (!title.trim() || !excerpt.trim() || !body.trim()) {
      setValidationError(`יש למלא כותרת, תקציר וגוף כתבה לפני הפרסום.`);
      return;
    }

    if (domains.length === 0) {
      setValidationError(`יש לבחור לפחות תחום התמודדות אחד.`);
      return;
    }

    const created = await createPost({
      title: title.trim(),
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim() || undefined,
      body,
      domains,
      embeddedApps,
      visibility: membersOnly ? `members_only` : `public`,
      metaDescription: metaDescription.trim() || undefined,
    });

    if (!created) return;

    setSuccessMessage(`הכתבה פורסמה בהצלחה!`);
    onPublished(created.id);
    navigate(`/blog/${created.slug}`);
  };

  return (
    <ProtectedRoute allowedRoles={[`writer`, `admin`]} mockData={mockUser}>
      <div className={classNames(styles.page, className)} style={style}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>עריכת כתבה</span>
            <h1 className={styles.title}>כתיבת כתבה חדשה לבלוג</h1>
            <p className={styles.subtitle}>
              ככותב/ת בהלם קלאב, הכתבה שלך תתפרסם באופן מיידי לאחר השליחה. אפשר לשלב תמונות
              ואפליקציות מארגז הכלים ישירות בתוך גוף הכתבה.
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>פרטי הכתבה</h2>
            <div className={styles.fieldGroup}>
              <TextInput
                label="כותרת הכתבה"
                placeholder="כותרת ברורה ומזמינה"
                value={title}
                onChange={(value) => setTitle(value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <Textarea
                label="תקציר"
                placeholder="שתיים-שלוש שורות שמתארות את הכתבה"
                value={excerpt}
                onChange={(value) => setExcerpt(value)}
                minRows={2}
                maxRows={4}
                maxLength={280}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <TextInput
                label="קישור לתמונת נושא"
                placeholder="https://..."
                type="url"
                value={coverImage}
                onChange={(value) => setCoverImage(value)}
                helperText="התמונה תוצג בראש הכתבה ובכרטיסי התצוגה בבלוג."
              />
              {coverImage.trim() && (
                <div className={styles.coverPreview}>
                  <img src={coverImage} alt={title || `תצוגה מקדימה`} className={styles.coverImage} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>גוף הכתבה</h2>
            <div className={styles.fieldGroup}>
              <Textarea
                label="תוכן הכתבה"
                placeholder="כתבו כאן את הכתבה המלאה..."
                value={body}
                onChange={(value) => setBody(value)}
                minRows={10}
                maxRows={24}
                required
              />
            </div>

            <div className={styles.insertRow}>
              <div className={styles.insertImage}>
                <TextInput
                  label="הוספת תמונה בתוך הכתבה"
                  placeholder="הדביקו קישור לתמונה"
                  type="url"
                  value={imageUrlDraft}
                  onChange={(value) => setImageUrlDraft(value)}
                />
                <Button variant="secondary" size="sm" onClick={() => handleInsertImage()}>
                  הוספה לתוך התוכן
                </Button>
              </div>

              {apps.length > 0 && (
                <div className={styles.insertApps}>
                  <span className={styles.insertAppsLabel}>הטמעת אפליקציה מארגז הכלים</span>
                  <div className={styles.appPills}>
                    {apps.map((app) => {
                      const isSelected = embeddedApps.includes(app.id);
                      return (
                        <button
                          key={app.id}
                          type="button"
                          className={classNames(styles.appPill, isSelected && styles.appPillActive)}
                          onClick={() => handleToggleApp(app.toObject())}
                        >
                          <span className={styles.appPillIcon}>{app.icon}</span>
                          <span>{app.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>סיווג ונראות</h2>
            <div className={styles.fieldGroup}>
              <DomainSelector
                value={domains}
                onChange={(next) => setDomains(next)}
                mockDomains={mockDomains}
                label="תחומי התמודדות"
                required
              />
            </div>
            <button
              type="button"
              className={classNames(styles.toggle, membersOnly && styles.toggleActive)}
              onClick={() => setMembersOnly((prev) => !prev)}
            >
              <span className={styles.toggleTrack}>
                <span className={styles.toggleThumb} />
              </span>
              <span className={styles.toggleLabel}>
                <MembersOnlyIcon size="small" color="secondary" /> תוכן לחברי קהילה בלבד
              </span>
            </button>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>קידום ו-SEO</h2>
            <div className={styles.fieldGroup}>
              <Textarea
                label="תיאור מטא (SEO)"
                placeholder="תיאור קצר שיוצג במנועי החיפוש וברשתות החברתיות"
                value={metaDescription}
                onChange={(value) => setMetaDescription(value)}
                minRows={2}
                maxRows={3}
                maxLength={160}
                helperText="עד 160 תווים, לתצוגה אופטימלית בתוצאות חיפוש."
              />
            </div>
          </div>

          {validationError && <p className={styles.errorText}>{validationError}</p>}
          {error && <p className={styles.errorText}>שגיאה בפרסום הכתבה. נסו שוב מאוחר יותר.</p>}
          {successMessage && <p className={styles.successText}>{successMessage}</p>}

          <div className={styles.actions}>
            <Button variant="accent" size="lg" loading={loading} onClick={() => handlePublish()}>
              פרסום הכתבה
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
