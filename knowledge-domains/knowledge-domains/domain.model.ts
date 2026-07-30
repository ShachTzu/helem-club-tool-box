import { prop } from '@typegoose/typegoose';

/**
 * a knowledge domain — a fixed, cross-cutting coping tag used to classify
 * and discover content across the Helam Club ecosystem.
 */
export class DomainModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ unique: true, required: true, type: String })
  public slug: string;

  @prop({ required: true, type: String })
  public name: string;

  @prop({ type: String })
  public description?: string;

  @prop({ type: String })
  public icon?: string;

  @prop({ type: Number, default: 0 })
  public count?: number;
}
