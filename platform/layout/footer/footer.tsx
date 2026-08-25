import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import { Logo } from '@helemclub/design.content.logo';
import { Link } from '@helemclub/design.navigation.link';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import type { FooterLink } from './footer-link-type.js';
import type { EmergencyContact } from './emergency-contact-type.js';
import { DEFAULT_FOOTER_LINKS, DEFAULT_EMERGENCY_CONTACTS } from './footer.mock.js';
import { FacebookIcon } from './facebook-icon.js';
import { InstagramIcon } from './instagram-icon.js';
import styles from './footer.module.scss';

export type FooterProps = {
  /**
   * grouped footer links, rendered as columns keyed by their `group` value.
   */
  links?: FooterLink[];

  /**
   * short description rendered under the logo.
   */
  description?: string;

  /**
   * url of the outbound facebook page.
   */
  facebookUrl?: string;

  /**
   * url of the outbound instagram page.
   */
  instagramUrl?: string;

  /**
   * emergency contacts rendered in the last column.
   */
  emergencyContacts?: EmergencyContact[];

  /**
   * the medical/legal disclaimer rendered at the bottom bar.
   */
  disclaimer?: string;

  /**
   * class name for the footer.
   */
  className?: string;

  /**
   * style for the footer.
   */
  style?: React.CSSProperties;
};

const DEFAULT_DESCRIPTION = `האקוסיסטם הדיגיטלי של קהילת המתמודדים עם פוסט-טראומה — מקום אחד, מסודר ונגיש.`;

const DEFAULT_DISCLAIMER = `התכנים באתר הם חוויה אישית, ידע והשראה — אינם ייעוץ, אבחון או טיפול, ואינם תחליף לטיפול מקצועי.`;

function groupLinks(links: FooterLink[]) {
  const groups = new Map<string, FooterLink[]>();

  links.forEach((link) => {
    const groupName = link.group || `קישורים`;
    const existing = groups.get(groupName) || [];
    groups.set(groupName, [...existing, link]);
  });

  return Array.from(groups.entries());
}

/**
 * the Helam Club site footer (RTL): brand column with social links, grouped
 * ecosystem/community links, and the medical disclaimer with emergency contacts.
 */
export function Footer({
  links = DEFAULT_FOOTER_LINKS,
  description = DEFAULT_DESCRIPTION,
  facebookUrl = `https://facebook.com`,
  instagramUrl = `https://instagram.com`,
  emergencyContacts = DEFAULT_EMERGENCY_CONTACTS,
  disclaimer = DEFAULT_DISCLAIMER,
  className,
  style,
}: FooterProps) {
  const linkGroups = groupLinks(links);

  return (
    <footer className={classNames(styles.footer, className)} style={style}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Logo variant="dark" size="large" />
          <Paragraph size="sm" className={styles.description}>
            {description}
          </Paragraph>
          <div className={styles.socialRow}>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="פייסבוק"
            >
              <FacebookIcon className={styles.socialIcon} />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="אינסטגרם"
            >
              <InstagramIcon className={styles.socialIcon} />
            </a>
          </div>
        </div>

        {linkGroups.map(([groupName, groupLinksList]) => (
          <div key={groupName} className={styles.column}>
            <div className={styles.heading}>{groupName}</div>
            {groupLinksList.map((link) => (
              <Link
                key={link.href}
                as={link.external ? undefined : RouterLink}
                href={link.href}
                external={link.external}
                inverse
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.column}>
          <div className={styles.heading}>מקרה חירום</div>
          <Paragraph size="sm" className={styles.emergencyText}>
            <span className={styles.emergencyLine}>האתר אינו למצבי חירום. במצוקה מיידית:</span>
            {emergencyContacts.map((contact) => (
              <span key={contact.label} className={styles.emergencyLine}>
                {contact.label} — {contact.phone}
              </span>
            ))}
          </Paragraph>
        </div>
      </div>

      <div className={styles.bottomBar}>
        {disclaimer} © {new Date().getFullYear()} הלם קלאב
      </div>
    </footer>
  );
}
