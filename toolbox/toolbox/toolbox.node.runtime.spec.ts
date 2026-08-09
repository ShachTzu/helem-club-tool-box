import { ToolboxNode } from './toolbox.node.runtime.js';
import type { SubmitAppInput } from './toolbox-options.js';

/**
 * these tests pin two things about the post-submission confirmation email:
 * a mail failure must never fail the submission itself, and a member-chosen
 * app name must never be able to inject markup into the email (helamPlatform's
 * sendEmail wraps its text straight into `<p>${text}</p>` with no escaping).
 *
 * plus the membership gate: publishing into the catalog requires an approved
 * community member, enforced server-side and not only by the route.
 */

const FAKE_USER = { id: 'user-1', role: 'member' };
const FAKE_MODERATOR = { id: 'mod-1', role: 'moderator', displayName: 'Dana Mod' };

const APPROVED = { isApprovedMember: async () => true };
const NOT_APPROVED = { isApprovedMember: async () => false };

function fakeApp(overrides: Partial<{ id: string; name: string; contactEmail: string }> = {}) {
  return { id: 'a1', slug: 'a1', name: 'Test Tool', contactEmail: '', ...overrides };
}

function buildToolbox(
  helamPlatform: unknown,
  appRepository: unknown,
  appReviewRepository: unknown = {},
  membership: unknown = APPROVED
) {
  return new ToolboxNode(
    {},
    {} as never,
    helamPlatform as never,
    membership as never,
    appRepository as never,
    appReviewRepository as never,
    undefined
  );
}

it('submitApp sends a confirmation email with the app name html-escaped', async () => {
  const sentEmails: Array<{ to: string; subject: string; text: string }> = [];
  const helamPlatform = {
    getCurrentUser: async () => FAKE_USER,
    sendEmail: async (to: string, subject: string, text: string) => {
      sentEmails.push({ to, subject, text });
      return true;
    },
  };
  const appRepository = {
    createApp: async () =>
      fakeApp({ name: '<script>alert(1)</script>', contactEmail: 'submitter@example.com' }),
  };

  const input: SubmitAppInput = { name: '<script>alert(1)</script>', externalLink: 'https://example.com' };
  await buildToolbox(helamPlatform, appRepository).submitApp(input, {});

  expect(sentEmails).toHaveLength(1);
  expect(sentEmails[0].to).toBe('submitter@example.com');
  expect(sentEmails[0].text).not.toContain('<script>');
  expect(sentEmails[0].text).toContain('&lt;script&gt;');
});

it('submitApp sends no email when the submission has no contact email', async () => {
  const sentEmails: unknown[] = [];
  const helamPlatform = {
    getCurrentUser: async () => FAKE_USER,
    sendEmail: async (...args: unknown[]) => {
      sentEmails.push(args);
      return true;
    },
  };
  const appRepository = { createApp: async () => fakeApp({ contactEmail: '' }) };

  const input: SubmitAppInput = { name: 'Tool', externalLink: 'https://example.com' };
  await buildToolbox(helamPlatform, appRepository).submitApp(input, {});

  expect(sentEmails).toHaveLength(0);
});

it('submitApp still returns the submitted app even when the confirmation email fails', async () => {
  const helamPlatform = {
    getCurrentUser: async () => FAKE_USER,
    sendEmail: async () => {
      throw new Error('Resend is down');
    },
  };
  const appRepository = {
    createApp: async () => fakeApp({ contactEmail: 'submitter@example.com' }),
  };

  const input: SubmitAppInput = { name: 'Tool', externalLink: 'https://example.com' };
  const result = await buildToolbox(helamPlatform, appRepository).submitApp(input, {});

  expect(result?.id).toBe('a1');
});

/**
 * these tests pin reviewToolboxApp's lifecycle behavior: a moderator-only
 * gate, the changes_requested action reaching the repository (not just
 * approve/reject), and the moderator's note being html-escaped in the
 * decision email for the same reason as the confirmation email above.
 */

it('reviewToolboxApp rejects a caller who is not a moderator or admin', async () => {
  const helamPlatform = { getCurrentUser: async () => FAKE_USER };
  const appRepository = {
    applyModerationDecision: async () => {
      throw new Error('should not be called for a non-moderator');
    },
  };

  await expect(
    buildToolbox(helamPlatform, appRepository).reviewToolboxApp({ appId: 'a1', action: 'approve' }, {})
  ).rejects.toThrow();
});

it('reviewToolboxApp with changes_requested passes the action and note through to the repository', async () => {
  const helamPlatform = { getCurrentUser: async () => FAKE_MODERATOR, sendEmail: async () => true };
  let captured: unknown[] = [];
  const appRepository = {
    applyModerationDecision: async (...args: unknown[]) => {
      captured = args;
      return fakeApp({ contactEmail: '' });
    },
  };

  await buildToolbox(helamPlatform, appRepository).reviewToolboxApp(
    { appId: 'a1', action: 'changes_requested', note: 'fix the icon' },
    {}
  );

  expect(captured).toEqual([
    'a1',
    'changes_requested',
    'changes_requested',
    { id: 'mod-1', name: 'Dana Mod' },
    'fix the icon',
  ]);
});

