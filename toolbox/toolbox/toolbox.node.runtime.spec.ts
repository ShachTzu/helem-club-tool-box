import { ToolboxNode } from './toolbox.node.runtime.js';
import type { SubmitAppInput } from './toolbox-options.js';

/**
 * these tests pin two things about the post-submission confirmation email:
 * a mail failure must never fail the submission itself, and a member-chosen
 * app name must never be able to inject markup into the email (helamPlatform's
 * sendEmail wraps its text straight into `<p>${text}</p>` with no escaping).
 */

const FAKE_USER = { id: 'user-1', role: 'member' };

function fakeApp(overrides: Partial<{ id: string; name: string; contactEmail: string }> = {}) {
  return { id: 'a1', slug: 'a1', name: 'Test Tool', contactEmail: '', ...overrides };
}

function buildToolbox(helamPlatform: unknown, appRepository: unknown) {
  return new ToolboxNode({}, {} as never, helamPlatform as never, appRepository as never, {} as never, undefined);
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
 * these two pin the authorization on rateToolboxApp. before this, the mutation
 * had no requireUser at all and took the reviewer's displayName straight from
 * the client — anyone could post a rating and a comment under any name, without
 * signing in, on a public site.
 */

function buildToolboxWithReviews(
  helamPlatform: unknown,
  appReviewRepository: unknown,
  appRepository: unknown
) {
  return new ToolboxNode(
    {},
    {} as never,
    helamPlatform as never,
    appRepository as never,
    appReviewRepository as never,
    undefined
  );
}

it('rateToolboxApp refuses a caller who is not signed in', async () => {
  const helamPlatform = { getCurrentUser: async () => null };
  const appReviewRepository = {
    createReview: async () => {
      throw new Error('createReview must not be reached for an anonymous caller');
    },
  };

  await expect(
    buildToolboxWithReviews(helamPlatform, appReviewRepository, {}).rateToolboxApp(
      { appId: 'a1', stars: 5 },
      {}
    )
  ).rejects.toThrow();
});

it('rateToolboxApp takes the reviewer name from the signed-in user, not the client', async () => {
  const createReviewCalls: unknown[][] = [];
  const storedReview = {
    id: 'r1',
    appId: 'a1',
    stars: 5,
    comment: '',
    displayName: 'Real Member',
    helpfulCount: 0,
    userId: 'user-1',
    createdAt: new Date(),
  };
  const helamPlatform = {
    getCurrentUser: async () => ({ id: 'user-1', role: 'member', displayName: 'Real Member' }),
  };
  const appReviewRepository = {
    createReview: async (...args: unknown[]) => {
      createReviewCalls.push(args);
      return storedReview;
    },
    listReviewsByAppId: async () => [storedReview],
  };
  const appRepository = { updateAppRating: async () => undefined };

  // a displayName sent by the client must be ignored even if it arrives over
  // the wire — the graphql input no longer declares the field, but the server
  // is what has to be safe.
  const input = { appId: 'a1', stars: 5, displayName: 'Impersonated Admin' } as never;
  const result = await buildToolboxWithReviews(
    helamPlatform,
    appReviewRepository,
    appRepository
  ).rateToolboxApp(input, {});

  expect(createReviewCalls[0][3]).toBe('Real Member');
  expect(createReviewCalls[0][4]).toBe('user-1');
  expect(result.displayName).toBe('Real Member');
});
