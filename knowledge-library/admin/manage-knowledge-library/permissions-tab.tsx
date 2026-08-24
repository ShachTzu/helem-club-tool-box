import React, { useState } from 'react';
import { Button } from '@helemclub/design.actions.button';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { useKnowledgeLibraryEditors } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import styles from './manage-knowledge-library.module.scss';

/**
 * admin-only: grant/revoke access to this feature's own editor allowlist —
 * separate from the platform's global roles, so a community manager can get
 * knowledge-library access without also getting blog-authoring or
 * moderation rights.
 */
export function PermissionsTab() {
  const { editors, loading, error, grantEditor, revokeEditor, granting } = useKnowledgeLibraryEditors();
  const [newUserId, setNewUserId] = useState('');

  const handleGrant = async () => {
    if (!newUserId.trim()) return;
    await grantEditor(newUserId.trim());
    setNewUserId('');
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>הרשאות ספריית הידע</h2>
          <p className={styles.subtitle}>
            משתמשים ברשימה זו יכולים לנהל את תוכן ספריית הידע, ללא צורך בהרשאת מנהל/מודרטור כללית.
          </p>
        </div>
      </div>

      <div className={styles.formActions}>
        <TextInput
          placeholder="מזהה משתמש (User ID)"
          value={newUserId}
          onChange={setNewUserId}
        />
        <Button variant="accent" loading={granting} onClick={() => handleGrant()}>
          הענקת הרשאה
        </Button>
      </div>

      {error && <div className={styles.errorBanner}>אירעה שגיאה בטעינת הרשאות.</div>}

      {loading ? (
        <div className={styles.loadingState}>טוען הרשאות...</div>
      ) : editors.length === 0 ? (
        <p className={styles.subtitle}>אין כרגע עורכים מורשים מעבר למנהלים/מודרטורים הכלליים.</p>
      ) : (
        <ul className={styles.fileList}>
          {editors.map((editor) => (
            <li key={editor.userId} className={styles.fileListItem}>
              {editor.userId} — הוענק ב-{new Date(editor.grantedAt).toLocaleDateString('he-IL')}
              <button type="button" className={styles.fileRemoveButton} onClick={() => revokeEditor(editor.userId)}>
                ביטול הרשאה
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
