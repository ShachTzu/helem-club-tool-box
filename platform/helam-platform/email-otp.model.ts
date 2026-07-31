import { prop, index } from '@typegoose/typegoose';

/**
 * a pending email one-time-password challenge.
 *
 * the plaintext code is never stored: only a keyed hash of it. a leaked
 * database dump therefore cannot be replayed into sessions, and the same
 * guarantee holds for anyone with read access to the collection.
 *
 * documents expire automatically — MongoDB drops them once `expiresAt`
 * passes — so codes cannot linger and be reused days later.
 */
@index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
@index({ email: 1 })
export class EmailOtpModel {
  /**
   * the lowercased email address the code was issued to.
   */
  @prop({ required: true, type: String })
  public email!: string;

  /**
   * HMAC of the one-time code, keyed with the platform session secret.
   */
  @prop({ required: true, type: String })
  public codeHash!: string;

  /**
   * display name captured during signup, applied to the account when the
   * code is verified and the account is created.
   */
  @prop({ type: String })
  public displayName?: string;

  /**
   * when this code stops being accepted.
   */
  @prop({ required: true, type: Date })
  public expiresAt!: Date;

  /**
   * how many verification attempts have been made against this code.
   * once it crosses the limit the challenge is burned, so a six-digit code
   * cannot be brute-forced.
   */
  @prop({ type: Number, default: 0 })
  public attempts!: number;

  /**
   * when the code was issued, used to throttle resend requests.
   */
  @prop({ required: true, type: Date })
  public createdAt!: Date;

  /**
   * when the code was successfully redeemed. a consumed code is never
   * accepted a second time.
   */
  @prop({ type: Date })
  public consumedAt?: Date;
}
