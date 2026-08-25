import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL mutation applying a moderation decision to one or more pending
 * toolbox apps. a single decision is a batch of one.
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
      moderatorNote
    }
  }
`;

/**
 * the moderation decisions a moderator can apply. "request_changes" sends the
 * submission back to its owner for edits instead of closing it.
 */
export type ReviewAction = 'approve' | 'reject' | 'request_changes';

export type ReviewAppOptions = {
  /**
   * ids of the pending apps being reviewed. pass one id for a single decision.
   */
  appIds: string[];

  /**
   * moderation action to apply.
   */
  action: ReviewAction;

  /**
   * the moderator's explanation, shown to the submitter. required by the
   * server for "reject" and "request_changes".
   */
  note?: string;
};

/**
 * applies a moderation decision to one or more pending toolbox apps.
 * intended for use by moderators and admins.
 */
export function useReviewApp() {
  const [reviewToolboxAppMutation, { loading, error }] = useMutation<
    { reviewToolboxApp: PlainApp[] },
    { options: ReviewAppOptions }
  >(REVIEW_TOOLBOX_APP_MUTATION);

  const reviewApp = async (options: ReviewAppOptions) => {
    const result = await reviewToolboxAppMutation({ variables: { options } });
    return (result.data?.reviewToolboxApp || []).map((reviewed) => App.from(reviewed));
  };

  return {
    reviewApp,
    loading,
    error,
  };
}
