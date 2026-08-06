import { prop, index } from '@typegoose/typegoose';

/**
 * where a registered account stands in the community-membership process.
 *
 * - `none`      — signed up, has not completed onboarding yet ("לא חבר קהילה")
 * - `pending`   — completed onboarding, waiting for an admin decision ("ממתין לאישור")
 * - `approved`  — an approved community member ("חבר קהילה")
 * - `rejected`  — an admin declined or revoked membership ("לא חבר קהילה")
 */
export type MembershipStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * how the member's disability is recognised by the state, mirroring the
 * volunteer survey's options.
 */
export type RecognitionStatus = 'recognized' | 'in-process' | 'planned' | 'none';

/**
 * the member's gender, mirroring the volunteer survey's options.
 */
export type Gender = 'female' | 'male' | 'other';

/**
 * the onboarding profile a registered account fills in once, and the
 * membership decision an admin makes on it.
 *
 * this lives in its own collection rather than on the platform's UserModel on
 * purpose: `injuryNote` and `recognitionStatus` are health data, which under
 * חוק הגנת הפרטיות is sensitive personal information. keeping it out of the
 * user record means no public query, serializer or cache can leak it by
 * accident — the only way to read it is through the owner-scoped or
 * admin-gated resolvers in this aspect.
 */
@index({ status: 1 })
export class MemberProfileModel {
  /**
   * the platform user id this profile belongs to. one profile per account.
   */
  @prop({ required: true, unique: true, type: String })
  public userId!: string;

  /**
   * the account's sign-in email, copied here so the admin approval queue can
   * be rendered without reading the platform's user collection.
   */
  @prop({ required: true, type: String })
  public accountEmail!: string;

  /**
   * the account's display name at the time of submission, same rationale as
   * `accountEmail`.
   */
  @prop({ type: String, default: '' })
  public accountDisplayName!: string;

  /**
   * how the account signed up — `email` (one-time code) or `google`. recorded
   * so an admin can see which route a member came in through.
   */
  @prop({ type: String, default: 'email' })
  public provider!: string;

  /**
   * the membership decision state.
   */
  @prop({ required: true, type: String, default: 'none' })
  public status!: string;

  /**
   * full name, as given in onboarding (survey q1).
   */
  @prop({ type: String, default: '' })
  public fullName!: string;

  /**
   * phone number (survey q2). the survey marks this the one required field.
   */
  @prop({ type: String, default: '' })
  public phone!: string;

  /**
   * preferred contact email (survey q3). may differ from `accountEmail` — a
   * member can sign in with Google and prefer another address.
   */
  @prop({ type: String, default: '' })
  public contactEmail!: string;

  /**
   * age (survey q4). 0 when not provided.
   */
  @prop({ type: Number, default: 0 })
  public age!: number;

  /**
   * city / area of residence (survey q5).
   */
  @prop({ type: String, default: '' })
  public city!: string;

  /**
   * roles the member already holds inside the community (survey q6).
   */
  @prop({ type: String, default: '' })
  public communityRoles!: string;

  /**
   * gender (survey q7), used to match members for welcome calls.
   */
  @prop({ type: String, default: '' })
  public gender!: string;

  /**
   * a few words about the member's injury (survey q8). HEALTH DATA — never
   * exposed outside the owner and admins.
   */
  @prop({ type: String, default: '' })
  public injuryNote!: string;

  /**
   * recognition status with National Insurance / Ministry of Defense
   * (survey q9). HEALTH DATA — same handling as `injuryNote`.
   */
  @prop({ type: String, default: '' })
  public recognitionStatus!: string;

  /**
   * whether the member agrees to be approached to take welcome calls with
   * newly-joined members (survey q12).
   */
  @prop({ type: Boolean, default: false })
  public welcomeCallsOptIn!: boolean;

  /**
   * the coping-domain names the member is most interested in. not part of the
   * volunteer survey — carried over from the platform's existing interests
   * step, which the content matching already relies on.
   */
  @prop({ type: () => [String], default: [] })
  public interests!: string[];

  /**
   * ISO timestamp of when the member submitted their onboarding profile.
   */
  @prop({ type: String })
  public submittedAt?: string;

  /**
   * ISO timestamp of the admin decision.
   */
  @prop({ type: String })
  public decidedAt?: string;

  /**
   * the id of the admin who made the decision.
   */
  @prop({ type: String })
  public decidedBy?: string;

  /**
   * an optional internal note the admin left with the decision.
   */
  @prop({ type: String, default: '' })
  public decisionNote!: string;

  /**
   * ISO timestamp of when the profile row was created.
   */
  @prop({ type: String })
  public createdAt?: string;
}
