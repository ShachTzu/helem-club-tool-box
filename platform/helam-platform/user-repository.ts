import { ReturnModelType } from '@typegoose/typegoose';
import { User, type PlainUser } from '@helemclub/platform.entities.user';
import { UserModel } from './user.model.js';

export type CreateUserProps = {
  /**
   * email address of the new user.
   */
  email: string;

  /**
   * display name shown across the platform.
   */
  displayName?: string;

  /**
   * optional avatar image url.
   */
  avatarUrl?: string;

  /**
   * the provider used to authenticate (email OTP or Google).
   */
  provider?: string;

  /**
   * community role assigned to the user.
   */
  role?: string;
};

/**
 * maps a persisted user document to the platform's serializable User entity.
 */
function toPlainUser(doc: UserModel): PlainUser {
  return {
    id: doc.userId,
    email: doc.email,
    displayName: doc.displayName,
    avatarUrl: doc.avatarUrl,
    role: (doc.role || 'member') as PlainUser['role'],
    provider: (doc.provider || 'email') as PlainUser['provider'],
    createdAt: doc.createdAt || new Date().toISOString(),
  };
}

/**
 * data-access layer for platform users, wrapping the typegoose User model.
 */
export class UserRepository {
  constructor(private userModel: ReturnModelType<typeof UserModel>) {}

  /**
   * create a new user with the given details.
   */
  async createUser(options: CreateUserProps): Promise<User> {
    const userId = crypto.randomUUID();
    const displayName = options.displayName || options.email.split('@')[0];
    const doc = await this.userModel.create({
      userId,
      email: options.email.toLowerCase(),
      displayName,
      avatarUrl: options.avatarUrl,
      provider: options.provider || 'email',
      role: options.role || 'member',
      onboardingCompleted: false,
      interests: [],
      createdAt: new Date().toISOString(),
    });

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * find a user by their stable id.
   */
  async findById(userId: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ userId });
    return doc ? User.from(toPlainUser(doc.toObject())) : null;
  }

  /**
   * find a user by their email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email: email.toLowerCase() });
    return doc ? User.from(toPlainUser(doc.toObject())) : null;
  }

  /**
   * find an existing user by email, or create one when none exists yet.
   */
  async findOrCreate(options: CreateUserProps): Promise<User> {
    const existing = await this.findByEmail(options.email);
    if (existing) return existing;
    return this.createUser(options);
  }

  /**
   * count the persisted users, used to decide whether to seed on start.
   */
  async count(): Promise<number> {
    return this.userModel.countDocuments();
  }
}
