import { prop, index } from '@typegoose/typegoose';

/**
 * persisted report of a comment, submitted by an anonymous device. only one
 * report may exist per device per comment; the parent comment is hidden once
 * it accumulates enough reports.
 */
@index({ commentId: 1 })
export class ReportModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public commentId!: string;

  @prop({ required: true, type: String })
  public deviceId!: string;

  @prop({ required: true, type: String })
  public createdAt!: string;
}
