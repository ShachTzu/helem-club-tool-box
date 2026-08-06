import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  HelamPlatformAspect,
  type HelamPlatformNode,
} from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import { NotFound } from '@bitdev/symphony.exceptions.not-found';
import type { MembershipConfig } from './membership-config.js';
import { membershipGqlSchema } from './membership.graphql.js';
import { MemberProfileModel } from './member-profile.model.js';
import { MemberProfileRepository, type ProfileOwner } from './member-profile-repository.js';
import type {
  AdminMemberProfile,
  ListMemberProfilesOptions,
  MembershipStatus,
  MyMembership,
  SetMembershipStatusInput,
  SubmitMemberProfileInput,
} from './membership-options.js';

type ResolverContext = {
  session?: { userId?: string };
};

/**
 * approving members exposes health data (injury description, disability
 * recognition), so this queue is admin-only — deliberately stricter than the
 * toolbox moderation queue, which moderators can also reach.
 */
const APPROVAL_ROLES = ['admin'];

const MAX_TEXT_LENGTH = 500;
const VALID_STATUSES: MembershipStatus[] = ['none', 'pending', 'approved', 'rejected'];

/**
 * `helamPlatform.sendEmail` interpolates its `text` straight into
 * `<p>${text}</p>` with no escaping, so anything member-controlled has to be
 * escaped by the caller. same helper and same reason as the toolbox aspect.
 */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * trim and cap a free-text answer. the onboarding form is the widest untrusted
 * input surface this aspect has, and nothing here needs an essay.
 */
function boundedText(value: string | undefined, maxLength = MAX_TEXT_LENGTH): string {
  return (value || '').trim().slice(0, maxLength);
}

export class MembershipNode {
  constructor(
    private membershipConfig: MembershipConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private profileRepository: MemberProfileRepository
  ) {}

  private async requireUser(context: ResolverContext) {
    const user = await this.helamPlatform.getCurrentUser(context || {});
    if (!user) throw new Unauthorized();
    return user;
  }

  private async requireAdmin(context: ResolverContext) {
    const user = await this.requireUser(context);
    if (!APPROVAL_ROLES.includes(user.role)) throw new AccessDenied();
    return user;
  }

  private static toOwner(user: {
    id: string;
    email: string;
    displayName: string;
    provider: string;
  }): ProfileOwner {
    return {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      provider: user.provider,
    };
  }

  /**
   * project a stored profile onto the shape the member's own browser gets.
   * carries the state and their own name — never the sensitive answers, which
   * the client has no use for once submitted.
   */
  private static toMyMembership(model: MemberProfileModel): MyMembership {
    const status = (model.status || 'none') as MembershipStatus;
    return {
      userId: model.userId,
      status,
      onboardingCompleted: status !== 'none',
      fullName: model.fullName || '',
    };
  }

  /**
   * project a stored profile onto the admin queue shape. this is the only
   * mapping that carries `injuryNote` and `recognitionStatus`, and it is
   * reachable exclusively from the admin-gated resolvers below.
   */
  private static toAdminProfile(model: MemberProfileModel): AdminMemberProfile {
    return {
      userId: model.userId,
      status: (model.status || 'none') as MembershipStatus,
      accountEmail: model.accountEmail || '',
      accountDisplayName: model.accountDisplayName || '',
      provider: model.provider || 'email',
      fullName: model.fullName || '',
      phone: model.phone || '',
      contactEmail: model.contactEmail || '',
      age: model.age || 0,
      city: model.city || '',
      communityRoles: model.communityRoles || '',
      gender: model.gender || '',
      injuryNote: model.injuryNote || '',
      recognitionStatus: model.recognitionStatus || '',
      welcomeCallsOptIn: Boolean(model.welcomeCallsOptIn),
      interests: model.interests || [],
      submittedAt: model.submittedAt,
      decidedAt: model.decidedAt,
      decisionNote: model.decisionNote || '',
      createdAt: model.createdAt,
    };
  }

  /**
   * the signed-in member's own membership state. returns null for anonymous
   * visitors rather than throwing — the onboarding gate runs on every page,
   * including public ones.
   */
  async getMyMembership(context: ResolverContext): Promise<MyMembership | null> {
    const user = await this.helamPlatform.getCurrentUser(context || {});
    if (!user) return null;

    const profile = await this.profileRepository.ensureProfile(
      MembershipNode.toOwner(user.toObject())
    );
    return MembershipNode.toMyMembership(profile);
  }

  /**
   * whether an account is an approved community member.
   *
   * this is the cross-aspect authorization primitive: feature aspects that
   * gate member-only actions (submitting a tool, and later commenting and
   * rating) call it with the id of the user they already authenticated.
   * returns false for every other state, including a member whose approval
   * was revoked.
   */
  async isApprovedMember(userId: string): Promise<boolean> {
    const profile = await this.profileRepository.getProfile(userId);
    return profile?.status === 'approved';
  }

