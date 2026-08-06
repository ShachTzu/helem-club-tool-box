import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { SelectList } from '@helemclub/design.inputs.select-list';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { useDomains, type UseDomainsOptions } from '@helemclub/knowledge-domains.hooks.use-domains';
import type { OnboardingProfile } from '@helemclub/platform.hooks.use-onboarding';
import styles from './onboarding-wizard.module.scss';

const STEPS = ['מי את.ה', 'הקשר שלך לקהילה', 'הרקע שלך', 'איך נתאים לך'];

const GENDER_OPTIONS = [
  { value: 'female', label: 'נקבה' },
  { value: 'male', label: 'זכר' },
  { value: 'other', label: 'אחר' },
];

const RECOGNITION_OPTIONS = [
  { value: 'recognized', label: 'יש לי הכרה' },
  { value: 'in-process', label: 'אני בתהליך להכרה' },
  { value: 'planned', label: 'בכוונתי לעשות בעתיד' },
  { value: 'none', label: 'אין לי וגם לא אעשה' },
];

/**
 * a phone number is the one answer the community's intake requires, because
 * welcome calls happen on the phone. accepts Israeli mobile and landline
 * formats with or without separators.
 */
function isValidPhone(value: string): boolean {
  return /^0\d{1,2}-?\d{7}$/.test(value.replace(/[\s()]/g, ''));
}

export type OnboardingAccount = {
  /**
   * the display name the account signed up with. Google supplies one; email
   * sign-in usually does not.
   */
  displayName?: string;

  /**
   * the address the account signed in with, used to pre-fill the contact
   * email so the member does not retype it.
   */
  email?: string;
};

