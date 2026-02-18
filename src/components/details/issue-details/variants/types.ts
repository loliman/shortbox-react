export type VariantIssue = {
  format?: string | null;
  variant?: string | null;
  collected?: boolean | null;
  cover?: { url?: string | null } | null;
  stories?: Array<unknown | null> | null;
  variants?: Array<VariantIssue | null> | null;
};
