import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import type { BeforeInstallPromptEvent, InstallPromptOutcome } from './install-prompt-event-type.js';
import { CloseIcon } from './close-icon.js';
import styles from './install-prompt.module.scss';

const DEFAULT_APP_NAME = `הלם קלאב`;

const DEFAULT_DESCRIPTION = `הוסיפו את האפליקציה למסך הבית לגישה מהירה, התראות ושימוש נוח גם ללא חיבור לאינטרנט.`;

const DEFAULT_ICON_URL = `https://storage.googleapis.com/bit-generated-images/images/image_a_minimalist_flat_design_app_i_0_1785193644349.png`;

const DEFAULT_STORAGE_KEY = `helam-club-install-prompt-dismissed`;

function isStandaloneDisplayMode(): boolean {
  if (typeof window === `undefined`) return false;

  const isDisplayModeStandalone = window.matchMedia?.(`(display-mode: standalone)`).matches;
  const isIosStandalone = Boolean((window.navigator as { standalone?: boolean }).standalone);

  return Boolean(isDisplayModeStandalone) || isIosStandalone;
}

export type InstallPromptProps = {
  /**
   * the app name shown in the prompt title.
   */
  appName?: string;

  /**
   * short Hebrew description explaining the benefit of installing the app.
   */
  description?: string;

  /**
   * url of the app icon rendered inside the prompt.
   */
  iconUrl?: string;

  /**
   * localStorage key used to remember that the user dismissed the prompt.
   */
  storageKey?: string;

  /**
   * called once the user accepts or dismisses the native install dialog.
   */
  onInstall?: (outcome: InstallPromptOutcome) => void;

  /**
   * called when the user dismisses the banner without installing.
   */
  onDismiss?: () => void;

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
 * a dismissible PWA install banner. listens for the browser's
 * `beforeinstallprompt` event and shows a Hebrew call-to-action to add
 * Helam Club to the home screen. stays hidden when the app already runs in
 * standalone (installed) mode, or after the user dismisses it.
 */
export function InstallPrompt({
  appName = DEFAULT_APP_NAME,
  description = DEFAULT_DESCRIPTION,
  iconUrl = DEFAULT_ICON_URL,
  storageKey = DEFAULT_STORAGE_KEY,
  onInstall,
  onDismiss,
  className,
  style,
}: InstallPromptProps) {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandaloneDisplayMode());

    if (typeof window !== `undefined`) {
      const wasDismissed = window.localStorage?.getItem(storageKey) === `true`;
      setIsDismissed(wasDismissed);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredEvent(null);
    };

    window.addEventListener(`beforeinstallprompt`, handleBeforeInstallPrompt);
    window.addEventListener(`appinstalled`, handleAppInstalled);

    return () => {
      window.removeEventListener(`beforeinstallprompt`, handleBeforeInstallPrompt);
      window.removeEventListener(`appinstalled`, handleAppInstalled);
    };
  }, [storageKey]);

  const dismissPrompt = () => {
    setIsDismissed(true);
    window.localStorage?.setItem(storageKey, `true`);
    onDismiss?.();
  };

  const requestInstall = () => {
    if (!deferredEvent) return;

    deferredEvent
      .prompt()
      .then(() => deferredEvent.userChoice)
      .then((choice) => {
        onInstall?.(choice.outcome);
        setDeferredEvent(null);
        if (choice.outcome === `accepted`) {
          setIsInstalled(true);
        }
      });
  };

  const shouldRender = Boolean(deferredEvent) && !isInstalled && !isDismissed;

  if (!shouldRender) return null;

  return (
    <div className={classNames(styles.installPrompt, className)} style={style}>
      <img className={styles.icon} src={iconUrl} alt={appName} />
      <div className={styles.body}>
        <p className={styles.title}>{`הוסיפו את ${appName} למסך הבית`}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.actions}>
        <Button variant="accent" size="sm" onClick={() => requestInstall()}>
          התקנה
        </Button>
        <button type="button" className={styles.closeButton} aria-label="סגור" onClick={() => dismissPrompt()}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