export type OnboardingWizardProps = {
  /**
   * the signed-in account, used to pre-fill what we already know. the wizard
   * is identical for email and Google sign-ups — Google simply arrives with
   * more of it filled in.
   */
  account?: OnboardingAccount;

  /**
   * called with the completed profile when the member finishes the wizard.
   */
  onComplete?: (profile: OnboardingProfile) => void;

  /**
   * whether the submission is in flight.
   */
  submitting?: boolean;

  /**
   * provide mock domains for the interests step, useful for tests and previews.
   */
  mockDomains?: UseDomainsOptions['mockData'];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * the multi-step post-signup onboarding wizard (RTL, Hebrew). collects the
 * community's intake questions — who the member is, their place in the
 * community, their background, and how we should match them — and emits the
 * profile on completion.
 *
 * the same wizard serves both sign-in routes: whatever the account already
 * knows (a Google display name, the sign-in address) is pre-filled, and
 * everything else is asked. nothing here depends on how the member signed in.
 */
export function OnboardingWizard({
  account,
  onComplete,
  submitting = false,
  mockDomains,
  className,
  style,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(0);

  // step 1 — who you are (q1-q5)
  const [fullName, setFullName] = useState(account?.displayName || '');
  const [phone, setPhone] = useState('');
  const [contactEmail, setContactEmail] = useState(account?.email || '');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  // step 2 — your place in the community (q6-q7)
  const [communityRoles, setCommunityRoles] = useState('');
  const [gender, setGender] = useState('');

  // step 3 — your background (q8-q9)
  const [injuryNote, setInjuryNote] = useState('');
  const [recognitionStatus, setRecognitionStatus] = useState('');

  // step 4 — matching (interests + q12)
  const [interests, setInterests] = useState<string[]>([]);
  const [welcomeCallsOptIn, setWelcomeCallsOptIn] = useState(false);

  const { domains } = useDomains(mockDomains ? { mockData: mockDomains } : {});

  const toggleInterest = (value: string) =>
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );

  const phoneTouched = phone.trim().length > 0;
  const phoneValid = isValidPhone(phone);

  const canNext = useMemo(() => {
    // only the first step gates: a name to greet the member by, and a phone
    // number the community can actually reach them on. everything after is
    // sensitive or optional, and blocking on it only loses people mid-form.
    if (step === 0) return fullName.trim().length > 1 && phoneValid;
    return true;
  }, [step, fullName, phoneValid]);

  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (!isLast) {
      setStep((current) => current + 1);
      return;
    }

    const parsedAge = Number.parseInt(age, 10);
    onComplete?.({
      fullName: fullName.trim(),
      phone: phone.trim(),
      contactEmail: contactEmail.trim() || undefined,
      age: Number.isFinite(parsedAge) ? parsedAge : undefined,
      city: city.trim() || undefined,
      communityRoles: communityRoles.trim() || undefined,
      gender: (gender as OnboardingProfile['gender']) || undefined,
      injuryNote: injuryNote.trim() || undefined,
      recognitionStatus:
        (recognitionStatus as OnboardingProfile['recognitionStatus']) || undefined,
      welcomeCallsOptIn,
      interests,
    });
  };

  const back = () => setStep((current) => Math.max(0, current - 1));

  return (
    <div className={classNames(styles.wizard, className)} style={style}>
      <div className={styles.head}>
        <div className={styles.headIcon} aria-hidden>
          🩷
        </div>
        <h1 className={styles.headTitle}>כמה פרטים לפני שמתחילים</h1>
        <p className={styles.headSubtitle}>
          נשמח להכיר אתכם קצת יותר — כדי להתאים לכם תוכן וכלים, וכדי שנדע לחבר אתכם לאנשים
          הנכונים בקהילה.
        </p>
      </div>

      <div className={styles.progress}>
        {STEPS.map((label, index) => (
          <div key={label} className={styles.progressStep}>
            <div
              className={classNames(styles.progressBar, index <= step && styles.progressBarActive)}
            />
            <div
              className={classNames(
                styles.progressLabel,
                index <= step && styles.progressLabelActive
              )}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        {step === 0 && (
          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>שם מלא</span>
              <TextInput value={fullName} onChange={setFullName} placeholder="איך קוראים לך?" />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>מספר טלפון</span>
              <TextInput value={phone} onChange={setPhone} placeholder="050-0000000" />
              {phoneTouched && !phoneValid && (
                <span className={styles.fieldError}>מספר הטלפון לא נראה תקין</span>
              )}
              <span className={styles.hint}>
                כך נוכל להתקשר כשמתאמים שיחת קליטה. המספר גלוי לצוות הקהילה בלבד.
              </span>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>כתובת מייל ליצירת קשר</span>
              <TextInput
                value={contactEmail}
                onChange={setContactEmail}
                placeholder="name@example.com"
              />
            </label>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>גיל</span>
                <TextInput value={age} onChange={setAge} placeholder="למשל 34" />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>אזור מגורים</span>
                <TextInput value={city} onChange={setCity} placeholder="עיר או אזור" />
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>תפקיד/ים בתוך הקהילה</span>
              <TextInput
                value={communityRoles}
                onChange={setCommunityRoles}
                placeholder="אם כבר יש לך תפקיד — נשמח לדעת. אם לא, אפשר לדלג"
              />
            </label>
            <div className={styles.field}>
              <SelectList
                label="מגדר"
                options={GENDER_OPTIONS}
                value={gender}
                onChange={(value) => setGender(String(value))}
                placeholder="בחרו מהרשימה"
              />
              <span className={styles.hint}>
                עוזר לנו להתאים מלווה לשיחת קליטה — התאמת מגדר היא השיקול הראשון.
              </span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>
                תוכל.י לשתף אותנו על הפציעה שלך בכמה מילים?
              </span>
              <Textarea
                value={injuryNote}
                onChange={setInjuryNote}
                placeholder="ממש בקצרה — ורק אם מתאים לך לשתף"
              />
            </label>
            <div className={styles.field}>
              <SelectList
                label="האם את.ה מוכר.ת בביטוח לאומי / משרד הביטחון?"
                options={RECOGNITION_OPTIONS}
                value={recognitionStatus}
                onChange={(value) => setRecognitionStatus(String(value))}
                placeholder="בחרו מהרשימה"
              />
            </div>
            <p className={styles.privacyNote}>
              שתי השאלות האלה הן מידע רפואי. הן נשמרות בנפרד משאר הפרטים, גלויות לצוות הניהול
              של הקהילה בלבד, ולא מוצגות בשום מקום באתר. אפשר גם לדלג עליהן.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className={styles.fields}>
            <div>
              <span className={styles.fieldLabel}>אילו תחומים הכי רלוונטיים לך כרגע?</span>
              <p className={styles.hint}>נשתמש בזה כדי להתאים לכם תוכן, כלים והמלצות.</p>
              <div className={styles.interests}>
                {domains.map((domain) => (
                  <TagChip
                    key={domain.slug}
                    label={domain.name}
                    active={interests.includes(domain.name)}
                    onToggle={() => toggleInterest(domain.name)}
                  />
                ))}
              </div>
            </div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={welcomeCallsOptIn}
                onChange={(event) => setWelcomeCallsOptIn(event.target.checked)}
              />
              אפשר לפנות אליי בנושא קליטת חברים חדשים (שיחות וולקאם)
            </label>
            <p className={styles.hint}>
              שיחת וולקאם היא שיחה אחת עם חבר.ת קהילה חדש.ה — לפגוש בן אדם אמיתי, לשאול שאלות
              ולקבל הכוונה. נפנה אליכם פעם בחודש-חודשיים, ותמיד אפשר להגיד שלא מתאים.
            </p>
          </div>
        )}

        <div className={styles.footer}>
          {step > 0 ? (
            <button type="button" className={styles.backButton} onClick={back}>
              → חזרה
            </button>
          ) : (
            <span />
          )}
          <Button onClick={next} disabled={!canNext || submitting} loading={submitting}>
            {isLast ? 'סיום ושליחה 🎉' : 'המשך'}
          </Button>
        </div>
      </div>

      <p className={styles.note}>
        מילוי הפרטים נדרש פעם אחת. אחרי השליחה הבקשה עוברת לאישור צוות הקהילה, ואפשר לעדכן
        הכל בהמשך מהפרופיל.
      </p>
    </div>
  );
}
