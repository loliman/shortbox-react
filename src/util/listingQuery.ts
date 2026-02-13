export type ListingQuery = {
  filter?: string | null;
  order?: string | null;
  direction?: string | null;
} | null | undefined;

export const DEFAULT_ORDER = "updatedAt";
export const DEFAULT_DIRECTION = "DESC";

export function parseListingFilter(query: ListingQuery, us: boolean): Record<string, unknown> {
  if (!query?.filter) return { us };

  try {
    const parsed = JSON.parse(query.filter);
    if (!parsed || typeof parsed !== "object") return { us };
    return { ...(parsed as Record<string, unknown>), us };
  } catch {
    return { us };
  }
}

export function getListingOrder(query: ListingQuery): string {
  return query?.order || DEFAULT_ORDER;
}

export function getListingDirection(query: ListingQuery): string {
  return query?.direction || DEFAULT_DIRECTION;
}

export function buildSortNavigationQuery(
  query: ListingQuery,
  patch: Partial<{ order: string | null; direction: string | null }>
) {
  return {
    filter: query?.filter || null,
    order: patch.order !== undefined ? patch.order : getListingOrder(query),
    direction: patch.direction !== undefined ? patch.direction : getListingDirection(query),
  };
}
