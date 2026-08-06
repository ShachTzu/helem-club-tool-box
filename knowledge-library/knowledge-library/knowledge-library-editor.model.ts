import { prop } from '@typegoose/typegoose';

/**
 * a user granted edit access to the knowledge-library admin, scoped to this
 * feature only — not a role on the shared platform User entity (see the
 * design doc's "access control" section for why: platform/entities/user and
 * user.model.ts are outside this feature's ownership).
 */
export class KnowledgeLibraryEditorModel {
  @prop({ unique: true, required: true, type: String })
  public userId: string;

  @prop({ required: true, type: String })
  public grantedAt: string;
}
