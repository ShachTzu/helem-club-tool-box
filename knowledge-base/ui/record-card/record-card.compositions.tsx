import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockMediaRecords } from '@helemclub/knowledge-base.entities.media-record';
import { RecordCard } from './record-card.js';

const records = mockMediaRecords();

export const BasicRecordCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 320 }}>
        <RecordCard record={records[0].toObject()} />
      </div>
    </MockProvider>
  );
};

export const RecordCardsGrid = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 18,
        }}
      >
        {records.map((record) => (
          <RecordCard key={record.slug} record={record.toObject()} />
        ))}
      </div>
    </MockProvider>
  );
};

export const AudioRecordCard = () => {
  const audioRecord = records[1].toObject();
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 320 }}>
        <RecordCard record={audioRecord} />
      </div>
    </MockProvider>
  );
};
