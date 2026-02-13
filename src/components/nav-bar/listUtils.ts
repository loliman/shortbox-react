import { getListQuery } from "../../graphql/queriesTyped";
import { HierarchyLevel } from "../../util/hierarchy";
import type { Connection, QueryCollection } from "@shortbox/contract";

export function parseFilter(filterValue?: string | null) {
  if (!filterValue) return undefined;

  try {
    return JSON.parse(filterValue);
  } catch {
    return undefined;
  }
}

export function normalizeListLevelAndSelected(level, selected) {
  if (level === HierarchyLevel.ISSUE) {
    return {
      level: HierarchyLevel.SERIES,
      selected: selected?.issue?.series ? { series: selected.issue.series } : selected?.issue,
    };
  }

  return { level, selected };
}

export function scrollToSelectedIssue(data, level, selected, listElement: HTMLUListElement | null) {
  if (!level || !selected?.issue?.number || !listElement) return;
  if (level !== HierarchyLevel.SERIES && level !== HierarchyLevel.ISSUE) return;

  const query = getListQuery(level);
  const queryName = getQueryName(query).toLowerCase();
  const items = toNodeList(data, queryName);
  if (!items) return;

  const idx = items.findIndex((entry) => entry?.number === selected.issue.number);
  if (idx < 0) return;

  const currentItem = listElement.querySelector(`[data-item-index="${idx}"]`) as HTMLElement | null;
  if (!currentItem) return;

  currentItem.scrollIntoView({
    block: "center",
    inline: "nearest",
  });
}

export function toNodeList(data, queryName) {
  if (!data?.[queryName]) return null;

  const value = data[queryName];
  if (Array.isArray(value)) return value;
  if (isConnection(value)) return value.edges.map((edge) => edge.node).filter(Boolean);

  return null;
}

export function getItemKey(item, fallbackIndex: number): string {
  if (item?.number && item?.series?.title && item?.series?.volume && item?.series?.publisher?.name) {
    return [
      "issue",
      item.series.publisher.name,
      item.series.title,
      item.series.volume,
      item.number,
      item.format || "",
      item.variant || "",
    ].join("|");
  }

  if (item?.title && item?.volume && item?.publisher?.name) {
    return ["series", item.publisher.name, item.title, item.volume].join("|");
  }

  if (item?.name) {
    return ["publisher", item.name].join("|");
  }

  return "entry|" + fallbackIndex;
}

function isConnection(value: QueryCollection<unknown>): value is Connection<unknown> {
  return !!value && !Array.isArray(value) && "edges" in value && "pageInfo" in value;
}

export function getQueryName(query: { definitions?: ReadonlyArray<unknown> }): string {
  const firstDefinition = query.definitions?.[0];
  if (!firstDefinition || typeof firstDefinition !== "object") return "";

  const withName = firstDefinition as { name?: { value?: string } };
  return withName.name?.value || "";
}
