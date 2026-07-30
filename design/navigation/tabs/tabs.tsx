import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import type { TabItem } from './tab-item-type.js';
import styles from './tabs.module.scss';

const defaultItems: TabItem[] = [
  { key: `overview`, label: `סקירה` },
  { key: `reviews`, label: `ביקורות` },
  { key: `details`, label: `פרטים` },
];

export type TabsProps = {
  /**
   * list of tab items to render, each with a unique key and a label.
   */
  items?: TabItem[];

  /**
   * the currently active tab key, for controlled usage.
   */
  activeKey?: string;

  /**
   * the initial active tab key, for uncontrolled usage.
   */
  defaultActiveKey?: string;

  /**
   * callback invoked with the newly selected tab key.
   */
  onChange?: (key: string) => void;

  /**
   * class name to override the root element.
   */
  className?: string;

  /**
   * style to override the root element.
   */
  style?: React.CSSProperties;
};

export function Tabs({
  items = defaultItems,
  activeKey,
  defaultActiveKey,
  onChange,
  className,
  style,
}: TabsProps) {
  const [internalActiveKey, setInternalActiveKey] = useState<string>(
    defaultActiveKey || (items[0] && items[0].key) || ``
  );
  const isControlled = activeKey !== undefined;
  const currentKey = isControlled ? activeKey : internalActiveKey;

  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const listElement = listRef.current;
    const activeElement = tabRefs.current[currentKey];
    if (!listElement || !activeElement) return;

    const listRect = listElement.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();
    const offset = activeRect.left - listRect.left + listElement.scrollLeft;

    setIndicatorStyle({
      '--tabs-indicator-offset': `${offset}px`,
      '--tabs-indicator-width': `${activeRect.width}px`,
    } as React.CSSProperties);
  }, [currentKey, items]);

  const selectTab = (key: string) => {
    if (!isControlled) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  return (
    <div className={classNames(styles.tabs, className)} style={style}>
      <div className={styles.tabList} role="tablist" aria-orientation="horizontal" ref={listRef}>
        {items.map((item) => {
          const isActive = item.key === currentKey;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={classNames(styles.tab, isActive && styles.tabActive)}
              ref={(element) => {
                tabRefs.current[item.key] = element;
              }}
              onClick={() => selectTab(item.key)}
            >
              {item.label}
            </button>
          );
        })}
        <span className={styles.indicator} style={indicatorStyle} />
      </div>
    </div>
  );
}
