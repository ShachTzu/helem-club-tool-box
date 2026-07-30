import type { AppCardDomain } from './app-card-domain-type.js';

/**
 * default coping-domain tags shown on the app card, matching the
 * default mock app from the toolbox app entity.
 */
export const DEFAULT_APP_CARD_DOMAINS: AppCardDomain[] = [
  { id: `mindfulness-breathing`, slug: `mindfulness-breathing`, name: `מיינדפולנס ונשימות` },
  { id: `anxiety`, slug: `anxiety`, name: `חרדה` },
  { id: `sleep`, slug: `sleep`, name: `שינה` },
];
