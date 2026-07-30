import React from 'react';
import classNames from 'classnames';
import styles from './paragraph.module.scss';

export type ParagraphSize = 'sm' | 'md' | 'lg';

export type ParagraphProps = {
  /**
   * the paragraph content.
   */
  children?: React.ReactNode;

  /**
   * controls the font size of the paragraph.
   */
  size?: ParagraphSize;

  /**
   * renders the paragraph with a muted, secondary text color.
   */
  muted?: boolean;

  /**
   * class name to override paragraph styles.
   */
  className?: string;

  /**
   * style object for spacing and positioning overrides.
   */
  style?: React.CSSProperties;
};

const DEFAULT_CONTENT = `הלם קלאב היא קהילה תומכת שבה חברים משתפים ידע, ניסיון אישי וכלים מעשיים להתמודדות עם החיים לאחר טראומה. הפסקאות שלנו נכתבות בעברית, ולכן הן מיושרות מימין לשמאל ונושמות עם רווח שורות נוח לקריאה ארוכה.`;

export function Paragraph({
  children = DEFAULT_CONTENT,
  size = 'md',
  muted = false,
  className,
  style,
}: ParagraphProps) {
  return (
    <p
      className={classNames(
        styles.paragraph,
        styles[size],
        muted ? styles.muted : undefined,
        className
      )}
      style={style}
    >
      {children}
    </p>
  );
}
