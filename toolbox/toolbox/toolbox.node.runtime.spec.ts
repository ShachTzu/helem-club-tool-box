import { ToolboxNode } from './toolbox.node.runtime.js';
import type { SubmitAppInput, ReviewAppInput } from './toolbox-options.js';

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
 * moderation decisions. the server is the only thing standing between a
 * crafted mutation and the catalog, so these pin the action whitelist and the
 * mandatory note rather than trusting the console to enforce them.
 */

const FAKE_MODERATOR = { id: 'mod-1', role: 'moderator', displayName: 'דנה מודרטורית' };

type ReviewCall = {
  appIds: string[];
  status: string;
  action: string;
  note: string;
  moderator: { id: string; name: string };
};

function buildReviewToolbox(sentEmails: unknown[] = [], calls: ReviewCall[] = []) {
  const helamPlatform = {
    getCurrentUser: async () => FAKE_MODERATOR,
    sendEmail: async (...args: unknown[]) => {
      sentEmails.push(args);
      return true;
    },
  };
  const appRepository = {
    reviewApps: async (
      appIds: string[],
      status: string,
      action: string,
      note: string,
      moderator: { id: string; name: string }
    ) => {
      calls.push({ appIds, status, action, note, moderator });
      return appIds.map((id) => ({
        ...fakeApp({ id, contactEmail: `${id}@example.com`, name: 'Tool' }),
        status,
        moderatorNote: note,
      }));
    },
  };
  return buildToolbox(helamPlatform, appRepository);
}

it('reviewToolboxApp refuses an action outside the whitelist instead of defaulting to reject', async () => {
  const calls: ReviewCall[] = [];
  const toolbox = buildReviewToolbox([], calls);

  const input = { appIds: ['a1'], action: 'delete_everything' } as unknown as ReviewAppInput;
  await expect(toolbox.reviewToolboxApp(input, {})).rejects.toThrow();
  expect(calls).toHaveLength(0);
});

it.each(['constructor', 'toString', 'hasOwnProperty', '__proto__'])(
  'reviewToolboxApp refuses "%s", which an object-literal whitelist would let through',
  async (action) => {
    const calls: ReviewCall[] = [];
    const toolbox = buildReviewToolbox([], calls);

    const input = { appIds: ['a1'], action, note: 'x' } as unknown as ReviewAppInput;
    await expect(toolbox.reviewToolboxApp(input, {})).rejects.toThrow();
    expect(calls).toHaveLength(0);
  }
);

it('reviewToolboxApp refuses to reject without a moderator note', async () => {
  const calls: ReviewCall[] = [];
  const toolbox = buildReviewToolbox([], calls);

  await expect(
    toolbox.reviewToolboxApp({ appIds: ['a1'], action: 'reject', note: '   ' }, {})
  ).rejects.toThrow();
  expect(calls).toHaveLength(0);
});

it('reviewToolboxApp approves a whole batch in one repository call and stores no note', async () => {
  const calls: ReviewCall[] = [];
  const toolbox = buildReviewToolbox([], calls);

  const reviewed = await toolbox.reviewToolboxApp(
    { appIds: ['a1', 'a2', 'a3'], action: 'approve', note: 'ignored' },
    {}
  );

  expect(calls).toHaveLength(1);
  expect(calls[0].appIds).toEqual(['a1', 'a2', 'a3']);
  expect(calls[0].status).toBe('approved');
  expect(calls[0].note).toBe('');
  expect(calls[0].action).toBe('approve');
  expect(calls[0].moderator.id).toBe('mod-1');
  expect(reviewed).toHaveLength(3);
});

it('reviewToolboxApp stores the note for request_changes and emails every submitter', async () => {
  const sentEmails: unknown[] = [];
  const calls: ReviewCall[] = [];
  const toolbox = buildReviewToolbox(sentEmails, calls);

  await toolbox.reviewToolboxApp(
    { appIds: ['a1', 'a2'], action: 'request_changes', note: '  הקישור לא עובד  ' },
    {}
  );

  expect(calls[0].status).toBe('changes_requested');
  expect(calls[0].note).toBe('הקישור לא עובד');
  expect(sentEmails).toHaveLength(2);
});

/**
 * correcting a note must never be a way to re-decide a submission, and must
 * never be reachable by anyone but a moderator.
 */

type CorrectCall = { appId: string; note: string; moderator: { id: string; name: string } };

function buildCorrectToolbox(user: unknown, calls: CorrectCall[]) {
  const helamPlatform = { getCurrentUser: async () => user, sendEmail: async () => true };
  const appRepository = {
    correctModeratorNote: async (
      appId: string,
      note: string,
      moderator: { id: string; name: string }
    ) => {
      calls.push({ appId, note, moderator });
      return { ...fakeApp({ id: appId }), status: 'rejected', moderatorNote: note };
    },
  };
  return buildToolbox(helamPlatform, appRepository);
}

