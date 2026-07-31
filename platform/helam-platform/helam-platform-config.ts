export type HelamPlatformConfig = {
  /**
   * mongo connection URI. required — the platform refuses to start without it.
   */
  mongoUrl?: string;

  /**
   * secret used to sign session cookies. required — the platform refuses to
   * start without it rather than falling back to a guessable default.
   */
  sessionSecretKey?: string;

  /**
   * the Google OAuth client id that ID tokens are verified against. optional —
   * when absent, Google sign-in is disabled and members sign in with an
   * emailed one-time code instead.
   */
  googleClientId?: string;

  /**
   * Resend API key used to deliver sign-in codes. when absent outside
   * production, codes are printed to the server console instead.
   */
  resendApiKey?: string;

  /**
   * the bare sender address for outbound mail, e.g. "ahalan@helem.club".
   * must belong to a domain verified in Resend.
   */
  mailFromAddress?: string;

  /**
   * set to "1"/"true" to stop feature aspects from inserting demo content into
   * the database. defaults to disabled in production and enabled elsewhere.
   */
  disableSeedData?: string;

  /**
   * comma-separated list of email addresses granted the admin role when they
   * sign in, with either provider. e.g. "roi@helem.club,shachar@helem.club".
   */
  adminEmails?: string;
};
