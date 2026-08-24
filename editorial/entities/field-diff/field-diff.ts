/**
 * kind of change detected between two field values.
 */
export type FieldDiffChangeKind = 'added' | 'removed' | 'modified' | 'unchanged';

export type PlainFieldDiff = {
  /**
   * unique id of the field diff, matches the field key.
   */
  id?: string;

  /**
   * key of the field within the payload.
   */
  field: string;

  /**
   * hebrew label of the field.
   */
  label: string;

  /**
   * value of the field before the change.
   */
  before?: any;

  /**
   * value of the field after the change.
   */
  after?: any;

  /**
   * kind of change detected between the before and after values.
   */
  changeKind: FieldDiffChangeKind;
};

export class FieldDiff {
  constructor(
    /**
     * key of the field within the payload.
     */
    readonly field: string,

    /**
     * hebrew label of the field.
     */
    readonly label: string,

    /**
     * kind of change detected between the before and after values.
     */
    readonly changeKind: FieldDiffChangeKind,

    /**
     * value of the field before the change.
     */
    readonly before?: any,

    /**
     * value of the field after the change.
     */
    readonly after?: any
  ) {}

  /**
   * unique id of the field diff.
   */
  get id() {
    return this.field;
  }

  /**
   * serialize a FieldDiff into a plain object.
   */
  toObject(): PlainFieldDiff {
    return {
      id: this.id,
      field: this.field,
      label: this.label,
      before: this.before,
      after: this.after,
      changeKind: this.changeKind,
    };
  }

  /**
   * create a FieldDiff instance from a plain object.
   */
  static from(plainFieldDiff: PlainFieldDiff) {
    const { field, label, before, after, changeKind } = plainFieldDiff;
    return new FieldDiff(field, label, changeKind, before, after);
  }
}

/**
 * compares a value using a stable JSON representation, so that
 * nested objects and arrays are compared by their content and not by reference.
 */
function stableStringify(value: any): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val)
        .sort()
        .reduce((acc: Record<string, any>, key) => {
          acc[key] = val[key];
          return acc;
        }, {});
    }
    return val;
  });
}

function isEmptyValue(value: any): boolean {
  return value === undefined || value === null;
}

function valuesAreEqual(before: any, after: any): boolean {
  if (before === after) return true;
  if (isEmptyValue(before) && isEmptyValue(after)) return true;
  return stableStringify(before) === stableStringify(after);
}

/**
 * generates a default hebrew label for a field, in case none was provided.
 */
function defaultFieldLabel(field: string): string {
  return field;
}

/**
 * compares two payload objects field by field and returns
 * a list of FieldDiff entries describing the changes between them.
 */
export function diffPayloads(
  before: Record<string, any> = {},
  after: Record<string, any> = {},
  fieldLabels: Record<string, string> = {}
): FieldDiff[] {
  const safeBefore = before || {};
  const safeAfter = after || {};

  const fields = Array.from(
    new Set([...Object.keys(safeBefore), ...Object.keys(safeAfter)])
  ).sort();

  return fields.map((field) => {
    const beforeValue = safeBefore[field];
    const afterValue = safeAfter[field];
    const label = fieldLabels[field] || defaultFieldLabel(field);

    const hadBefore = !isEmptyValue(beforeValue);
    const hasAfter = !isEmptyValue(afterValue);

    let changeKind: FieldDiffChangeKind;
    if (!hadBefore && hasAfter) {
      changeKind = 'added';
    } else if (hadBefore && !hasAfter) {
      changeKind = 'removed';
    } else if (!valuesAreEqual(beforeValue, afterValue)) {
      changeKind = 'modified';
    } else {
      changeKind = 'unchanged';
    }

    return new FieldDiff(field, label, changeKind, beforeValue, afterValue);
  });
}

/**
 * builds a short hebrew sentence summarizing a list of field diffs,
 * e.g. "עודכנו 3 שדות, נוסף שדה אחד".
 */
export function summarizeDiff(diffs: FieldDiff[]): string {
  const modifiedCount = diffs.filter((diff) => diff.changeKind === 'modified').length;
  const addedCount = diffs.filter((diff) => diff.changeKind === 'added').length;
  const removedCount = diffs.filter((diff) => diff.changeKind === 'removed').length;

  const parts: string[] = [];

  if (modifiedCount === 1) {
    parts.push('עודכן שדה אחד');
  } else if (modifiedCount > 1) {
    parts.push(`עודכנו ${modifiedCount} שדות`);
  }

  if (addedCount === 1) {
    parts.push('נוסף שדה אחד');
  } else if (addedCount > 1) {
    parts.push(`נוספו ${addedCount} שדות`);
  }

  if (removedCount === 1) {
    parts.push('הוסר שדה אחד');
  } else if (removedCount > 1) {
    parts.push(`הוסרו ${removedCount} שדות`);
  }

  if (parts.length === 0) {
    return 'לא בוצעו שינויים';
  }

  return parts.join(', ');
}
