import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { CommentComposer } from './comment-composer.js';

/** The rich composer for a signed-in member. */
export const SignedInComposer = () => (
  <MockProvider>
    <div style={{ maxWidth: 620, padding: 24 }}>
      <CommentComposer parentLabel="הכתבה" mockUser={mockUser().toObject()} />
    </div>
  </MockProvider>
);

/** The login-gated prompt shown to anonymous visitors. */
export const AnonymousComposer = () => (
  <MockProvider>
    <div style={{ maxWidth: 620, padding: 24 }}>
      <CommentComposer parentLabel="הכתבה" mockUser={null} />
    </div>
  </MockProvider>
);

/** Reply mode with a cancel action. */
export const ReplyComposer = () => (
  <MockProvider>
    <div style={{ maxWidth: 620, padding: 24 }}>
      <CommentComposer parentLabel="הכתבה" replyTo="מיכל ר." mockUser={mockUser().toObject()} onCancel={() => {}} />
    </div>
  </MockProvider>
);
