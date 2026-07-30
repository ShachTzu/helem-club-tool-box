/**
 * form values used by the publish-recording overlay, pushing a past event's
 * recording into a knowledge-base label as a new media record.
 */
export type PublishRecordingValues = {
  labelId: string;
  title: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  domains: string[];
};
