import React, { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Heading } from '@helemclub/design.typography.heading';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { useAuth, useGoogleSignIn } from '@helemclub/platform.hooks.use-auth';
import { GoogleIcon } from './google-icon.js';
import styles from './login.module.scss';

type LoginStep = `email` | `code`;

export type LoginProps = {
  /**
   * path to redirect to once sign-in succeeds. when omitted, the page uses
   * the intended route from navigation state (the route the user tried to
   * access before being redirected to login), falling back to the home page.
   */
  defaultRedirectPath?: string;

  /**
   * overrides how a Google ID token is obtained. by default the page uses
   * Google Identity Services, configured from the client id the server
   * serves. provide a stub in tests and previews.
   */
  getGoogleIdToken?: () => Promise<string | null>;

  /**
   * class name for the root container.
   */
  className?: string;

  /**
   * style for the root container.
   */
  style?: React.CSSProperties;
};

/**
 * Login page for the Helam Club platform. Members sign in with a
 * one-time code sent to their email, or with a Google account — the email
 * route keeps the community open to people who do not use Google.
 * After a successful sign-in, redirects back to the route the user
 * originally intended to visit.
 */
export function Login({
  defaultRedirectPath = `/`,
  getGoogleIdToken,
  className,
  style,
}: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestEmailOtp, verifyEmailOtp, signInWithGoogle } = useAuth();

  const [step, setStep] = useState<LoginStep>(`email`);
  const [email, setEmail] = useState(``);
  const [code, setCode] = useState(``);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const state = location.state as { from?: string } | null;
  const redirectPath = state?.from || defaultRedirectPath;

  /**
   * exchanges a Google-issued ID token for a platform session and continues
   * to the route the member originally wanted.
   */
  const completeGoogleSignIn = useCallback(
    async (idToken: string) => {
      setError(undefined);
      setIsGoogleSubmitting(true);
      try {
        const session = await signInWithGoogle(idToken);
        if (session) {
          void navigate(redirectPath, { replace: true });
        } else {
          setError(`ההתחברות עם Google לא הושלמה. נסו שוב.`);
        }
      } catch {
        setError(`לא הצלחנו להתחבר עם Google כרגע. נסו שוב מאוחר יותר.`);
      } finally {
        setIsGoogleSubmitting(false);
      }
    },
    [signInWithGoogle, navigate, redirectPath]
  );

  const { googleButtonRef, available: googleAvailable } = useGoogleSignIn({
    onCredential: completeGoogleSignIn,
  });

  // Google is shown only when it can actually complete: either the server has
  // a client id configured, or a token resolver was injected for previews.
  const showGoogle = Boolean(getGoogleIdToken) || googleAvailable;

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      setError(`נא להזין כתובת מייל תקינה`);
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    try {
      const { sent, reason } = await requestEmailOtp(email.trim());
      if (sent) {
        setStep(`code`);
      } else {
        // the server explains throttling and invalid addresses in Hebrew;
        // pass it through rather than flattening it to a generic failure.
        setError(reason || `לא הצלחנו לשלוח את הקוד. בדקו את כתובת המייל ונסו שוב.`);
      }
    } catch {
      setError(`משהו השתבש בשליחת הקוד. נסו שוב בעוד רגע.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code.trim()) {
      setError(`נא להזין את הקוד שקיבלתם`);
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    try {
      const session = await verifyEmailOtp(email.trim(), code.trim());
      if (session) {
        void navigate(redirectPath, { replace: true });
      } else {
        setError(`הקוד שהוזן שגוי או שפג תוקפו. נסו שוב.`);
      }
    } catch {
      setError(`לא הצלחנו לאמת את הקוד. נסו שוב בעוד רגע.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // preview/test path: a resolver was injected, so keep the custom button.
  const handleGoogleSignIn = async () => {
    if (!getGoogleIdToken) return;
    setError(undefined);
    setIsGoogleSubmitting(true);
    try {
      const idToken = await getGoogleIdToken();
      if (!idToken) {
        // the member closed the Google chooser — not an error worth shouting about.
        setIsGoogleSubmitting(false);
        return;
      }
      await completeGoogleSignIn(idToken);
    } catch {
      setError(`לא הצלחנו להתחבר עם Google כרגע. נסו שוב מאוחר יותר.`);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleChangeEmail = () => {
    setStep(`email`);
    setCode(``);
    setError(undefined);
  };

  const handleResendCode = () => {
    // errors are surfaced by handleRequestOtp itself, into the error banner.
    void handleRequestOtp();
  };

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <div className={styles.card}>
        <Heading level={2} align="center" color="primary" className={styles.title}>
          ברוכים הבאים להלם קלאב
        </Heading>
        <p className={styles.subtitle}>
          מתחברים בלי סיסמה — עם קוד חד-פעמי למייל, או עם חשבון Google. בלי לחץ, בקצב שלכם.
        </p>

        {showGoogle && (
          <>
            <div className={styles.googleButton}>
              {getGoogleIdToken ? (
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  leadingIcon={<GoogleIcon />}
                  loading={isGoogleSubmitting}
                  onClick={() => handleGoogleSignIn()}
                >
                  התחברות עם Google
                </Button>
              ) : (
                // Google renders its own button here — the only flow it still
                // supports for an explicit sign-in click.
                <div ref={googleButtonRef} className={styles.googleMount} />
              )}
            </div>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerLabel}>או</span>
              <span className={styles.dividerLine} />
            </div>
          </>
        )}

        {step === `email` && (
          <div className={styles.form}>
            <TextInput
              label="כתובת מייל"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(value) => setEmail(value)}
              error={error}
            />
            <Button
              variant="accent"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onClick={() => handleRequestOtp()}
            >
              שליחת קוד למייל
            </Button>
            <p className={styles.helperText}>
              נשלח אליכם קוד בן כמה ספרות. תוך רגע תוכלו להיכנס בבטחה.
            </p>
          </div>
        )}

        {step === `code` && (
          <div className={styles.form}>
            <p className={styles.codeSentText}>
              שלחנו קוד אימות אל <span className={styles.emailHighlight}>{email}</span>
            </p>
            <TextInput
              label="קוד אימות"
              type="text"
              placeholder="הזינו את הקוד שקיבלתם"
              value={code}
              onChange={(value) => setCode(value)}
              error={error}
            />
            <Button
              variant="accent"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onClick={() => handleVerifyOtp()}
            >
              אימות והתחברות
            </Button>
            <div className={styles.linksRow}>
              <button
                type="button"
                className={styles.linkButton}
                disabled={isSubmitting}
                onClick={() => handleChangeEmail()}
              >
                החלפת כתובת מייל
              </button>
              <button
                type="button"
                className={styles.linkButton}
                disabled={isSubmitting}
                onClick={() => handleResendCode()}
              >
                שליחת קוד חדש
              </button>
            </div>
          </div>
        )}

        <p className={styles.legalText}>
          בהמשך ההתחברות אתם מאשרים את תנאי השימוש ומדיניות הפרטיות של הקהילה.
        </p>
      </div>
    </div>
  );
}
