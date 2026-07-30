import { mockAppReviews } from '@helemclub/toolbox.entities.app-review';

/**
 * a list of plain app reviews for the "ground-me" app, useful for testing and
 * previewing the useAppReviews hook without a live GraphQL server.
 */
export function mockAppReviewsData() {
  return mockAppReviews().map((review) => review.toObject());
}
