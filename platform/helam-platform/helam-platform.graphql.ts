import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import type { User } from '@helemclub/platform.entities.user';
import type { HelamPlatformNode } from './helam-platform.node.runtime.js';

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
  };
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

      type Query {
        getCurrentUser: PlatformUser
        authConfig: AuthConfig
      }

      type Mutation {
        requestEmailOtp(options: RequestEmailOtpOptions!): RequestEmailOtpResult
        verifyEmailOtp(options: VerifyEmailOtpOptions!): AuthSession
        signInWithGoogle(options: SignInWithGoogleOptions!): AuthSession
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