  /**
   * store the signed-in member's onboarding answers and put them in the
   * approval queue. the owner comes from the session, so this cannot be
   * pointed at another member's profile.
   */
  async submitMemberProfile(
    input: SubmitMemberProfileInput,
    context: ResolverContext
  ): Promise<MyMembership> {
    const user = await this.requireUser(context);

    const fullName = boundedText(input.fullName, 120);
    const phone = boundedText(input.phone, 40);
    if (!fullName) throw new Error('חסר שם מלא');
    if (!phone) throw new Error('חסר מספר טלפון');

    const profile = await this.profileRepository.submitProfile(
      MembershipNode.toOwner(user.toObject()),
      {
        fullName,
        phone,
        contactEmail: boundedText(input.contactEmail, 200),
        age: Math.max(0, Math.min(120, Math.round(input.age || 0))),
        city: boundedText(input.city, 120),
        communityRoles: boundedText(input.communityRoles, 200),
        gender: input.gender,
        injuryNote: boundedText(input.injuryNote),
        recognitionStatus: input.recognitionStatus,
        welcomeCallsOptIn: Boolean(input.welcomeCallsOptIn),
        interests: (input.interests || []).slice(0, 20).map((item) => boundedText(item, 60)),
      }
    );

    return MembershipNode.toMyMembership(profile);
  }

  /**
   * the admin approval queue. admins only.
   */
  async listMemberProfiles(
    options: ListMemberProfilesOptions | undefined,
    context: ResolverContext
  ): Promise<AdminMemberProfile[]> {
    await this.requireAdmin(context);
    const profiles = await this.profileRepository.listProfiles(options || {});
    return profiles.map((profile) => MembershipNode.toAdminProfile(profile));
  }

  /**
   * per-state counts for the approval queue tabs. admins only.
   */
  async countMemberProfiles(context: ResolverContext): Promise<Record<MembershipStatus, number>> {
    await this.requireAdmin(context);
    return this.profileRepository.countByStatus();
  }

  /**
   * record an admin's decision on a member's application, and let the member
   * know by email when they are approved or declined.
   */
  async setMembershipStatus(
    input: SetMembershipStatusInput,
    context: ResolverContext
  ): Promise<AdminMemberProfile> {
    const admin = await this.requireAdmin(context);
    if (!VALID_STATUSES.includes(input.status)) throw new Error('סטטוס לא חוקי');

    const updated = await this.profileRepository.setStatus(
      input.userId,
      input.status,
      admin.id,
      boundedText(input.note, 300)
    );
    if (!updated) throw new NotFound();

    await this.notifyDecision(updated);
    return MembershipNode.toAdminProfile(updated);
  }

  /**
   * email the member their approval decision. failures only log — the decision
   * is already persisted by the time this runs, and a mail outage must not
   * roll it back or error out to the admin.
   */
  private async notifyDecision(profile: MemberProfileModel): Promise<void> {
    const status = profile.status as MembershipStatus;
    if (status !== 'approved' && status !== 'rejected') return;

    const to = profile.contactEmail || profile.accountEmail;
    if (!to) return;

    const name = escapeHtml(profile.fullName || profile.accountDisplayName || 'חבר.ת קהילה');
    const subject =
      status === 'approved' ? 'ברוכים הבאים להלם קלאב' : 'עדכון לגבי הבקשה שלך להלם קלאב';
    const text =
      status === 'approved'
        ? `היי ${name}, אישרנו את החברות שלך בקהילת הלם קלאב. מעכשיו אפשר להיכנס לארגז הכלים, להגיש כלים משלך ולהשתתף בפעילות הקהילה. שמחים שהצטרפת 🩷`
        : `היי ${name}, בדקנו את הבקשה שלך להצטרף לקהילת הלם קלאב וכרגע לא אישרנו אותה. אם נראה לך שזו טעות או שיש משהו שתרצה.י להוסיף, אפשר להשיב למייל הזה ונשמח לבדוק שוב.`;

    try {
      await this.helamPlatform.sendEmail(to, subject, text);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[membership] decision email failed for user ${profile.userId}`);
    }
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: MembershipConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: MembershipConfig
  ) {
    const profileModel = getModelForClass(MemberProfileModel);
    const profileRepository = new MemberProfileRepository(profileModel);

    const membership = new MembershipNode(
      config,
      symphonyPlatform,
      helamPlatform,
      profileRepository
    );

    helamPlatform.registerBackendServer([
      {
        routes: [],
        gql: membershipGqlSchema(membership),
      },
    ]);

    helamPlatform.registerOnStart(async () => {
      await profileModel.syncIndexes();
    });

    // deliberately no `registerSeed` here: seeding invented member profiles
    // would mean inventing people's injuries and phone numbers.

    return membership;
  }
}

export default MembershipNode;
