import type { ReturnModelType } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';
import { AppReviewModel } from './app-review.model.js';

/**
 * encapsulates all MongoDB/Typegoose CRUD operations for toolbox app reviews.
 */
export class AppReviewRepository {
  constructor(private appReviewModel: ReturnModelType<typeof AppReviewModel>) {}

  /**
   * list the reviews for an app, most helpful first.
   */
  async listReviewsByAppId(appId: string): Promise<AppReviewModel[]> {
    const docs = await this.appReviewModel
      .find({ appId })
      .sort({ helpfulCount: -1, createdAt: -1 })
      .exec();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * add a new review to an app.
   */
  async createReview(
    appId: string,
    stars: number,
    comment?: string,
    displayName?: string,
    userId?: string
  ): Promise<AppReviewModel> {
    const id = uuidv4();
    const created = await this.appReviewModel.create({
      id,
      appId,
      stars,
      comment: comment || '',
      displayName: displayName || 'אנונימי',
      helpfulCount: 0,
      userId: userId || '',
      createdAt: new Date(),
    });

    return created.toObject();
  }
}
