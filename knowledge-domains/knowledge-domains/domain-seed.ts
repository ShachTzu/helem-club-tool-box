import { mockDomains } from '@helemclub/knowledge-domains.entities.domain';
import type { PlainDomain } from '@helemclub/knowledge-domains.entities.domain';

/**
 * the 14 fixed Hebrew coping domains, seeded on start into the Domain
 * collection. sourced from the canonical entities/domain mock so the
 * backend, hooks and pages all agree on the same closed set.
 */
export const DOMAIN_SEEDS: PlainDomain[] = mockDomains().map((domain) => domain.toObject());
