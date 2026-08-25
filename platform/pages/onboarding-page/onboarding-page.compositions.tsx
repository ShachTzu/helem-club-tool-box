import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { domainsMock } from '@helemclub/knowledge-domains.hooks.use-domains';
import { OnboardingPage } from './onboarding-page.js';
import { PendingApprovalNotice } from './pending-approval-notice.js';

/** The post-signup onboarding page. */
export const BasicOnboardingPage = () => (
  <MockProvider>
    <OnboardingPage mockDomains={domainsMock} />
  </MockProvider>
);

/** What a new signup sees while a moderator reviews their membership request. */
export const AwaitingModeratorApproval = () => (
  <MockProvider>
    <OnboardingPage mockDomains={domainsMock} mockPendingApproval />
  </MockProvider>
);

/** The pending-approval notice on its own, personalised with a member name. */
export const PendingApprovalNoticeForMember = () => (
  <MockProvider>
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 24 }}>
      <PendingApprovalNotice displayName="שירה אזולאי" />
    </div>
  </MockProvider>
);
