import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockMediaRecord } from '@helemclub/knowledge-base.entities.media-record';
import { RecordPage } from './record-page.js';

/** A media record rendered in full. */
export const BasicRecordPage = () => (
  <MockProvider>
    <RecordPage mockRecord={mockMediaRecord()} />
  </MockProvider>
);
