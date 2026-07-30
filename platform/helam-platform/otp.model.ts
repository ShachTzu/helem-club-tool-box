import { prop, index } from '@typegoose/typegoose';

/**
 * a pending one-time-password for an email sign-in. only the HMAC hash of the
 * code is stored, never the raw code. documents are removed on successful use,
 * and a TTL index sweeps expired codes as a backstop.
 */
@index({ email: 1 })
@index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export class OtpModel {
  /**
   * the email address the code was issued for (lower-cased).
   */
  @prop({ required: true, type: String })
  public email!: string;

  /**
   * HMAC-SHA256 hash of the 6-digit code. the raw code is never persisted.
   */
  @prop({ required: true, type: String })
  public codeHash!: string;

  /**
   * when the code stops being valid. also drives the TTL index (Mongo removes
   * the document shortly after this time).
   */
  @prop({ required: true, type: Date })
  public expiresAt!: Date;

  /**
   * how many wrong verification attempts have been made against this code.
   */
  @prop({ required: true, type: Number, default: 0 })
  public attempts!: number;

  /**
   * when the code was issued — used for the per-email request cooldown.
   */
  @prop({ required: true, type: Date })
  public createdAt!: Date;
}
