import { romanize, wrapItem } from "./util";
import type { Issue, Publisher, RouteParams, SelectedRoot, Series } from "../types/domain";

export const HierarchyLevel = Object.freeze({
  ROOT: "ROOT",
  PUBLISHER: "PUBLISHER",
  SERIES: "SERIES",
  ISSUE: "ISSUE",
});

export type HierarchyLevelType = (typeof HierarchyLevel)[keyof typeof HierarchyLevel];

export function getHierarchyLevel(item: SelectedRoot): HierarchyLevelType {
  if (item.publisher) return HierarchyLevel.PUBLISHER;
  if (item.series) return HierarchyLevel.SERIES;
  if (item.issue) return HierarchyLevel.ISSUE;
  return HierarchyLevel.ROOT;
}

export function generateUrl(item: SelectedRoot, us: boolean): string {
  if (hasTypename(item)) item = wrapItem(item);

  const url = us ? "/us/" : "/de/";

  if (!item.publisher && !item.series && !item.issue) return url;

  if (item.publisher) return url + encodeURIComponent(item.publisher.name);

  if (item.series) {
    return (
      url +
      encodeURIComponent(item.series.publisher.name.replace(/%/g, "%25")) +
      "/" +
      encodeURIComponent(item.series.title.replace(/%/g, "%25") + "_Vol_" + item.series.volume)
    );
  }

  if (!item.issue?.variant || item.issue.variant === "") {
    return (
      url +
      encodeURIComponent(item.issue?.series.publisher.name.replace(/%/g, "%25") || "") +
      "/" +
      encodeURIComponent(
        (item.issue?.series.title || "").replace(/%/g, "%25") + "_Vol_" + item.issue?.series.volume
      ) +
      "/" +
      encodeURIComponent((item.issue?.number || "").replace(/%/g, "%25")) +
      (item.issue?.format ? "/" + encodeURIComponent(item.issue.format) : "")
    );
  }

  return (
    url +
    encodeURIComponent(item.issue.series.publisher.name.replace(/%/g, "%25")) +
    "/" +
    encodeURIComponent(
      item.issue.series.title.replace(/%/g, "%25") + "_Vol_" + item.issue.series.volume
    ) +
    "/" +
    encodeURIComponent(item.issue.number.replace(/%/g, "%25")) +
    "/" +
    encodeURIComponent((item.issue.format || "") + "_" + item.issue.variant)
  );
}

export function getSelected(params: RouteParams, us: boolean): SelectedRoot {
  const selected: SelectedRoot = { us };

  if (params.publisher) {
    selected.publisher = { name: decodeURIComponent(params.publisher) };
  }

  if (params.series) {
    const seriesValue = decodeURIComponent(params.series);
    const volumeSeparator = "_Vol_";
    const separatorIndex = seriesValue.lastIndexOf(volumeSeparator);
    const hasSeparator = separatorIndex > -1;
    const legacySeparatorIndex = seriesValue.lastIndexOf("_");
    const hasLegacySeparator = !hasSeparator && legacySeparatorIndex > -1;
    const title = hasSeparator
      ? seriesValue.substring(0, separatorIndex)
      : hasLegacySeparator
        ? seriesValue.substring(0, legacySeparatorIndex)
        : seriesValue;
    const volumeText = hasSeparator
      ? seriesValue.substring(separatorIndex + volumeSeparator.length)
      : hasLegacySeparator
        ? seriesValue.substring(legacySeparatorIndex + 1)
        : "1";
    const volume = Number.parseInt(volumeText, 10);

    selected.series = {
      title,
      volume,
      publisher: { name: selected.publisher?.name || "" },
    };
    selected.publisher = undefined;
  }

  if (params.issue && selected.series) {
    selected.issue = {
      number: decodeURIComponent(params.issue),
      series: {
        title: selected.series.title,
        volume: selected.series.volume,
        publisher: { name: selected.series.publisher.name },
      },
    };
    selected.series = undefined;
  }

  if (params.variant && selected.issue) {
    const variant = decodeURIComponent(params.variant);
    const separatorIndex = variant.indexOf("_");
    if (separatorIndex > -1) {
      selected.issue.format = variant.substring(0, separatorIndex);
      selected.issue.variant = variant.substring(separatorIndex + 1);
    } else {
      selected.issue.format = variant;
    }
  }

  return selected;
}

export function generateLabel(item?: SelectedRoot | null): string {
  if (!item) return "";

  if (hasTypename(item)) item = wrapItem(item);

  if (!item.publisher && !item.series && !item.issue) {
    return "Shortbox - Das deutsche Archiv für Marvel Comics";
  }

  if (item.publisher) return item.publisher.name;

  if (item.series) {
    let year = "";
    if (item.series.startyear) year = " (" + item.series.startyear + ")";
    return (
      item.series.title +
      (item.series.publisher ? " (Vol. " + romanize(item.series.volume) + ")" + year : "")
    );
  }

  if (item.issue) {
    let year = "";
    if (item.issue.series.startyear) year = " (" + item.issue.series.startyear + ")";

    return (
      item.issue.series.title +
      (item.issue.series.publisher ? " (Vol. " + romanize(item.issue.series.volume) + ")" : "") +
      (year || "") +
      " #" +
      item.issue.number
    );
  }

  return "";
}

function hasTypename(
  item: SelectedRoot | Publisher | Series | Issue
): item is Publisher | Series | Issue {
  return !!item && typeof item === "object" && "__typename" in item && Boolean(item.__typename);
}