it('correctModerationNote denies a member who is not a moderator', async () => {
  const calls: CorrectCall[] = [];
  const toolbox = buildCorrectToolbox(FAKE_USER, calls);

  await expect(
    toolbox.correctModerationNote({ appId: 'a1', note: 'ניסוח מתוקן' }, {})
  ).rejects.toThrow();
  expect(calls).toHaveLength(0);
});

it('correctModerationNote refuses an empty correction', async () => {
  const calls: CorrectCall[] = [];
  const toolbox = buildCorrectToolbox(FAKE_MODERATOR, calls);

  await expect(toolbox.correctModerationNote({ appId: 'a1', note: '   ' }, {})).rejects.toThrow();
  expect(calls).toHaveLength(0);
});

it('correctModerationNote stores the trimmed note against the acting moderator', async () => {
  const calls: CorrectCall[] = [];
  const toolbox = buildCorrectToolbox(FAKE_MODERATOR, calls);

  const result = await toolbox.correctModerationNote(
    { appId: 'a1', note: '  ניסוח מתוקן  ' },
    {}
  );

  expect(calls).toHaveLength(1);
  expect(calls[0].note).toBe('ניסוח מתוקן');
  expect(calls[0].moderator.id).toBe('mod-1');
  expect(result?.moderatorNote).toBe('ניסוח מתוקן');
  // the decision itself is untouched
  expect(result?.status).toBe('rejected');
});

it('listDecidedToolboxApps denies a member who is not a moderator', async () => {
  const helamPlatform = { getCurrentUser: async () => FAKE_USER };
  const appRepository = { listDecidedApps: async () => [] };

  await expect(
    buildToolbox(helamPlatform, appRepository).listDecidedToolboxApps({})
  ).rejects.toThrow();
});

/**
 * deletion is irreversible and self-service, so these pin the two things that
 * would be unrecoverable if wrong: that it only ever touches the caller's own
 * submission, and that "everything" really does mean everything.
 */

function buildDeleteToolbox(user: unknown, log: string[], ownerId = 'user-1') {
  const helamPlatform = { getCurrentUser: async () => user };
  const appRepository = {
    anonymizeApp: async (appId: string, userId: string) => {
      if (userId !== ownerId) return null;
      log.push(`anonymize:${appId}`);
      return fakeApp({ id: appId });
    },
    deleteOwnedApp: async (appId: string, userId: string) => {
      if (userId !== ownerId) return false;
      log.push(`delete:${appId}`);
      return true;
    },
  };
  const appReviewRepository = {
    deleteReviewsForApp: async (appId: string) => {
      log.push(`reviews:${appId}`);
      return 3;
    },
  };
  const deletionRepository = {
    record: async (appId: string, mode: string) => {
      log.push(`receipt:${appId}:${mode}`);
    },
  };
  return new ToolboxNode(
    {},
    {} as never,
    helamPlatform as never,
    appRepository as never,
    appReviewRepository as never,
    undefined,
    deletionRepository as never
  );
}

it('deleteMySubmission refuses an anonymous caller', async () => {
  const log: string[] = [];
  const toolbox = buildDeleteToolbox(null, log);

  await expect(
    toolbox.deleteMySubmission({ appId: 'a1', mode: 'everything' }, {})
  ).rejects.toThrow();
  expect(log).toHaveLength(0);
});

it('deleteMySubmission refuses a mode outside the whitelist', async () => {
  const log: string[] = [];
  const toolbox = buildDeleteToolbox(FAKE_USER, log);

  await expect(
    toolbox.deleteMySubmission({ appId: 'a1', mode: 'constructor' } as never, {})
  ).rejects.toThrow();
  expect(log).toHaveLength(0);
});

it('deleteMySubmission cannot touch a submission belonging to someone else', async () => {
  const log: string[] = [];
  // the repository stubs only match ownerId 'user-1'; the caller is someone else
  const toolbox = buildDeleteToolbox({ id: 'intruder', role: 'member' }, log);

  await expect(
    toolbox.deleteMySubmission({ appId: 'a1', mode: 'everything' }, {})
  ).rejects.toThrow();
  expect(log).toHaveLength(0);
});

it('deleteMySubmission in personal_data mode keeps the tool and writes a receipt', async () => {
  const log: string[] = [];
  const toolbox = buildDeleteToolbox(FAKE_USER, log);

  const result = await toolbox.deleteMySubmission({ appId: 'a1', mode: 'personal_data' }, {});

  expect(result).toBe(true);
  expect(log).toEqual(['anonymize:a1', 'receipt:a1:personal_data']);
});

it('deleteMySubmission in everything mode removes the reviews too', async () => {
  const log: string[] = [];
  const toolbox = buildDeleteToolbox(FAKE_USER, log);

  await toolbox.deleteMySubmission({ appId: 'a1', mode: 'everything' }, {});

  expect(log).toEqual(['delete:a1', 'reviews:a1', 'receipt:a1:everything']);
});

