import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import type { User, MembershipStatus } from '@helemclub/platform.entities.user';
import type { HelamPlatformNode } from './helam-platform.node.runtime.js';

const MEMBERSHIP_STATUSES: MembershipStatus[] = ['pending', 'approved', 'rejected'];

/**
 * serialize a User entity into the GraphQL PlatformUser shape expected by the
 * platform's use-auth hooks (id, email, displayName, avatarUrl, role, provider,
 * createdAt).
 */
function serializeUser(user: User) {
  const plain = user.toObject();
  return {
    id: plain.id,
    email: plain.email,
    displayName: plain.displayName,
    avatarUrl: plain.avatarUrl,
    role: plain.role,
    provider: plain.provider,
    createdAt: plain.createdAt,
    onboardingCompleted: plain.onboardingCompleted ?? false,
    interests: plain.interests ?? [],
    membershipStatus: plain.membershipStatus ?? 'pending',
    contentAdmin: plain.contentAdmin ?? false,
  };
}

/**
 * resolve the signed-in user and assert they may moderate community
 * membership. approving members is a moderator/admin power, so the check is
 * enforced here on the server rather than relying on the admin UI alone.
 */
async function requireMemberModerator(
  helamPlatform: HelamPlatformNode,
  context: any
): Promise<User> {
  const currentUser = await helamPlatform.getCurrentUser(context);
  if (!currentUser) throw new Error('יש להתחבר כדי לבצע פעולה זו');
  if (!currentUser.canModerateMembers()) {
    throw new Error('אין לך הרשאה לנהל חברות בקהילה');
  }
  return currentUser;
}

/**
 * the platform's GraphQL schema. implements the authentication contract
 * consumed by the use-auth hooks: email one-time-password request/verify,
 * Google sign-in, the public auth configuration, the current user query, and
 * sign out. sessions are managed with express-session.
 */
