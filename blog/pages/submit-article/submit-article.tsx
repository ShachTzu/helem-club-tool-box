import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { DomainSelector, type DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';
import { useSubmitPost } from '@helemclub/blog.hooks.use-posts';
import styles from './submit-article.module.scss';

export type SubmitArticleProps = {
  /**
   * mock domain options forwarded to the domain selector, useful for tests and previews.
   */
  mockDomains?: DomainOption[];

  /**
   * skips the submission flow and renders the success state directly, useful for tests and previews.
   */
  previewSubmitted?: boolean;

  /**
   * called with the submitted article's title after a successful submission.
   */
  onSubmitted?: (title: string) => void;

  /**
   * path navigated to when the visitor returns to the blog from the success state.
   */
  blogHref?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const REQUIRED_FIELDS_ERROR = `נא למלא את כל השדות המסומנים בכוכבית`;
const SUBMIT_FAILED_ERROR = `אירעה שגיאה בשליחת הכתבה. נסו שוב בעוד רגע.`;

/**
 * community blog article submission form. collects the article content, coping-domains
 * and identifying contact details (never shown publicly), and submits it as a pending
 * post awaiting moderation. RTL.
 */
export function SubmitArticle({
  mockDomains,
  previewSubmitted = false,
  onSubmitted,
  blogHref = `/blog`,
  className,
  style,
}: SubmitArticleProps) {
  const navigate = useNavigate();
  const { submitPost, loading: submitting, error } = useSubmitPost();

  const [title, setTitle] = useState(``);
  const [excerpt, setExcerpt] = useState(``);
  const [body, setBody] = useState(``);
  const [domainIds, setDomainIds] = useState<string[]>([]);
  const [fullName, setFullName] = useState(``);
  const [email, setEmail] = useState(``);
  const [phone, setPhone] = useState(``);
  const [facebook, setFacebook] = useState(``);
  const [displayName, setDisplayName] = useState(``);
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(previewSubmitted);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    const missingRequiredField =
      !title.trim() ||
      !excerpt.trim() ||
      !body.trim() ||
      domainIds.length === 0 ||
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !facebook.trim();

    if (missingRequiredField) {
      setFormError(REQUIRED_FIELDS_ERROR);
      return;
    }

    setFormError(undefined);

    const result = await submitPost({
      title: title.trim(),
      excerpt: excerpt.trim(),
      body: body.trim(),
      domains: domainIds,
      submitterName: fullName.trim(),
      submitterEmail: email.trim(),
      submitterPhone: phone.trim(),
      submitterFacebook: facebook.trim(),
      displayName: anonymous ? `אנונימי/ת` : displayName.trim() || fullName.trim(),
    });

    if (result) {
      setSubmitted(true);
      onSubmitted?.(result.title);
    } else {
      setFormError(SUBMIT_FAILED_ERROR);
    }
  };

  if (submitted) {
    return (
      <div className={classNames(styles.page, className)} style={style}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>🕊️</div>
          <h1 className={styles.successTitle}>תודה שהגשתם כתבה!</h1>
          <p className={styles.successText}>
            הכתבה שלכם התקבלה וממתינה לאישור צוות הבלוג. נעדכן אתכם ברגע שהיא תפורסם.
          </p>
          <Button variant="primary" onClick={() => navigate(blogHref)}>
            חזרה לבלוג
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <div className={styles.container}>
        <h1 className={styles.title}>הגשת כתבה לבלוג</h1>
        <p className={styles.subtitle}>
          מוזמנים לשתף ידע או חוויה אישית. הכתבה תעבור הגהה ואישור לפני פרסום. פרטי הקשר אינם מוצגים
          לציבור.
        </p>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <TextInput
            label="כותרת הכתבה"
            required
            value={title}
            onChange={(value) => setTitle(value)}
            placeholder="כותרת ברורה ומזמינה"
          />

          <Textarea
            label="תקציר"
            required
            value={excerpt}
            onChange={(value) => setExcerpt(value)}
            placeholder="שתי-שלוש שורות שמתארות את הכתבה"
            minRows={3}
            maxLength={220}
          />

          <Textarea
            label="גוף הכתבה"
            required
            value={body}
            onChange={(value) => setBody(value)}
            placeholder="כתבו כאן..."
            minRows={8}
            maxRows={20}
          />

          <DomainSelector
            value={domainIds}
            onChange={(next) => setDomainIds(next)}
            mockDomains={mockDomains}
            label="תחומי התמודדות"
            required
            helperText="בחרו תחום אחד או יותר שרלוונטיים לכתבה — נעזור להתאים אותה לקוראים הנכונים."
          />

          <div className={styles.identityCard}>
            <div className={styles.identityTitle}>פרטי מזהה (לא מוצגים לציבור)</div>
            <div className={styles.identityGrid}>
              <TextInput
                label="שם מלא"
                required
                value={fullName}
                onChange={(value) => setFullName(value)}
                placeholder="איך קוראים לך?"
              />
              <TextInput
                label="דוא&quot;ל"
                type="email"
                required
                value={email}
                onChange={(value) => setEmail(value)}
                placeholder="name@example.com"
              />
              <TextInput
                label="טלפון"
                type="tel"
                required
                value={phone}
                onChange={(value) => setPhone(value)}
                placeholder="050-0000000"
              />
              <TextInput
                label="קישור לפרופיל פייסבוק"
                type="url"
                required
                value={facebook}
                onChange={(value) => setFacebook(value)}
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <TextInput
            label="שם לפרסום (אופציונלי)"
            value={displayName}
            onChange={(value) => setDisplayName(value)}
            placeholder="איך נציג את שמך לצד הכתבה"
            disabled={anonymous}
            helperText="אם לא יוגדר, נציג את שמכם המלא. אפשר גם לבחור לפרסם בכינוי אנונימי."
          />

          <label className={styles.anonymousLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={anonymous}
              onChange={(event) => setAnonymous(event.target.checked)}
            />
            <span>אני מעדיף/ה לפרסם בכינוי אנונימי</span>
          </label>

          {(formError || error) && (
            <p className={styles.errorText}>{formError || SUBMIT_FAILED_ERROR}</p>
          )}

          <Button type="submit" variant="accent" size="lg" fullWidth loading={submitting}>
            שליחה לאישור
          </Button>
        </form>
      </div>
    </div>
  );
}
