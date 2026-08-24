export type DraftStatus =
  | 'draft'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'published'
  | 'archived';

export type PlainDraft = {
  /**
   * unique identifier of the draft.
   */
  id: string;

  /**
   * content type key, e.g. 'post' / 'media-record'.
   */
  contentType: string;

  /**
   * id of the already-published record, when editing existing content.
   */
  contentRef?: string;

  /**
   * title of the draft.
   */
  title: string;

  /**
   * the actual content, open schema defined by the feature.
   */
  payload: Record<string, any>;

  /**
   * domains this draft is dealing with.
   */
  domains: string[];

  /**
   * current status of the draft.
   */
  status: DraftStatus;

  /**
   * id of the author.
   */
  authorId: string;

  /**
   * name of the author.
   */
  authorName: string;

  /**
   * current version number.
   */
  currentVersion: number;

  /**
   * creation timestamp.
   */
  createdAt: string;

  /**
   * last update timestamp.
   */
  updatedAt: string;

  /**
   * timestamp the draft was submitted for review.
   */
  submittedAt?: string;

  /**
   * timestamp the draft was published.
   */
  publishedAt?: string;

  /**
   * id of the last reviewer.
   */
  lastReviewerId?: string;

  /**
   * note left by the last reviewer.
   */
  lastReviewNote?: string;
};

/**
 * map of legal status transitions.
 * key is the source status, value is the list of legal target statuses.
 */
const transitionsMap: Record<DraftStatus, DraftStatus[]> = {
  draft: ['in_review'],
  in_review: ['approved', 'changes_requested', 'archived'],
  changes_requested: ['in_review'],
  approved: ['published'],
  published: ['archived'],
  archived: [],
};

/**
 * checks whether a transition from one draft status to another is legal.
 */
export function canTransition(from: DraftStatus, to: DraftStatus): boolean {
  const legalTargets = transitionsMap[from] || [];
  return legalTargets.includes(to);
}

export class Draft {
  constructor(
    /**
     * unique identifier of the draft.
     */
    readonly id: string,

    /**
     * content type key, e.g. 'post' / 'media-record'.
     */
    readonly contentType: string,

    /**
     * title of the draft.
     */
    readonly title: string,

    /**
     * the actual content, open schema defined by the feature.
     */
    readonly payload: Record<string, any>,

    /**
     * domains this draft is dealing with.
     */
    readonly domains: string[],

    /**
     * current status of the draft.
     */
    readonly status: DraftStatus,

    /**
     * id of the author.
     */
    readonly authorId: string,

    /**
     * name of the author.
     */
    readonly authorName: string,

    /**
     * current version number.
     */
    readonly currentVersion: number,

    /**
     * creation timestamp.
     */
    readonly createdAt: string,

    /**
     * last update timestamp.
     */
    readonly updatedAt: string,

    /**
     * id of the already-published record, when editing existing content.
     */
    readonly contentRef?: string,

    /**
     * timestamp the draft was submitted for review.
     */
    readonly submittedAt?: string,

    /**
     * timestamp the draft was published.
     */
    readonly publishedAt?: string,

    /**
     * id of the last reviewer.
     */
    readonly lastReviewerId?: string,

    /**
     * note left by the last reviewer.
     */
    readonly lastReviewNote?: string
  ) {}

  /**
   * whether the draft can be edited by its author (draft or changes requested).
   */
  get isEditable(): boolean {
    return this.status === 'draft' || this.status === 'changes_requested';
  }

  /**
   * whether the draft is pending review.
   */
  get isPending(): boolean {
    return this.status === 'in_review';
  }

  /**
   * whether the draft has been published.
   */
  get isPublished(): boolean {
    return this.status === 'published';
  }

  /**
   * whether the draft needs the author's attention (changes were requested).
   */
  get needsAttention(): boolean {
    return this.status === 'changes_requested';
  }

  /**
   * serialize a Draft into a plain object.
   */
  toObject(): PlainDraft {
    return {
      id: this.id,
      contentType: this.contentType,
      contentRef: this.contentRef,
      title: this.title,
      payload: this.payload,
      domains: this.domains,
      status: this.status,
      authorId: this.authorId,
      authorName: this.authorName,
      currentVersion: this.currentVersion,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      submittedAt: this.submittedAt,
      publishedAt: this.publishedAt,
      lastReviewerId: this.lastReviewerId,
      lastReviewNote: this.lastReviewNote,
    };
  }

  /**
   * create a Draft instance from a plain object.
   */
  static from(plainDraft: PlainDraft): Draft {
    const {
      id,
      contentType,
      contentRef,
      title,
      payload = {},
      domains = [],
      status,
      authorId,
      authorName,
      currentVersion,
      createdAt,
      updatedAt,
      submittedAt,
      publishedAt,
      lastReviewerId,
      lastReviewNote,
    } = plainDraft;

    return new Draft(
      id,
      contentType,
      title,
      payload,
      domains,
      status,
      authorId,
      authorName,
      currentVersion,
      createdAt,
      updatedAt,
      contentRef,
      submittedAt,
      publishedAt,
      lastReviewerId,
      lastReviewNote
    );
  }
}
