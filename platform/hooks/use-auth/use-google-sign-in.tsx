import { useCallback, useEffect, useRef, useState } from 'react';
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
      // the tag may still be in flight when a second component mounts, so wait
      // for its load event rather than assuming the SDK is already usable.
      if ((window as any).google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('failed to load Google Identity Services'))
      );
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

export type UseGoogleSignInOptions = {
  /**
   * called with the ID token issued by Google once the member picks an
   * account in the rendered button. the token is meaningless to the client —
   * hand it to `signInWithGoogle`, which has the server verify it against
   * Google's certificates before issuing a session.
   */
  onCredential?: (idToken: string) => void;

  /**
   * the label Google renders inside its own button. defaults to `signin_with`.
   */
  buttonText?: 'signin_with' | 'signup_with' | 'continue_with';

  /**
   * BCP-47 locale for the button label. defaults to Hebrew, matching the rest
   * of the platform.
   */
  locale?: string;
};

export type UseGoogleSignInValue = {
  /**
   * ref callback to attach to an empty container element. Google renders its
   * own sign-in button inside it and invokes `onCredential` on success.
   *
   * Google Identity Services only drives an explicit sign-in click through a
   * rendered button: `prompt()` is One Tap, which the browser may suppress
   * silently under FedCM, leaving a custom button with nothing to open.
   */
  googleButtonRef: (node: HTMLDivElement | null) => void;

  /**
   * whether Google sign-in is available: the server has a client id
   * configured and the browser SDK has loaded.
   */
  available: boolean;

  /**
   * error raised while loading or invoking the Google SDK, if any.
   */
  error?: Error;

  /**
   * opens the One Tap prompt and resolves with an ID token, or null when it
   * was dismissed or suppressed.
   *
   * @deprecated One Tap is suppressed in many browsers under FedCM and cannot
   * be relied on for an explicit sign-in click — attach `googleButtonRef`
   * instead. Retained so tests and previews can inject a resolver.
   */
  requestGoogleIdToken: () => Promise<string | null>;
};

/**
 * integrates Google Identity Services in the browser.
 *
 * the client id comes from the server rather than a build-time env var, so
 * one build runs unchanged across environments. when the server reports no
 * client id, `available` stays false and the UI falls back to email sign-in
 * rather than rendering a button that cannot work.
 *
 * @param options credential callback and button label preferences.
 * @returns a ref for Google's rendered button, availability, and any load error.
 */
export function useGoogleSignIn(options: UseGoogleSignInOptions = {}): UseGoogleSignInValue {
  const { onCredential, buttonText = 'signin_with', locale = 'he' } = options;
  const { googleClientId } = useAuthConfig();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const containerRef = useRef<HTMLDivElement | null>(null);
  // read the callback through a ref so a re-render does not re-initialize the
  // SDK and re-render the button on every keystroke in the sibling form.
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;
  const pendingResolveRef = useRef<((token: string | null) => void) | undefined>(undefined);

  useEffect(() => {
    if (!googleClientId) return undefined;
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

  const handleCredential = useCallback((response: GoogleCredentialResponse) => {
    const token = response?.credential || null;

    const resolve = pendingResolveRef.current;
    if (resolve) {
      pendingResolveRef.current = undefined;
      resolve(token);
    }

    if (token) onCredentialRef.current?.(token);
  }, []);

  const renderButton = useCallback(() => {
    const node = containerRef.current;
    const google = (window as any).google;
    if (!node || !googleClientId || !google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleCredential,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: true,
    });

    // rendering into a populated container stacks duplicate iframes.
    node.innerHTML = '';

    // Google requires an explicit pixel width and caps it at 400, so a
    // percentage-width parent has to be measured rather than passed through.
    const measured = Math.round(node.getBoundingClientRect().width);
    const width = Math.min(400, Math.max(200, measured || 320));

    google.accounts.id.renderButton(node, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: buttonText,
      logo_alignment: 'center',
      locale,
      width,
    });
  }, [googleClientId, handleCredential, buttonText, locale]);

  useEffect(() => {
    if (!ready) return;
    renderButton();
  }, [ready, renderButton]);

  const googleButtonRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (node && ready) renderButton();
    },
    [ready, renderButton]
  );

  const requestGoogleIdToken = useCallback(async (): Promise<string | null> => {
    if (!googleClientId) return null;
    await loadGsi();

    const google = (window as any).google;
    if (!google?.accounts?.id) return null;

    return new Promise<string | null>((resolve) => {
      let settled = false;
      let timeout: ReturnType<typeof setTimeout> | undefined;

      const settle = (value: string | null) => {
        if (settled) return;
        settled = true;
        if (timeout) clearTimeout(timeout);
        pendingResolveRef.current = undefined;
        resolve(value);
      };

      pendingResolveRef.current = settle;

      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredential,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });

      // under FedCM the moment-notification methods below are deprecated
      // no-ops, so a suppressed prompt would leave this promise pending
      // forever and the caller stuck on a spinner. give up instead of hanging.
      timeout = setTimeout(() => settle(null), 20000);

      google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
          settle(null);
        }
      });
    });
  }, [googleClientId, handleCredential]);

  return {
    googleButtonRef,
    available: Boolean(googleClientId) && ready,
    error,
    requestGoogleIdToken,
  };
}
