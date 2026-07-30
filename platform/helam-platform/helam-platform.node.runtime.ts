import { randomUUID } from 'node:crypto';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import { User } from '@helemclub/platform.entities.user';
import type { BackendServerDefinition } from '@bitdev/symphony.backends.backend-server';
import type { HelamPlatformConfig } from './helam-platform-config.js';
import { helamPlatformGqlSchema } from './helam-platform.graphql.js';
import { UserRepository } from './user-repository.js';
import { UserModel } from './user.model.js';
import { OtpModel } from './otp.model.js';
import { OtpRepository } from './otp-repository.js';
import { verifyGoogleIdToken } from './google.js';

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
    private otpRepository: OtpRepository,
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
   * issue a real one-time-password for the given email: generate a 6-digit
   * code, store only its hash with a short TTL, and email it (or log it in dev
   * when no mail provider is configured). returns false on an invalid email or
   * when a code was requested too recently.
   */
  async requestEmailOtp(email: string): Promise<boolean> {
    if (!email || !email.includes('@')) return false;
    const result = await this.otpRepository.issue(email);
    if (!result.ok) return false;
    await this.sendOtp(email.toLowerCase(), result.code);
    return true;
  }

  /**
   * verify an email one-time-password and establish a session. on success the
   * code is consumed, the user is found or provisioned, their email is marked
   * verified, and admins are promoted by the configured allow-list.
   */
  async verifyEmailOtp(email: string, code: string): Promise<AuthSession | undefined> {
    if (!email || !code) return undefined;
    const result = await this.otpRepository.verify(email, code);
    if (!result.ok) return undefined;

    const user = await this.userRepository.findOrCreate({
      email: email.toLowerCase(),
      provider: 'email',
    });
    const updated =
      (await this.userRepository.setAuthState(user.id, {
        emailVerified: true,
        role: this.adminRoleFor(email, user.toObject().role),
      })) || user;
    return { user: updated, token: this.issueToken() };
  }

  /**
   * exchange a Google ID token for a platform session. the token is verified
   * server-side against the configured client id — an unconfigured client
   * disables Google sign-in rather than trusting the token.
   */
  async signInWithGoogle(idToken: string): Promise<AuthSession | undefined> {
    if (!idToken) return undefined;
    const clientId = this.config.googleClientId;
    if (!clientId) throw new Error('Google sign-in is not configured');

    const identity = await verifyGoogleIdToken(idToken, clientId);
    if (!identity) return undefined;

    const user = await this.userRepository.findOrCreate({
      email: identity.email,
      provider: 'google',
      emailVerified: identity.emailVerified,
      googleSub: identity.sub,
    });
    const updated =
      (await this.userRepository.setAuthState(user.id, {
        emailVerified: true,
        googleSub: identity.sub,
        role: this.adminRoleFor(identity.email, user.toObject().role),
      })) || user;
    return { user: updated, token: this.issueToken() };
  }

  /**
   * whether the given user holds the admin role.
   */
  isAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  /**
   * the role to promote a signing-in user to, or undefined to leave unchanged.
   * only promotes emails on the configured admin allow-list.
   */
  private adminRoleFor(email: string, currentRole: string): string | undefined {
    const admins = this.config.adminEmails || [];
    if (admins.includes(email.toLowerCase()) && currentRole !== 'admin') return 'admin';
    return undefined;
  }

  /**
   * send an OTP by email via Resend, or log it to the console in non-production
   * when no mail provider is configured. throws in production without a key.
   */
  private async sendOtp(email: string, code: string): Promise<void> {
    const { resendApiKey, otpFromEmail } = this.config;
    if (resendApiKey && otpFromEmail) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: otpFromEmail,
          to: email,
          subject: 'קוד הכניסה שלך ל-Helam Club',
          html: `<div dir="rtl" style="font-family:Assistant,Arial,sans-serif;font-size:16px">קוד הכניסה שלך: <strong style="font-size:28px;letter-spacing:4px">${code}</strong><br/>הקוד תקף ל-10 דקות. אם לא ביקשת אותו, אפשר להתעלם.</div>`,
        }),
      });
      if (!res.ok) throw new Error(`OTP email failed to send (Resend ${res.status}).`);
      return;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY and OTP_FROM_EMAIL are required to send OTP emails in production.');
    }

    // ponytail: dev-only fallback so local testing works without a mail provider.
    // eslint-disable-next-line no-console
    console.log(`[helam-platform] DEV OTP for ${email}: ${code} (valid 10 min).`);
  }

  private issueToken(): string {
    return randomUUID();
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: HelamPlatformConfig = {
    mongoUrl: process.env.MONGO_URL,
    sessionSecretKey: process.env.SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    resendApiKey: process.env.RESEND_API_KEY,
    otpFromEmail: process.env.OTP_FROM_EMAIL || 'onboarding@resend.dev',
    adminEmails: (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  };

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: HelamPlatformConfig
  ) {
    const dc = HelamPlatformNode.defaultConfig;

    const mongoUrl = process.env.MONGO_URL || config.mongoUrl;
    if (!mongoUrl) {
      throw new Error('MONGO_URL is required — refusing to start without a database.');
    }
    const sessionSecret = process.env.SESSION_SECRET || config.sessionSecretKey;
    if (!sessionSecret) {
      throw new Error('SESSION_SECRET is required — refusing to start without a session secret.');
    }

    await mongoose.connect(mongoUrl);

    const resolved: HelamPlatformConfig = {
      mongoUrl,
      sessionSecretKey: sessionSecret,
      googleClientId: config.googleClientId ?? dc.googleClientId,
      resendApiKey: config.resendApiKey ?? dc.resendApiKey,
      otpFromEmail: config.otpFromEmail ?? dc.otpFromEmail,
      adminEmails: config.adminEmails ?? dc.adminEmails,
    };

    const userModel = getModelForClass(UserModel);
    const userRepository = new UserRepository(userModel);
    const otpModel = getModelForClass(OtpModel);
    const otpRepository = new OtpRepository(otpModel, sessionSecret);
    const helamPlatform = new HelamPlatformNode(
      resolved,
      userRepository,
      otpRepository,
      symphonyPlatform
    );

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
     * session middleware backing the password-less auth flow. cookies are
     * http-only by express-session default; secure in production (needs the
     * app behind a trusted proxy for TLS termination), and lax same-site so the
     * OAuth redirect back from Google keeps the session.
     */
    symphonyPlatform.registerMiddlewares([
      bodyParser.urlencoded({ extended: true }),
      session({
        store: MongoStore.create({ mongoUrl }),
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        },
      }),
      async (req: any, _res: any, next: any) => {
        if (!req?.session?.userId) return next();
        const user = await helamPlatform.getUser(req.session.userId);
        if (user) req.session.user = user;
        return next();
      },
    ]);

    return helamPlatform;
  }
}

export default HelamPlatformNode;
