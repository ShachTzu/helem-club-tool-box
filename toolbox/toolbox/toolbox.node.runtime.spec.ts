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
