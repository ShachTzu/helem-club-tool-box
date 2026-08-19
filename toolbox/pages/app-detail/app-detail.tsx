import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { Image } from '@helemclub/design.content.image';
import { CtaButton } from '@helemclub/design.actions.cta-button';
import { DomainBadge } from '@helemclub/knowledge-domains.ui.domain-badge';
import { EngagementBar } from '@helemclub/engagement.ui.engagement-bar';
import { RatingSummary } from '@helemclub/toolbox.ui.rating-summary';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';
import type { PlainAppReview } from '@helemclub/toolbox.entities.app-review';
import { useApps } from '@helemclub/toolbox.hooks.use-apps';
import { useAppReviews } from '@helemclub/toolbox.hooks.use-app-reviews';
import type { AppDetailDomain } from './app-detail-domain-type.js';
import { mockGroundMeAppData, mockAppDetailReviewsData } from './app-detail.mock.js';
import styles from './app-detail.module.scss';

const DEFAULT_APP_DATA = mockGroundMeAppData();
const DEFAULT_REVIEWS_DATA = mockAppDetailReviewsData();
const IMAGE_URL_PATTERN = /^https?:\/\//;

function renderStars(value: number, sizeClassName: string) {
  const clampedValue = Math.max(0, Math.min(5, value));
  const percent = (clampedValue / 5) * 100;

  return (
    <span className={classNames(styles.starsWrapper, sizeClassName)}>
      <span className={styles.starsBase}>★★★★★</span>
      <span className={styles.starsFill} style={{ width: `${percent}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

function toDomainBadges(domainNames: string[], overrides?: AppDetailDomain[]): AppDetailDomain[] {
  if (overrides) return overrides;
  return domainNames.map((domainName) => ({ id: domainName, slug: domainName, name: domainName }));
}

export type AppDetailProps = {
  /**
   * slug of the app to display, overriding the ":slug" route param.
   */
  slug?: string;

  /**
   * pre-loaded app data. when provided, the page skips fetching and renders
   * this app directly, useful for tests and previews.
   */
  app?: PlainApp;

  /**
   * pre-loaded reviews for the app. when provided, the page skips fetching
   * reviews, useful for tests and previews.
   */
  reviews?: PlainAppReview[];

  /**
   * coping-domain badge items matching the app's domains, used to link each
   * badge to its domain lobby page. when omitted, badges are derived from
   * the app's domain names.
   */
  domains?: AppDetailDomain[];

  /**
   * base path used to build the link to a domain's lobby page.
   */
  domainLinkBase?: string;

  /**
   * path the "back to toolbox" link points to.
   */
  backHref?: string;

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
 * app detail page (/toolbox/:slug), ported from the prototype
 * app-detail-page: screenshots, description, metadata, domain badges,
 * rating summary with submit-rating form, an external call-to-action that
 * records a click-through, and an engagement bar. RTL.
 */
export function AppDetail({
  slug,
  app: appProp,
  reviews: reviewsProp,
  domains,
  domainLinkBase = `/domains`,
  backHref = `/toolbox`,
  className,
  style,
}: AppDetailProps) {
  const params = useParams<{ slug?: string }>();
  const resolvedSlug = slug || params.slug || DEFAULT_APP_DATA.slug;

  const { getApp, app: fetchedApp, appLoading, appError, incrementClick } = useApps();

  useEffect(() => {
    if (appProp) return;
    getApp(resolvedSlug);
  }, [resolvedSlug, appProp, getApp]);

  const resolvedApp = appProp ? App.from(appProp) : fetchedApp;
  const isLoading = !appProp && appLoading;
  const hasError = !appProp && Boolean(appError);

  const { reviews, rateApp, submitting, submitError } = useAppReviews(resolvedApp?.id || ``, {
    mockData: reviewsProp || (appProp ? undefined : DEFAULT_REVIEWS_DATA.filter((review) => review.appId === resolvedApp?.id)),
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewComment, setReviewComment] = useState(``);
  const [reviewFormError, setReviewFormError] = useState<string | undefined>(undefined);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleExternalClick = () => {
    if (!resolvedApp) return;
    incrementClick({ appId: resolvedApp.id, source: `app-detail` }).catch(() => undefined);
  };

  const handleSubmitReview = async () => {
    if (!resolvedApp) return;

    if (selectedStars < 1) {
      setReviewFormError(`נא לבחור דירוג בין 1 ל-5 כוכבים`);
      return;
    }

    setReviewFormError(undefined);

    // no display name is sent — the server names the review after the
    // signed-in user.
    const createdReview = await rateApp({
      stars: selectedStars,
      comment: reviewComment.trim() || undefined,
    });

    if (createdReview) {
      setReviewSubmitted(true);
      setReviewComment(``);
      setSelectedStars(5);
    }
  };

  if (isLoading) {
    return (
      <PageLayout className={classNames(styles.appDetail, className)} style={style}>
        <p className={styles.stateText}>טוען את פרטי האפליקציה…</p>
      </PageLayout>
    );
  }

  if (hasError || !resolvedApp) {
    return (
      <PageLayout className={classNames(styles.appDetail, className)} style={style}>
        <div className={styles.notFound}>
          <h2 className={styles.notFoundTitle}>האפליקציה לא נמצאה</h2>
          <Link to={backHref} className={styles.backLink}>
            → חזרה לארגז הכלים
          </Link>
        </div>
      </PageLayout>
    );
  }

  const totalHelpfulVotes = resolvedApp.helpfulYes + resolvedApp.helpfulNo;
  const helpfulPercent = totalHelpfulVotes > 0 ? Math.round((resolvedApp.helpfulYes / totalHelpfulVotes) * 100) : 0;
  const isIconImage = IMAGE_URL_PATTERN.test(resolvedApp.icon);
  const domainBadges = toDomainBadges(resolvedApp.domains, domains);

  return (
    <PageLayout className={classNames(styles.appDetail, className)} style={style}>
      <Link to={backHref} className={styles.backLink}>
        → חזרה לארגז הכלים
      </Link>

      <div className={styles.headerCard}>
        <div className={styles.iconWrap}>
          {isIconImage ? (
            <Image className={styles.iconImage} src={resolvedApp.icon} alt={resolvedApp.name} aspectRatio="1 / 1" rounded="none" />
          ) : (
            <span>{resolvedApp.icon}</span>
          )}
        </div>
        <div className={styles.headerBody}>
          <div className={styles.titleRow}>
            <h1 className={styles.name}>{resolvedApp.name}</h1>
            {resolvedApp.isFeatured && <span className={styles.featuredBadge}>מומלץ ע&quot;י הקהילה</span>}
          </div>
          <p className={styles.subtitle}>{resolvedApp.subtitle}</p>
          <div className={styles.metaRow}>
            <span>
              {renderStars(resolvedApp.avgRating, styles.starsWrapperMedium)} {resolvedApp.avgRating.toFixed(1)} ·{` `}
              {resolvedApp.ratingCount.toLocaleString(`he-IL`)} מדרגים
            </span>
            <span>· 👆 {resolvedApp.clickCount.toLocaleString(`he-IL`)} קליקים</span>
            <span>· {resolvedApp.costType}</span>
          </div>
        </div>
        <CtaButton href={resolvedApp.externalLink} external onClick={() => handleExternalClick()}>
          לאפליקציה ↗
        </CtaButton>
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>הקרדיטים של הקהילה</h3>
        <div className={styles.creditsRow}>
          <div>
            <div className={styles.metaLabel}>פותח ע&quot;י</div>
            <div className={styles.metaValue}>{resolvedApp.developerName}</div>
          </div>
          {resolvedApp.originatorName && (
            <div>
              <div className={styles.metaLabel}>הרעיון של</div>
              <div className={styles.metaValueSecondary}>{resolvedApp.originatorName} (מה-Wishlist)</div>
            </div>
          )}
        </div>
      </div>

      {resolvedApp.screenshots.length > 0 && (
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>גלריה</h3>
          <div className={styles.gallery}>
            {resolvedApp.screenshots.map((screenshot, index) => (
              <Image
                key={screenshot}
                className={styles.screenshot}
                src={screenshot}
                alt={`${resolvedApp.name} צילום מסך ${index + 1}`}
                aspectRatio="9 / 16"
                rounded="medium"
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>על האפליקציה</h3>
        <p className={styles.description}>{resolvedApp.fullDescription}</p>
        {domainBadges.length > 0 && (
          <div className={styles.domainsRow}>
            <DomainBadge domains={domainBadges} domainLinkBase={domainLinkBase} />
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>מתאים ל…</h3>
        <div className={styles.metadataRow}>
          <div>
            <div className={styles.metaLabel}>פלטפורמה</div>
            <div className={styles.metaValue}>{resolvedApp.platform.join(` · `)}</div>
          </div>
          <div>
            <div className={styles.metaLabel}>שפה</div>
            <div className={styles.metaValue}>{resolvedApp.language}</div>
          </div>
          <div>
            <div className={styles.metaLabel}>נדרשת הרשמה</div>
            <div className={styles.metaValue}>{resolvedApp.requiresSignup ? `כן` : `לא`}</div>
          </div>
        </div>
      </div>

      {totalHelpfulVotes > 0 && (
        <div className={classNames(styles.card, styles.helpfulBanner)}>
          <div>
            <h3 className={styles.sectionTitle}>עזר לך?</h3>
            <p className={styles.helpfulText}>{helpfulPercent}% מהמשתמשים דיווחו שהאפליקציה עזרה להם</p>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.ratingHeader}>
          <h3 className={styles.sectionTitle}>דירוגים וביקורות</h3>
          <button
            type="button"
            className={styles.writeReviewButton}
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            כתבו ביקורת
          </button>
        </div>

        {showReviewForm && (
          <form
            className={styles.reviewForm}
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitReview();
            }}
          >
            <div className={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles.starButton}
                  onClick={() => setSelectedStars(star)}
                >
                  {star <= selectedStars ? `★` : `☆`}
                </button>
              ))}
            </div>
            <label className={styles.fieldLabel}>
              ביקורת (אופציונלי)
              <textarea
                className={styles.textArea}
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="ספרו איך האפליקציה עזרה לכם"
              />
            </label>
            {(reviewFormError || submitError) && (
              <p className={styles.formError}>{reviewFormError || `אירעה שגיאה בשליחת הדירוג, נסו שוב`}</p>
            )}
            {reviewSubmitted && <p className={styles.formSuccess}>תודה על הדירוג!</p>}
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton} disabled={submitting}>
                {submitting ? `שולח…` : `שליחת דירוג`}
              </button>
            </div>
          </form>
        )}

        <RatingSummary
          averageRating={resolvedApp.avgRating}
          ratingCount={resolvedApp.ratingCount}
          ratingHistogram={resolvedApp.ratingHistogram}
        />

        <div className={styles.reviewsList}>
          {reviews.length === 0 && <p className={styles.emptyReviews}>אין עדיין ביקורות — היו הראשונים לשתף.</p>}
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewStars}>{renderStars(review.stars, styles.starsWrapperSmall)}</span>
                <span className={styles.reviewAuthor}>{review.displayName || `אנונימי`}</span>
              </div>
              {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
            </div>
          ))}
        </div>
      </div>

      <EngagementBar
        targetType="app"
        targetId={resolvedApp.id}
        title={resolvedApp.name}
        url={resolvedApp.externalLink}
      />
    </PageLayout>
  );
}
