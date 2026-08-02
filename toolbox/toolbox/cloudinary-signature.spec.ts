import { createHash } from 'node:crypto';
import { parseCloudinaryUrl, signCloudinaryUpload } from './cloudinary-signature.js';

describe('parseCloudinaryUrl', () => {
  it('parses a well-formed CLOUDINARY_URL', () => {
    expect(parseCloudinaryUrl('cloudinary://123456:secretvalue@my-cloud')).toEqual({
      apiKey: '123456',
      apiSecret: 'secretvalue',
      cloudName: 'my-cloud',
    });
  });

  it('throws when the value is missing', () => {
    expect(() => parseCloudinaryUrl(undefined)).toThrow();
  });

  it('throws when the value is malformed', () => {
    expect(() => parseCloudinaryUrl('not-a-cloudinary-url')).toThrow();
  });
});

describe('signCloudinaryUpload', () => {
  it('is deterministic for the same params and secret', () => {
    const params = { folder: 'toolbox/submissions/user-1', timestamp: 1700000000 };
    expect(signCloudinaryUpload(params, 'shh')).toBe(signCloudinaryUpload(params, 'shh'));
  });

  it('is independent of key order (params are sorted before signing)', () => {
    const a = signCloudinaryUpload({ folder: 'f', timestamp: 1 }, 'shh');
    const b = signCloudinaryUpload({ timestamp: 1, folder: 'f' }, 'shh');
    expect(a).toBe(b);
  });

  it('changes when the folder changes (pins the signature to one folder)', () => {
    const a = signCloudinaryUpload({ folder: 'toolbox/submissions/user-1', timestamp: 1 }, 'shh');
    const b = signCloudinaryUpload({ folder: 'toolbox/submissions/user-2', timestamp: 1 }, 'shh');
    expect(a).not.toBe(b);
  });

  it('changes when the secret changes (a wrong secret cannot forge a match)', () => {
    const params = { folder: 'f', timestamp: 1 };
    expect(signCloudinaryUpload(params, 'shh')).not.toBe(signCloudinaryUpload(params, 'other'));
  });

  it('matches a manually computed sha1 of the documented Cloudinary format', () => {
    const expected = createHash('sha1').update('folder=f&timestamp=1shh').digest('hex');
    expect(signCloudinaryUpload({ folder: 'f', timestamp: 1 }, 'shh')).toBe(expected);
  });
});
