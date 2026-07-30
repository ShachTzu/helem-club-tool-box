/**
 * supported sort keys for the toolbox apps catalog.
 */
export type AppSort = 'rating' | 'clicks' | 'newest';

/**
 * options accepted by the listToolboxApps query for filtering and sorting the
 * published catalog.
 */
export type ListToolboxAppsOptions = {
  /**
   * restrict the results to apps tagged with any of the given coping domains.
   */
  domainIds?: string[];

  /**
   * sort key applied to the returned apps.
   */
  sort?: AppSort;

  /**
   * restrict the results to featured apps only.
   */
  featured?: boolean;

  /**
   * free-text query matched against the app name and description.
   */
  query?: string;
};

/**
 * payload used to submit a new app to the toolbox for moderation review.
 */
export type SubmitAppInput = {
  /**
   * display name of the app being submitted.
   */
  name: string;

  /**
   * short one-line subtitle describing the app.
   */
  subtitle?: string;

  /**
   * full description of the app.
   */
  fullDescription?: string;

  /**
   * external link to the app (store page, website, etc).
   */
  externalLink: string;

  /**
   * icon representing the app (emoji or image url).
   */
  icon?: string;

  /**
   * cost model of the app, e.g. "free", "freemium", "paid".
   */
  costType?: string;

  /**
   * platforms the app is available on, e.g. ["iOS", "Android", "Web"].
   */
  platform?: string[];

  /**
   * primary language of the app.
   */
  language?: string;

  /**
   * coping domains the app is relevant for.
   */
  domains?: string[];
};

/**
 * payload used to apply a moderation decision to a pending app.
 */
export type ReviewAppInput = {
  /**
   * id of the pending app being reviewed.
   */
  appId: string;

  /**
   * moderation action to apply, either "approve" or "reject".
   */
  action: 'approve' | 'reject';
};

/**
 * payload used to record a click-through on an app's external link.
 */
export type IncrementClickInput = {
  /**
   * id of the app whose external link was clicked.
   */
  appId: string;

  /**
   * optional source of the click, e.g. "toolbox-list" or "app-detail".
   */
  source?: string;
};

/**
 * payload used to submit a star rating (and optional comment) for an app.
 */
export type RateAppInput = {
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
