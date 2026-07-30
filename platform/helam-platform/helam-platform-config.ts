export type HelamPlatformConfig = {
  /**
   * mongo connection URI.
   */
  mongoUrl?: string;

  /**
   * secret key for session management.
   */
  sessionSecretKey?: string;
};