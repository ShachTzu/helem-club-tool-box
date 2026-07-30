import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { domainsMock } from '@helemclub/knowledge-domains.hooks.use-domains';
import { OnboardingWizard } from './onboarding-wizard.js';

/** The onboarding wizard on its first step. */
export const BasicOnboardingWizard = () => (
  <MockProvider>
    <div style={{ padding: 24, background: '#f6f8fa' }}>
      <OnboardingWizard mockDomains={domainsMock} onComplete={() => {}} />
    </div>
  </MockProvider>
);
