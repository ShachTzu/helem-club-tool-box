import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { domainsMock } from '@helemclub/knowledge-domains.hooks.use-domains';
import { WisdomPage } from './wisdom-page.js';

/** The full community wisdom page. */
export const BasicWisdomPage = () => (
  <MockProvider>
    <WisdomPage mockDomains={domainsMock} />
  </MockProvider>
);
