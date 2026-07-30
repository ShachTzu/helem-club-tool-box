import React, { useState } from 'react';
import classNames from 'classnames';
import { WhatsappIcon } from './whatsapp-icon.js';
import { FacebookIcon } from './facebook-icon.js';
import { XIcon } from './x-icon.js';
import { CopyLinkIcon } from './copy-link-icon.js';
import { CheckIcon } from './check-icon.js';
import type { ShareNetwork } from './share-network-type.js';
import styles from './share-buttons.module.scss';

export type ShareButtonsProps = {
  /**
   * the url being shared.
   */
  url?: string;

  /**
   * the title/text accompanying the shared url.
   */
  title?: string;

  /**
   * an optional visible label rendered before the buttons.
   */
  label?: string;

  /**
   * the set and order of networks to render.
   */
  networks?: ShareNetwork[];

  /**
   * called after a network share link was opened or the link was copied.
   */
  onShare?: (network: ShareNetwork) => void;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_NETWORKS: ShareNetwork[] = [`whatsapp`, `facebook`, `x`, `copy`];

const COPIED_RESET_DELAY_MS = 2000;

/**
 * standard social share buttons row (WhatsApp, Facebook, X, copy link) for a given url and title. RTL-ready.
 */
export function ShareButtons({
  url = `https://helam.club`,
  title = `הלם קלאב — קהילה, ידע וכלים לחיים לצד פוסט-טראומה`,
  label = `שתפו:`,
  networks = DEFAULT_NETWORKS,
  onShare,
  className,
  style,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks: Record<Exclude<ShareNetwork, `copy`>, string> = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };

  const handleNetworkClick = (network: Exclude<ShareNetwork, `copy`>) => {
    window.open(shareLinks[network], `_blank`, `noopener,noreferrer`);
    onShare?.(network);
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        onShare?.(`copy`);
        setTimeout(() => setCopied(false), COPIED_RESET_DELAY_MS);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  return (
    <div className={classNames(styles.shareButtons, className)} style={style}>
      {label && <span className={styles.label}>{label}</span>}
      {networks.includes(`whatsapp`) && (
        <button
          type="button"
          aria-label="שיתוף בוואטסאפ"
          title="שיתוף בוואטסאפ"
          className={classNames(styles.button, styles.whatsapp)}
          onClick={() => handleNetworkClick(`whatsapp`)}
        >
          <span className={styles.icon}>
            <WhatsappIcon />
          </span>
        </button>
      )}
      {networks.includes(`facebook`) && (
        <button
          type="button"
          aria-label="שיתוף בפייסבוק"
          title="שיתוף בפייסבוק"
          className={classNames(styles.button, styles.facebook)}
          onClick={() => handleNetworkClick(`facebook`)}
        >
          <span className={styles.icon}>
            <FacebookIcon />
          </span>
        </button>
      )}
      {networks.includes(`x`) && (
        <button
          type="button"
          aria-label="שיתוף ב-X"
          title="שיתוף ב-X"
          className={classNames(styles.button, styles.x)}
          onClick={() => handleNetworkClick(`x`)}
        >
          <span className={styles.icon}>
            <XIcon />
          </span>
        </button>
      )}
      {networks.includes(`copy`) && (
        <button
          type="button"
          aria-label="העתקת קישור"
          title="העתקת קישור"
          className={classNames(styles.button, styles.copy, copied && styles.copied)}
          onClick={() => handleCopyClick()}
        >
          <span className={styles.icon}>
            {copied ? <CheckIcon /> : <CopyLinkIcon />}
          </span>
        </button>
      )}
      {copied && <span className={styles.copiedToast}>הקישור הועתק!</span>}
    </div>
  );
}