it('deleteMySubmission still reports success when the receipt cannot be written', async () => {
  const helamPlatform = { getCurrentUser: async () => FAKE_USER };
  const appRepository = { deleteOwnedApp: async () => true };
  const appReviewRepository = { deleteReviewsForApp: async () => 0 };
  const deletionRepository = {
    record: async () => {
      throw new Error('mongo is down');
    },
  };
  const toolbox = new ToolboxNode(
    {},
    {} as never,
    helamPlatform as never,
    appRepository as never,
    appReviewRepository as never,
    undefined,
    deletionRepository as never
  );

  await expect(
    toolbox.deleteMySubmission({ appId: 'a1', mode: 'everything' }, {})
  ).resolves.toBe(true);
});

it('rateToolboxApp refuses an anonymous rating', async () => {
  const created: unknown[] = [];
  const helamPlatform = { getCurrentUser: async () => null };
  const appReviewRepository = {
    createReview: async (...args: unknown[]) => {
      created.push(args);
      return {};
    },
  };
  const toolbox = new ToolboxNode(
    {},
    {} as never,
    helamPlatform as never,
    {} as never,
    appReviewRepository as never,
    undefined
  );

  await expect(toolbox.rateToolboxApp({ appId: 'a1', stars: 5 }, {})).rejects.toThrow();
  expect(created).toHaveLength(0);
});

it('rateToolboxApp takes the reviewer name from the session, not the request', async () => {
  const created: unknown[][] = [];
  const helamPlatform = {
    getCurrentUser: async () => ({ id: 'user-7', role: 'member', displayName: 'רות כהן' }),
  };
  const appReviewRepository = {
    createReview: async (...args: unknown[]) => {
      created.push(args);
      return { id: 'r1', appId: 'a1', stars: 5, displayName: 'רות כהן' };
    },
    listReviewsByAppId: async () => [{ stars: 5 }],
  };
  const appRepository = { updateAppRating: async () => undefined };
  const toolbox = new ToolboxNode(
    {},
    {} as never,
    helamPlatform as never,
    appRepository as never,
    appReviewRepository as never,
    undefined
  );

  // a client trying to post under someone else's name
  await toolbox.rateToolboxApp(
    { appId: 'a1', stars: 5, displayName: 'מישהו אחר' } as never,
    {}
  );

  expect(created[0][3]).toBe('רות כהן');
  expect(created[0][4]).toBe('user-7');
});

it('getApp hides a rejected submission and its moderator note from the public', async () => {
  const helamPlatform = { getCurrentUser: async () => null };
  const appRepository = {
    getAppByIdOrSlug: async () => ({
      ...fakeApp({ id: 'a1' }),
      status: 'rejected',
      submittedBy: 'user-9',
      moderatorNote: 'נראה כמו הונאה',
    }),
  };

  const result = await buildToolbox(helamPlatform, appRepository).getApp('a1', {});

  expect(result).toBeNull();
});

it('getApp shows a rejected submission and its note to the member who submitted it', async () => {
  const helamPlatform = { getCurrentUser: async () => ({ id: 'user-9', role: 'member' }) };
  const appRepository = {
    getAppByIdOrSlug: async () => ({
      ...fakeApp({ id: 'a1' }),
      status: 'rejected',
      submittedBy: 'user-9',
      moderatorNote: 'הקישור לא עובד',
    }),
  };

  const result = await buildToolbox(helamPlatform, appRepository).getApp('a1', {});

  expect(result?.moderatorNote).toBe('הקישור לא עובד');
});

it('getApp hides another member’s pending submission from a signed-in member', async () => {
  const helamPlatform = { getCurrentUser: async () => ({ id: 'someone-else', role: 'member' }) };
  const appRepository = {
    getAppByIdOrSlug: async () => ({
      ...fakeApp({ id: 'a1' }),
      status: 'pending',
      submittedBy: 'user-9',
      moderatorNote: '',
    }),
  };

  const result = await buildToolbox(helamPlatform, appRepository).getApp('a1', {});

  expect(result).toBeNull();
});

it('getApp serves an approved app to anyone, signed in or not', async () => {
  const helamPlatform = { getCurrentUser: async () => null };
  const appRepository = {
    getAppByIdOrSlug: async () => ({ ...fakeApp({ id: 'a1' }), status: 'approved', moderatorNote: '' }),
  };

  const result = await buildToolbox(helamPlatform, appRepository).getApp('a1', {});

  expect(result?.id).toBe('a1');
});

it('reviewToolboxApp denies a member who is not a moderator', async () => {
  const calls: ReviewCall[] = [];
  const helamPlatform = { getCurrentUser: async () => FAKE_USER, sendEmail: async () => true };
  const appRepository = {
    reviewApps: async (
      appIds: string[],
      status: string,
      action: string,
      note: string,
      moderator: { id: string; name: string }
    ) => {
      calls.push({ appIds, status, action, note, moderator });
      return [];
    },
  };

  await expect(
    buildToolbox(helamPlatform, appRepository).reviewToolboxApp(
      { appIds: ['a1'], action: 'approve' },
      {}
    )
  ).rejects.toThrow();
  expect(calls).toHaveLength(0);
});
