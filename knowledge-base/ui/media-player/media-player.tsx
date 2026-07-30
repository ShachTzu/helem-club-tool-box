import React, { useState } from 'react';
import classNames from 'classnames';
import { getMediaEmbedInfo, formatDurationSec } from './media-source-utils.js';
import { PlayIcon } from './play-icon.js';
import styles from './media-player.module.scss';

export type MediaPlayerProps = {
  /**
   * the external media url (YouTube, Vimeo, direct audio/video file).
   */
  mediaUrl?: string;

  /**
   * the type of media, used as a hint when the url pattern is ambiguous.
   */
  mediaType?: `video` | `audio`;

  /**
   * title of the media, used for accessible labeling of the embed.
   */
  title?: string;

  /**
   * poster image shown before playback starts.
   */
  posterUrl?: string;

  /**
   * duration of the media, in seconds. shown as a badge over the poster.
   */
  durationSec?: number;

  /**
   * starts the embed immediately, skipping the poster/play step.
   */
  autoPlay?: boolean;

  /**
   * invoked once the viewer starts playback.
   */
  onPlay?: () => void;

  /**
   * class name applied to the root element.
   */
  className?: string;

  /**
   * style applied to the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_MEDIA_URL = `https://www.youtube.com/watch?v=1ZYbU82GVz4`;
const DEFAULT_TITLE = `קרקוע ברגע של פלאשבק`;
const DEFAULT_POSTER =
  `https://storage.googleapis.com/bit-generated-images/images/image_calm__professional_video_thumb_0_1785187458374.png`;

export function MediaPlayer({
  mediaUrl = DEFAULT_MEDIA_URL,
  mediaType = `video`,
  title = DEFAULT_TITLE,
  posterUrl = DEFAULT_POSTER,
  durationSec,
  autoPlay = false,
  onPlay,
  className,
  style,
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const embedInfo = getMediaEmbedInfo(mediaUrl, mediaType);
  const durationLabel = formatDurationSec(durationSec);

  const startPlayback = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  const renderPlayer = () => {
    if (embedInfo.kind === `youtube` || embedInfo.kind === `vimeo`) {
      return (
        <iframe
          className={styles.frame}
          src={embedInfo.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (embedInfo.kind === `audio`) {
      return (
        <div className={styles.audioStage}>
          {posterUrl && <img className={styles.audioPoster} src={posterUrl} alt={title} />}
          <audio className={styles.audioElement} src={mediaUrl} controls autoPlay={autoPlay} />
        </div>
      );
    }

    return (
      <video className={styles.frame} src={mediaUrl} poster={posterUrl} controls autoPlay={autoPlay} />
    );
  };

  return (
    <div className={classNames(styles.mediaPlayer, className)} style={style}>
      <div className={styles.stageWrapper}>
        {isPlaying ? (
          renderPlayer()
        ) : (
          <button type="button" className={styles.posterButton} onClick={() => startPlayback()}>
            {posterUrl ? (
              <img className={styles.poster} src={posterUrl} alt={title} />
            ) : (
              <div className={styles.posterFallback} />
            )}
            <span className={styles.posterOverlay} />
            <span className={styles.playCircle}>
              <PlayIcon className={styles.playIcon} />
            </span>
            {durationLabel && <span className={styles.durationBadge}>{durationLabel}</span>}
          </button>
        )}
      </div>
    </div>
  );
}
