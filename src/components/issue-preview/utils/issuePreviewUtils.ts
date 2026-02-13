import type { CSSProperties } from "react";

interface StoryParent {
  children?: Array<unknown>;
  collectedmultipletimes?: boolean;
}

interface StoryChild {
  issue?: { collected?: boolean };
}

interface StoryLike {
  onlyapp?: boolean;
  firstapp?: boolean;
  otheronlytb?: boolean;
  exclusive?: boolean;
  onlyoneprint?: boolean;
  onlytb?: boolean;
  reprintOf?: unknown;
  reprints?: Array<unknown>;
  parent?: StoryParent;
  children?: Array<StoryChild>;
  collectedmultipletimes?: boolean;
}

interface CoverLike {
  url?: string | null;
}

export type PreviewIssue = {
  id?: string | number | null;
  number?: string | null;
  title?: string | null;
  verified?: boolean | null;
  stories?: Array<StoryLike>;
  covers?: Array<{ parent?: { issue?: { cover?: CoverLike | null } | null } | null }>;
  cover?: CoverLike | null;
  collected?: boolean;
  format?: string | null;
  variant?: string | null;
  series?: {
    title?: string | null;
    volume?: number | null;
    startyear?: number | null;
    endyear?: number | null;
    publisher?: { name?: string | null; us?: boolean | null } | null;
  } | null;
};

export type IssuePreviewFlags = {
  collected: boolean;
  collectedMultipleTimes: boolean;
  sellable: number;
  hasOnlyApp: boolean;
  hasFirstApp: boolean;
  hasOtherOnlyTb: boolean;
  hasExclusive: boolean;
  isPureReprintDe: boolean;
  hasNoStoriesDe: boolean;
  hasOnlyOnePrintUs: boolean;
  hasOnlyTbUs: boolean;
  notPublishedInDe: boolean;
  hasReprintOfUs: boolean;
  hasReprintsUs: boolean;
};

export function getIssueVariantLabel(issue: PreviewIssue): string {
  if (!issue.format) return "";

  let variant = issue.format;
  if (issue.variant) variant += " (" + issue.variant + " Variant)";

  return variant;
}

export function getIssuePreviewCover(issue: PreviewIssue, us: boolean): { coverUrl: string; blurCover: boolean } {
  const directCover = issue.cover?.url?.trim();
  if (directCover) return { coverUrl: directCover, blurCover: false };

  const parentCover = issue.covers?.[0]?.parent?.issue?.cover?.url?.trim();
  if (!us && parentCover) return { coverUrl: parentCover, blurCover: true };

  return { coverUrl: "", blurCover: false };
}

export function getIssuePreviewBorderRadius(
  idx?: number,
  isLast?: boolean
): CSSProperties["borderRadius"] {
  if (idx === 0) return isLast ? "8px" : "8px 8px 0 0";
  if (isLast) return "0 0 8px 8px";
  return 0;
}

export function getIssuePreviewFlags(issue: PreviewIssue, us: boolean, hasSession: boolean): IssuePreviewFlags {
  const stories = issue.stories || [];

  const hasOnlyApp = stories.some((story) => Boolean(story.onlyapp));
  const hasFirstApp = stories.some((story) => Boolean(story.firstapp));
  const hasOtherOnlyTb = stories.some((story) => Boolean(story.otheronlytb));
  const hasExclusive = stories.some((story) => Boolean(story.exclusive));
  const hasOnlyOnePrintUs = stories.some((story) => Boolean(story.onlyoneprint));
  const hasOnlyTbUs = stories.some((story) => Boolean(story.onlytb));
  const hasReprintOfUs = stories.some((story) => Boolean(story.reprintOf));
  const hasReprintsUs = stories.some((story) => (story.reprints?.length || 0) > 0);

  const allAreChildrenReprints =
    stories.length > 0 && stories.every((story) => (story.parent?.children?.length || 0) > 1);
  const isPureReprintDe = !us && allAreChildrenReprints && !hasFirstApp;

  const hasNoStoriesDe = !us && stories.length === 0;
  const notPublishedInDe = us && stories.every((story) => (story.children?.length || 0) === 0);

  let collected = Boolean(issue.collected);
  let collectedMultipleTimes = false;
  let sellable = 0;

  if (us) {
    for (const story of stories) {
      if (!collectedMultipleTimes && story.collectedmultipletimes === true) {
        collectedMultipleTimes = true;
      }

      for (const child of story.children || []) {
        if (!collected && child.issue?.collected) {
          collected = true;
        }
      }
    }
  } else {
    for (const story of stories) {
      if (story.parent?.collectedmultipletimes === true) {
        sellable += 1;
        if (!collectedMultipleTimes) collectedMultipleTimes = true;
      }
    }
  }

  if (!hasSession) {
    collected = false;
    collectedMultipleTimes = false;
    sellable = 0;
  }

  return {
    collected,
    collectedMultipleTimes,
    sellable,
    hasOnlyApp,
    hasFirstApp,
    hasOtherOnlyTb,
    hasExclusive,
    isPureReprintDe,
    hasNoStoriesDe,
    hasOnlyOnePrintUs,
    hasOnlyTbUs,
    notPublishedInDe,
    hasReprintOfUs,
    hasReprintsUs,
  };
}
