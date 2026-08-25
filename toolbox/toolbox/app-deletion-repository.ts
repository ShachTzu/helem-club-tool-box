import type { ReturnModelType } from '@typegoose/typegoose';
import { AppDeletionRecord } from './app-deletion.model.js';

/**
 * writes the non-personal proof-of-deletion rows. separate from the app
 * repository because these rows outlive the app documents they refer to.
 */
export class AppDeletionRepository {
  constructor(private deletionModel: ReturnModelType<typeof AppDeletionRecord>) {}

  /**
   * record that a deletion request was carried out. best-effort by design:
   * the caller has already removed the data, and failing to write the receipt
   * must not resurrect it.
   */
  async record(appId: string, mode: string): Promise<void> {
    await this.deletionModel.create({ appId, mode, deletedAt: new Date() });
  }

  /**
   * the receipts for one submission, oldest first. used to show that a
   * request was honoured without revealing anything about who made it.
   */
  async listForApp(appId: string): Promise<AppDeletionRecord[]> {
    const docs = await this.deletionModel.find({ appId }).sort({ deletedAt: 1 }).exec();
    return docs.map((doc) => doc.toObject());
  }
}
