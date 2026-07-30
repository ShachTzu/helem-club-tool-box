import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { Card } from '@helemclub/design.content.card';
import { StarRating } from '@helemclub/design.content.star-rating';
import { App, type PlainApp, mockApps } from '@helemclub/toolbox.entities.app';
import { useApps } from '@helemclub/toolbox.hooks.use-apps';
import { useIsMock } from '@helemclub/platform.testing.mock-provider';
import styles from './app-embed-block.module.scss';

export type AppEmbedBlockProps = {
  /**
   * id or slug of the app to render. when omitted, a sample app is shown.
   */
  appId?: string;

  /**
   * pre-loaded app data. when provided, the block skips fetching and
   * renders this app directly, useful for previews and tests.
   */
  app?: PlainApp;

  /**
   * source tag attached to the click-through event, used to attribute
   * clicks back to the surface that embedded the block.
   */
  source?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_APP_ID = `breathe-calm`;

/**
 * a compact, embeddable card presenting a single toolbox app by id: icon,
 * name, live rating and a call-to-action button opening the app's external
 * link while recording a tagged click-through. built to be reused across
 * the toolbox and the blog.
 */
export function AppEmbedBlock({
  appId = DEFAULT_APP_ID,
  app: appProp,
  source = `blog`,
  className,
  style,
}: AppEmbedBlockProps) {
  const isMock = useIsMock();
  const { getApp, app: fetchedApp, appLoading, appError, incrementClick } = useApps();

  useEffect(() => {
    // in mock mode (tests/previews) Apollo is not wired to a real backend, so
    // skip the network fetch and resolve the app from the mock catalog instead.
    if (appProp || isMock) return;
    getApp(appId);
  }, [appId, appProp, isMock, getApp]);

  const mockApp = isMock && !appProp ? mockApps().find((candidate) => candidate.id === appId || candidate.slug === appId) : undefined;
  const resolvedApp = appProp ? App.from(appProp) : mockApp || fetchedApp;
  const isLoading = !appProp && !isMock && appLoading;
  const hasError = !appProp && !isMock && Boolean(appError);
  const isIconUrl = /^https?:\/\//.test(resolvedApp?.icon || ``);

  const handleAppClick = () => {
    if (!resolvedApp || isMock) return;
    incrementClick({ appId: resolvedApp.id, source }).catch(() => undefined);
  };

  if (isLoading) {
    return (
      <Card className={classNames(styles.appEmbedBlock, className)} padding="medium" style={style}>
        <div className={styles.content}>
          <div className={classNames(styles.iconWrapper, styles.skeletonIcon)} />
          <div className={styles.info}>
            <span className={classNames(styles.skeletonLine, styles.skeletonLineWide)} />
            <span className={classNames(styles.skeletonLine, styles.skeletonLineNarrow)} />
          </div>
        </div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className={classNames(styles.appEmbedBlock, className)} padding="medium" style={style}>
        <p className={styles.stateText}>לא ניתן לטעון את האפליקציה כרגע</p>
      </Card>
    );
  }

  if (!resolvedApp) {
    return (
      <Card className={classNames(styles.appEmbedBlock, className)} padding="medium" style={style}>
        <p className={styles.stateText}>האפליקציה לא נמצאה</p>
      </Card>
    );
  }

  return (
    <Card className={classNames(styles.appEmbedBlock, className)} padding="medium" style={style}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          {isIconUrl ? (
            <img className={styles.iconImage} src={resolvedApp.icon} alt={resolvedApp.name} />
          ) : (
            <span className={styles.iconEmoji}>{resolvedApp.icon}</span>
          )}
        </div>
        <div className={styles.info}>
          <h4 className={styles.name}>{resolvedApp.name}</h4>
          {resolvedApp.ratingCount > 0 ? (
            <StarRating
              value={resolvedApp.avgRating}
              ratingCount={resolvedApp.ratingCount}
              size={14}
              showValue
            />
          ) : (
            <span className={styles.noRating}>אין עדיין דירוגים</span>
          )}
        </div>
        <div className={styles.action}>
          <Button
            variant="accent"
            size="sm"
            href={resolvedApp.externalLink}
            external
            onClick={() => handleAppClick()}
          >
            לאפליקציה
          </Button>
        </div>
      </div>
    </Card>
  );
}
