import crypto from 'crypto';
import type { ReturnModelType } from '@typegoose/typegoose';
import type { EmailOtpModel } from './email-otp.model.js';
import { Mailer, buildOtpEmail } from './mailer.js';

/**
 * how long an issued code stays valid, in minutes.
 */
export const OTP_TTL_MINUTES = 10;

/**
 * how many verification attempts a single code tolerates before it is burned.
 */
export const OTP_MAX_ATTEMPTS = 5;

/**
 * minimum seconds between two code requests for the same address.
 */
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

/**
 * how many codes a single address may request per hour.
 */
export const OTP_MAX_PER_HOUR = 5;

/**
 * the outcome of verifying a submitted code.
 */
export type OtpVerification = {
  /**
   * whether the code was correct, unexpired, unconsumed and within the
   * attempt budget.
   */
  ok: boolean;

  /**
   * a Hebrew, user-facing reason when verification failed.
   */
  reason?: string;

  /**
   * the display name captured when the code was requested, applied to the
   * account on first sign-in.
   */
  displayName?: string;
};

/**
 * the outcome of requesting a code.
 */
export type OtpRequest = {
  /**
   * whether a code was issued.
   */
  sent: boolean;

  /**
   * a Hebrew, user-facing reason when the request was throttled.
   */
  reason?: string;
};

/**
 * normalizes an email address for storage and comparison.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * a permissive but real email shape check — enough to reject obvious junk
 * before it reaches the mail provider.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/**
 * issues and verifies email one-time-passwords.
 *
 * this replaces an earlier implementation that accepted *any* submitted code,
 * which meant knowing an address was enough to be issued that account's
 * session — including an admin's. every property below exists to close that:
 * codes are random, stored only as keyed hashes, expire, are single-use,
 * are compared in constant time, survive only a bounded number of guesses,
 * and are rate-limited per address.
 */
export class EmailOtpService {
  constructor(
    private otpModel: ReturnModelType<typeof EmailOtpModel>,
    private mailer: Mailer,
    private secret: string
  ) {}

  /**
   * HMAC a code with the platform secret, so stored digests are useless
   * without the server key and cannot be precomputed via rainbow tables.
   */
  private hash(code: string): string {
    return crypto.createHmac('sha256', this.secret).update(code).digest('hex');
  }

  /**
   * generate a cryptographically random six-digit code.
   *
   * `randomInt` is used rather than `Math.random`, which is predictable and
   * would let an attacker who has seen a few codes derive the next ones.
   */
  private generateCode(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  /**
   * issue a one-time-password to the given address and email it.
   *
   * @param rawEmail the address to send the code to.
   * @param displayName optional display name captured during signup.
   * @returns whether a code was issued, with a Hebrew reason when throttled.
   */
  async request(rawEmail: string, displayName?: string): Promise<OtpRequest> {
    const email = normalizeEmail(rawEmail);
    if (!isValidEmail(email)) {
      return { sent: false, reason: 'כתובת המייל אינה תקינה' };
    }

    const now = new Date();

    const recent = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 })
      .lean();

    if (recent?.createdAt) {
      const elapsedSeconds = (now.getTime() - new Date(recent.createdAt).getTime()) / 1000;
      if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
        const wait = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds);
        return { sent: false, reason: `כבר שלחנו קוד. אפשר לבקש קוד חדש בעוד ${wait} שניות.` };
      }
    }

    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const lastHour = await this.otpModel.countDocuments({ email, createdAt: { $gte: hourAgo } });
    if (lastHour >= OTP_MAX_PER_HOUR) {
      return { sent: false, reason: 'נשלחו יותר מדי קודים לכתובת הזו. נסו שוב בעוד שעה.' };
    }

    const code = this.generateCode();
    const challenge = await this.otpModel.create({
      email,
      codeHash: this.hash(code),
      displayName,
      createdAt: now,
      expiresAt: new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000),
      attempts: 0,
    });

    const message = buildOtpEmail(code, OTP_TTL_MINUTES);

    try {
      await this.mailer.send({ to: email, ...message });
    } catch (error) {
      // a code nobody received must not sit in the database counting against
      // the member's hourly quota, nor should the provider's internals reach
      // the browser. burn it and answer with something a person can act on.
      challenge.consumedAt = new Date();
      await challenge.save();

      // eslint-disable-next-line no-console
      console.error('[helam-platform] failed to deliver a sign-in code', error);

      return {
        sent: false,
        reason: 'לא הצלחנו לשלוח את הקוד כרגע. נסו שוב בעוד כמה רגעים.',
      };
    }

    return { sent: true };
  }

  /**
   * verify a submitted code against the newest live challenge for the address.
   *
   * @param rawEmail the address the code was sent to.
   * @param code the code the member typed in.
   * @returns whether the code is valid, plus the captured display name.
   */
  async verify(rawEmail: string, code: string): Promise<OtpVerification> {
    const email = normalizeEmail(rawEmail);
    const submitted = (code || '').trim();
    if (!email || !submitted) {
      return { ok: false, reason: 'הקוד שגוי או שפג תוקפו' };
    }

    const challenge = await this.otpModel
      .findOne({ email, consumedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 });

    if (!challenge) {
      return { ok: false, reason: 'הקוד שגוי או שפג תוקפו' };
    }

    if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
      return { ok: false, reason: 'יותר מדי ניסיונות. בקשו קוד חדש.' };
    }

    challenge.attempts += 1;
    await challenge.save();

    const expected = Buffer.from(challenge.codeHash, 'utf8');
    const actual = Buffer.from(this.hash(submitted), 'utf8');
    const matches = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

    if (!matches) {
      return { ok: false, reason: 'הקוד שגוי או שפג תוקפו' };
    }

    challenge.consumedAt = new Date();
    await challenge.save();

    // any other live code for this address is invalidated, so a code the user
    // requested twice cannot be redeemed a second time.
    await this.otpModel.updateMany(
      { email, consumedAt: { $exists: false } },
      { $set: { consumedAt: new Date() } }
    );

    return { ok: true, displayName: challenge.displayName };
  }
}
