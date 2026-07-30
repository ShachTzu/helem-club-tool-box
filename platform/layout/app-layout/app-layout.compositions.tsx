import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { AppLayout } from './app-layout.js';

/** Default shell with placeholder page content. */
export const BasicAppLayout = () => (
  <MockProvider>
    <AppLayout mockUser={null}>
      <div style={{ padding: '48px 20px', textAlign: 'center', minHeight: 400 }}>
        <h1 style={{ color: '#0B1A30' }}>תוכן העמוד</h1>
        <p style={{ color: '#4F6D7A' }}>כאן מוצג התוכן של כל מסלול, עטוף במעטפת האתר.</p>
      </div>
    </AppLayout>
  </MockProvider>
);

/** Shell as seen by a signed-in member. */
export const SignedInAppLayout = () => (
  <MockProvider>
    <AppLayout
      mockUser={{ id: 'u1', name: 'דנה לוי', email: 'dana@example.com', role: 'member' } as never}
    >
      <div style={{ padding: '48px 20px', textAlign: 'center', minHeight: 400 }}>
        <h1 style={{ color: '#0B1A30' }}>שלום, דנה 👋</h1>
      </div>
    </AppLayout>
  </MockProvider>
);
