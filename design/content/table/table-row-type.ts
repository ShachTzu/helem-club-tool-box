/**
 * a single row of data rendered by the table.
 * keys must match the `key` field of the columns configuration.
 */
export type TableRow = Record<string, string | number | boolean | null | undefined>;
