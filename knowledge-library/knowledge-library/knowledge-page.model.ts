import { prop, index } from '@typegoose/typegoose';
import { HELEM_CLUB_AUTHOR_NAME } from './knowledge-page-options.js';

/**
 * typegoose model for a knowledge-library page — a hierarchical text page
 * (unlimited nesting via parentId), always authored under the fixed הלם קלאב
 * display identity. see docs/superpowers/specs/2026-08-06-knowledge-library-design.md.
 */
@index({ title: 'text', body: 'text' })
@index({ slug: 1 }, { unique: true })
@index({ parentId: 1 })
@index({ normalizedTitle: 1 })
export class KnowledgePageModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public slug: string;

  @prop({ required: true, type: String })
  public title: string;

  /**
   * trimmed, whitespace-collapsed, lower-cased title — used for the CSV
   * importer's "does a page with this title already exist" lookup, which
   * must tolerate the whitespace/casing noise real CSV exports carry.
   */
  @prop({ required: true, type: String })
  public normalizedTitle: string;

  @prop({ required: true, type: String, default: '' })
  public body: string;

  @prop({ type: String, default: null })
  public parentId: string | null;

  @prop({ type: [String], default: [] })
  public ancestorIds: string[];

  @prop({ type: [String], default: [] })
  public domains: string[];

  @prop({ type: String })
  public image?: string;

  @prop({ type: String })
  public videoUrl?: string;

  @prop({ type: String })
  public videoEmbedHtml?: string;

  @prop({ required: true, type: String })
  public publishDate: string;

  @prop({ required: true, type: String, default: HELEM_CLUB_AUTHOR_NAME })
  public authorName: string;

  @prop({ required: true, type: Boolean, default: true })
  public isStaffAuthor: boolean;

  @prop({ required: true, type: Boolean, default: true })
  public isPublished: boolean;

  @prop({ required: true, type: String })
  public createdAt: string;

  @prop({ required: true, type: String })
  public updatedAt: string;
}
