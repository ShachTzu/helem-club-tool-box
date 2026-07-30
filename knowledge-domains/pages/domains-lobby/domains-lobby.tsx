import React from 'react';
import classNames from 'classnames';
import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { useDomains, type UseDomainsOptions } from '@helemclub/knowledge-domains.hooks.use-domains';
import {
  useDomainContent,
  type TaggedContent,
} from '@helemclub/knowledge-domains.hooks.use-domain-content';
import { DEFAULT_CONTENT_TYPE_META, type ContentTypeMeta } from './content-type-meta-type.js';
import styles from './domains-lobby.module.scss';

export type DomainsLobbyProps = {
  /**
   * base path used to build links to a domain's lobby page, e.g. `${domainLinkBase}/${slug}`.
   */
  domainLinkBase?: string;

  /**
   * ordered metadata describing how each content type is labeled and grouped
   * within the cross-sliced feed of a selected domain.
   */
  contentTypeMeta?: ContentTypeMeta[];

  /**
   * provide mock domains data, skipping the network request. useful for tests and compositions.
   */
  mockDomains?: NonNullable<UseDomainsOptions['mockData']>;

  /**
   * provide mock cross-sliced content data for the selected domain, skipping the network request.
   */
  mockContent?: TaggedContent[];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * the domains lobby page: browsing all coping domains at `/domains`, and,
 * for a selected domain (`/domains/:slug`), a cross-sliced feed of every
 * content type across the ecosystem tagged with it.
 */
export function DomainsLobby({
  domainLinkBase = `/domains`,
  contentTypeMeta = DEFAULT_CONTENT_TYPE_META,
  mockDomains,
  mockContent,
  className,
  style,
}: DomainsLobbyProps) {
  const { slug } = useParams();
  const { domains, loading: domainsLoading } = useDomains({ mockData: mockDomains });

  const selectedDomain = slug ? domains.find((domain) => domain.slug === slug) : undefined;
  const { content, loading: contentLoading } = useDomainContent(selectedDomain?.id || ``, {
    mockData: mockContent,
  });

  if (slug) {
    if (!domainsLoading && !selectedDomain) {
      return (
        <div className={classNames(styles.domainsLobby, className)} style={style}>
          <PageLayout>
            <EmptyState
              title="התחום לא נמצא"
              description="ייתכן שהקישור שגוי או שהתחום הוסר. חזרו לרשימת התחומים כדי לבחור תחום אחר."
              actionLabel="לכל התחומים"
              actionHref={domainLinkBase}
            />
          </PageLayout>
        </div>
      );
    }

    return (
      <div className={classNames(styles.domainsLobby, className)} style={style}>
        <PageLayout>
          <SectionLayout
            eyebrow="תחום התמודדות"
            title={selectedDomain?.name}
            subtitle={
              selectedDomain
                ? `כל התוכן באקוסיסטם שמתויג בתחום זה — ${content.length} פריטים מכל חלקי הלם קלאב.`
                : undefined
            }
          >
            <div className={styles.detailToolbar}>
              <Link to={domainLinkBase} className={styles.backLink}>
                ← כל התחומים
              </Link>
              {contentTypeMeta.map((meta) => {
                const count = content.filter((item) => item.type === meta.type).length;
                if (count === 0) return null;
                return (
                  <span key={meta.type} className={styles.toolbarStat}>
                    {meta.icon} {count} {meta.label}
                  </span>
                );
              })}
            </div>
          </SectionLayout>

          {contentLoading && (
            <SectionLayout>
              <div className={styles.contentGrid}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <span key={index} className={styles.skeletonCard} />
                ))}
              </div>
            </SectionLayout>
          )}

          {!contentLoading &&
            contentTypeMeta.map((meta) => {
              const items = content.filter((item) => item.type === meta.type);
              if (items.length === 0) return null;
              return (
                <SectionLayout key={meta.type} title={`${meta.icon} ${meta.label}`}>
                  <div className={styles.contentGrid}>
                    {items.map((item) => (
                      <ContentCard key={`${item.type}-${item.id}`} content={item} />
                    ))}
                  </div>
                </SectionLayout>
              );
            })}

          {!contentLoading && content.length === 0 && (
            <EmptyState
              title="אין עדיין תוכן בתחום זה"
              description="ברגע שיתפרסם תוכן חדש המתויג בתחום הזה, הוא יופיע כאן."
              actionLabel="לכל התחומים"
              actionHref={domainLinkBase}
            />
          )}
        </PageLayout>
      </div>
    );
  }

  return (
    <div className={classNames(styles.domainsLobby, className)} style={style}>
      <PageLayout>
        <SectionLayout
          eyebrow="שכבה רוחבית"
          title="תחומי התמודדות"
          subtitle="14 דומיינים שחוצים את כל האקוסיסטם. כל כתבה, כלי, אירוע ותוכן מתויגים לפיהם — כדי שתמצאו בדיוק את מה שרלוונטי לכם."
        />
        <SectionLayout title="הדומיינים" subtitle="לחצו על תחום כדי לראות את כל התוכן הקשור אליו">
          {domainsLoading ? (
            <div className={styles.domainsGrid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} className={styles.skeletonCard} />
              ))}
            </div>
          ) : (
            <div className={styles.domainsGrid}>
              {domains.map((domain) => (
                <Link key={domain.id} to={`${domainLinkBase}/${domain.slug}`} className={styles.domainCard}>
                  <div className={styles.domainCardHeader}>
                    <span className={styles.domainCardIcon}>{domain.icon || `🔹`}</span>
                    <span className={styles.domainCardCount}>{domain.count}</span>
                  </div>
                  <h3 className={styles.domainCardTitle}>{domain.name}</h3>
                  {domain.description && (
                    <p className={styles.domainCardDescription}>{domain.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </SectionLayout>
      </PageLayout>
    </div>
  );
}

type ContentCardProps = {
  content: TaggedContent;
};

function ContentCard({ content }: ContentCardProps) {
  const meta = DEFAULT_CONTENT_TYPE_META.find((item) => item.type === content.type);

  return (
    <Link to={content.url} className={styles.contentCard}>
      {content.imageUrl && (
        <img className={styles.contentCardImage} src={content.imageUrl} alt={content.title} />
      )}
      <div className={styles.contentCardBody}>
        <h3 className={styles.contentCardTitle}>{content.title}</h3>
        {content.excerpt && <p className={styles.contentCardExcerpt}>{content.excerpt}</p>}
        <div className={styles.contentCardFooter}>
          <span className={styles.toolbarStat}>
            {meta?.icon || `🔹`} {meta?.label || content.type}
          </span>
        </div>
      </div>
    </Link>
  );
}
