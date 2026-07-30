import type { DomainTagOption } from './domain-tag-option-type.js';

/**
 * a small set of coping-domain options used to seed the domain tagging
 * control in compositions and tests.
 */
export function mockDomainTagOptions(): DomainTagOption[] {
  return [
    { id: `anxiety`, slug: `anxiety`, name: `חרדה`, icon: `😰`, count: 5 },
    { id: `sleep`, slug: `sleep`, name: `שינה`, icon: `🌙`, count: 4 },
    { id: `emotional-regulation`, slug: `emotional-regulation`, name: `ויסות רגשי`, icon: `🌊`, count: 4 },
    { id: `mindfulness-breathing`, slug: `mindfulness-breathing`, name: `מיינדפולנס ונשימות`, icon: `🧘`, count: 5 },
    { id: `triggers`, slug: `triggers`, name: `טריגרים`, icon: `⚡`, count: 4 },
  ];
}
