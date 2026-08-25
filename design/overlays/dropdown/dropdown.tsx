import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
 * copies the resolved custom properties (design tokens) and text direction from `source`
 * onto `target`. the menu is portaled to `document.body`, which sits outside the themed
 * DOM subtree, so CSS custom properties are no longer inherited through the real DOM tree —
 * this restores them by reading the resolved values at the trigger and writing them inline.
 */
function copyThemeTokens(source: HTMLElement, target: HTMLElement) {
  const computed = window.getComputedStyle(source);
  for (let index = 0; index < computed.length; index += 1) {
    const property = computed[index];
    if (property.startsWith(`--`)) {
      target.style.setProperty(property, computed.getPropertyValue(property));
    }
  }
  target.style.direction = computed.direction;
}

/**
 * an accessible dropdown/menu anchored to a trigger element. supports RTL alignment,
 * keyboard navigation and click-outside dismissal. the menu is portaled to `document.body`
 * so it always escapes ancestors with `overflow` or `transform` (e.g. a sliding drawer),
 * which would otherwise clip or mis-position a `position: fixed`/`absolute` menu. used by
 * the user bar, sort menus and header actions across Helam Club.
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
  const menuRef = useRef<HTMLUListElement>(null);
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
      const insideTrigger = rootRef.current?.contains(target);
      const insideMenu = menuRef.current?.contains(target);
      if (!insideTrigger && !insideMenu) {
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

  // copy design tokens onto the portaled menu once per open — tokens don't change mid-session,
  // so this doesn't need to run on every position frame below.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const trigger_ = rootRef.current;
    const menu = menuRef.current;
    if (!trigger_ || !menu) return;
    copyThemeTokens(trigger_, menu);
  }, [isOpen]);

  // track the trigger's viewport position every frame while open, so the menu follows it
  // even when an ancestor scrolls, resizes or animates (e.g. the header drawer sliding open).
  // a continuous rAF loop already runs before every paint, so separate scroll/resize
  // listeners would not observe anything earlier — they'd just be redundant.
  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    let frameId: number;

    const updatePosition = () => {
      const trigger_ = rootRef.current;
      const menu = menuRef.current;
      if (trigger_ && menu) {
        const rect = trigger_.getBoundingClientRect();
        const direction = window.getComputedStyle(trigger_).direction;
        const spacing = parseFloat(window.getComputedStyle(trigger_).getPropertyValue(`--spacing-small`)) || 8;
        const alignToRightEdge = direction === `rtl` ? align === `start` : align === `end`;

        menu.style.top = `${rect.bottom + spacing}px`;
        if (alignToRightEdge) {
          menu.style.right = `${window.innerWidth - rect.right}px`;
          menu.style.left = `auto`;
        } else {
          menu.style.left = `${rect.left}px`;
          menu.style.right = `auto`;
        }
      }
      frameId = requestAnimationFrame(updatePosition);
    };

    frameId = requestAnimationFrame(updatePosition);
    updatePosition();

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, align]);

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

  const menu = isOpen && typeof document !== `undefined`
    ? createPortal(
        <ul
          ref={menuRef}
          role="menu"
          className={classNames(styles.menu, menuClassName)}
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
        </ul>,
        document.body
      )
    : null;

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

      {menu}
    </div>
  );
}
