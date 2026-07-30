/**
 * The cost model used to describe how an app can be obtained.
 */
export type AppCostType = string;

/**
 * The review/publication status of an app in the toolbox.
 */
export type AppStatus = 'pending' | 'approved' | 'rejected';

export type PlainApp = {
  /**
   * unique identifier of the app.
   */
  id: string;

  /**
   * url-friendly unique slug of the app.
   */
  slug: string;

  /**
   * display name of the app.
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
  icon: string;

  /**
   * screenshots showcasing the app.
   */
  screenshots?: string[];

  /**
   * cost model of the app, e.g. "free", "freemium", "paid".
   */
  costType: AppCostType;

  /**
   * platforms the app is available on, e.g. ["iOS", "Android", "Web"].
   */
  platform?: string[];

  /**
   * primary language of the app.
   */
  language: string;

  /**
   * whether the app requires a signup to use.
   */
  requiresSignup: boolean;

  /**
   * number of times the app link was clicked.
   */
  clickCount?: number;

  /**
   * number of "helpful" votes.
   */
  helpfulYes?: number;

  /**
   * number of "not helpful" votes.
   */
  helpfulNo?: number;

  /**
   * whether the app is featured in the toolbox.
   */
  isFeatured?: boolean;

  /**
   * name of the developer of the app.
   */
  developerName: string;

  /**
   * name of the community member who originated/suggested the app.
   */
  originatorName?: string;

  /**
   * coping domains the app is relevant for.
   */
  domains?: string[];

  /**
   * average rating of the app.
   */
  avgRating?: number;

  /**
   * total number of ratings.
   */
  ratingCount?: number;

  /**
   * histogram of ratings, index 0 = 1 star ... index 4 = 5 stars.
   */
  ratingHistogram?: number[];

  /**
   * publication status of the app.
   */
  status?: AppStatus;
};

/**
 * an App entity, ported from the Helam Club marketplace prototype.
 * represents a coping-app catalog entry shown in the toolbox.
 */
export class App {
  constructor(
    /**
     * unique identifier of the app.
     */
    readonly id: string,

    /**
     * url-friendly unique slug of the app.
     */
    readonly slug: string,

    /**
     * display name of the app.
     */
    readonly name: string,

    /**
     * short one-line subtitle describing the app.
     */
    readonly subtitle: string,

    /**
     * full description of the app.
     */
    readonly fullDescription: string,

    /**
     * external link to the app (store page, website, etc).
     */
    readonly externalLink: string,

    /**
     * icon representing the app (emoji or image url).
     */
    readonly icon: string,

    /**
     * screenshots showcasing the app.
     */
    readonly screenshots: string[],

    /**
     * cost model of the app, e.g. "free", "freemium", "paid".
     */
    readonly costType: AppCostType,

    /**
     * platforms the app is available on, e.g. ["iOS", "Android", "Web"].
     */
    readonly platform: string[],

    /**
     * primary language of the app.
     */
    readonly language: string,

    /**
     * whether the app requires a signup to use.
     */
    readonly requiresSignup: boolean,

    /**
     * number of times the app link was clicked.
     */
    readonly clickCount: number,

    /**
     * number of "helpful" votes.
     */
    readonly helpfulYes: number,

    /**
     * number of "not helpful" votes.
     */
    readonly helpfulNo: number,

    /**
     * whether the app is featured in the toolbox.
     */
    readonly isFeatured: boolean,

    /**
     * name of the developer of the app.
     */
    readonly developerName: string,

    /**
     * coping domains the app is relevant for.
     */
    readonly domains: string[],

    /**
     * average rating of the app.
     */
    readonly avgRating: number,

    /**
     * total number of ratings.
     */
    readonly ratingCount: number,

    /**
     * histogram of ratings, index 0 = 1 star ... index 4 = 5 stars.
     */
    readonly ratingHistogram: number[],

    /**
     * publication status of the app.
     */
    readonly status: AppStatus,

    /**
     * name of the community member who originated/suggested the app.
     */
    readonly originatorName?: string
  ) {}

  /**
   * total number of helpfulness votes received.
   */
  get totalHelpfulVotes(): number {
    return this.helpfulYes + this.helpfulNo;
  }

  /**
   * serialize an App into a plain object.
   */
  toObject(): PlainApp {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      subtitle: this.subtitle,
      fullDescription: this.fullDescription,
      externalLink: this.externalLink,
      icon: this.icon,
      screenshots: this.screenshots,
      costType: this.costType,
      platform: this.platform,
      language: this.language,
      requiresSignup: this.requiresSignup,
      clickCount: this.clickCount,
      helpfulYes: this.helpfulYes,
      helpfulNo: this.helpfulNo,
      isFeatured: this.isFeatured,
      developerName: this.developerName,
      originatorName: this.originatorName,
      domains: this.domains,
      avgRating: this.avgRating,
      ratingCount: this.ratingCount,
      ratingHistogram: this.ratingHistogram,
      status: this.status,
    };
  }

  /**
   * create an App instance from a plain object.
   */
  static from(plainApp: PlainApp): App {
    const {
      id,
      slug,
      name,
      subtitle,
      fullDescription,
      externalLink,
      icon,
      screenshots = [],
      costType,
      platform = [],
      language,
      requiresSignup,
      clickCount = 0,
      helpfulYes = 0,
      helpfulNo = 0,
      isFeatured = false,
      developerName,
      originatorName,
      domains = [],
      avgRating = 0,
      ratingCount = 0,
      ratingHistogram = [0, 0, 0, 0, 0],
      status = 'approved',
    } = plainApp;

    return new App(
      id,
      slug,
      name,
      subtitle,
      fullDescription,
      externalLink,
      icon,
      screenshots,
      costType,
      platform,
      language,
      requiresSignup,
      clickCount,
      helpfulYes,
      helpfulNo,
      isFeatured,
      developerName,
      domains,
      avgRating,
      ratingCount,
      ratingHistogram,
      status,
      originatorName
    );
  }
}
