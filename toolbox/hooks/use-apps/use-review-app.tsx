import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL mutation applying a moderation decision (e.g. approve or reject)
 * to a pending toolbox app.
 */
export const REVIEW_TOOLBOX_APP_MUTATION = gql`
  mutation ReviewToolboxApp($options: ReviewToolboxAppOptions!) {
    reviewToolboxApp(options: $options) {
      id
      slug
      name
      subtitle
      fullDescription
      externalLink
      icon
      screenshots
      costType
      platform
      language
      requiresSignup
      clickCount
      helpfulYes
      helpfulNo
      isFeatured
      developerName
      originatorName
      domains
      avgRating
      ratingCount
      ratingHistogram
      status
    }
  }
`;

export type ReviewAppOptions = {
  /**
   * id of the pending app being reviewed.
   */
  appId: string;

  /**
   * moderation action to apply, e.g. "approve" or "reject".
   */
  action: string;
};

/**
 * applies a moderation decision to a pending toolbox app, such as approving
 * or rejecting it. intended for use by moderators and admins.
 */
export function useReviewApp() {
  const [reviewToolboxAppMutation, { data, loading, error }] = useMutation<
    { reviewToolboxApp: PlainApp },
    { options: ReviewAppOptions }
  >(REVIEW_TOOLBOX_APP_MUTATION);

  const reviewApp = async (options: ReviewAppOptions) => {
    const result = await reviewToolboxAppMutation({ variables: { options } });
    const reviewedApp = result.data?.reviewToolboxApp;
    return reviewedApp ? App.from(reviewedApp) : undefined;
  };

  const app = data?.reviewToolboxApp ? App.from(data.reviewToolboxApp) : undefined;

  return {
    reviewApp,
    app,
    loading,
    error,
  };
}
