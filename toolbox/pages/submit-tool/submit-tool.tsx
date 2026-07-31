import React, { useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { SelectList, type SelectListOption } from '@helemclub/design.inputs.select-list';
import { DomainSelector, type DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';
import { useApps } from '@helemclub/toolbox.hooks.use-apps';
import styles from './submit-tool.module.scss';

type ProtectedRouteMockUser = React.ComponentProps<typeof ProtectedRoute>['mockData'];

const DEFAULT_COST_OPTIONS: SelectListOption[] = [
  { value: `free`, label: `חינם לחברי הקהילה` },
  { value: `freemium`, label: `פרימיום — חלק בתשלום` },
  { value: `paid`, label: `בתשלום` },
  { value: `subscription`, label: `מנוי חודשי` },
];

const DEFAULT_PLATFORM_OPTIONS: SelectListOption[] = [
  { value: `iOS`, label: `iOS` },
  { value: `Android`, label: `Android` },
  { value: `Web`, label: `Web` },
  { value: `Windows`, label: `Windows` },
  { value: `macOS`, label: `macOS` },
];

const DEFAULT_LANGUAGE_OPTIONS: SelectListOption[] = [
  { value: `עברית`, label: `עברית` },
  { value: `אנגלית`, label: `אנגלית` },
  { value: `ערבית`, label: `ערבית` },
  { value: `רוסית`, label: `רוסית` },
  { value: `רב-לשוני`, label: `רב-לשוני` },
];

export type SubmitToolProps = {
  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;

  /**
   * options offered for the cost model select field.
   */
  costOptions?: SelectListOption[];

  /**
   * options offered for the supported platforms select field.
   */
  platformOptions?: SelectListOption[];

  /**
   * options offered for the primary language select field.
   */
  languageOptions?: SelectListOption[];

  /**
   * provide mock coping domains to skip the network request, useful for tests and previews.
   */
  mockDomains?: DomainOption[];

  /**
   * provide a mock signed-in user to bypass the auth check, useful for tests and previews.
   * pass null to simulate a signed-out state.
   */
  mockUser?: ProtectedRouteMockUser;

  /**
   * path to redirect anonymous (signed-out) members to.
   */
  redirectTo?: string;

  /**
   * where this submission originated, tagged on the created app (e.g. the
   * hackathon cohort). defaults to 'hackathon-1'.
   */
  submissionSource?: string;

  /**
   * called after the tool was submitted successfully and is pending review.
   */
  onSubmitted?: () => void;
};

/**
 * a protected form allowing members to submit a new tool to the toolbox
 * catalog. the submission is created with a "pending" status until a
 * moderator reviews it. RTL.
 */
export function SubmitTool({
  className,
  style,
  costOptions = DEFAULT_COST_OPTIONS,
  platformOptions = DEFAULT_PLATFORM_OPTIONS,
  languageOptions = DEFAULT_LANGUAGE_OPTIONS,
  mockDomains,
  mockUser,
  redirectTo = `/login`,
  submissionSource = `hackathon-1`,
  onSubmitted = () => {},
}: SubmitToolProps) {
  const [name, setName] = useState(``);
  const [subtitle, setSubtitle] = useState(``);
  const [description, setDescription] = useState(``);
  const [externalLink, setExternalLink] = useState(``);
  const [costType, setCostType] = useState(``);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [language, setLanguage] = useState(``);
  const [domains, setDomains] = useState<string[]>([]);
  const [developerName, setDeveloperName] = useState(``);
  const [contactEmail, setContactEmail] = useState(``);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  const { submitApp, submitting, submitError } = useApps();

  const resetForm = () => {
    setName(``);
    setSubtitle(``);
    setDescription(``);
    setExternalLink(``);
    setCostType(``);
    setPlatforms([]);
    setLanguage(``);
    setDomains([]);
    setDeveloperName(``);
    setContactEmail(``);
    setFormError(undefined);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedSubtitle = subtitle.trim();
    const trimmedDescription = description.trim();
    const trimmedLink = externalLink.trim();
    const trimmedDeveloper = developerName.trim();
    const trimmedContact = contactEmail.trim();

    if (
      !trimmedName ||
      !trimmedSubtitle ||
      !trimmedDescription ||
      !trimmedLink ||
      !costType ||
      !language ||
      !trimmedDeveloper ||
      !trimmedContact
    ) {
      setFormError(`נא למלא את כל השדות המסומנים בכוכבית לפני השליחה`);
      return;
    }

    if (!/^https?:\/\//.test(trimmedLink)) {
      setFormError(`קישור חיצוני חייב להתחיל ב-http:// או https://`);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact)) {
      setFormError(`נא להזין כתובת מייל תקינה ליצירת קשר`);
      return;
    }

    setFormError(undefined);

    const result = await submitApp({
      name: trimmedName,
      subtitle: trimmedSubtitle,
      fullDescription: trimmedDescription,
      externalLink: trimmedLink,
      costType,
      platform: platforms,
      language,
      domains,
      developerName: trimmedDeveloper,
      contactEmail: trimmedContact,
      submissionSource,
    });

    if (result) {
      setSubmitted(true);
      onSubmitted();
    }
  };

  return (
    <ProtectedRoute redirectTo={redirectTo} mockData={mockUser}>
      <div className={classNames(styles.page, className)} style={style}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>🧩 הגשת כלי חדשה</span>
            <h1 className={styles.title}>הצעת כלי לארגז הכלים</h1>
            <p className={styles.subtitle}>
              מכירים אפליקציה או כלי שעוזר להתמודד? שתפו אותו עם הקהילה. ההגשה תיבדק ע&quot;י צוות
              המנחים ותפורסם לאחר אישור.
            </p>
          </div>

          {submitted ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.successTitle}>הכלי נשלח לבדיקה!</h2>
              <p className={styles.successText}>
                תודה על התרומה לקהילה. הכלי &quot;{name}&quot; ממתין כעת לאישור צוות המנחים, ויפורסם
                בארגז הכלים ברגע שיאושר.
              </p>
              <Button variant="accent" onClick={() => resetForm()}>
                הגשת כלי נוסף
              </Button>
            </div>
          ) : (
            <form
              className={styles.card}
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <div className={styles.form}>
                <div className={styles.row}>
                  <TextInput
                    label="שם הכלי"
                    placeholder="לדוגמה: נשימה רגועה"
                    value={name}
                    onChange={(value) => setName(value)}
                    required
                  />
                  <TextInput
                    label="כותרת משנה"
                    placeholder="תיאור קצר בשורה אחת"
                    value={subtitle}
                    onChange={(value) => setSubtitle(value)}
                    required
                  />
                </div>

                <Textarea
                  label="תיאור מלא"
                  placeholder="תארו את הכלי — איך הוא עוזר, למי הוא מתאים ומה מייחד אותו"
                  value={description}
                  onChange={(value) => setDescription(value)}
                  minRows={4}
                  maxLength={1200}
                  required
                />

                <TextInput
                  label="קישור חיצוני"
                  type="url"
                  placeholder="https://example.com"
                  value={externalLink}
                  onChange={(value) => setExternalLink(value)}
                  helperText="קישור לחנות האפליקציות, לאתר או לעמוד ההרשמה"
                  required
                />

                <div className={styles.row}>
                  <SelectList
                    label="עלות"
                    options={costOptions}
                    value={costType}
                    onChange={(value) => setCostType(value as string)}
                    placeholder="בחרו מודל עלות"
                  />
                  <SelectList
                    label="שפה עיקרית"
                    options={languageOptions}
                    value={language}
                    onChange={(value) => setLanguage(value as string)}
                    placeholder="בחרו שפה"
                  />
                </div>

                <SelectList
                  label="פלטפורמות נתמכות"
                  options={platformOptions}
                  value={platforms}
                  onChange={(value) => setPlatforms(value as string[])}
                  multiple
                  placeholder="בחרו פלטפורמות"
                />

                <DomainSelector
                  value={domains}
                  onChange={(value) => setDomains(value)}
                  mockDomains={mockDomains}
                  label="תחומי התמודדות רלוונטיים"
                  helperText="בחרו תחום אחד או יותר שהכלי רלוונטי עבורם"
                />

                <div className={styles.row}>
                  <TextInput
                    label="שם המפתח / הצוות"
                    placeholder="מי בנה את הכלי"
                    value={developerName}
                    onChange={(value) => setDeveloperName(value)}
                    required
                  />
                  <TextInput
                    label="מייל ליצירת קשר"
                    type="email"
                    placeholder="name@example.com"
                    value={contactEmail}
                    onChange={(value) => setContactEmail(value)}
                    helperText="לשימוש צוות המנחים בלבד — לא יוצג לציבור"
                    required
                  />
                </div>

                {(formError || submitError) && (
                  <p className={styles.errorBanner}>{formError || `אירעה שגיאה בשליחת הכלי, נסו שוב`}</p>
                )}

                <div className={styles.actions}>
                  <Button variant="accent" size="lg" type="submit" loading={submitting}>
                    שליחת הכלי לבדיקה
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
