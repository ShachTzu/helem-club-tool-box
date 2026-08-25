import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';
import type { PendingModeratorApp, ModeratorMeta } from './use-list-pending-apps.js';

/**
 * GraphQL query listing submissions a moderator already decided against,
 * newest decision first. moderator-gated, same shape as the pending list.
 */
export const LIST_DECIDED_TOOLBOX_APPS_QUERY = gql`
  query ListDecidedToolboxApps {
    listDecidedToolboxApps {
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
      contactEmail
      submittedBy
      submissionSource
      moderationHistory {
        action
        note
        moderatorName
        createdAt
      }
    }
  }
`;

export type UseListDecidedAppsOptions = {
  /**
   * provide mock decided apps to skip the network request, useful for tests
   * and previews.
   */
  mockData?: PlainApp[];
};

/**
 * lists submissions that were rejected or sent back for changes, so a
 * moderator can find a decision they just made and correct the note on it.
 */
export function useListDecidedApps(options?: UseListDecidedAppsOptions) {
  const results = useQuery<{ listDecidedToolboxApps: PendingModeratorApp[] }>(
    LIST_DECIDED_TOOLBOX_APPS_QUERY,
    { skip: !!options?.mockData }
  );

  const rawApps = options?.mockData ? options.mockData : results.data?.listDecidedToolboxApps;

  const apps = useMemo(() => (rawApps || []).map((app) => App.from(app)), [rawApps]);

  const moderatorMeta = useMemo<ModeratorMeta>(() => {
    const meta: ModeratorMeta = {};
    (rawApps || []).forEach((app) => {
      const m = app as PendingModeratorApp;
      meta[app.id] = {
        contactEmail: m.contactEmail || '',
        submittedBy: m.submittedBy || '',
        submissionSource: m.submissionSource || '',
        moderationHistory: m.moderationHistory || [],
      };
    });
    return meta;
  }, [rawApps]);

  return {
    apps,
    moderatorMeta,
    loading: options?.mockData ? false : results.loading,
    error: options?.mockData ? undefined : results.error,
    refetch: results.refetch,
  };
}
