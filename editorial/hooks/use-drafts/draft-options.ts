/**
 * options for filtering the drafts list. mirrors the ListDraftsOptions
 * GraphQL input type.
 */
export type ListDraftsOptions = {
  /**
   * filter drafts by content type key, e.g. 'post' / 'media-record'.
   */
  contentType?: string;

  /**
   * filter drafts by one or more statuses.
   */
  status?: string[];

  /**
   * filter drafts by author id.
   */
  authorId?: string;

  /**
   * filter drafts by one or more domains.
   */
  domains?: string[];

  /**
   * free text search across the draft title and content.
   */
  search?: string;

  /**
   * maximum number of drafts to return.
   */
  limit?: number;

  /**
   * number of drafts to skip, for pagination.
   */
  offset?: number;
};

/**
 * input for creating or updating a draft. mirrors the SaveDraftOptions
 * GraphQL input type.
 */
export type SaveDraftInput = {
  /**
   * id of the draft to update. omit to create a new draft.
   */
  id?: string;

  /**
   * content type key, e.g. 'post' / 'media-record'.
   */
  contentType?: string;

  /**
   * id of the already-published record, when editing existing content.
   */
  contentRef?: string;

  /**
   * title of the draft.
   */
  title?: string;

  /**
   * the actual content, open schema defined by the feature.
   */
  payload?: Record<string, any>;

  /**
   * domains this draft is dealing with.
   */
  domains?: string[];

  /**
   * short, human readable summary of what changed in this save, used for
   * the revision history.
   */
  changeSummary?: string;
};
