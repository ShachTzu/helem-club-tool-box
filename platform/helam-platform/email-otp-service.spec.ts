import { EmailOtpService, OTP_MAX_ATTEMPTS } from './email-otp-service.js';
import { Mailer } from './mailer.js';

/**
 * an in-memory stand-in for the typegoose OTP model, implementing just the
 * surface the service touches. this keeps the security behaviour under test
 * without needing a live MongoDB.
 */
function createFakeOtpModel() {
  const docs: any[] = [];

  const wrap = (doc: any) => {
    doc.save = async () => doc;
    return doc;
  };

  const matches = (doc: any, query: any) => {
    if (query.email && doc.email !== query.email) return false;
    if (query.consumedAt?.$exists === false && doc.consumedAt) return false;
    if (query.expiresAt?.$gt && !(doc.expiresAt > query.expiresAt.$gt)) return false;
    if (query.createdAt?.$gte && !(doc.createdAt >= query.createdAt.$gte)) return false;
    return true;
  };

  const sorted = (list: any[]) =>
    [...list].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    docs,
    findOne(query: any) {
      const found = () => sorted(docs.filter((doc) => matches(doc, query)))[0];
      const result: any = {
        sort: () => ({
          lean: async () => found(),
          then: (resolve: any) => resolve(found()),
        }),
        then: (resolve: any) => resolve(found()),
      };
      return result;
    },
    async countDocuments(query: any) {
      return docs.filter((doc) => matches(doc, query)).length;
    },
    async create(doc: any) {
      const created = wrap({ ...doc });
      docs.push(created);
      return created;
    },
    async updateMany(query: any, update: any) {
      docs.filter((doc) => matches(doc, query)).forEach((doc) => Object.assign(doc, update.$set));
    },
  } as any;
}

function createService() {
  const model = createFakeOtpModel();
  // no API key — the mailer logs instead of delivering, which is what we want
  // in a test.
  const mailer = new Mailer({});
  const service = new EmailOtpService(model, mailer, 'test-secret');
  return { service, model };
}

it(`issues a code and reports it as sent`, async () => {
  const { service, model } = createService();

  const result = await service.request(`member@example.com`);

  expect(result.sent).toBe(true);
  expect(model.docs).toHaveLength(1);
});

it(`never stores the plaintext code`, async () => {
  const { service, model } = createService();

  await service.request(`member@example.com`);
  const stored = model.docs[0];

  expect(stored.codeHash).toMatch(/^[a-f0-9]{64}$/);
  expect(stored).not.toHaveProperty(`code`);
});

it(`rejects an arbitrary code — the flaw that let anyone in`, async () => {
  const { service } = createService();
  await service.request(`member@example.com`);

  const result = await service.verify(`member@example.com`, `000000`);

  // a wrong guess must fail even though a live challenge exists.
  expect(result.ok).toBe(false);
});

it(`rejects verification when no code was ever requested`, async () => {
  const { service } = createService();

  const result = await service.verify(`stranger@example.com`, `123456`);

  expect(result.ok).toBe(false);
});

it(`throttles a second request made immediately`, async () => {
  const { service } = createService();

  await service.request(`member@example.com`);
  const second = await service.request(`member@example.com`);

  expect(second.sent).toBe(false);
  expect(second.reason).toContain(`שניות`);
});

it(`rejects a malformed email address`, async () => {
  const { service } = createService();

  const result = await service.request(`not-an-email`);

  expect(result.sent).toBe(false);
});

it(`burns the challenge after too many wrong guesses`, async () => {
  const { service } = createService();
  await service.request(`member@example.com`);

  for (let i = 0; i < OTP_MAX_ATTEMPTS; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await service.verify(`member@example.com`, `111111`);
  }

  const result = await service.verify(`member@example.com`, `111111`);
  expect(result.reason).toContain(`יותר מדי ניסיונות`);
});

it(`rejects an expired code`, async () => {
  const { service, model } = createService();
  await service.request(`member@example.com`);
  model.docs[0].expiresAt = new Date(Date.now() - 1000);

  const result = await service.verify(`member@example.com`, `123456`);

  expect(result.ok).toBe(false);
});
