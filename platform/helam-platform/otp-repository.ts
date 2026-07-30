import { ReturnModelType } from '@typegoose/typegoose';
import { OtpModel } from './otp.model.js';
import {
  generateOtp,
  hashOtp,
  verifyOtp,
  isExpired,
  OTP_TTL_MS,
  OTP_MAX_ATTEMPTS,
  OTP_REQUEST_COOLDOWN_MS,
} from './otp.js';

/**
 * outcome of issuing a code: the raw code to email, or a cooldown signal when
 * one was requested too recently for the same email.
 */
export type IssueOtpResult = { ok: true; code: string } | { ok: false; reason: 'cooldown' };

/**
 * outcome of verifying a submitted code.
 */
export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; reason: 'no-code' | 'expired' | 'locked' | 'mismatch' };

/**
 * data-access + logic for email one-time-passwords. keeps a single active code
 * per email and enforces the request cooldown, attempt cap, expiry, and
 * single-use semantics. only hashes are stored.
 */
export class OtpRepository {
  constructor(
    private otpModel: ReturnModelType<typeof OtpModel>,
    private secret: string
  ) {}

  /**
   * issue a fresh code for an email, replacing any previous one. returns the raw
   * code (to be emailed) or a cooldown signal.
   */
  async issue(email: string): Promise<IssueOtpResult> {
    const normalized = email.toLowerCase();
    const latest = await this.otpModel.findOne({ email: normalized }).sort({ createdAt: -1 });
    if (latest) {
      const since = Date.now() - new Date(latest.createdAt).getTime();
      if (since < OTP_REQUEST_COOLDOWN_MS) return { ok: false, reason: 'cooldown' };
    }

    const code = generateOtp();
    const now = new Date();
    await this.otpModel.deleteMany({ email: normalized });
    await this.otpModel.create({
      email: normalized,
      codeHash: hashOtp(code, this.secret),
      expiresAt: new Date(now.getTime() + OTP_TTL_MS),
      attempts: 0,
      createdAt: now,
    });
    return { ok: true, code };
  }

  /**
   * verify a submitted code. consumes the code on success, counts attempts and
   * burns the code after the cap, and treats expired/missing codes as failures.
   */
  async verify(email: string, code: string): Promise<VerifyOtpResult> {
    const normalized = email.toLowerCase();
    const doc = await this.otpModel.findOne({ email: normalized }).sort({ createdAt: -1 });
    if (!doc) return { ok: false, reason: 'no-code' };

    if (isExpired(new Date(doc.expiresAt).getTime())) {
      await this.otpModel.deleteMany({ email: normalized });
      return { ok: false, reason: 'expired' };
    }
    if (doc.attempts >= OTP_MAX_ATTEMPTS) {
      await this.otpModel.deleteMany({ email: normalized });
      return { ok: false, reason: 'locked' };
    }
    if (!verifyOtp(code, doc.codeHash, this.secret)) {
      await this.otpModel.updateOne({ _id: doc._id }, { $inc: { attempts: 1 } });
      return { ok: false, reason: 'mismatch' };
    }

    await this.otpModel.deleteMany({ email: normalized });
    return { ok: true };
  }
}
