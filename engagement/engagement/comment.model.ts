import { prop, index } from '@typegoose/typegoose';

/**
 * persisted comment posted against a target object (app, article, event,
 * domain, etc.). scoped by targetType + targetId and, for anonymous
 * commenters, by an anonymous device id.
 */
@index({ targetType: 1, targetId: 1 })
export class CommentModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public targetType!: string;

  @prop({ required: true, type: String })
  public targetId!: string;

  @prop({ required: true, type: String })
  public text!: string;

  @prop({ type: String })
  public displayName?: string;

  @prop({ type: Boolean, default: false })
  public isAnonymous?: boolean;

  @prop({ type: Boolean, default: false })
  public membersOnly?: boolean;

  @prop({ type: String })
  public deviceId?: string;

  @prop({ type: String })
  public userId?: string;

  @prop({ type: Number, default: 0 })
  public reportCount?: number;

  @prop({ type: Boolean, default: false })
  public hidden?: boolean;

  @prop({ required: true, type: String })
  public createdAt!: string;
}
