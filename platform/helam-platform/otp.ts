import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

/**
 * how long an issued OTP stays valid, in milliseconds.
 */
export const OTP_TTL_MS = 10 * 60 * 1000;

/**
 * maximum wrong verification attempts before a stored code is burned.
 */
export const OTP_MAX_ATTEMPTS = 5;

/**
 * minimum gap between OTP requests for the same email, in milliseconds —
 * a light rate limit against inbox flooding.
 */
export const OTP_REQUEST_COOLDOWN_MS = 30 * 1000;

/**
 * generate a random 6-digit numeric one-time code. uses crypto.randomInt for
 * an unbiased draw across the full 000000–999999 range.
 */
export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

/**
 * hash an OTP for storage. HMAC-SHA256 keyed with a server secret, so a leak of
 * the stored hash alone does not reveal the code — an attacker also needs the
 * secret. Never store the raw code.
 */
export function hashOtp(code: string, secret: string): string {
  return createHmac('sha256', secret).update(code).digest('hex');
}

/**
 * timing-safe comparison of a submitted code against a stored hash. returns
 * false on any malformed hash rather than throwing.
 */
export function verifyOtp(code: string, storedHash: string, secret: string): boolean {
  const actual = Buffer.from(hashOtp(code, secret), 'hex');
  let expected: Buffer;
  try {
    expected = Buffer.from(storedHash, 'hex');
  } catch {
    return false;
  }
  if (expected.length === 0 || actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

/**
 * whether a code that expires at the given epoch-ms is already past its window.
 */
export function isExpired(expiresAtMs: number, nowMs: number = Date.now()): boolean {
  return nowMs >= expiresAtMs;
}
