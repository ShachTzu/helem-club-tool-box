import { ReturnModelType } from '@typegoose/typegoose';
import { KnowledgeLibraryEditorModel } from './knowledge-library-editor.model.js';

export class KnowledgeLibraryEditorRepository {
  constructor(private editorModel: ReturnModelType<typeof KnowledgeLibraryEditorModel>) {}

  async isEditor(userId: string): Promise<boolean> {
    return Boolean(await this.editorModel.exists({ userId }));
  }

  async listEditors(): Promise<KnowledgeLibraryEditorModel[]> {
    const editors = await this.editorModel.find({}).sort({ grantedAt: -1 });
    return editors.map((editor) => editor.toObject());
  }

  async grant(userId: string): Promise<void> {
    await this.editorModel.updateOne(
      { userId },
      { $setOnInsert: { userId, grantedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }

  async revoke(userId: string): Promise<boolean> {
    const result = await this.editorModel.deleteOne({ userId });
    return result.deletedCount > 0;
  }
}
