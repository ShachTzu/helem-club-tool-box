import type { ImportRowInput } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';

/**
 * exact CSV column headers this feature's semi-automatic import expects, per
 * the design doc's sample export.
 */
const COLUMN = {
  text: 'Text',
  imageFilename: 'Image filename',
  videoHtmlEmbed: 'Video HTML embed',
  videoUrl: 'Video URL (YouTube/Spotify)',
  date: 'Date',
  currentPageTitle: 'Current page title',
  currentPageUrl: 'Current page URL',
  parentPageTitle: 'Parent page title (hierarchy)',
} as const;

/**
 * map one parsed CSV record (header -> cell value, as papaparse's
 * header:true mode produces) into an import row. returns null for a row
 * with no page title — nothing to create.
 */
export function mapCsvRecordToRow(record: Record<string, string>): ImportRowInput | null {
  const currentPageTitle = (record[COLUMN.currentPageTitle] || '').trim();
  if (!currentPageTitle) return null;

  return {
    text: record[COLUMN.text] || undefined,
    imageFilename: record[COLUMN.imageFilename]?.trim() || undefined,
    videoHtmlEmbed: record[COLUMN.videoHtmlEmbed] || undefined,
    videoUrl: record[COLUMN.videoUrl] || undefined,
    date: record[COLUMN.date] || undefined,
    currentPageTitle,
    currentPageUrl: record[COLUMN.currentPageUrl] || undefined,
    parentPageTitle: record[COLUMN.parentPageTitle] || undefined,
  };
}
