/**
 * type of action performed on a draft, recorded in the approval trail.
 */
export type ApprovalAction =
  | 'created'
  | 'submitted'
  | 'changes_requested'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'unpublished'
  | 'restored';

/**
 * role of the actor that performed the action.
 */
export type ApprovalActorRole = 'member' | 'writer' | 'moderator' | 'admin';

export type PlainApprovalEntry = {
  /**
   * unique identifier of the approval entry.
   */
  id: string;

  /**
   * id of the draft this entry belongs to.
   */
  draftId: string;

  /**
   * the action performed.
   */
  action: ApprovalAction;

  /**
   * id of the actor who performed the action.
   */
  actorId: string;

  /**
   * name of the actor who performed the action.
   */
  actorName: string;

  /**
   * role of the actor who performed the action.
   */
  actorRole: ApprovalActorRole;

  /**
   * optional moderator note, written in Hebrew.
   */
  note?: string;

  /**
   * status of the draft before the action, if applicable.
   */
  fromStatus?: string;

  /**
   * status of the draft after the action, if applicable.
   */
  toStatus?: string;

  /**
   * revision version number related to the action, if applicable.
   */
  versionNumber?: number;

  /**
   * creation timestamp of the entry, in ISO format.
   */
  createdAt: string;
};

const ACTION_LABELS: Record<ApprovalAction, string> = {
  created: 'נוצר',
  submitted: 'נשלח לביקורת',
  changes_requested: 'נדרשו תיקונים',
  approved: 'אושר',
  rejected: 'נדחה',
  published: 'פורסם',
  unpublished: 'הוסר מפרסום',
  restored: 'שוחזר',
};

const DECISION_ACTIONS: ApprovalAction[] = ['approved', 'rejected', 'changes_requested'];

/**
 * an append-only entry in a draft's approval trail.
 */
export class ApprovalEntry {
  constructor(
    /**
     * unique identifier of the approval entry.
     */
    readonly id: string,

    /**
     * id of the draft this entry belongs to.
     */
    readonly draftId: string,

    /**
     * the action performed.
     */
    readonly action: ApprovalAction,

    /**
     * id of the actor who performed the action.
     */
    readonly actorId: string,

    /**
     * name of the actor who performed the action.
     */
    readonly actorName: string,

    /**
     * role of the actor who performed the action.
     */
    readonly actorRole: ApprovalActorRole,

    /**
     * creation timestamp of the entry, in ISO format.
     */
    readonly createdAt: string,

    /**
     * optional moderator note, written in Hebrew.
     */
    readonly note?: string,

    /**
     * status of the draft before the action, if applicable.
     */
    readonly fromStatus?: string,

    /**
     * status of the draft after the action, if applicable.
     */
    readonly toStatus?: string,

    /**
     * revision version number related to the action, if applicable.
     */
    readonly versionNumber?: number
  ) {}

  /**
   * whether this entry represents an editorial decision
   * (approved, rejected or changes requested).
   */
  get isDecision(): boolean {
    return DECISION_ACTIONS.includes(this.action);
  }

  /**
   * a human readable Hebrew label for the entry's action.
   */
  actionLabel(): string {
    return ACTION_LABELS[this.action];
  }

  /**
   * serialize an ApprovalEntry into a plain object.
   */
  toObject(): PlainApprovalEntry {
    const {
      id,
      draftId,
      action,
      actorId,
      actorName,
      actorRole,
      createdAt,
      note,
      fromStatus,
      toStatus,
      versionNumber,
    } = this;

    return {
      id,
      draftId,
      action,
      actorId,
      actorName,
      actorRole,
      createdAt,
      note,
      fromStatus,
      toStatus,
      versionNumber,
    };
  }

  /**
   * create an ApprovalEntry instance from a plain object.
   */
  static from(plainApprovalEntry: PlainApprovalEntry): ApprovalEntry {
    const {
      id,
      draftId,
      action,
      actorId,
      actorName,
      actorRole,
      createdAt,
      note,
      fromStatus,
      toStatus,
      versionNumber,
    } = plainApprovalEntry;

    return new ApprovalEntry(
      id,
      draftId,
      action,
      actorId,
      actorName,
      actorRole,
      createdAt,
      note,
      fromStatus,
      toStatus,
      versionNumber
    );
  }
}
