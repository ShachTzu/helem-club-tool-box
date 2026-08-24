export type PlainRevision = {
  /**
   * unique identifier of the revision.
   */
  id: string;

  /**
   * id of the draft this revision belongs to.
   */
  draftId: string;

  /**
   * sequential version number, starting from 1.
   */
  versionNumber: number;

  /**
   * a snapshot of the draft's payload at the time the revision was created.
   */
  payload: Record<string, any>;

  /**
   * domains associated with the draft at the time of this revision.
   */
  domains: string[];

  /**
   * title of the draft at the time of this revision.
   */
  title: string;

  /**
   * id of the author who created this revision.
   */
  authorId: string;

  /**
   * name of the author who created this revision.
   */
  authorName: string;

  /**
   * short summary (in Hebrew) describing what changed in this revision.
   */
  changeSummary: string;

  /**
   * ISO timestamp of when this revision was created.
   */
  createdAt: string;
};

/**
 * Revision is an immutable snapshot of a Draft at a specific point in time.
 *
 * Revisions are never deleted and never edited. Restoring an older revision
 * does not modify history — it creates a brand new revision on top of the
 * draft, keeping the full chain of changes intact.
 */
export class Revision {
  constructor(
    /**
     * unique identifier of the revision.
     */
    readonly id: string,

    /**
     * id of the draft this revision belongs to.
     */
    readonly draftId: string,

    /**
     * sequential version number, starting from 1.
     */
    readonly versionNumber: number,

    /**
     * a snapshot of the draft's payload at the time the revision was created.
     */
    readonly payload: Record<string, any>,

    /**
     * domains associated with the draft at the time of this revision.
     */
    readonly domains: string[],

    /**
     * title of the draft at the time of this revision.
     */
    readonly title: string,

    /**
     * id of the author who created this revision.
     */
    readonly authorId: string,

    /**
     * name of the author who created this revision.
     */
    readonly authorName: string,

    /**
     * short summary (in Hebrew) describing what changed in this revision.
     */
    readonly changeSummary: string,

    /**
     * ISO timestamp of when this revision was created.
     */
    readonly createdAt: string
  ) {}

  /**
   * whether this revision is the first (initial) revision of the draft.
   */
  get isInitial(): boolean {
    return this.versionNumber === 1;
  }

  /**
   * serialize a Revision into a plain, serializable object.
   */
  toObject(): PlainRevision {
    return {
      id: this.id,
      draftId: this.draftId,
      versionNumber: this.versionNumber,
      payload: this.payload,
      domains: this.domains,
      title: this.title,
      authorId: this.authorId,
      authorName: this.authorName,
      changeSummary: this.changeSummary,
      createdAt: this.createdAt,
    };
  }

  /**
   * create a Revision instance from a plain object.
   */
  static from(plainRevision: Partial<PlainRevision>): Revision {
    const {
      id = '',
      draftId = '',
      versionNumber = 1,
      payload = {},
      domains = [],
      title = '',
      authorId = '',
      authorName = '',
      changeSummary = '',
      createdAt = new Date().toISOString(),
    } = plainRevision;

    return new Revision(
      id,
      draftId,
      versionNumber,
      payload,
      domains,
      title,
      authorId,
      authorName,
      changeSummary,
      createdAt
    );
  }
}
