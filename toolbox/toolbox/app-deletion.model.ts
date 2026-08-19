import { prop, index } from '@typegoose/typegoose';

/**
 * proof that a deletion request was carried out. deliberately holds NO
 * personal data — not the member's id, not their email, not the note that was
 * removed. it records that a specific submission was cleared, in which mode,
 * and when. that is what demonstrates the request was honoured; keeping who
 * asked would defeat the point of the request.
 *
 * it lives in its own collection because the "everything" mode removes the
 * app document itself, so there is nothing left to hang a flag on.
 */
@index({ appId: 1 })
export class AppDeletionRecord {
  /**
   * id of the submission that was cleared. an opaque uuid, not personal data.
   */
  @prop({ required: true, type: String })
  public appId: string;

  /**
   * 'personal_data' — the submitter's details and the notes about them were
   * cleared, the tool itself stayed in the catalog.
   * 'everything' — the submission was removed outright.
   */
  @prop({ required: true, type: String })
  public mode: string;

  @prop({ type: Date, default: Date.now })
  public deletedAt: Date;
}
