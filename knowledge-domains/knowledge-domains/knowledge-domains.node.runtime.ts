import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { Domain, type PlainDomain } from '@helemclub/knowledge-domains.entities.domain';
import type { KnowledgeDomainsConfig } from './knowledge-domains-config.js';
import { knowledgeDomainsGqlSchema } from './knowledge-domains.graphql.js';
import { DomainModel } from './domain.model.js';
import { DOMAIN_SEEDS } from './domain-seed.js';
import { DomainRepository } from './domain-repository.js';
import type {
  TaggedContent,
  DomainTag,
  GetContentByDomainOptions,
  GetContentDomainsOptions,
  TagContentOptions,
} from './domain-types.js';

export class KnowledgeDomainsNode {
  constructor(
    private knowledgeDomainsConfig: KnowledgeDomainsConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private domainRepository: DomainRepository
  ) {}

  /**
   * list the fixed coping domains, each with its tagged-content count.
   */
  async listDomains(): Promise<PlainDomain[]> {
    const domainModels = await this.domainRepository.listDomains();
    return domainModels.map((model) => this.toPlainDomain(model));
  }

  /**
   * return the domains a specific content object is tagged with.
   */
  async getContentDomains(options: GetContentDomainsOptions): Promise<PlainDomain[]> {
    const domainModels = await this.domainRepository.getContentDomains(options);
    return domainModels.map((model) => this.toPlainDomain(model));
  }

  /**
   * return the cross-sliced content tagged with a given domain, optionally
   * filtered by content type and paginated.
   */
  async getContentByDomain(options: GetContentByDomainOptions): Promise<TaggedContent[]> {
    return this.domainRepository.getContentByDomain(options);
  }

  /**
   * associate a content object with a set of domains, replacing any previous
   * associations.
   */
  async tagContent(options: TagContentOptions): Promise<DomainTag[]> {
    return this.domainRepository.tagContent(options);
  }

  private toPlainDomain(model: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    icon?: string;
    count?: number;
  }): PlainDomain {
    return Domain.from({
      id: model.id,
      slug: model.slug,
      name: model.name,
      description: model.description,
      icon: model.icon,
      count: model.count ?? 0,
    }).toObject();
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: KnowledgeDomainsConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: KnowledgeDomainsConfig
  ) {
    const domainModel = getModelForClass(DomainModel);
    const domainRepository = new DomainRepository(domainModel);
    const knowledgeDomains = new KnowledgeDomainsNode(config, symphonyPlatform, helamPlatform, domainRepository);

    const gqlSchema = knowledgeDomainsGqlSchema(knowledgeDomains);

    helamPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    helamPlatform.registerOnStart(async () => {
      const existingDocs = await domainModel.find().limit(1);
      const hasDocs = Boolean(existingDocs.length);
      if (hasDocs) return undefined;
      await domainModel.insertMany(DOMAIN_SEEDS);
      return undefined;
    });

    return knowledgeDomains;
  }
}

export default KnowledgeDomainsNode;
