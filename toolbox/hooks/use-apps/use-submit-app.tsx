import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL mutation submitting a new app to the toolbox for moderation review.
 */
export const SUBMIT_TOOLBOX_APP_MUTATION = gql`
  mutation SubmitToolboxApp($options: SubmitToolboxAppOptions!, $id: String) {
    submitToolboxApp(options: $options, id: $id) {
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

export type SubmitAppOptions = {
  /**
   * display name of the app being submitted.
   */
  name: string;

  /**
   * short one-line subtitle describing the app.
   */
  subtitle: string;

  /**
   * full description of the app.
   */
  fullDescription: string;

  /**
   * external link to the app (store page, website, etc).
   */
  externalLink: string;

  /**
   * icon representing the app (emoji or image url).
   */
  icon?: string;

  /**
   * screenshot image urls showcasing the app.
   */
  screenshots?: string[];

  /**
   * cost model of the app, e.g. "free", "freemium", "paid".
   */
  costType: string;

  /**
   * platforms the app is available on, e.g. ["iOS", "Android", "Web"].
   */
  platform?: string[];

  /**
   * primary language of the app.
   */
  language: string;

  /**
   * coping domains the app is relevant for.
   */
  domains?: string[];

  /**
   * name of the developer or team submitting the app.
   */
  developerName?: string;

  /**
   * contact email for the submitter. PII — stored for moderators only, never
   * returned by any public query or included in the mutation response.
   */
  contactEmail?: string;

  /**
   * where the submission originated, e.g. 'hackathon-1'.
   */
  submissionSource?: string;
};

/**
 * submits a new app to the toolbox catalog. the submitted app is created
 * with a "pending" status until it is reviewed by a moderator.
 */
export function useSubmitApp() {
  const [submitToolboxAppMutation, { data, loading, error }] = useMutation<
    { submitToolboxApp: PlainApp },
    { options: SubmitAppOptions; id?: string }
  >(SUBMIT_TOOLBOX_APP_MUTATION);

  const submitApp = async (options: SubmitAppOptions, id?: string) => {
    const result = await submitToolboxAppMutation({ variables: { options, id } });
    const submittedApp = result.data?.submitToolboxApp;
    return submittedApp ? App.from(submittedApp) : undefined;
  };

  const app = data?.submitToolboxApp ? App.from(data.submitToolboxApp) : undefined;

  return {
    submitApp,
    app,
    loading,
    error,
  };
}
