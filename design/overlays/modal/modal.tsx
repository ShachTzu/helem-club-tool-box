import React, { useEffect, useRef, type ReactNode } from 'react';
import classNames from 'classnames';
import { CloseIcon } from './close-icon.js';
import type { ModalSize } from './modal-size-type.js';
import styles from './modal.module.scss';

export type ModalProps = {
  /**
   * controls whether the modal is rendered.
   */
  open: boolean;

  /**
   * called when the modal requests to be closed
   * (backdrop click, escape key or close button).
   */
  onClose: () => void;

  /**
   * modal title, rendered in the header.
   */
  title?: string;

  /**
   * modal body content.
   */
  children?: ReactNode;

  /**
   * footer content, usually action buttons.
   */
  footer?: ReactNode;

  /**
   * width preset of the modal.
   */
  size?: ModalSize;

  /**
   * closes the modal when the backdrop is clicked.
   */
  closeOnBackdropClick?: boolean;

  /**
   * closes the modal when the escape key is pressed.
   */
  closeOnEsc?: boolean;

  /**
   * hides the close (x) button from the header.
   */
  hideCloseButton?: boolean;

  /**
   * class name for the root backdrop element.
   */
  className?: string;

  /**
   * class name for the modal dialog element.
   */
  dialogClassName?: string;

  /**
   * style for the root backdrop element.
   */
  style?: React.CSSProperties;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  hideCloseButton = false,
  className,
  dialogClassName,
  style,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !closeOnEsc) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdropClick) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const sizeClassName = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;

  return (
    <div
      className={classNames(styles.backdrop, className)}
      style={style}
      onMouseDown={(event) => handleBackdropClick(event)}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={classNames(styles.modal, sizeClassName, dialogClassName)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {(title || !hideCloseButton) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {!hideCloseButton && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => onClose()}
                aria-label="סגירה"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
