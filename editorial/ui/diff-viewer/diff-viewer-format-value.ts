/**
 * formats a field diff value (which may be a primitive, array or object)
 * into a short, readable hebrew-friendly string for display.
 */
export function formatDiffValue(value: unknown): string {
  if (value === undefined || value === null || value === ``) {
    return `ריק`;
  }

  if (Array.isArray(value)) {
    return value.length ? value.map((item) => formatDiffValue(item)).join(`, `) : `ריק`;
  }

  if (typeof value === `object`) {
    return JSON.stringify(value);
  }

  return String(value);
}
