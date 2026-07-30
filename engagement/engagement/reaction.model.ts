import { prop, index } from '@typegoose/typegoose';

/**
 * persisted reaction (like / emoji) made by an anonymous device against a
 * target object. one reaction per device per target — toggling or changing
 * it replaces the existing reaction.
 */
@index({ targetType: 1, targetId: 1 })
export class ReactionModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public targetType!: string;

  @prop({ required: true, type: String })
  public targetId!: string;

  @prop({ required: true, type: String })
  public type!: string;

  @prop({ required: true, type: String })
  public deviceId!: string;

  @prop({ required: true, type: String })
  public createdAt!: string;
}
