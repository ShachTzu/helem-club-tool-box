export type MediaSourceKind = 'youtube' | 'vimeo' | 'audio' | 'video' | 'unknown';

export type MediaEmbedInfo = {
  /**
   * the detected kind of media source.
   */
  kind: MediaSourceKind;

  /**
   * the embeddable iframe url, when relevant (youtube/vimeo).
   */
  embedUrl?: string;
};

const YOUTUBE_PATTERN = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i;
const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/i;
const AUDIO_EXTENSION_PATTERN = /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i;

/**
 * resolve the embeddable media source information for a given url,
 * detecting YouTube, Vimeo, audio files or falling back to a native video/unknown source.
 */
export function getMediaEmbedInfo(mediaUrl: string, mediaType?: `video` | `audio`): MediaEmbedInfo {
  if (!mediaUrl) return { kind: `unknown` };

  const youtubeMatch = mediaUrl.match(YOUTUBE_PATTERN);
  if (youtubeMatch) {
    return {
      kind: `youtube`,
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`,
    };
  }

  const vimeoMatch = mediaUrl.match(VIMEO_PATTERN);
  if (vimeoMatch) {
    return {
      kind: `vimeo`,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  if (mediaType === `audio` || AUDIO_EXTENSION_PATTERN.test(mediaUrl)) {
    return { kind: `audio` };
  }

  if (mediaType === `video`) {
    return { kind: `video` };
  }

  return { kind: `unknown` };
}

/**
 * format a duration in seconds into a `mm:ss` or `h:mm:ss` display string.
 */
export function formatDurationSec(durationSec?: number): string | undefined {
  if (durationSec === undefined || Number.isNaN(durationSec)) return undefined;

  const totalSeconds = Math.max(0, Math.round(durationSec));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, `0`);

  if (hours > 0) {
    const paddedMinutes = String(minutes).padStart(2, `0`);
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}
