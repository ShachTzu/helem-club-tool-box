import { useCallback, useEffect, useState } from 'react';
import { useAuthConfig } from './use-auth-config.js';

const GSI_SRC = 'https://accounts.google.com/gsi/client';

type GoogleCredentialResponse = {
  credential?: string;
};

/**
 * loads the Google Identity Services script once per page.
 *
 * the promise is cached at module level so several components mounting the
 * hook share a single script tag and a single load, instead of racing to
 * inject duplicates.
 */
let gsiLoader: Promise<void> | undefined;

function loadGsi(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (gsiLoader) return gsiLoader;

  gsiLoader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('failed to load Google Identity Services'));
    document.head.appendChild(script);
  });

  return gsiLoader;
}

export type UseGoogleSignInValue = {
  /**
   * opens the Google account chooser and resolves with an ID token, or null
   * when the member dismissed it. the token is meaningless to the client — it
   * is posted to the server, which verifies it against Google's certificates
   * before issuing a session.
   */
  requestGoogleIdToken: () => Promise<string | null>;

  /**
   * whether Google sign-in is available: the server has a client id
   * configured and the browser SDK has loaded.
   */
  available: boolean;

  /**
   * error raised while loading or invoking the Google SDK, if any.
   */
  error?: Error;
};

/**
 * integrates Google Identity Services in the browser.
 *
 * the client id comes from the server rather than a build-time env var, so
 * one build runs unchanged across environments. when the server reports no
 * client id, `available` stays false and the UI falls back to email sign-in
 * rather than rendering a button that cannot work.
 */
export function useGoogleSignIn(): UseGoogleSignInValue {
  const { googleClientId } = useAuthConfig();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!googleClientId) return;
    let cancelled = false;

    loadGsi()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [googleClientId]);

  const requestGoogleIdToken = useCallback(async (): Promise<string | null> => {
    if (!googleClientId) return null;
    await loadGsi();

    const google = (window as any).google;
    if (!google?.accounts?.id) return null;

    return new Promise<string | null>((resolve) => {
      let settled = false;
      const settle = (value: string | null) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: GoogleCredentialResponse) => settle(response?.credential || null),
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });

      // the prompt can be suppressed by the browser (FedCM disabled, cookies
      // blocked). resolving null then lets the page show email sign-in rather
      // than hanging on a promise that never settles.
      google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
          settle(null);
        }
      });
    });
  }, [googleClientId]);

  return {
    requestGoogleIdToken,
    available: Boolean(googleClientId) && ready,
    error,
  };
}
