import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { CtaButton } from '@helemclub/design.actions.cta-button';
import type { HeroCtaLink } from './hero-cta-link-type.js';
import styles from './hero.module.scss';

const DEFAULT_PRIMARY_CTA: HeroCtaLink = {
  label: `גלו את ארגז הכלים`,
  href: `/toolbox`,
};

const DEFAULT_SECONDARY_CTA: HeroCtaLink = {
  label: `למאגר הידע`,
  href: `/knowledge`,
};

export type HeroProps = {
  /**
   * a short label rendered above the headline.
   */
  eyebrow?: string;

  /**
   * the main headline of the hero.
   */
  title?: string;

  /**
   * a calm supporting subtext describing the community ecosystem.
   */
  subtitle?: string;

  /**
   * the primary call-to-action, rendered as a filled amber button.
   */
  primaryCta?: HeroCtaLink;

  /**
   * the secondary call-to-action, rendered as a ghost outlined link.
   */
  secondaryCta?: HeroCtaLink;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * home hero section (RTL). a navy gradient band with the Helam Club
 * headline, a calm subtext about the community ecosystem, and CTAs into
 * the toolbox and knowledge base.
 */
export function Hero({
  eyebrow = `האקוסיסטם הדיגיטלי של הלם קלאב`,
  title = `מקום אחד, מסודר ונגיש — לכל מי שמתמודד`,
  subtitle = `חממה שמאגדת ידע, כלים וחוויות אישיות, ומזמינה השתתפות פעילה שמקדמת תהליכי שיקום אמיתיים.`,
  primaryCta = DEFAULT_PRIMARY_CTA,
  secondaryCta = DEFAULT_SECONDARY_CTA,
  className,
  style,
}: HeroProps) {
  return (
    <section className={classNames(styles.hero, className)} style={style}>
      <span className={styles.glow} />
      <div className={styles.inner}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <Heading level={1} color="inverse" align="center" className={styles.title}>
          {title}
        </Heading>
        {subtitle && (
          <Paragraph size="lg" className={styles.subtitle}>
            {subtitle}
          </Paragraph>
        )}
        <div className={styles.actions}>
          {primaryCta && (
            <CtaButton
              href={primaryCta.href}
              external={primaryCta.external}
              size="lg"
            >
              {primaryCta.label}
            </CtaButton>
          )}
          {secondaryCta &&
            (secondaryCta.external ? (
              <a
                href={secondaryCta.href}
                target="_blank"
                rel="noreferrer"
                className={styles.ghostLink}
              >
                {secondaryCta.label}
              </a>
            ) : (
              <Link to={secondaryCta.href} className={styles.ghostLink}>
                {secondaryCta.label}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
