import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { domainsMock } from '@helemclub/knowledge-domains.hooks.use-domains';
import { OnboardingWizard } from './onboarding-wizard.js';

/** The onboarding wizard on its first step, for an email sign-up. */
export const BasicOnboardingWizard = () => (
  <MockProvider>
    <div style={{ padding: 24, background: '#f6f8fa' }}>
      <OnboardingWizard
        account={{ email: 'member@example.com' }}
        mockDomains={domainsMock}
        onComplete={() => {}}
      />
    </div>
  </MockProvider>
);

/** The same wizard for a Google sign-up, which arrives with a name already known. */
export const GoogleSignUpWizard = () => (
  <MockProvider>
    <div style={{ padding: 24, background: '#f6f8fa' }}>
      <OnboardingWizard
        account={{ displayName: 'רותם לוי', email: 'rotem@example.com' }}
        mockDomains={domainsMock}
        onComplete={() => {}}
      />
    </div>
  </MockProvider>
);
