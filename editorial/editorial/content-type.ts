import type { ComponentType } from 'react';

/**
 * a draft as seen by a publish handler.
 */
export type PublishableDraft = {
  id: string;
  contentType: string;
  contentRef?: string;
  title: string;
  payload: Record<string, any>;
  domains: string[];
  authorId: string;
  authorName: string;
  currentVersion: number;
};

/**
 * a field descriptor declared by a content type, used by the generic editor
 * fallback and by the diff viewer for Hebrew field labels.
 */
export type ContentTypeFieldInfo = {
  /**
   * the payload key.
   */
  name: string;

  /**
   * Hebrew label of the field.
   */
  label: string;

  /**
   * whether the field is multi-line.
   */
  multiline?: boolean;
};

/**
 * the browser-side registration of a content type: how it is labelled, and
 * which component edits it. registered by feature aspects into the
 * ContentTypeUi slot.
 */
export type ContentTypeUi = {
  /**
   * unique key of the content type, e.g. 'post' / 'media-record'.
   */
  contentType: string;

  /**
   * Hebrew label shown to writers, e.g. 'מאמר בבלוג'.
   */
  label: string;

  /**
   * optional icon rendered next to the label.
   */
  icon?: ComponentType<any>;

  /**
   * the editor component for this content type's payload.
   */
  editor: ComponentType<{
    payload: Record<string, any>;
    onChange: (payload: Record<string, any>) => void;
    readOnly?: boolean;
  }>;

  /**
   * optional read-only preview of the payload.
   */
  preview?: ComponentType<{ payload: Record<string, any> }>;

  /**
   * the fields of this content type.
   */
  fields: ContentTypeFieldInfo[];
};

/**
 * a lightweight description of a registered content type, returned to
 * consumers that only need the key and label.
 */
export type ContentTypeInfo = {
  contentType: string;
  label: string;
  fields: ContentTypeFieldInfo[];
};

/**
 * the node-side registration of a content type: how an approved draft is
 * written into the feature's own store. registered by feature aspects into
 * the PublishHandler slot.
 */
export type PublishHandler = {
  /**
   * the content type this handler publishes.
   */
  contentType: string;

  /**
   * writes the approved draft into the feature's store and returns the id
   * of the published record.
   */
  publish: (draft: PublishableDraft) => Promise<{ contentRef: string; url?: string }>;

  /**
   * reverts a published record back to unpublished.
   */
  unpublish?: (contentRef: string) => Promise<void>;

  /**
   * validates the payload before publishing, returning Hebrew errors.
   */
  validate?: (payload: Record<string, any>) => { valid: boolean; errors?: string[] };
};

/**
 * an extra action a feature can attach to a draft in the library UI.
 */
export type DraftAction = {
  id: string;
  label: string;
  component: ComponentType<{ draftId: string; contentType: string }>;
  order?: number;
};
