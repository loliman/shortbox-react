import type { Issue } from "../../../../types/domain";

type ArcLike = {
  title?: string | null;
  type?: string | null;
};

export function getTodayLocalDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function collectIssueArcs(issueData: Issue, us: boolean) {
  if (us) {
    return (issueData.arcs || [])
      .filter((arc): arc is ArcLike => Boolean(arc?.title))
      .map((arc) => ({
        title: arc.title || "",
        type: arc.type || "STORYARC",
      }));
  }

  const deduped = new Map<string, { title: string; type: string }>();
  for (const story of issueData.stories || []) {
    for (const arc of story?.parent?.issue?.arcs || []) {
      if (!arc?.title) continue;
      const key = `${arc.type || "STORYARC"}|${arc.title}`;
      if (!deduped.has(key)) {
        deduped.set(key, { title: arc.title, type: arc.type || "STORYARC" });
      }
    }
  }

  return Array.from(deduped.values());
}

export function getContainsItemKey(
  item: { __typename?: string | null; number?: string | number | null },
  idx: number
): string {
  const type = item?.__typename || "item";
  const number = item?.number || String(idx);
  return `${type}|${number}|${idx}`;
}

export function getVariantKey(
  variant: { format?: string | null; variant?: string | null; number?: string | number | null },
  idx: number
): string {
  return `${variant.format || ""}|${variant.variant || ""}|${variant.number || idx}`;
}

export function compareIssueNumbers(issueNumber: string, filterNumber: string): number {
  const issueNumeric = Number(issueNumber);
  const filterNumeric = Number(filterNumber);

  if (Number.isFinite(issueNumeric) && Number.isFinite(filterNumeric)) {
    return issueNumeric - filterNumeric;
  }

  return String(issueNumber).localeCompare(String(filterNumber), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
