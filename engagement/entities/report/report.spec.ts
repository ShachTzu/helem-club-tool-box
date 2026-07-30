import { Report } from './report.js';
import { mockReport, mockReports } from './report.mock.js';

it('has a Report.from() method', () => {
  expect(Report.from).toBeTruthy();
});

it('should create a Report instance from a plain object', () => {
  const report = Report.from({
    id: 'r1',
    commentId: 'c1',
    deviceId: 'd1',
    createdAt: '2024-05-01T10:00:00.000Z',
  });

  expect(report).toBeInstanceOf(Report);
  expect(report.id).toEqual('r1');
  expect(report.commentId).toEqual('c1');
  expect(report.deviceId).toEqual('d1');
  expect(report.createdAt).toEqual('2024-05-01T10:00:00.000Z');
});

it('should serialize a Report into a plain object', () => {
  const report = Report.from({
    id: 'r1',
    commentId: 'c1',
    deviceId: 'd1',
    createdAt: '2024-05-01T10:00:00.000Z',
  });

  expect(report.toObject()).toEqual({
    id: 'r1',
    commentId: 'c1',
    deviceId: 'd1',
    createdAt: '2024-05-01T10:00:00.000Z',
  });
});

it('should create a new Report using Report.create()', () => {
  const report = Report.create('c1', 'd1');

  expect(report.commentId).toEqual('c1');
  expect(report.deviceId).toEqual('d1');
  expect(report.id).toEqual('c1:d1');
  expect(typeof report.createdAt).toEqual('string');
});

it('should default missing properties safely when using from()', () => {
  const report = Report.from({} as any);

  expect(report.id).toEqual('');
  expect(report.commentId).toEqual('');
  expect(report.deviceId).toEqual('');
  expect(typeof report.createdAt).toEqual('string');
});

it('mockReport() should return a Report instance', () => {
  const report = mockReport();

  expect(report).toBeInstanceOf(Report);
  expect(report.id).toBeTruthy();
  expect(report.commentId).toBeTruthy();
  expect(report.deviceId).toBeTruthy();
});

it('mockReport() should support partial overrides', () => {
  const report = mockReport({ commentId: 'custom-comment' });

  expect(report.commentId).toEqual('custom-comment');
});

it('mockReports() should return a list of Report instances', () => {
  const reports = mockReports();

  expect(reports.length).toEqual(3);
  reports.forEach((report) => {
    expect(report).toBeInstanceOf(Report);
  });
});
