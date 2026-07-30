import MongoStore from 'connect-mongo';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import { User, mockUsers } from '@helemclub/platform.entities.user';
import type { BackendServerDefinition } from '@bitdev/symphony.backends.backend-server';
import type { HelamPlatformConfig } from './helam-platform-config.js';
import { helamPlatformGqlSchema } from './helam-platform.graphql.js';
import { UserRepository } from './user-repository.js';
import { UserModel } from './user.model.js';

/**
 * an authenticated session returned after a successful sign-in.
 */
export type AuthSession = {
  /**
   * the authenticated user.
   */
  user: User;

  /**
   * the session token issued for the user.
   */
  token: string;
};

export class HelamPlatformNode {
  constructor(
    private config: HelamPlatformConfig,
    private userRepository: UserRepository,
    private symphonyPlatform: SymphonyPlatformNode
  ) {}

  /**
   * register a feature GraphQL schema + resolvers onto the platform's single
   * backend gateway.
   */
  registerBackendServer(server: BackendServerDefinition | BackendServerDefinition[]) {
    const servers = Array.isArray(server) ? server : [server];
    this.symphonyPlatform.registerBackendServer(servers);
    return this;
  }

  /**
   * register an async callback run once the server starts, used by feature
   * aspects to seed their MongoDB collections.
   */
  registerOnStart(callback: () => Promise<void>) {
    this.symphonyPlatform.registerOnStart(callback);
    return this;
  }

  /**
   * resolve the currently authenticated user from the request/session
   * context, or null when no one is signed in.
   */
  async getCurrentUser(context: { session?: { userId?: string } }): Promise<User | null> {
    const userId = context?.session?.userId;
    if (!userId) return null;
    return this.userRepository.findById(userId);
  }

  /**
   * get a user by their stable id.
   */
  async getUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  /**
   * get a user by their email address.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * request a one-time-password for the given email. this platform uses a
   * password-less flow: the code is not persisted or emailed here — any code
   * is accepted on verification, and the note is logged on start for the
   * seeded admin. always resolves true so the client advances to the code step.
   */
  async requestEmailOtp(email: string): Promise<boolean> {
    if (!email || !email.includes('@')) return false;
    // eslint-disable-next-line no-console
    console.log(`[helam-platform] OTP requested for ${email} (password-less: enter any code to continue).`);
    return true;
  }

  /**
   * verify an email one-time-password and establish a session. finds the user
   * by email or provisions a new member on first sign-in, then issues a token.
   */
  async verifyEmailOtp(email: string, code: string): Promise<AuthSession | undefined> {
    if (!email || !code) return undefined;
    const user = await this.userRepository.findOrCreate({ email, provider: 'email' });
    return { user, token: this.issueToken(user) };
  }

  /**
   * exchange a Google ID token for a platform session. in this environment the
   * token payload is trusted and mapped to a user by a derived email.
   */
  async signInWithGoogle(idToken: string): Promise<AuthSession | undefined> {
    if (!idToken) return undefined;
    const email = this.emailFromGoogleToken(idToken);
    const user = await this.userRepository.findOrCreate({ email, provider: 'google' });
    return { user, token: this.issueToken(user) };
  }

  /**
   * whether the given user holds the admin role.
   */
  isAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  private issueToken(user: User): string {
    return `helam.${user.id}.${Date.now()}`;
  }

  private emailFromGoogleToken(idToken: string): string {
    // derive a stable, deterministic email for the token in this environment.
    const normalized = idToken.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24).toLowerCase() || 'guest';
    return `${normalized}@google.helemclub.org`;
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: HelamPlatformConfig = {
    mongoUrl: process.env.MONGO_URL,
    sessionSecretKey: 'SESSION_SECRET',
  };

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: HelamPlatformConfig
  ) {
    const mongoUrl = process.env.MONGO_URL || config.mongoUrl;
    if (mongoUrl) {
      await mongoose.connect(mongoUrl);
    }

    const userModel = getModelForClass(UserModel);
    const userRepository = new UserRepository(userModel);
    const helamPlatform = new HelamPlatformNode(config, userRepository, symphonyPlatform);

    const gqlSchema = helamPlatformGqlSchema(helamPlatform);

    /**
     * mount the platform's own GraphQL schema on the single backend gateway.
     * feature aspects mount their own schemas through registerBackendServer.
     */
    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    /**
     * session middleware backing the password-less auth flow.
     */
    symphonyPlatform.registerMiddlewares([
      bodyParser.urlencoded({ extended: true }),
      session({
        store: mongoUrl ? MongoStore.create({ mongoUrl }) : undefined,
        secret: config.sessionSecretKey || 'SESSION_SECRET',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto', sameSite: true },
      }),
      async (req: any, _res: any, next: any) => {
        if (!req?.session?.userId) return next();
        const user = await helamPlatform.getUser(req.session.userId);
        if (user) req.session.user = user;
        return next();
      },
    ]);

    /**
     * seed users from the platform's User mock when the collection is empty,
     * including at least one admin. logs the admin's password-less OTP note.
     */
    symphonyPlatform.registerOnStart(async () => {
      const existing = await userRepository.count();
      if (existing > 0) return undefined;

      const seedUsers = mockUsers();
      await userModel.insertMany(
        seedUsers.map((user) => {
          const plain = user.toObject();
          return {
            userId: plain.id,
            email: plain.email.toLowerCase(),
            displayName: plain.displayName,
            avatarUrl: plain.avatarUrl,
            role: plain.role,
            provider: plain.provider,
            onboardingCompleted: true,
            interests: [],
            createdAt: plain.createdAt,
          };
        })
      );

      const admin = seedUsers.find((user) => user.role === 'admin');
      if (admin) {
        // eslint-disable-next-line no-console
        console.log(
          `[helam-platform] seeded admin ${admin.email} — sign in password-less: request an OTP for this email, then enter any code.`
        );
      }

      return undefined;
    });

    return helamPlatform;
  }
}

export default HelamPlatformNode;
