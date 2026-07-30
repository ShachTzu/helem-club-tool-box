import { v4 as uuid } from 'uuid';
import { Report } from './report.js';
import type { PlainReport } from './report.js';

/**
 * generate a single mock Report, with optional property overrides.
 */
export function mockReport(overrides: Partial<PlainReport> = {}): Report {
  return Report.from({
    id: uuid(),
    commentId: uuid(),
    deviceId: uuid(),
    createdAt: new Date('2024-05-01T10:00:00.000Z').toISOString(),
    ...overrides,
  });
}

/**
 * generate a list of mock Reports for development and testing purposes.
 */
export function mockReports(): Report[] {
  const commentId = uuid();

  return [
    mockReport({ commentId, createdAt: new Date('2024-05-01T10:00:00.000Z').toISOString() }),
    mockReport({ commentId, createdAt: new Date('2024-05-01T11:15:00.000Z').toISOString() }),
    mockReport({ createdAt: new Date('2024-05-02T09:30:00.000Z').toISOString() }),
  ];
}
