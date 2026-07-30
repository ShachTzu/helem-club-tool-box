import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useSearch } from '@helemclub/platform.hooks.use-search';
import type { SearchResult } from '@helemclub/platform.entities.search-result';
import { SearchIcon } from './search-icon.js';
import { CloseIcon } from './close-icon.js';
import styles from './global-search.module.scss';

const DEFAULT_PLACEHOLDER = `חיפוש לפי תסמין, נושא או כלי`;

const DEFAULT_TYPE_LABELS: Record<string, string> = {
  app: `כלים`,
  blog: `בלוג`,
  event: `אירועים`,
  gallery: `גלריית PTSDART`,
  knowledge: `מאגר ידע`,
  wisdom: `חוכמת הקהילה`,
  domain: `תחומי התמודדות`,
};

export type GlobalSearchProps = {
  /**
   * placeholder text rendered inside the search input.
   */
  placeholder?: string;

  /**
   * labels used for the group headers of the results dropdown, keyed by content type.
   */
  typeLabels?: Record<string, string>;

  /**
   * called with the selected search result, before navigating to its url.
   */
  onResultSelect?: (result: SearchResult) => void;

  /**
   * provides mock search results, bypassing the network request. useful for tests and compositions.
   */
  mockResults?: SearchResult[];

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
 * a global, cross-content search box for the platform header. shows a results dropdown
 * grouped by content type, supports keyboard navigation and expands to a full-screen
 * overlay on mobile.
 */
export function GlobalSearch({
  placeholder = DEFAULT_PLACEHOLDER,
  typeLabels = DEFAULT_TYPE_LABELS,
  onResultSelect,
  mockResults,
  className,
  style,
}: GlobalSearchProps) {
  const [query, setQuery] = useState(``);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { groupedResults, loading, isEmpty } = useSearch(query, { mockData: mockResults });

  const groupEntries = useMemo(() => Object.entries(groupedResults), [groupedResults]);

  const flatResults = useMemo(() => groupEntries.flatMap(([, results]) => results), [groupEntries]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener(`mousedown`, handlePointerDown);
    return () => document.removeEventListener(`mousedown`, handlePointerDown);
  }, [isOpen]);

  const closeSearch = () => {
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const selectResult = (result: SearchResult) => {
    onResultSelect?.(result);
    setQuery(``);
    closeSearch();
    navigate(result.url);
  };

  const handleKeyDown = (key: string) => {
    if (key === `Escape`) {
      closeSearch();
      return;
    }

    if (!isOpen || flatResults.length === 0) return;

    if (key === `ArrowDown`) {
      setActiveIndex((current) => (current + 1) % flatResults.length);
      return;
    }

    if (key === `ArrowUp`) {
      setActiveIndex((current) => (current <= 0 ? flatResults.length - 1 : current - 1));
      return;
    }

    if (key === `Enter` && activeIndex >= 0) {
      selectResult(flatResults[activeIndex]);
    }
  };

  const showPanel = isOpen && query.trim().length > 0;
  let resultIndex = -1;

  return (
    <div ref={rootRef} className={classNames(styles.root, isOpen && styles.open, className)} style={style}>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => handleKeyDown(event.key)}
        />
        {query.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            aria-label="נקה חיפוש"
            onClick={() => {
              setQuery(``);
              inputRef.current?.focus();
            }}
          >
            <CloseIcon />
          </button>
        )}
        <button type="button" className={styles.overlayCloseButton} aria-label="סגור חיפוש" onClick={() => closeSearch()}>
          <CloseIcon />
        </button>
      </div>

      {showPanel && (
        <div className={styles.resultsPanel}>
          {loading && <div className={styles.statusMessage}>טוען תוצאות...</div>}
          {!loading && isEmpty && <div className={styles.statusMessage}>לא נמצאו תוצאות עבור &quot;{query}&quot;</div>}
          {!loading &&
            groupEntries.map(([type, results]) => (
              <div key={type} className={styles.group}>
                <div className={styles.groupLabel}>{typeLabels[type] || type}</div>
                <ul className={styles.resultList}>
                  {results.map((result) => {
                    resultIndex += 1;
                    const isActive = resultIndex === activeIndex;
                    return (
                      <li key={result.id} role="none">
                        <button
                          type="button"
                          className={classNames(styles.resultItem, isActive && styles.resultItemActive)}
                          onMouseEnter={() => setActiveIndex(resultIndex)}
                          onClick={() => selectResult(result)}
                        >
                          {result.imageUrl ? (
                            <img className={styles.resultImage} src={result.imageUrl} alt={result.title} />
                          ) : (
                            <span className={styles.resultImagePlaceholder} />
                          )}
                          <span className={styles.resultText}>
                            <span className={styles.resultTitle}>{result.title}</span>
                            {result.excerpt && <span className={styles.resultExcerpt}>{result.excerpt}</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
