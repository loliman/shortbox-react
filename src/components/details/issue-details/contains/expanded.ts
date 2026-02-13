import { compareIssueNumbers } from "../utils/issueDetailsUtils";

export type QueryParams = {
  expand?: string;
  filter?: string;
} | null;

type SeriesLike = {
  title?: string;
  volume?: string | number;
  publisher?: { name?: string };
};

type IssueLike = {
  number?: string | number;
  series?: SeriesLike;
  arcs?: Array<{ title?: string | null }> | null;
};

type PersonLike = { name?: string; type?: string };
type AppearanceLike = { name?: string };

export type ItemLike = {
  __typename?: string;
  number?: string | number;
  onlyapp?: boolean;
  firstapp?: boolean;
  otheronlytb?: boolean;
  onlytb?: boolean;
  onlyoneprint?: boolean;
  exclusive?: boolean;
  children?: unknown[] | null;
  parent?: ItemLike | null;
  issue?: IssueLike | null;
  individuals?: PersonLike[] | null;
  appearances?: AppearanceLike[] | null;
};

type ExpandedFilter = {
  onlyPrint?: boolean;
  firstPrint?: boolean;
  otherOnlyTb?: boolean;
  onlyTb?: boolean;
  onlyOnePrint?: boolean;
  exclusive?: boolean;
  noPrint?: boolean;
  series?: SeriesLike[];
  publishers?: Array<{ name?: string }>;
  publisher?: { name?: string };
  numbers?: Array<{ compare?: "=" | ">" | "<" | ">=" | "<="; number?: string | number }>;
  arcs?: string;
  individuals?: PersonLike[];
  appearances?: string;
};

export function expanded(item: ItemLike, query?: QueryParams): boolean {
  if (query?.expand && String(query.expand) === String(item?.number ?? "")) {
    return true;
  }

  const filter = query?.filter;
  if (!filter) return false;

  let currentFilter: ExpandedFilter | null = null;
  try {
    const parsed = JSON.parse(filter) as ExpandedFilter;
    currentFilter = parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return false;
  }
  if (!currentFilter) return false;

  const compare = item?.parent ? item.parent : item;
  const compareIssue = resolveIssue(compare);
  const compareIndividuals = toArray<PersonLike>(compare?.individuals);
  const compareAppearances = toArray<AppearanceLike>(compare?.appearances);
  const compareArcs = toArray<{ title?: string | null }>(compareIssue?.arcs);
  const itemIndividuals = toArray<PersonLike>(item?.individuals);
  const filterIndividuals = toArray<PersonLike>(currentFilter.individuals);

  let isExpanded = false;
  isExpanded = (currentFilter.onlyPrint && Boolean(item?.onlyapp)) || isExpanded;
  isExpanded = (currentFilter.firstPrint && Boolean(item?.firstapp)) || isExpanded;
  isExpanded = (currentFilter.otherOnlyTb && Boolean(item?.otheronlytb)) || isExpanded;
  isExpanded = (currentFilter.onlyTb && Boolean(item?.onlytb)) || isExpanded;
  isExpanded = (currentFilter.onlyOnePrint && Boolean(item?.onlyoneprint)) || isExpanded;
  isExpanded = (currentFilter.exclusive && Boolean(item?.exclusive)) || isExpanded;
  isExpanded = (currentFilter.noPrint && toArray(item?.children).length === 0) || isExpanded;

  if (compareIssue?.series) {
    const filterSeries = toArray<SeriesLike>(currentFilter.series);
    if (
      filterSeries.some((series) => {
        return (
          compareIssue.series?.title === series.title &&
          String(compareIssue.series?.volume) === String(series.volume) &&
          compareIssue.series?.publisher?.name === series.publisher?.name
        );
      })
    ) {
      isExpanded = true;
    }

    const filterPublishers = toArray<{ name?: string }>(currentFilter.publishers);
    if (
      filterPublishers.some(
        (publisher) => compareIssue.series?.publisher?.name === publisher?.name
      )
    ) {
      isExpanded = true;
    }

    if (
      currentFilter.publisher?.name &&
      compareIssue.series?.publisher?.name === currentFilter.publisher.name
    ) {
      isExpanded = true;
    }
  }

  if (compareIssue?.number !== undefined) {
    const filterNumbers = toArray(currentFilter.numbers);
    for (const number of filterNumbers) {
      if (!number || number.number === undefined || !number.compare) continue;

      const comparison = compareIssueNumbers(
        String(compareIssue.number),
        String(number.number)
      );

      if (
        (number.compare === "=" && comparison === 0) ||
        (number.compare === ">" && comparison > 0) ||
        (number.compare === "<" && comparison < 0) ||
        (number.compare === ">=" && comparison >= 0) ||
        (number.compare === "<=" && comparison <= 0)
      ) {
        isExpanded = true;
      }
    }
  }

  if (item?.__typename === "Story") {
    if (
      currentFilter.arcs &&
      compareArcs.some((arc) => currentFilter?.arcs === arc?.title)
    ) {
      isExpanded = true;
    }

    if (hasMatchingIndividual(filterIndividuals, compareIndividuals)) {
      isExpanded = true;
    }

    if (
      currentFilter.appearances &&
      compareAppearances.some((appearance) => currentFilter?.appearances === appearance?.name)
    ) {
      isExpanded = true;
    }
  } else if (item?.__typename === "Cover") {
    if (hasMatchingIndividual(filterIndividuals, itemIndividuals)) {
      isExpanded = true;
    }
  } else if (item?.__typename === "Feature") {
    if (hasMatchingIndividual(filterIndividuals, compareIndividuals)) {
      isExpanded = true;
    }
  }

  return isExpanded;
}

function resolveIssue(item: ItemLike | null | undefined): IssueLike | null {
  if (!item) return null;
  if (item.issue) return item.issue;

  const asIssue = item as IssueLike;
  if (asIssue.series && asIssue.number !== undefined) return asIssue;

  return null;
}

function toArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function hasMatchingIndividual(selected: PersonLike[], available: PersonLike[]): boolean {
  return selected.some((individual) =>
    available.some((candidate) => {
      return individual?.name === candidate?.name && individual?.type === candidate?.type;
    })
  );
}
