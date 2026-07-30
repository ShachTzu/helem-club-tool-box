import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ChevronDownIcon } from './chevron-down-icon.js';
import type { DropdownItemType } from './dropdown-item-type.js';
import styles from './dropdown.module.scss';

const DEFAULT_ITEMS: DropdownItemType[] = [
  { id: `profile`, label: `הפרופיל שלי`, icon: `👤` },
  { id: `settings`, label: `הגדרות`, icon: `⚙️` },
  { id: `logout`, label: `התנתקות`, icon: `🚪`, danger: true },
];

export type DropdownAlign = `start` | `end`;

export type DropdownProps = {
  /**
   * the element that opens the dropdown when activated. when omitted, a default
   * trigger button is rendered using `label`.
   */
  trigger?: React.ReactNode;

  /**
   * label rendered on the default trigger button, used only when `trigger` is not set.
   */
  label?: string;

  /**
   * items rendered inside the dropdown menu.
   */
  items?: DropdownItemType[];

  /**
   * alignment of the menu relative to the trigger, respects RTL direction.
   */
  align?: DropdownAlign;

  /**
   * controls the open state of the dropdown from outside.
   */
  open?: boolean;

  /**
   * called whenever the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * hides the chevron icon on the default trigger button.
   */
  hideChevron?: boolean;

  /**
   * class name for the root container.
   */
  className?: string;

  /**
   * class name for the menu panel.
   */
  menuClassName?: string;

  /**
   * style for the root container.
   */
  style?: React.CSSProperties;
};

/**
 * an accessible dropdown/menu anchored to a trigger element. supports RTL alignment,
 * keyboard navigation and click-outside dismissal. used by the user bar, sort menus
 * and header actions across Helam Club.
 */
export function Dropdown({
  trigger,
  label = `תפריט`,
  items = DEFAULT_ITEMS,
  align = `start`,
  open,
  onOpenChange,
  hideChevron,
  className,
  menuClassName,
  style,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, [setOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === `Escape`) {
        closeMenu();
      }
    };

    document.addEventListener(`mousedown`, handlePointerDown);
    document.addEventListener(`keydown`, handleKeyDown);
    return () => {
      document.removeEventListener(`mousedown`, handlePointerDown);
      document.removeEventListener(`keydown`, handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  const toggleOpen = () => {
    setOpen(!isOpen);
    setActiveIndex(-1);
  };

  const selectItem = (item: DropdownItemType) => {
    if (item.disabled) return;
    item.onSelect?.();
    closeMenu();
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const enabledIndexes = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.disabled)
      .map(({ index }) => index);

    if (enabledIndexes.length === 0) return;

    if (event.key === `ArrowDown`) {
      event.preventDefault();
      const currentPosition = enabledIndexes.indexOf(activeIndex);
      const nextPosition = (currentPosition + 1) % enabledIndexes.length;
      setActiveIndex(enabledIndexes[nextPosition]);
    }

    if (event.key === `ArrowUp`) {
      event.preventDefault();
      const currentPosition = enabledIndexes.indexOf(activeIndex);
      const prevPosition = currentPosition <= 0 ? enabledIndexes.length - 1 : currentPosition - 1;
      setActiveIndex(enabledIndexes[prevPosition]);
    }

    if (event.key === `Enter` || event.key === ` `) {
      event.preventDefault();
      if (activeIndex >= 0) selectItem(items[activeIndex]);
    }

    if (event.key === `Tab`) {
      closeMenu();
    }
  };

  return (
    <div ref={rootRef} className={classNames(styles.dropdown, className)} style={style}>
      <div className={styles.triggerWrapper} onClick={() => toggleOpen()}>
        {trigger ?? (
          <button type="button" className={styles.defaultTrigger} aria-expanded={isOpen} aria-haspopup="true">
            <span className={styles.defaultTriggerLabel}>{label}</span>
            {!hideChevron && (
              <ChevronDownIcon className={classNames(styles.chevron, isOpen && styles.chevronOpen)} />
            )}
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          role="menu"
          className={classNames(
            styles.menu,
            align === `end` ? styles.alignEnd : styles.alignStart,
            menuClassName
          )}
          onKeyDown={(event) => handleMenuKeyDown(event)}
        >
          {items.map((item, index) => (
            <li key={item.id} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={classNames(
                  styles.item,
                  item.danger && styles.itemDanger,
                  index === activeIndex && styles.itemActive
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectItem(item)}
              >
                {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                <span className={styles.itemLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
