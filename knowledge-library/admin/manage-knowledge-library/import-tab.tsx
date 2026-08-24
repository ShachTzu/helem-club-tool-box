import React, { useMemo, useState } from 'react';
import Papa from 'papaparse';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { SelectList } from '@helemclub/design.inputs.select-list';
import {
  useKnowledgePages,
  useImportKnowledgePages,
  useUploadKnowledgeLibraryImage,
} from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import type { ImportRowInput, ImportSummaryResult } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import { mapCsvRecordToRow } from './csv-row-mapping.js';
import styles from './manage-knowledge-library.module.scss';

function dropZoneProps(onFiles: (files: FileList) => void, isDragging: boolean, setIsDragging: (v: boolean) => void) {
  return {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files);
    },
  };
}

export function ImportTab() {
  const { pages, refetch: refetchPages } = useKnowledgePages();
  const { importPages, loading: importing } = useImportKnowledgePages();
  const { uploadImage, uploading } = useUploadKnowledgeLibraryImage();

  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [csvRows, setCsvRows] = useState<ImportRowInput[]>([]);
  const [csvError, setCsvError] = useState<string | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [topAnchorParentId, setTopAnchorParentId] = useState<string>('');
  const [summary, setSummary] = useState<ImportSummaryResult | undefined>(undefined);
  const [isCsvDragging, setIsCsvDragging] = useState(false);
  const [isImagesDragging, setIsImagesDragging] = useState(false);

  const topAnchorOptions = useMemo(
    () => [{ value: '', label: 'ללא (עמוד עליון)' }, ...pages.map((page) => ({ value: page.id, label: page.title }))],
    [pages]
  );

  const referencedImageFilenames = useMemo(
    () => new Set(csvRows.map((row) => row.imageFilename).filter(Boolean) as string[]),
    [csvRows]
  );

  const handleCsvFiles = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setCsvFile(file);
    setCsvError(undefined);
    setSummary(undefined);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map(mapCsvRecordToRow).filter((row): row is ImportRowInput => row !== null);
        if (!rows.length) {
          setCsvError('לא נמצאו שורות עם כותרת עמוד בקובץ ה-CSV.');
          return;
        }
        setCsvRows(rows);
      },
      error: (err: Error) => setCsvError(`קריאת קובץ ה-CSV נכשלה: ${err.message}`),
    });
  };

  const handleImageFiles = (files: FileList) => {
    setImageFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImageFile = (name: string) => {
    setImageFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const handleRunImport = async () => {
    setSummary(undefined);
    setCsvError(undefined);

    const imagesByFilename: { filename: string; url: string }[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const file of imageFiles) {
      // eslint-disable-next-line no-await-in-loop
      const url = await uploadImage(file);
      if (url) imagesByFilename.push({ filename: file.name, url });
    }

    const result = await importPages(csvRows, imagesByFilename, topAnchorParentId || null);
    if (result) {
      setSummary(result);
      // refresh the parent-page list so newly-created parents (from this
      // batch) immediately show up in the "top anchor" dropdown, instead of
      // staying stuck with the pre-import snapshot.
      refetchPages();
    }
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>ייבוא מקובץ CSV</h2>
          <p className={styles.subtitle}>
            העלאה חצי-אוטומטית של סדרת עמודים: קובץ CSV + קבצי התמונות שהוא מפנה אליהם, ועמוד-אב עליון לכל האצווה.
          </p>
        </div>
      </div>

      <div className={styles.formField}>
        <span className={styles.formLabel}>עמוד-אב עליון לכל האצווה</span>
        <SelectList
          searchable
          options={topAnchorOptions}
          value={topAnchorParentId}
          onChange={(value) => setTopAnchorParentId(value as string)}
        />
      </div>

      <div
        className={classNames(styles.dropZone, isCsvDragging && styles.dropZoneActive)}
        {...dropZoneProps(handleCsvFiles, isCsvDragging, setIsCsvDragging)}
      >
        {csvFile ? (
          <p>
            📄 {csvFile.name} — {csvRows.length} שורות
          </p>
        ) : (
          <p>גררו לכאן את קובץ ה-CSV, או</p>
        )}
        <input
          type="file"
          accept=".csv,text/csv"
          className={styles.hiddenFileInput}
          id="knowledge-library-csv-input"
          onChange={(event) => event.target.files && handleCsvFiles(event.target.files)}
        />
        <label htmlFor="knowledge-library-csv-input" className={styles.dropZoneButton}>
          בחירת קובץ CSV
        </label>
      </div>
      {csvError && <div className={styles.errorBanner}>{csvError}</div>}

      <div
        className={classNames(styles.dropZone, isImagesDragging && styles.dropZoneActive)}
        {...dropZoneProps(handleImageFiles, isImagesDragging, setIsImagesDragging)}
      >
        <p>גררו לכאן את קבצי התמונות (יותאמו לפי שם הקובץ בעמודת Image filename), או</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenFileInput}
          id="knowledge-library-images-input"
          onChange={(event) => event.target.files && handleImageFiles(event.target.files)}
        />
        <label htmlFor="knowledge-library-images-input" className={styles.dropZoneButton}>
          בחירת קבצי תמונה
        </label>
        {imageFiles.length > 0 && (
          <ul className={styles.fileList}>
            {imageFiles.map((file) => {
              const isReferenced = referencedImageFilenames.has(file.name);
              return (
                <li key={file.name} className={styles.fileListItem}>
                  {isReferenced ? '🖼️' : '⚠️'} {file.name}
                  {!isReferenced && <span className={styles.fileListWarning}> — לא מוזכר בשום שורה ב-CSV</span>}
                  <button type="button" onClick={() => removeImageFile(file.name)} className={styles.fileRemoveButton}>
                    הסרה
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className={styles.formActions}>
        <Button
          variant="primary"
          disabled={!csvRows.length}
          loading={importing || uploading}
          onClick={() => handleRunImport()}
        >
          הרצת ייבוא ({csvRows.length} שורות)
        </Button>
      </div>

      {summary && (
        <div className={styles.importSummary}>
          <h3 className={styles.formTitle}>סיכום ייבוא</h3>
          <p>✅ {summary.createdPageIds.length} עמודים נוצרו</p>
          {summary.matchedExistingParents.length > 0 && (
            <p>🔗 שויכו לעמודי-אב קיימים: {summary.matchedExistingParents.join(', ')}</p>
          )}
          {summary.createdParents.length > 0 && (
            <p>🆕 נוצרו עמודי-אב חדשים: {summary.createdParents.join(', ')}</p>
          )}
          {summary.rejected.length > 0 && (
            <div className={styles.errorBanner}>
              <p>❌ {summary.rejected.length} שורות נדחו:</p>
              <ul>
                {summary.rejected.map((rejection) => (
                  <li key={rejection.currentPageTitle}>
                    {rejection.currentPageTitle} — {rejection.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
