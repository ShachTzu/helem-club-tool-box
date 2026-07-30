import { useEffect, useState } from 'react';

const STORAGE_KEY = 'helam:device-id';

export type UseDeviceIdOptions = {
  /**
   * override the generated/persisted device id. useful for testing,
   * previews, or server-rendered contexts where an id is already known.
   */
  mockDeviceId?: string;
};

function generateDeviceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const random = Math.random().toString(36).slice(2);
  const timestamp = Date.now().toString(36);
  return `device-${timestamp}-${random}`;
}

function readStoredDeviceId(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    return window.localStorage.getItem(STORAGE_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function persistDeviceId(deviceId: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, deviceId);
  } catch {
    // localStorage may be unavailable (e.g. private browsing mode).
    // the id will simply be regenerated on next mount, which is an
    // acceptable degradation for anonymous engagement actions.
  }
}

function resolveInitialDeviceId(mockDeviceId?: string): string {
  if (mockDeviceId) return mockDeviceId;

  const stored = readStoredDeviceId();
  if (stored) return stored;

  const generated = generateDeviceId();
  persistDeviceId(generated);
  return generated;
}

/**
 * returns a stable, anonymous device id persisted in localStorage.
 *
 * used by engagement features (reactions, saves, reports) so anonymous
 * visitors can act on content without creating an account. the id is
 * generated once per browser, persisted in localStorage, and reused
 * across sessions and page reloads.
 *
 * an optional `mockDeviceId` can be supplied to override the persisted
 * value, which is useful for tests and previews.
 */
export function useDeviceId(options?: UseDeviceIdOptions): string {
  const mockDeviceId = options?.mockDeviceId;
  const [deviceId, setDeviceId] = useState<string>(() => resolveInitialDeviceId(mockDeviceId));

  useEffect(() => {
    if (mockDeviceId) {
      setDeviceId(mockDeviceId);
    }
  }, [mockDeviceId]);

  return deviceId;
}