export function helamPlatformGqlSchema(helamPlatform: HelamPlatformNode): GqlSchema {
  return {
    typeDefs: gql`
      type PlatformUser {
        id: ID!
        email: String
        displayName: String
        avatarUrl: String
        role: String
        provider: String
        createdAt: String
        onboardingCompleted: Boolean
        interests: [String!]

        """
        community membership status: pending, approved or rejected. new
        signups stay pending until a moderator or an admin approves them.
        """
        membershipStatus: String

        """
        scoped content-domain admin: can manage writers, the knowledge
        library and the blog, without holding the site-wide admin role.
        """
        contentAdmin: Boolean
      }

      type AuthSession {
        token: String
        user: PlatformUser
      }

      type RequestEmailOtpResult {
        """
        whether a code was issued and sent.
        """
        sent: Boolean

        """
        a Hebrew, user-facing explanation when no code was sent — an invalid
        address, or a throttled request.
        """
        reason: String
      }

      """
      the public, non-secret configuration the browser needs to start a
      sign-in. served from the API so the Google client id never has to be
      baked into the browser bundle at build time.
      """
      type AuthConfig {
        googleClientId: String
        emailSignInEnabled: Boolean
      }

      input RequestEmailOtpOptions {
        email: String!
        displayName: String
      }

      input VerifyEmailOtpOptions {
        email: String!
        code: String!
      }

      input SignInWithGoogleOptions {
        idToken: String!
      }

      input CompleteOnboardingOptions {
        interests: [String!]
      }

      input ListPlatformUsersOptions {
        query: String
        membershipStatus: String
        limit: Int
      }

      input UpdatePlatformUserRoleOptions {
        userId: ID!
        role: String!
      }

      input UpdateMembershipStatusOptions {
        userId: ID!
        membershipStatus: String!
      }

      input UpdateContentAdminOptions {
        userId: ID!
        contentAdmin: Boolean!
      }

      type Query {
        getCurrentUser: PlatformUser
        authConfig: AuthConfig
        listUsers(options: ListPlatformUsersOptions): [PlatformUser!]!
        pendingMembersCount: Int
      }

      type Mutation {
        requestEmailOtp(options: RequestEmailOtpOptions!): RequestEmailOtpResult
        verifyEmailOtp(options: VerifyEmailOtpOptions!): AuthSession
        signInWithGoogle(options: SignInWithGoogleOptions!): AuthSession
        completeOnboarding(options: CompleteOnboardingOptions!): PlatformUser
        updateUserRole(options: UpdatePlatformUserRoleOptions!): PlatformUser
        updateMembershipStatus(options: UpdateMembershipStatusOptions!): PlatformUser
        updateContentAdmin(options: UpdateContentAdminOptions!): PlatformUser
        signOut: Boolean
      }
    `,
    resolvers: {
      Query: {
        getCurrentUser: async (_parent: unknown, _args: unknown, context: any) => {
          const user = await helamPlatform.getCurrentUser(context);
          return user ? serializeUser(user) : null;
        },

        authConfig: async () => {
          return {
            googleClientId: helamPlatform.getGoogleClientId() || null,
            emailSignInEnabled: true,
          };
        },

        listUsers: async (_parent: unknown, { options }: any, context: any) => {
          await requireMemberModerator(helamPlatform, context);

          const requestedStatus = options?.membershipStatus;
          const membershipStatus = MEMBERSHIP_STATUSES.includes(requestedStatus)
            ? (requestedStatus as MembershipStatus)
            : undefined;

          const users = await helamPlatform.listUsers({
            query: options?.query ?? undefined,
            membershipStatus,
            limit: options?.limit ?? undefined,
          });
          return users.map(serializeUser);
        },

        pendingMembersCount: async (_parent: unknown, _args: unknown, context: any) => {
          await requireMemberModerator(helamPlatform, context);
          return helamPlatform.countPendingMembers();
        },
      },
      Mutation: {
        requestEmailOtp: async (_parent: unknown, { options }: any) => {
          return helamPlatform.requestEmailOtp(options.email, options.displayName);
        },

        verifyEmailOtp: async (_parent: unknown, { options }: any, context: any) => {
          const session = await helamPlatform.verifyEmailOtp(options.email, options.code);
          if (!session) throw new Error('הקוד שגוי או שפג תוקפו');

          context.session.userId = session.user.id;
          await new Promise<void>((resolve, reject) => {
            context.session.save((err: unknown) => (err ? reject(err) : resolve()));
          });

          return { token: session.token, user: serializeUser(session.user) };
        },

        signInWithGoogle: async (_parent: unknown, { options }: any, context: any) => {
          const session = await helamPlatform.signInWithGoogle(options.idToken);
          if (!session) throw new Error('ההתחברות עם Google נכשלה');

          context.session.userId = session.user.id;
          await new Promise<void>((resolve, reject) => {
            context.session.save((err: unknown) => (err ? reject(err) : resolve()));
          });

          return { token: session.token, user: serializeUser(session.user) };
        },

        completeOnboarding: async (_parent: unknown, { options }: any, context: any) => {
          const userId = context?.session?.userId;
          if (!userId) throw new Error('יש להתחבר כדי להשלים את תהליך ההרשמה');

          const user = await helamPlatform.completeOnboarding(userId, {
            interests: options?.interests ?? [],
          });
          return serializeUser(user);
        },

        updateUserRole: async (_parent: unknown, { options }: any, context: any) => {
          const currentUser = await helamPlatform.getCurrentUser(context);
          if (!currentUser) throw new Error('יש להתחבר כדי לבצע פעולה זו');
          // assigning roles is an admin-only power — a moderator may approve
          // members, but may not promote anyone (including themselves).
          if (!currentUser.isAtLeast('admin')) {
            throw new Error('אין לך הרשאה לעדכן תפקידים');
          }

          const user = await helamPlatform.updateUserRole(options.userId, options.role);
          return serializeUser(user);
        },

        updateContentAdmin: async (_parent: unknown, { options }: any, context: any) => {
          const currentUser = await helamPlatform.getCurrentUser(context);
          if (!currentUser) throw new Error('יש להתחבר כדי לבצע פעולה זו');
          // granting the scoped content-admin flag is a full-admin-only power,
          // exactly like assigning roles — a content admin may not grant it to
          // anyone else, including themselves.
          if (!currentUser.isAtLeast('admin')) {
            throw new Error('אין לך הרשאה לעדכן הרשאות תוכן');
          }

          const user = await helamPlatform.updateContentAdmin(
            options.userId,
            options.contentAdmin
          );
          return serializeUser(user);
        },

        updateMembershipStatus: async (_parent: unknown, { options }: any, context: any) => {
          const currentUser = await requireMemberModerator(helamPlatform, context);

          const requestedStatus = options?.membershipStatus;
          if (!MEMBERSHIP_STATUSES.includes(requestedStatus)) {
            throw new Error('סטטוס חברות לא חוקי');
          }

          const user = await helamPlatform.updateMembershipStatus(
            options.userId,
            requestedStatus as MembershipStatus,
            currentUser.id
          );
          return serializeUser(user);
        },

        signOut: async (_parent: unknown, _args: unknown, context: any) => {
          await new Promise<void>((resolve, reject) => {
            context.session.destroy((err: unknown) => (err ? reject(err) : resolve()));
          });
          return true;
        },
      },
    },
  };
}
