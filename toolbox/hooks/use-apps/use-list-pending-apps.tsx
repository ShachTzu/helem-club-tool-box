import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL query listing toolbox apps awaiting moderation review.
 */
export const LIST_PENDING_TOOLBOX_APPS_QUERY = gql`
  query ListPendingToolboxApps {
    listPendingToolboxApps {
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
      contactEmail
      submittedBy
      submissionSource
    }
  }
`;

/**
 * a pending app plus moderator-only submitter details, returned by the
 * moderator-gated query. these PII fields never reach public queries.
 */
export type PendingModeratorApp = PlainApp & {
  contactEmail?: string;
  submittedBy?: string;
  submissionSource?: string;
};

/**
 * moderator-only submitter details, keyed by app id, kept out of the public
 * App entity so PII never rides along the shared app shape.
 */
export type ModeratorMeta = Record<
  string,
  { contactEmail: string; submittedBy: string; submissionSource: string }
>;

export type UseListPendingAppsOptions = {
  /**
   * provide mock pending apps to skip the network request, useful for tests and previews.
   */
  mockData?: PlainApp[];
};

/**
 * lists toolbox apps that are awaiting moderation review, for use by
 * moderators and admins.
 */
export function useListPendingApps(options?: UseListPendingAppsOptions) {
  const results = useQuery<{ listPendingToolboxApps: PendingModeratorApp[] }>(
    LIST_PENDING_TOOLBOX_APPS_QUERY,
    { skip: !!options?.mockData }
  );

  const rawApps = options?.mockData ? options.mockData : results.data?.listPendingToolboxApps;

  const apps = useMemo(() => {
    return (rawApps || []).map((app) => App.from(app));
  }, [rawApps]);

  const moderatorMeta = useMemo<ModeratorMeta>(() => {
    const meta: ModeratorMeta = {};
    (rawApps || []).forEach((app) => {
      const m = app as PendingModeratorApp;
      meta[app.id] = {
        contactEmail: m.contactEmail || '',
        submittedBy: m.submittedBy || '',
        submissionSource: m.submissionSource || '',
      };
    });
    return meta;
  }, [rawApps]);

  if (options?.mockData) {
    return {
      apps,
      moderatorMeta,
      loading: false,
      error: undefined,
      refetch: results.refetch,
    };
  }

  return {
    apps,
    moderatorMeta,
    loading: results.loading,
    error: results.error,
    refetch: results.refetch,
  };
}
