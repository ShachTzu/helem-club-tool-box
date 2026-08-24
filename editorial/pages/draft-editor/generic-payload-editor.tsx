import React from 'react';
import { TextInput } from '@helemclub/design.inputs.text-input';
import { Textarea } from '@helemclub/design.inputs.textarea';
import styles from './draft-editor.module.scss';

/**
 * a field descriptor supplied by the content type registration.
 */
export type ContentTypeField = {
  /**
   * the payload key this field edits.
   */
  name: string;

  /**
   * Hebrew label rendered above the field.
   */
  label: string;

  /**
   * whether the field should render as a multi-line textarea.
   */
  multiline?: boolean;
};

export type GenericPayloadEditorProps = {
  /**
   * the current draft payload.
   */
  payload: Record<string, any>;

  /**
   * called with the full updated payload whenever a field changes.
   */
  onChange: (payload: Record<string, any>) => void;

  /**
   * the fields to render, as declared by the content type.
   */
  fields?: ContentTypeField[];

  /**
   * renders the fields as read-only.
   */
  readOnly?: boolean;
};

/**
 * the fallback editor used when a content type has not registered a
 * dedicated editor component. renders a simple text field per declared
 * field, so a draft is always editable even before a feature wires up its
 * own editor.
 */
export function GenericPayloadEditor({
  payload,
  onChange,
  fields = [],
  readOnly = false,
}: GenericPayloadEditorProps) {
  const resolvedFields: ContentTypeField[] =
    fields.length > 0
      ? fields
      : Object.keys(payload).map((key) => ({ name: key, label: key, multiline: true }));

  if (resolvedFields.length === 0) {
    return (
      <p className={styles.genericHint}>
        לסוג התוכן הזה עדיין לא הוגדרו שדות עריכה.
      </p>
    );
  }

  return (
    <div className={styles.genericEditor}>
      {resolvedFields.map((field) => {
        const value = payload[field.name] ?? '';
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        const update = (next: string) => onChange({ ...payload, [field.name]: next });

        return (
          <label key={field.name} className={styles.genericField}>
            <span className={styles.genericLabel}>{field.label}</span>
            {field.multiline ? (
              <Textarea value={stringValue} onChange={update} disabled={readOnly} minRows={4} />
            ) : (
              <TextInput value={stringValue} onChange={update} disabled={readOnly} />
            )}
          </label>
        );
      })}
    </div>
  );
}
