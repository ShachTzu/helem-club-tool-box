import type { MembershipStatus, RecognitionStatus, Gender } from './member-profile.model.js';

export type { MembershipStatus, RecognitionStatus, Gender };

/**
 * the onboarding answers a member submits once, right after signing up.
 * mirrors questions 1-9 and 12 of the volunteer survey.
 *
 * note there is no `userId` here — the owner is always taken from the session
 * server-side, so a caller cannot write onto somebody else's profile.
 */
export type SubmitMemberProfileInput = {
  /**
   * full name (q1).
   */
  fullName: string;

  /**
   * phone number (q2). the only field the survey marks as required.
   */
  phone: string;

  /**
   * preferred contact email (q3).
   */
  contactEmail?: string;

  /**
   * age (q4).
   */
  age?: number;

  /**
   * city / area of residence (q5).
   */
  city?: string;

  /**
   * roles the member already holds in the community (q6).
   */
  communityRoles?: string;

  /**
   * gender (q7).
   */
  gender?: Gender;

  /**
   * a few words about the member's injury (q8). health data.
   */
  injuryNote?: string;

  /**
   * recognition status with National Insurance / Ministry of Defense (q9).
   * health data.
   */
  recognitionStatus?: RecognitionStatus;

  /**
   * whether the member agrees to take welcome calls with new members (q12).
   */
  welcomeCallsOptIn?: boolean;

  /**
   * coping domains the member is interested in.
   */
  interests?: string[];
};

/**
 * the membership state of the signed-in member, as returned to their own
 * browser. carries no other member's data.
 */
export type MyMembership = {
  /**
   * the platform user id.
   */
  userId: string;

  /**
   * the membership decision state.
   */
  status: MembershipStatus;

  /**
   * whether the member has already submitted their onboarding profile.
   */
  onboardingCompleted: boolean;

  /**
   * the name the member gave in onboarding, so the app can greet them.
   */
  fullName: string;
};

/**
 * one row of the admin approval queue: enough to find a person, sort the queue
 * and make contact — and deliberately nothing more.
 *
 * the health answers are NOT here. the queue lists every registered member at
 * once, so putting them in this shape would ship the community's medical
 * details to a browser in bulk to display none of them. an admin who opens a
 * specific applicant fetches {@link AdminMemberProfile} for that one person.
 */
export type MemberProfileSummary = {
  userId: string;
  status: MembershipStatus;
  accountEmail: string;
  accountDisplayName: string;
  provider: string;
  fullName: string;
  phone: string;
  contactEmail: string;
  city: string;
  submittedAt?: string;
  decidedAt?: string;
  createdAt?: string;
};

/**
 * one member's full application, including the sensitive answers. returned by
 * a single admin-gated lookup, one person at a time — never in a list.
 */
export type AdminMemberProfile = MemberProfileSummary & {
  age: number;
  communityRoles: string;
  gender: string;
  injuryNote: string;
  recognitionStatus: string;
  welcomeCallsOptIn: boolean;
  interests: string[];
  decisionNote: string;
};

/**
 * options for the admin approval queue listing.
 */
export type ListMemberProfilesOptions = {
  /**
   * restrict to a single membership state. omit to list every registered
   * account.
   */
  status?: MembershipStatus;

  /**
   * free-text match against name and email.
   */
  query?: string;
};

/**
 * an admin's decision on a member's application.
 */
export type SetMembershipStatusInput = {
  /**
   * the member the decision applies to.
   */
  userId: string;

  /**
   * the state to move the member into.
   */
  status: MembershipStatus;

  /**
   * an optional internal note recorded with the decision.
   */
  note?: string;
};
