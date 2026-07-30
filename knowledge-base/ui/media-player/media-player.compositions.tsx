import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { MediaPlayer } from './media-player.js';

export const VideoRecordPlayer = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 720 }}>
        <MediaPlayer
          mediaUrl="https://www.youtube.com/watch?v=1ZYbU82GVz4"
          mediaType="video"
          title="קרקוע ברגע של פלאשבק"
          posterUrl="https://storage.googleapis.com/bit-generated-images/images/image_calm__professional_video_thumb_0_1785187458374.png"
          durationSec={504}
        />
      </div>
    </MockProvider>
  );
};

export const AudioRecordPlayer = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 720 }}>
        <MediaPlayer
          mediaUrl="https://example.com/media/panic-breathing.mp3"
          mediaType="audio"
          title="נשימה בזמן התקף חרדה"
          posterUrl="https://storage.googleapis.com/bit-generated-images/images/image_podcast_cover_art_style_image__0_1785187458182.png"
          durationSec={662}
        />
      </div>
    </MockProvider>
  );
};

export const VimeoAutoplayPlayer = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 720 }}>
        <MediaPlayer
          mediaUrl="https://vimeo.com/76979871"
          mediaType="video"
          title="החיים שאחרי — שולחן עגול"
          autoPlay
        />
      </div>
    </MockProvider>
  );
};
