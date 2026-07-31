import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import { Heading } from '@helemclub/design.typography.heading';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { useAuth, useGoogleSignIn } from '@helemclub/platform.hooks.use-auth';
import type { User, PlainUser } from '@helemclub/platform.entities.user';
import { GoogleIcon } from './google-icon.js';
import styles from './signup.module.scss';

export type SignupStep = `details` | `otp`;

export type SignupProps = {
  /**
   * called after the user successfully signs up and authenticates,
   * either through the email OTP flow or through Google. defaults to
   * navigating to the homepage.
   */
  onSignupSuccess?: (user: User) => void;

  /**
   * path to the login page, linked at the bottom of the form.
   */
  loginHref?: string;

  /**
   * overrides how a Google ID token is obtained. by default the page uses
   * Google Identity Services, configured from the client id the server
   * serves. resolves with null when the member cancelled. provide a stub in
   * tests and previews.
   */
  requestGoogleIdToken?: () => Promise<string | null>;

  /**
   * provide mock data for the current user, bypassing the auth query.
   * useful for tests and previews.
   */
  mockData?: PlainUser | null;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

const BENEFITS = [
  { icon: `📖`, text: `הקריאה תמיד חופשית — כל התוכן פתוח לכולם, גם בלי חשבון` },
  { icon: `🔓`, text: `חשבון פותח גישה לתוכן חברי-קהילה ולשמירת מועדפים` },
  { icon: `✍️`, text: `חברי קהילה רשומים יכולים להגיש כלים, תוכן ולהגיב` },
];

/**
 * signup page for the Helam Club platform. collects a display name and
 * email, sends a one-time-password to verify the address, and also
 * offers signup with Google. explains that reading remains free while
 * an account unlocks members-only content and submissions.
 */
export function Signup({
  onSignupSuccess,
  loginHref = `/login`,
  requestGoogleIdToken,
  mockData,
  className,
  style,
}: SignupProps) {
  const navigate = useNavigate();
  const hasMockData = mockData !== undefined;
  const { requestEmailOtp, verifyEmailOtp, signInWithGoogle } = useAuth(
    hasMockData ? { mockData } : undefined
  );
  const { requestGoogleIdToken: gsiRequestToken, available: googleAvailable } = useGoogleSignIn();

  // Google is offered only when it can actually complete: either the server
  // has a client id configured, or a resolver was injected for previews.
  const resolveGoogleToken = requestGoogleIdToken || gsiRequestToken;
  const showGoogle = Boolean(requestGoogleIdToken) || googleAvailable;

  const [step, setStep] = useState<SignupStep>(`details`);
  const [displayName, setDisplayName] = useState(``);
  const [email, setEmail] = useState(``);
  const [code, setCode] = useState(``);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSuccess = (user: User) => {
    if (onSignupSuccess) {
      onSignupSuccess(user);
      return;
    }
    navigate(`/`);
  };

  const handleRequestOtp = async () => {
    setError(undefined);

    if (displayName.trim().length < 2) {
      setError(`נא להזין שם תצוגה בן 2 תווים לפחות`);
      return;
    }

    if (!email.includes(`@`)) {
      setError(`נא להזין כתובת מייל תקינה`);
      return;
    }

    setIsSubmitting(true);
    try {
      // the display name travels with the request and is applied to the
      // account created when the code is verified.
      const { sent, reason } = await requestEmailOtp(email, displayName.trim());
      if (!sent) {
        setError(reason || `לא הצלחנו לשלוח קוד למייל הזה. נסו שוב`);
        return;
      }
      setStep(`otp`);
    } catch {
      setError(`משהו השתבש בשליחת הקוד. נסו שוב בעוד רגע`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(undefined);

    if (code.trim().length < 4) {
      setError(`נא להזין את הקוד שקיבלתם במייל`);
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await verifyEmailOtp(email, code);
      if (!session) {
        setError(`הקוד שגוי או שפג תוקפו. נסו לבקש קוד חדש`);
        return;
      }
      handleSuccess(session.user);
    } catch {
      setError(`משהו השתבש באימות הקוד. נסו שוב`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(undefined);

    if (!showGoogle) {
      setError(`ההרשמה עם Google אינה זמינה כרגע. נסו עם מייל`);
      return;
    }

    setIsGoogleSubmitting(true);
    try {
      const idToken = await resolveGoogleToken();
      if (!idToken) {
        return;
      }
      const session = await signInWithGoogle(idToken);
      if (!session) {
        setError(`ההרשמה עם Google נכשלה. נסו שוב`);
        return;
      }
      handleSuccess(session.user);
    } catch {
      setError(`משהו השתבש בהרשמה עם Google. נסו שוב`);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <div className={styles.card}>
        <div className={styles.emoji}>🌱</div>
        <Heading level={2} align="center" className={styles.title}>
          בואו נכיר
        </Heading>
        <p className={styles.subtitle}>
          יצירת חשבון בקהילת הלם קלאב לוקחת פחות מדקה — בלי סיסמה.
        </p>

        <div className={styles.benefits}>
          {BENEFITS.map((benefit) => (
            <div key={benefit.text} className={styles.benefitRow}>
              <span className={styles.benefitIcon}>{benefit.icon}</span>
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>

        {showGoogle && (
          <>
            <button
              type="button"
              className={styles.googleButton}
              onClick={() => handleGoogleSignup()}
              disabled={isGoogleSubmitting}
            >
              <GoogleIcon />
              {isGoogleSubmitting ? `מתחברים...` : `הרשמה עם Google`}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span>או</span>
              <span className={styles.dividerLine} />
            </div>
          </>
        )}

        {step === `details` && (
          <div className={styles.form}>
            <TextInput
              label="שם תצוגה"
              placeholder="איך קוראים לך?"
              value={displayName}
              onChange={(value) => setDisplayName(value)}
              required
            />
            <TextInput
              label="כתובת מייל"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(value) => setEmail(value)}
              required
            />
            {error && <p className={styles.errorText}>{error}</p>}
            <Button
              variant="accent"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onClick={() => handleRequestOtp()}
            >
              קבלת קוד למייל
            </Button>
          </div>
        )}

        {step === `otp` && (
          <div className={styles.form}>
            <p className={styles.otpHint}>
              שלחנו קוד חד-פעמי לכתובת <span className={styles.otpEmail}>{email}</span>
            </p>
            <TextInput
              label="קוד אימות"
              placeholder="הזינו את הקוד בן 6 הספרות"
              value={code}
              onChange={(value) => setCode(value)}
              required
            />
            {error && <p className={styles.errorText}>{error}</p>}
            <Button
              variant="accent"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onClick={() => handleVerifyOtp()}
            >
              אימות והרשמה
            </Button>
            <button
              type="button"
              className={styles.changeEmailButton}
              onClick={() => {
                setStep(`details`);
                setCode(``);
                setError(undefined);
              }}
            >
              שינוי כתובת מייל
            </button>
          </div>
        )}

        <p className={styles.footerText}>
          כבר יש לכם חשבון?{` `}
          <Link to={loginHref} className={styles.loginLink}>
            התחברות
          </Link>
        </p>
      </div>
    </div>
  );
}
