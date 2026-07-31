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
import { EmailOtpModel } from './email-otp.model.js';
import { EmailOtpService } from './email-otp-service.js';
import { Mailer } from './mailer.js';
import { GoogleVerifier } from './google.js';

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
    private symphonyPlatform: SymphonyPlatformNode,
    private emailOtpService: EmailOtpService,
    private googleVerifier: GoogleVerifier | undefined,
    private adminEmails: string[] = [],
    private googleClientId?: string,
    private seedEnabled: boolean = false
  ) {}

  /**
   * the public Google OAuth client id, served to the browser so the sign-in
   * button can initialize without the id being baked into the bundle at build
   * time. undefined when Google sign-in is not configured, in which case the
   * UI offers email sign-in only.
   */
  getGoogleClientId(): string | undefined {
    return this.googleClientId;
  }

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
   * whether demo/seed content may be written to the database.
   *
   * seeding exists so a fresh development database is not an empty shell. in
   * production the same code would publish invented Hebrew names and fake
   * reviews as if they were real community content, so it is switched off by
   * setting DISABLE_SEED_DATA to a truthy value (and off by default whenever
   * NODE_ENV is production).
   */
  get seedingEnabled(): boolean {
    return this.seedEnabled;
  }

  /**
   * register a start callback that only runs when seeding is permitted.
   *
   * feature aspects use this for inserting demo content, and keep genuine
   * start-up work (index syncing, migrations) on `registerOnStart` so it still
   * runs in production.
   *
   * @param callback the seeding routine to run on start.
   */
  registerSeed(callback: () => Promise<void>) {
    if (!this.seedEnabled) return this;
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
   * send a one-time sign-in code to an email address.
   *
   * this is the way in for members who do not use Google. the code is random,
   * stored only as a keyed hash, expires, and is rate-limited per address.
   *
   * @param email the address to send the code to.
   * @param displayName optional name captured during signup, applied to the
   * account when the code is verified.
   * @returns whether a code was issued, and a Hebrew reason when it was not.
   */
  async requestEmailOtp(
    email: string,
    displayName?: string
  ): Promise<{ sent: boolean; reason?: string }> {
    return this.emailOtpService.request(email, displayName);
  }

  /**
   * verify an emailed one-time code and open a session for that address.
   *
   * an account is created on first successful verification, so email sign-in
   * doubles as sign-up. the email is marked verified only here — proving
   * ownership of the address is the entire point of the code.
   *
   * @param email the address the code was sent to.
   * @param code the code the member submitted.
   * @returns the authenticated session, or undefined when the code is wrong,
   * expired, already used, or out of attempts.
   */
  async verifyEmailOtp(email: string, code: string): Promise<AuthSession | undefined> {
    const result = await this.emailOtpService.verify(email, code);
    if (!result.ok) return undefined;

    const normalized = email.trim().toLowerCase();
    const user = await this.userRepository.findOrCreateVerifiedByEmail({
      email: normalized,
      displayName: result.displayName,
      role: this.adminEmails.includes(normalized) ? 'admin' : undefined,
    });

    return { user, token: user.id };
  }

  /**
   * exchange a Google ID token for a platform session.
   *
   * the token is cryptographically verified against Google's certificates —
   * signature, issuer, audience and expiry — before any account is touched.
   * an unverifiable token yields no session.
   *
   * @param idToken the raw JWT issued by Google Identity Services in the browser.
   * @returns the authenticated session, or undefined when verification fails.
   */
  async signInWithGoogle(idToken: string): Promise<AuthSession | undefined> {
    if (!idToken || !this.googleVerifier) return undefined;

    const identity = await this.googleVerifier.verify(idToken);
    if (!identity) return undefined;

    const user = await this.userRepository.findOrCreateFromGoogle(identity, this.adminEmails);
    return { user, token: user.id };
  }

  /**
   * whether the given user holds the admin role.
   */
  isAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: HelamPlatformConfig = {
    mongoUrl: process.env.MONGO_URL,
    sessionSecretKey: process.env.SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    adminEmails: process.env.ADMIN_EMAILS,
    disableSeedData: process.env.DISABLE_SEED_DATA,
    resendApiKey: process.env.RESEND_API_KEY,
    mailFromAddress: process.env.MAIL_FROM_ADDRESS,
  };

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: HelamPlatformConfig
  ) {
    const mongoUrl = process.env.MONGO_URL || config.mongoUrl;
    if (!mongoUrl) {
      throw new Error(
        '[helam-platform] MONGO_URL is not set. the platform cannot start without a database — ' +
          'booting without one would fail later with unrelated errors.'
      );
    }

    const sessionSecret = process.env.SESSION_SECRET || config.sessionSecretKey;
    if (!sessionSecret) {
      throw new Error(
        '[helam-platform] SESSION_SECRET is not set. refusing to start with a guessable ' +
          'session key, which would let anyone forge a signed session cookie.'
      );
    }

    // Google is one of two ways in, alongside emailed one-time codes, so a
    // missing client id disables that button rather than blocking boot.
    const googleClientId = process.env.GOOGLE_CLIENT_ID || config.googleClientId;
    if (!googleClientId) {
      // eslint-disable-next-line no-console
      console.warn(
        '[helam-platform] GOOGLE_CLIENT_ID is not set — Google sign-in is disabled. ' +
          'Members can still sign in with an emailed code.'
      );
    }

    await mongoose.connect(mongoUrl);

    const adminEmails = (process.env.ADMIN_EMAILS || config.adminEmails || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    /**
     * demo content is opt-out in development and off by default in production:
     * shipping invented member names and reviews to real visitors is worse than
     * an empty catalog.
     */
    const disableSeedFlag = process.env.DISABLE_SEED_DATA ?? config.disableSeedData;
    const seedEnabled =
      disableSeedFlag === undefined
        ? process.env.NODE_ENV !== 'production'
        : !['1', 'true', 'yes'].includes(String(disableSeedFlag).trim().toLowerCase());

    const userModel = getModelForClass(UserModel);
    const otpModel = getModelForClass(EmailOtpModel);
    const userRepository = new UserRepository(userModel);

    const mailer = new Mailer({
      apiKey: process.env.RESEND_API_KEY || config.resendApiKey,
      fromAddress: process.env.MAIL_FROM_ADDRESS || config.mailFromAddress,
      requireDelivery: process.env.NODE_ENV === 'production',
    });

    // the session secret doubles as the HMAC key for stored codes, so a
    // database dump alone cannot be replayed into sessions.
    const emailOtpService = new EmailOtpService(otpModel, mailer, sessionSecret);
    const googleVerifier = googleClientId ? new GoogleVerifier(googleClientId) : undefined;

    const helamPlatform = new HelamPlatformNode(
      config,
      userRepository,
      symphonyPlatform,
      emailOtpService,
      googleVerifier,
      adminEmails,
      googleClientId,
      seedEnabled
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
     * session middleware backing both sign-in flows. `saveUninitialized`
     * is false so anonymous visitors and crawlers do not each create a stored
     * session, and `sameSite: 'lax'` allows the OAuth redirect to return with
     * the cookie intact (strict would drop it).
     */
    symphonyPlatform.registerMiddlewares([
      bodyParser.urlencoded({ extended: true }),
      session({
        store: MongoStore.create({ mongoUrl }),
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: 'auto',
          sameSite: 'lax',
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30,
        },
      }),
      async (req: any, _res: any, next: any) => {
        if (!req?.session?.userId) return next();
        const user = await helamPlatform.getUser(req.session.userId);
        if (user) req.session.user = user;
        return next();
      },
    ]);

    /**
     * ensure the unique+sparse index on googleSub exists, so two accounts can
     * never be created for the same Google subject.
     *
     * no users are seeded. the previous seed provisioned mock accounts —
     * including an admin — that anyone could sign into while email OTP accepted
     * any code. admins are now granted by listing their address in ADMIN_EMAILS,
     * which is applied when that person signs in, either way.
     */
    symphonyPlatform.registerOnStart(async () => {
      await userModel.syncIndexes();
      // creates the TTL index that expires stale sign-in codes.
      await otpModel.syncIndexes();

      if (!mailer.canDeliver) {
        // eslint-disable-next-line no-console
        console.warn(
          '[helam-platform] RESEND_API_KEY is not set — sign-in codes are printed to this ' +
            'console instead of being emailed. Development only.'
        );
      }

      if (!seedEnabled) {
        // eslint-disable-next-line no-console
        console.log('[helam-platform] seed data is disabled — no demo content will be inserted.');
      }

      if (!adminEmails.length) {
        // eslint-disable-next-line no-console
        console.warn(
          '[helam-platform] ADMIN_EMAILS is empty — no one will be granted the admin role on sign-in.'
        );
      }

      return undefined;
    });

    return helamPlatform;
  }
}

export default HelamPlatformNode;
