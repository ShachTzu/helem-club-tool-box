import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Button } from '@helemclub/design.actions.button';
import { NotFoundIllustration } from './not-found-illustration.js';
import styles from './not-found-page.module.scss';

export type NotFoundPageProps = {
  /**
   * the main heading shown above the message.
   */
  title?: string;

  /**
   * the calm, reassuring message shown to the user.
   */
  message?: string;

  /**
   * label for the button leading back home.
   */
  homeLabel?: string;

  /**
   * path to navigate to when the home button is clicked.
   */
  homePath?: string;

  /**
   * called when the home button is clicked, in addition to navigation.
   */
  onNavigateHome?: () => void;

  /**
   * class name for the page root.
   */
  className?: string;

  /**
   * inline style for the page root.
   */
  style?: React.CSSProperties;
};

const DEFAULT_TITLE = `הדף הזה איננו`;
const DEFAULT_MESSAGE = `לפעמים גם דרכים מובילות למקום לא נכון. הדף שחיפשתם לא קיים או שהוסר - אבל אתם עדיין כאן, ואפשר תמיד לחזור להתחלה.`;
const DEFAULT_HOME_LABEL = `חזרה לדף הבית`;
const DEFAULT_HOME_PATH = `/`;

/**
 * a calm, RTL 404 page shown when a route is not found, with a reassuring
 * message and a button leading back to the home page.
 */
export function NotFoundPage({
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
  homeLabel = DEFAULT_HOME_LABEL,
  homePath = DEFAULT_HOME_PATH,
  onNavigateHome,
  className,
  style,
}: NotFoundPageProps) {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    onNavigateHome?.();
    navigate(homePath);
  };

  return (
    <div className={classNames(styles.notFoundPage, className)} style={style}>
      <div className={styles.content}>
        <NotFoundIllustration className={styles.illustration} />
        <div className={styles.code}>404</div>
        <Heading level={2} align="center" className={styles.title}>
          {title}
        </Heading>
        <Paragraph size="md" muted className={styles.message}>
          {message}
        </Paragraph>
        <div className={styles.actions}>
          <Button variant="accent" size="lg" onClick={() => handleNavigateHome()}>
            {homeLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
