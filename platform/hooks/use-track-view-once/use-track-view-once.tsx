import { useEffect, useRef } from 'react';

export type UseTrackViewOnceOptions = {
  /**
   * skip tracking entirely, e.g. when mock/pre-loaded data bypasses the real
   * network request (tests, previews).
   */
  skip?: boolean;
};

/**
 * fires onView(id) once per distinct id, the first time it becomes
 * available — used to record a page view exactly once per item load, not on
 * every re-render. navigating away and back to a previously seen id fires
 * again, since each mount/id-change is a real new view.
 */
export function useTrackViewOnce(
  id: string | undefined,
  onView: (id: string) => void,
  options?: UseTrackViewOnceOptions
): void {
  const trackedId = useRef<string | null>(null);

  useEffect(() => {
    if (options?.skip || !id || trackedId.current === id) return;
    trackedId.current = id;
    onView(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, options?.skip]);
}
