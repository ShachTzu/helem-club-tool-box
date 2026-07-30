import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { domainsMock } from '@helemclub/knowledge-domains.hooks.use-domains';
import { OnboardingPage } from './onboarding-page.js';

/** The post-signup onboarding page. */
export const BasicOnboardingPage = () => (
  <MockProvider>
    <OnboardingPage mockDomains={domainsMock} />
  </MockProvider>
);
