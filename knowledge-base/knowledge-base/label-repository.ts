import { ReturnModelType } from '@typegoose/typegoose';
import { LabelModel } from './label.model.js';
import type { UpsertLabelOptions } from './media-record-options.js';

export class LabelRepository {
  constructor(private labelModel: ReturnModelType<typeof LabelModel>) {}

  /**
   * list all knowledge base labels (projects), sorted by name.
   */
  async listLabels(): Promise<LabelModel[]> {
    const labels = await this.labelModel.find({}).sort({ _id: 1 });
    return labels.map((label) => label.toObject());
  }

  /**
   * resolve a single label by its id or slug.
   */
  async getLabel(idOrSlug: string): Promise<LabelModel | null> {
    const label = await this.labelModel.findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    if (!label) return null;
    return label.toObject();
  }

  /**
   * create or update a label by its slug. an existing label with the same slug
   * is updated in place; otherwise a new one is created.
   */
  async upsertLabel(options: UpsertLabelOptions): Promise<LabelModel> {
    const existing = await this.labelModel.findOne({ slug: options.slug });

    if (existing) {
      existing.name = options.name;
      existing.description = options.description;
      existing.coverImage = options.coverImage;
      await existing.save();
      return existing.toObject();
    }

    const created = await this.labelModel.create({
      id: crypto.randomUUID(),
      slug: options.slug,
      name: options.name,
      description: options.description,
      coverImage: options.coverImage,
    });

    return created.toObject();
  }
}
