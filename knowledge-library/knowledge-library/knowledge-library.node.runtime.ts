import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import type { KnowledgeLibraryConfig } from './knowledge-library-config.js';
import { createKnowledgeLibraryGqlSchema } from './knowledge-library.graphql.js';
import { KnowledgePageModel } from './knowledge-page.model.js';
import { KnowledgePageRepository } from './knowledge-page-repository.js';
import { KnowledgeLibraryEditorModel } from './knowledge-library-editor.model.js';
import { KnowledgeLibraryEditorRepository } from './knowledge-library-editor-repository.js';
import { parseCloudinaryUrl, signCloudinaryUpload, type CloudinaryConfig } from './cloudinary-signature.js';
import { KnowledgeLibraryImporter } from './knowledge-library-importer.js';
import type { ImportRow, ImportSummary } from './knowledge-library-importer.js';
import type {
  PlainKnowledgePage,
  ListPagesOptions,
  CreatePageOptions,
  UpdatePageOptions,
} from './knowledge-page-options.js';

type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export class KnowledgeLibraryNode {
  constructor(
    private config: KnowledgeLibraryConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private knowledgePageRepository: KnowledgePageRepository,
    private editorRepository: KnowledgeLibraryEditorRepository,
    private importer: KnowledgeLibraryImporter,
    private cloudinaryConfig: CloudinaryConfig | undefined
  ) {}

  /**
   * list and filter knowledge-library pages by parent, coping domains and
   * free text.
   */
  async listPages(options?: ListPagesOptions): Promise<PlainKnowledgePage[]> {
    return this.knowledgePageRepository.listPages(options);
  }

  /**
   * resolve a single page by its id or slug.
   */
  async getPage(idOrSlug: string): Promise<PlainKnowledgePage | null> {
    return this.knowledgePageRepository.getPage(idOrSlug);
  }

  /**
   * create a page. callable server-side (e.g. by the CSV importer), so auth
   * is enforced by the GraphQL layer only.
   */
  async createPage(options: CreatePageOptions): Promise<PlainKnowledgePage> {
    return this.knowledgePageRepository.createPage(options);
  }

  /**
   * update an existing page by its id.
   */
  async updatePage(id: string, options: UpdatePageOptions): Promise<PlainKnowledgePage | null> {
    return this.knowledgePageRepository.updatePage(id, options);
  }

  /**
   * delete a page by its id.
   */
  async deletePage(id: string): Promise<boolean> {
    return this.knowledgePageRepository.deletePage(id);
  }

  /**
   * find an existing page by a normalized title match — used by the CSV
   * importer to resolve a "Parent page title" cell.
   */
  async findByNormalizedTitle(title: string): Promise<PlainKnowledgePage | null> {
    return this.knowledgePageRepository.findByNormalizedTitle(title);
  }

  /**
   * import a CSV-derived batch of rows as pages, anchored under an optional
   * top-level parent for the whole batch. see KnowledgeLibraryImporter for
   * the row-mapping and parent-resolution rules.
   */
  async importPages(
    rows: ImportRow[],
    imagesByFilename: Record<string, string>,
    topAnchorParentId: string | null
  ): Promise<ImportSummary> {
    return this.importer.importRows(rows, imagesByFilename, topAnchorParentId);
  }

  /**
   * whether a user is on the knowledge-library editor allowlist.
   */
  async isEditor(userId: string): Promise<boolean> {
    return this.editorRepository.isEditor(userId);
  }

  async listEditors() {
    return this.editorRepository.listEditors();
  }

  async grantEditor(userId: string): Promise<void> {
    await this.editorRepository.grant(userId);
  }

  async revokeEditor(userId: string): Promise<boolean> {
    return this.editorRepository.revoke(userId);
  }

  /**
   * signed, time-limited authorization for the current editor to upload one
   * image directly to Cloudinary from the browser (the API secret never
   * reaches the client). the folder is pinned to the caller's own id — baked
   * into the signature — so it can only ever be used to write into their own
   * upload folder.
   */
  async createUploadSignature(userId: string): Promise<UploadSignature> {
    if (!this.cloudinaryConfig) {
      throw new Error('Image upload is not configured (CLOUDINARY_URL missing)');
    }
    const { cloudName, apiKey, apiSecret } = this.cloudinaryConfig;
    const folder = `knowledge-library/pages/${userId}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signCloudinaryUpload({ folder, timestamp }, apiSecret);
    return { signature, timestamp, apiKey, cloudName, folder };
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: KnowledgeLibraryConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: KnowledgeLibraryConfig
  ) {
    const knowledgePageModel = getModelForClass(KnowledgePageModel);
    const knowledgePageRepository = new KnowledgePageRepository(knowledgePageModel);

    const editorModel = getModelForClass(KnowledgeLibraryEditorModel);
    const editorRepository = new KnowledgeLibraryEditorRepository(editorModel);

    const importer = new KnowledgeLibraryImporter(knowledgePageRepository);

    // image upload is optional at boot — browsing the library doesn't need
    // it, so a missing/malformed CLOUDINARY_URL only fails the
    // upload-signature call itself, not the whole aspect.
    let cloudinaryConfig: CloudinaryConfig | undefined;
    try {
      cloudinaryConfig = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
    } catch (err) {
      cloudinaryConfig = undefined;
      // eslint-disable-next-line no-console
      console.warn(`[knowledge-library] image upload disabled: ${(err as Error).message}`);
    }

    const knowledgeLibrary = new KnowledgeLibraryNode(
      config,
      symphonyPlatform,
      helamPlatform,
      knowledgePageRepository,
      editorRepository,
      importer,
      cloudinaryConfig
    );

    const gqlSchema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

    helamPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    return knowledgeLibrary;
  }
}

export default KnowledgeLibraryNode;
