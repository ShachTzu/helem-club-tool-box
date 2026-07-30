import type { PlainAppReview } from '@helemclub/toolbox.entities.app-review';
import { useListAppReviews } from './use-list-app-reviews.js';
import { useRateApp, type RateAppOptions } from './use-rate-app.js';

export type UseAppReviewsOptions = {
  /**
   * provide mock reviews to skip the network request, useful for tests and previews.
   */
  mockData?: PlainAppReview[];
};

export type SubmitRatingOptions = Omit<RateAppOptions, 'appId'>;

/**
 * lists the reviews submitted for a toolbox app and exposes a rateApp function
 * for submitting a new star rating (with an optional comment and display name).
 * accepts an optional mockData option to bypass the network request for
 * tests and previews.
 */
export function useAppReviews(appId: string, options?: UseAppReviewsOptions) {
  const { reviews, loading, error, refetch } = useListAppReviews(appId, { mockData: options?.mockData });
  const { rateApp: submitRating, review, loading: submitting, error: submitError } = useRateApp();

  const rateApp = async (rating: SubmitRatingOptions) => {
    const createdReview = await submitRating({ appId, ...rating });

    if (!options?.mockData) {
      await refetch?.();
    }

    return createdReview;
  };

  return {
    reviews,
    loading,
    error,
    rateApp,
    review,
    submitting,
    submitError,
  };
}
