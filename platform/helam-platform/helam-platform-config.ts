export type HelamPlatformConfig = {
  /**
   * mongo connection URI.
   */
  mongoUrl?: string;

  /**
   * secret key for session management and OTP hashing.
   */
  sessionSecretKey?: string;

  /**
   * Google OAuth client id, used to verify Google ID tokens server-side. when
   * unset, Google sign-in is disabled (rejected) rather than trusted.
   */
  googleClientId?: string;

  /**
   * Resend API key for sending OTP emails. when unset in non-production, the
   * code is logged to the server console instead of emailed.
   */
  resendApiKey?: string;

  /**
   * the From address for OTP emails (e.g. onboarding@resend.dev, or
   * no-reply@helem.club once the domain is verified).
   */
  otpFromEmail?: string;

  /**
   * emails granted the admin role on sign-in (comma-separated in the env var).
   */
  adminEmails?: string[];
};
