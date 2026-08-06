import { mapCsvRecordToRow } from './csv-row-mapping.js';

const SAMPLE_RECORD = {
  Text: 'טקסט לדוגמה',
  'Image filename': '',
  'Video HTML embed': '<iframe src="https://www.youtube.com/embed/abc"></iframe>',
  'Video URL (YouTube/Spotify)': 'https://www.youtube.com/watch?v=abc',
  Date: '2023-09-11',
  'Current page title': 'איך נראים החיים שלך בזמן האחרון?',
  'Current page URL': 'https://helem.club/home/start/',
  'Parent page title (hierarchy)': 'מה זה פוסט טראומה והאם יש לי כזו?',
};

it('maps every CSV column to its corresponding import row field', () => {
  expect(mapCsvRecordToRow(SAMPLE_RECORD)).toEqual({
    text: 'טקסט לדוגמה',
    imageFilename: undefined,
    videoHtmlEmbed: '<iframe src="https://www.youtube.com/embed/abc"></iframe>',
    videoUrl: 'https://www.youtube.com/watch?v=abc',
    date: '2023-09-11',
    currentPageTitle: 'איך נראים החיים שלך בזמן האחרון?',
    currentPageUrl: 'https://helem.club/home/start/',
    parentPageTitle: 'מה זה פוסט טראומה והאם יש לי כזו?',
  });
});

it('returns null for a row with no page title — nothing to create', () => {
  expect(mapCsvRecordToRow({ ...SAMPLE_RECORD, 'Current page title': '' })).toBeNull();
  expect(mapCsvRecordToRow({ ...SAMPLE_RECORD, 'Current page title': '   ' })).toBeNull();
});

it('maps a populated image filename', () => {
  const row = mapCsvRecordToRow({ ...SAMPLE_RECORD, 'Image filename': 'photo.png' });
  expect(row?.imageFilename).toBe('photo.png');
});

it('leaves optional empty columns undefined rather than empty strings', () => {
  const row = mapCsvRecordToRow({
    ...SAMPLE_RECORD,
    'Video HTML embed': '',
    'Video URL (YouTube/Spotify)': '',
    'Parent page title (hierarchy)': '',
  });
  expect(row?.videoHtmlEmbed).toBeUndefined();
  expect(row?.videoUrl).toBeUndefined();
  expect(row?.parentPageTitle).toBeUndefined();
});
