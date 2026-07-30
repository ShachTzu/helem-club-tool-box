import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDeviceId } from '@helemclub/platform.hooks.use-device-id';
import { SavedItem, type PlainSavedItem, type SavedItemTargetType } from '@helemclub/engagement.entities.saved-item';

const STORAGE_KEY_PREFIX = 'helam:saved-items';

/**
 * the display + identity fields required to save a content object
 * (an app, article, event, gallery item, domain, etc.).
 */
export type SaveTarget = {
  /**
   * type of the target content being saved.
   */
  targetType: SavedItemTargetType;

  /**
   * id of the target content being saved.
   */
  targetId: string;

  /**
   * display title for rendering the saved list.
   */
  title: string;

  /**
   * url to navigate to when the saved item is opened.
   */
  url: string;

  /**
   * optional display image for rendering the saved list.
   */
  imageUrl?: string;
};

export type UseSavedOptions = {
  /**
   * override the persisted/generated device id. useful for tests and
   * previews where a stable id is required.
   */
  mockDeviceId?: string;

  /**
   * override the saved items list entirely, skipping localStorage reads
   * and writes. useful for tests and previews.
   */
  mockSavedItems?: SavedItem[];
};

export type UseSavedValue = {
  /**
   * all items saved by the current device, most recently saved first.
   */
  savedItems: SavedItem[];

  /**
   * checks whether a given target is currently saved.
   */
  isSaved: (targetType: SavedItemTargetType, targetId: string) => boolean;

  /**
   * saves a content object for the current device. a no-op if the target
   * is already saved.
   */
  save: (target: SaveTarget) => void;

  /**
   * removes a previously saved content object for the current device.
   */
  unsave: (targetType: SavedItemTargetType, targetId: string) => void;

  /**
   * saves the target if it is not yet saved, or removes it if it is.
   */
  toggleSave: (target: SaveTarget) => void;
};

function storageKey(deviceId: string): string {
  return `${STORAGE_KEY_PREFIX}:${deviceId}`;
}

function readStoredItems(deviceId: string): PlainSavedItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(storageKey(deviceId));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistItems(deviceId: string, items: PlainSavedItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(storageKey(deviceId), JSON.stringify(items));
  } catch {
    // localStorage may be unavailable (e.g. private browsing mode).
    // saved items will simply not persist across reloads, which is an
    // acceptable degradation for an anonymous, local-only feature.
  }
}

function isSameTarget(item: PlainSavedItem, targetType: SavedItemTargetType, targetId: string): boolean {
  return item.targetType === targetType && item.targetId === targetId;
}

/**
 * manages saving and unsaving content objects (apps, articles, events,
 * gallery items, domains, etc.) and lists the items saved by the current
 * visitor.
 *
 * persistence is fully local: saved items are stored in the browser's
 * localStorage, keyed by an anonymous device id (via useDeviceId), so
 * visitors can build a personal saved list without creating an account.
 *
 * an optional mockDeviceId and mockSavedItems can be supplied to override
 * the device id and saved list, which is useful for tests and previews.
 */
export function useSaved(options?: UseSavedOptions): UseSavedValue {
  const mockSavedItems = options?.mockSavedItems;
  const deviceId = useDeviceId({ mockDeviceId: options?.mockDeviceId });

  const [items, setItems] = useState<PlainSavedItem[]>(() => {
    if (mockSavedItems) return mockSavedItems.map((item) => item.toObject());
    return readStoredItems(deviceId);
  });

  useEffect(() => {
    if (mockSavedItems) return;
    setItems(readStoredItems(deviceId));
  }, [deviceId, mockSavedItems]);

  const isSaved = useCallback(
    (targetType: SavedItemTargetType, targetId: string) => {
      return items.some((item) => isSameTarget(item, targetType, targetId));
    },
    [items]
  );

  const save = useCallback(
    (target: SaveTarget) => {
      setItems((prev) => {
        if (prev.some((item) => isSameTarget(item, target.targetType, target.targetId))) {
          return prev;
        }

        const newItem: PlainSavedItem = {
          id: `${target.targetType}:${target.targetId}`,
          targetType: target.targetType,
          targetId: target.targetId,
          deviceId,
          savedAt: new Date().toISOString(),
          title: target.title,
          url: target.url,
          imageUrl: target.imageUrl,
        };

        const next = [...prev, newItem];
        if (!mockSavedItems) persistItems(deviceId, next);
        return next;
      });
    },
    [deviceId, mockSavedItems]
  );

  const unsave = useCallback(
    (targetType: SavedItemTargetType, targetId: string) => {
      setItems((prev) => {
        const next = prev.filter((item) => !isSameTarget(item, targetType, targetId));
        if (!mockSavedItems) persistItems(deviceId, next);
        return next;
      });
    },
    [deviceId, mockSavedItems]
  );

  const toggleSave = useCallback(
    (target: SaveTarget) => {
      if (isSaved(target.targetType, target.targetId)) {
        unsave(target.targetType, target.targetId);
        return;
      }

      save(target);
    },
    [isSaved, save, unsave]
  );

  const savedItems = useMemo(() => {
    return [...items].reverse().map((item) => SavedItem.from(item));
  }, [items]);

  return { savedItems, isSaved, save, unsave, toggleSave };
}
