const SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/**
 * escape a user-supplied string so it can be embedded safely inside a RegExp,
 * preventing search input from being interpreted as a pattern.
 *
 * @param value the raw user input to escape.
 * @returns the escaped string, safe to pass to the RegExp constructor.
 */
export function escapeRegExp(value: string): string {
  return value.replace(SPECIAL_CHARS, '\\$&');
}
