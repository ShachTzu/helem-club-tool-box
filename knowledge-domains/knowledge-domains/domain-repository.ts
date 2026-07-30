import type { ReturnModelType } from '@typegoose/typegoose';
import type { DomainModel } from './domain.model.js';
import type {
  TaggedContent,
  DomainTag,
  GetContentByDomainOptions,
  GetContentDomainsOptions,
  TagContentOptions,
} from './domain-types.js';
import { CONTENT_MOCKS } from './domain-content-mock.js';

/**
 * encapsulates persistence for knowledge domains and the cross-slice
 * content tagged with them. domains are persisted via typegoose, while the
 * cross-ecosystem content graph is held in-memory (each channel owns its own
 * store — this aspect only indexes the domain associations).
 */
export class DomainRepository {
  private content: TaggedContent[];

  constructor(private domainModel: ReturnModelType<typeof DomainModel>, content: TaggedContent[] = CONTENT_MOCKS) {
    this.content = content.map((item) => ({ ...item, domains: [...item.domains] }));
  }

  /**
   * list all domains in the store, each with an up-to-date tagged-content count.
   */
  async listDomains(): Promise<DomainModel[]> {
    const docs = await this.domainModel.find({}).sort({ _id: 1 });
    return docs.map((doc) => {
      const domain = doc.toObject();
      return { ...domain, count: this.countForDomain(domain.id) };
    });
  }

  /**
   * find a single domain by its slug.
   */
  async getDomainBySlug(slug: string): Promise<DomainModel | null> {
    const doc = await this.domainModel.findOne({ slug });
    if (!doc) return null;
    const domain = doc.toObject();
    return { ...domain, count: this.countForDomain(domain.id) };
  }

  /**
   * find a single domain by its id.
   */
  async getDomainById(id: string): Promise<DomainModel | null> {
    const doc = await this.domainModel.findOne({ id });
    if (!doc) return null;
    const domain = doc.toObject();
    return { ...domain, count: this.countForDomain(domain.id) };
  }

  /**
   * return the cross-sliced content tagged with a given domain (by id or slug),
   * optionally filtered by content type and paginated.
   */
  async getContentByDomain(options: GetContentByDomainOptions): Promise<TaggedContent[]> {
    const { domainId, types, limit, offset } = options;
    const resolvedId = await this.resolveDomainId(domainId);

    let items = this.content.filter((item) => item.domains.includes(resolvedId));

    if (types && types.length > 0) {
      items = items.filter((item) => types.includes(item.type));
    }

    const start = offset && offset > 0 ? offset : 0;
    const end = typeof limit === `number` ? start + limit : undefined;

    return items.slice(start, end);
  }

  /**
   * resolve the domains a specific content object is tagged with.
   */
  async getContentDomains(options: GetContentDomainsOptions): Promise<DomainModel[]> {
    const { targetType, targetId } = options;
    const item = this.content.find((entry) => entry.type === targetType && entry.id === targetId);
    if (!item) return [];

    const docs = await this.domainModel.find({ id: { $in: item.domains } });
    return docs.map((doc) => {
      const domain = doc.toObject();
      return { ...domain, count: this.countForDomain(domain.id) };
    });
  }

  /**
   * associate a content object with a set of domains, replacing any previous
   * associations, and return the resulting tag records.
   */
  async tagContent(options: TagContentOptions): Promise<DomainTag[]> {
    const { targetType, targetId, domainIds } = options;
    const existing = this.content.find((entry) => entry.type === targetType && entry.id === targetId);

    if (existing) {
      existing.domains = [...domainIds];
    } else {
      this.content.push({
        type: targetType,
        id: targetId,
        title: targetId,
        url: ``,
        domains: [...domainIds],
      });
    }

    return domainIds.map((domainId) => ({
      id: `${targetType}:${targetId}:${domainId}`,
      domainId,
      targetType,
      targetId,
    }));
  }

  private countForDomain(domainId: string): number {
    return this.content.filter((item) => item.domains.includes(domainId)).length;
  }

  private async resolveDomainId(domainIdOrSlug: string): Promise<string> {
    const byId = await this.domainModel.findOne({ id: domainIdOrSlug });
    if (byId) return byId.id;
    const bySlug = await this.domainModel.findOne({ slug: domainIdOrSlug });
    return bySlug ? bySlug.id : domainIdOrSlug;
  }
}
