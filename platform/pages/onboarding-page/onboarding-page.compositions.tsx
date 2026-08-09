import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { domainsMock } from '@helemclub/knowledge-domains.hooks.use-domains';
import { OnboardingPage } from './onboarding-page.js';

/** The post-signup onboarding page, for an account that has not filled it in yet. */
export const BasicOnboardingPage = () => (
  <MockProvider>
    <OnboardingPage mockStatus="none" mockDomains={domainsMock} />
  </MockProvider>
);

/** What a member sees right after submitting — waiting for an admin decision. */
export const WaitingForApproval = () => (
  <MockProvider>
    <OnboardingPage mockStatus="pending" mockDomains={domainsMock} />
  </MockProvider>
);

/** What an approved community member sees if they come back to the page. */
export const ApprovedMember = () => (
  <MockProvider>
    <OnboardingPage mockStatus="approved" mockDomains={domainsMock} />
  </MockProvider>
);
