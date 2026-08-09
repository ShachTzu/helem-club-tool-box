import type { ReturnModelType } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';
import { AppReviewModel } from './app-review.model.js';
import type { RatingStats, RatingWeeklyTrendPoint } from './toolbox-options.js';

/**
 * how many trailing weeks the rating stats trend covers.
 */
const TREND_WEEKS = 8;

/**
 * the Sunday (UTC, date-only) that starts the week containing the given date.
 */
function startOfWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d;
}

/**
 * bucket a list of dates into a fixed trailing window of weekly counts,
 * including weeks with zero activity so the trend line has no gaps.
 */
function buildWeeklyTrend(dates: Date[]): RatingWeeklyTrendPoint[] {
  const now = new Date();
  const weeks: RatingWeeklyTrendPoint[] = [];
  for (let i = TREND_WEEKS - 1; i >= 0; i -= 1) {
    const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
    weeks.push({ weekStart: weekStart.toISOString().slice(0, 10), count: 0 });
  }

  const indexByWeekStart = new Map(weeks.map((week, idx) => [week.weekStart, idx]));
  dates.forEach((date) => {
    const key = startOfWeek(date).toISOString().slice(0, 10);
    const idx = indexByWeekStart.get(key);
    if (idx !== undefined) weeks[idx].count += 1;
  });

  return weeks;
}

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

  /**
   * aggregate rating counters for the toolbox engagement dashboard: total
   * review count, overall average stars, and an 8-week trend of new reviews.
   */
  async getRatingStats(): Promise<RatingStats> {
    const reviews = await this.appReviewModel.find().exec();
    const count = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.stars, 0);

    return {
      reviewCount: count,
      averageStars: count > 0 ? Number((sum / count).toFixed(1)) : 0,
      weeklyTrend: buildWeeklyTrend(reviews.map((review) => new Date(review.createdAt))),
    };
  }
}
