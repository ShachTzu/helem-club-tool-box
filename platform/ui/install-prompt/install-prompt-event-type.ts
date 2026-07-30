/**
 * The outcome reported once the user responds to the native install prompt.
 */
export type InstallPromptOutcome = `accepted` | `dismissed`;

/**
 * The non-standard `beforeinstallprompt` event fired by browsers that support
 * installable PWAs. Not part of the official DOM lib types, so it is declared
 * locally and narrowed from the generic `Event` received by the listener.
 */
export type BeforeInstallPromptEvent = Event & {
  /**
   * the platforms on which the app can be installed.
   */
  readonly platforms: string[];

  /**
   * resolves once the user has responded to the install prompt.
   */
  readonly userChoice: Promise<{ outcome: InstallPromptOutcome; platform: string }>;

  /**
   * shows the native install prompt.
   */
  prompt: () => Promise<void>;
};
