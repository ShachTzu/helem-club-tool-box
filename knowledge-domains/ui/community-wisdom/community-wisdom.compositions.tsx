import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { domainsMock } from '@helemclub/knowledge-domains.hooks.use-domains';
import { CommunityWisdom } from './community-wisdom.js';

/** Full unified hub with all filters. */
export const FullCommunityWisdom = () => (
  <MockProvider>
    <CommunityWisdom mockDomains={domainsMock} />
  </MockProvider>
);

/** Compact hub for embedding on the home page. */
export const CompactCommunityWisdom = () => (
  <MockProvider>
    <CommunityWisdom compact mockDomains={domainsMock} />
  </MockProvider>
);
