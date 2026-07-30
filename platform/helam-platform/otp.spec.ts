import {
  generateOtp,
  hashOtp,
  verifyOtp,
  isExpired,
  OTP_TTL_MS,
} from './otp.js';

const SECRET = 'test-secret-key';

it('generates a 6-digit numeric code', () => {
  for (let i = 0; i < 50; i += 1) {
    expect(generateOtp()).toMatch(/^\d{6}$/);
  }
});

it('verifies a correct code against its hash', () => {
  const code = generateOtp();
  expect(verifyOtp(code, hashOtp(code, SECRET), SECRET)).toBe(true);
});

it('rejects a wrong code', () => {
  expect(verifyOtp('654321', hashOtp('123456', SECRET), SECRET)).toBe(false);
});

it('rejects a correct code under the wrong server secret', () => {
  expect(verifyOtp('123456', hashOtp('123456', SECRET), 'other-secret')).toBe(false);
});

it('rejects malformed or empty stored hashes', () => {
  expect(verifyOtp('123456', '', SECRET)).toBe(false);
  expect(verifyOtp('123456', 'zz', SECRET)).toBe(false);
});

it('never stores the raw code', () => {
  const code = '424242';
  const hash = hashOtp(code, SECRET);
  expect(hash).not.toContain(code);
  expect(hash).toMatch(/^[0-9a-f]{64}$/);
});

it('detects expiry at the window boundary', () => {
  const now = 1_000_000;
  expect(isExpired(now + OTP_TTL_MS, now)).toBe(false);
  expect(isExpired(now, now)).toBe(true);
  expect(isExpired(now - 1, now)).toBe(true);
});