it('reviewToolboxApp emails the submitter with the moderator note html-escaped', async () => {
  const sentEmails: Array<{ to: string; subject: string; text: string }> = [];
  const helamPlatform = {
    getCurrentUser: async () => FAKE_MODERATOR,
    sendEmail: async (to: string, subject: string, text: string) => {
      sentEmails.push({ to, subject, text });
      return true;
    },
  };
  const appRepository = {
    applyModerationDecision: async () =>
      fakeApp({ name: 'Test Tool', contactEmail: 'submitter@example.com' }),
  };

  await buildToolbox(helamPlatform, appRepository).reviewToolboxApp(
    { appId: 'a1', action: 'changes_requested', note: '<b>fix the icon</b>' },
    {}
  );

  expect(sentEmails).toHaveLength(1);
  expect(sentEmails[0].to).toBe('submitter@example.com');
  expect(sentEmails[0].text).not.toContain('<b>fix');
  expect(sentEmails[0].text).toContain('&lt;b&gt;fix the icon&lt;/b&gt;');
});

it('reviewToolboxApp sends no email and still returns the app when there is no contact email', async () => {
  const sentEmails: unknown[] = [];
  const helamPlatform = {
    getCurrentUser: async () => FAKE_MODERATOR,
    sendEmail: async (...args: unknown[]) => {
      sentEmails.push(args);
      return true;
    },
  };
  const appRepository = {
    applyModerationDecision: async () => fakeApp({ contactEmail: '' }),
  };

  const result = await buildToolbox(helamPlatform, appRepository).reviewToolboxApp(
    { appId: 'a1', action: 'approve' },
    {}
  );

  expect(sentEmails).toHaveLength(0);
  expect(result?.id).toBe('a1');
});

/**
 * these tests pin rateToolboxApp's auth requirement: rating must require a
 * signed-in member, and the reviewer identity (name + id) must always come
 * from the session, never from client-supplied input — closing the "rate as
 * anyone" gap the field had before.
 */

it('rateToolboxApp rejects an anonymous caller', async () => {
  const helamPlatform = { getCurrentUser: async () => null };
  const appReviewRepository = {
    createReview: async () => {
      throw new Error('should not be called for an anonymous caller');
    },
  };

  await expect(
    buildToolbox(helamPlatform, {}, appReviewRepository).rateToolboxApp({ appId: 'a1', stars: 5 }, {})
  ).rejects.toThrow();
});

it("rateToolboxApp uses the authed user's own id and display name", async () => {
  const helamPlatform = {
    getCurrentUser: async () => ({ id: 'user-9', role: 'member', displayName: 'שם אמיתי' }),
  };
  let captured: unknown[] = [];
  const appReviewRepository = {
    createReview: async (...args: unknown[]) => {
      captured = args;
      return {
        id: 'r1',
        appId: 'a1',
        stars: 5,
        comment: '',
        displayName: 'שם אמיתי',
        helpfulCount: 0,
        userId: 'user-9',
        createdAt: new Date(),
      };
    },
    listReviewsByAppId: async () => [],
  };
  const appRepository = { updateAppRating: async () => null };

  await buildToolbox(helamPlatform, appRepository, appReviewRepository).rateToolboxApp(
    { appId: 'a1', stars: 5, comment: 'great' },
    {}
  );

  expect(captured[0]).toBe('a1');
  expect(captured[3]).toBe('שם אמיתי');
  expect(captured[4]).toBe('user-9');
});

/**
 * these tests pin the membership gate on publishing: an account that signed in
 * but has not been approved as a community member cannot put anything in the
 * catalog, and that is enforced here in the resolver, not only by the route.
 */

it('submitApp refuses a signed-in account that is not an approved member', async () => {
  const helamPlatform = { getCurrentUser: async () => FAKE_USER, sendEmail: async () => true };
  const appRepository = {
    createApp: async () => {
      throw new Error('must not reach the repository');
    },
  };

  const input: SubmitAppInput = { name: 'Tool', externalLink: 'https://example.com' };
  const toolbox = buildToolbox(helamPlatform, appRepository, {}, NOT_APPROVED);

  await expect(toolbox.submitApp(input, {})).rejects.toThrow();
});

it('submitApp lets a moderator through without an approved member profile', async () => {
  const helamPlatform = {
    getCurrentUser: async () => ({ id: 'mod-1', role: 'moderator' }),
    sendEmail: async () => true,
  };
  const appRepository = { createApp: async () => fakeApp() };

  const input: SubmitAppInput = { name: 'Tool', externalLink: 'https://example.com' };
  const result = await buildToolbox(helamPlatform, appRepository, {}, NOT_APPROVED).submitApp(input, {});

  expect(result?.id).toBe('a1');
});
