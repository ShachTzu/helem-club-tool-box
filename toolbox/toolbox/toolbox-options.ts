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
   * screenshot image urls showcasing the app. capped server-side.
   */
  screenshots?: string[];

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

  /**
   * name of the developer or team submitting the app.
   */
  developerName?: string;

  /**
   * contact email for the submitter. PII — stored for moderators only, never
   * exposed in the public app shape.
   */
  contactEmail?: string;

  /**
   * where the submission came from, e.g. 'hackathon-1'.
   */
  submissionSource?: string;
};

/**
 * payload used to apply a moderation decision to a pending app.
 */
export type ReviewAction = 'approve' | 'reject' | 'request_changes';

/**
 * what a member asks us to remove.
 * 'personal_data' — their details and everything written about them go; the
 * tool stays in the catalog with nothing tying it to them.
 * 'everything' — the submission itself goes too.
 */
export type DeletionMode = 'personal_data' | 'everything';

export type DeleteSubmissionInput = {
  /**
   * id of the member's own submission being cleared.
   */
  appId: string;

  /**
   * how much to remove.
   */
  mode: DeletionMode;
};

/**
 * payload used to fix the wording of a note already written on a decided
 * submission. never changes the decision itself.
 */
export type CorrectNoteInput = {
  /**
   * id of the already-decided app whose note is being corrected.
   */
  appId: string;

  /**
   * the corrected note. this is what the submitter sees from now on.
   */
  note: string;
};

export type ReviewAppInput = {
  /**
   * ids of the pending apps being reviewed. a single decision is just a list
   * of one, so bulk and single-app moderation share one code path.
   */
  appIds: string[];

  /**
   * moderation action to apply.
   */
  action: ReviewAction;

  /**
   * the moderator's explanation, shown to the submitter. required for
   * "reject" and "request_changes", ignored for "approve".
   */
  note?: string;
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
};
