import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { useDomains, type UseDomainsOptions } from '@helemclub/knowledge-domains.hooks.use-domains';
import type { OnboardingProfile } from '@helemclub/platform.hooks.use-onboarding';
import styles from './onboarding-wizard.module.scss';

const ROLES = ['מתמודד/ת', 'בן/בת משפחה', 'איש/אשת מקצוע', 'אחר'];
const STEPS = ['פרטים אישיים', 'ההקשר שלך', 'תחומי עניין'];

export type OnboardingWizardProps = {
  /**
   * called with the completed profile when the user finishes the wizard.
   */
  onComplete?: (profile: OnboardingProfile) => void;

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
 * a multi-step post-signup onboarding wizard (RTL, Hebrew). collects personal
 * details, the user's role and context, and their interest domains, with a
 * progress bar and per-step validation gating. emits the collected profile on
 * completion — used to gate new users until they finish setting up.
 */
export function OnboardingWizard({ onComplete, mockDomains, className, style }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [about, setAbout] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [notify, setNotify] = useState(true);
  const [anonymous, setAnonymous] = useState(false);

  const { domains } = useDomains(mockDomains ? { mockData: mockDomains } : {});

  const toggleInterest = (value: string) =>
    setInterests((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));

  const canNext = useMemo(() => {
    if (step === 0) return name.trim().length > 1;
    if (step === 1) return role !== null;
    if (step === 2) return interests.length > 0;
    return true;
  }, [step, name, role, interests]);

  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    onComplete?.({
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      role: role ?? undefined,
      about: about.trim() || undefined,
      interests,
      notify,
      anonymous,
    });
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className={classNames(styles.wizard, className)} style={style}>
      <div className={styles.head}>
        <div className={styles.headIcon} aria-hidden>🌱</div>
        <h1 className={styles.headTitle}>כמה פרטים לפני שמתחילים</h1>
        <p className={styles.headSubtitle}>
          נשמח להכיר אתכם קצת יותר — כדי להתאים לכם תוכן, כלים והמלצות רלוונטיים.
        </p>
      </div>

      <div className={styles.progress}>
        {STEPS.map((label, i) => (
          <div key={label} className={styles.progressStep}>
            <div className={classNames(styles.progressBar, i <= step && styles.progressBarActive)} />
            <div className={classNames(styles.progressLabel, i <= step && styles.progressLabelActive)}>{label}</div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        {step === 0 && (
          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>שם מלא</span>
              <TextInput value={name} onChange={setName} placeholder="איך קוראים לך?" />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>כינוי לתצוגה בקהילה (אופציונלי)</span>
              <TextInput value={nickname} onChange={setNickname} placeholder="השם שיוצג לצד תגובות ושיתופים" />
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              אני מעדיף/ה להישאר אנונימי/ת בפעילות הציבורית
            </label>
          </div>
        )}

        {step === 1 && (
          <div className={styles.fields}>
            <div>
              <span className={styles.fieldLabel}>מה מתאר אותך?</span>
              <div className={styles.roles}>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={classNames(styles.roleButton, role === r && styles.roleButtonActive)}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>קצת על מה מביא אותך לכאן (אופציונלי)</span>
              <Textarea value={about} onChange={setAbout} placeholder="נשמח לשמוע — אבל רק אם מתאים לך לשתף" />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className={styles.fields}>
            <div>
              <span className={styles.fieldLabel}>אילו תחומים הכי רלוונטיים לך כרגע?</span>
              <p className={styles.hint}>בחרו לפחות תחום אחד — נשתמש בזה כדי להתאים לכם תוכן והמלצות.</p>
              <div className={styles.interests}>
                {domains.map((d) => (
                  <TagChip
                    key={d.slug}
                    label={d.name}
                    active={interests.includes(d.name)}
                    onToggle={() => toggleInterest(d.name)}
                  />
                ))}
              </div>
            </div>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
              עדכנו אותי על תוכן ואירועים חדשים בתחומים שבחרתי
            </label>
          </div>
        )}

        <div className={styles.footer}>
          {step > 0 ? (
            <button type="button" className={styles.backButton} onClick={back}>→ חזרה</button>
          ) : <span />}
          <Button onClick={next} disabled={!canNext}>
            {isLast ? 'סיום וכניסה 🎉' : 'המשך'}
          </Button>
        </div>
      </div>

      <p className={styles.note}>
        השלמת הפרטים נדרשת פעם אחת בלבד — אפשר לעדכן הכל בהמשך מהפרופיל.
      </p>
    </div>
  );
}
