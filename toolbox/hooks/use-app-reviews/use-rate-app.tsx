import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { AppReview, type PlainAppReview } from '@helemclub/toolbox.entities.app-review';

export const RATE_TOOLBOX_APP_MUTATION = gql`
  mutation RateToolboxApp($options: RateToolboxAppOptions!) {
    rateToolboxApp(options: $options) {
      id
      appId
      stars
      comment
      displayName
      helpfulCount
      createdAt
    }
  }
`;

export type RateAppOptions = {
  /**
   * id of the app being rated.
   */
  appId: string;

  /**
   * star rating given by the reviewer, typically 1-5.
   */
  stars: number;

  /**
   * optional free-text comment left by the reviewer.
   */
  comment?: string;

  /**
   * optional display name of the reviewer.
   */
  displayName?: string;
};

/**
 * submits a star rating (and optional comment) for a toolbox app.
 */
export function useRateApp() {
  const [rateToolboxAppMutation, { data, loading, error }] = useMutation<
    { rateToolboxApp: PlainAppReview },
    { options: RateAppOptions }
  >(RATE_TOOLBOX_APP_MUTATION);

  const rateApp = async (options: RateAppOptions) => {
    const result = await rateToolboxAppMutation({ variables: { options } });
    const createdReview = result.data?.rateToolboxApp;
    return createdReview ? AppReview.from(createdReview) : undefined;
  };

  const review = data?.rateToolboxApp ? AppReview.from(data.rateToolboxApp) : undefined;

  return {
    rateApp,
    review,
    loading,
    error,
  };
}
