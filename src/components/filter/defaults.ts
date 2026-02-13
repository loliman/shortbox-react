import { FilterFormatOption, FilterValues } from "./types";

const DEFAULT_RELEASE_DATE = { date: "1900-01-01", compare: ">" };
const DEFAULT_NUMBER_FILTER = { number: "", compare: ">", variant: "" };

function isFormatNameObject(value: unknown): value is FilterFormatOption {
  return Boolean(value && typeof value === "object" && "name" in value);
}

function normalizeFormats(rawFormats: unknown): FilterFormatOption[] {
  if (!Array.isArray(rawFormats)) {
    return [];
  }

  return rawFormats
    .map((format) => {
      if (typeof format === "string") {
        return { name: format };
      }

      if (isFormatNameObject(format)) {
        const typedFormat = format as { name?: unknown };
        if (typeof typedFormat.name === "string") {
          return { name: typedFormat.name };
        }
      }

      return null;
    })
    .filter((format): format is FilterFormatOption => Boolean(format));
}

function normalizeSeries(rawSeries: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(rawSeries)) {
    return [];
  }

  return rawSeries
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({ ...entry, __typename: "Series" }));
}

export function createDefaultFilterValues(): FilterValues {
  return {
    formats: [],
    withVariants: false,
    releasedates: [{ ...DEFAULT_RELEASE_DATE }],
    publishers: [],
    series: [],
    numbers: [{ ...DEFAULT_NUMBER_FILTER }],
    arcs: "",
    individuals: [],
    appearances: "",
    firstPrint: false,
    onlyPrint: false,
    onlyTb: false,
    exclusive: false,
    reprint: false,
    otherOnlyTb: false,
    onlyOnePrint: false,
    noPrint: false,
    onlyCollected: false,
    onlyNotCollected: false,
    sellable: false,
    noCover: false,
    noContent: false,
    and: false,
  };
}

export function parseFilterValues(queryFilter?: string): FilterValues {
  const defaults = createDefaultFilterValues();

  if (!queryFilter) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(queryFilter) as Partial<FilterValues>;

    return {
      ...defaults,
      ...parsed,
      formats: normalizeFormats(parsed.formats),
      releasedates: Array.isArray(parsed.releasedates) && parsed.releasedates.length > 0
        ? parsed.releasedates
        : defaults.releasedates,
      publishers: Array.isArray(parsed.publishers) ? parsed.publishers : defaults.publishers,
      series: normalizeSeries(parsed.series),
      numbers: Array.isArray(parsed.numbers) && parsed.numbers.length > 0
        ? parsed.numbers
        : defaults.numbers,
      individuals: Array.isArray(parsed.individuals) ? parsed.individuals : defaults.individuals,
      arcs: typeof parsed.arcs === "string" ? parsed.arcs : defaults.arcs,
      appearances: typeof parsed.appearances === "string" ? parsed.appearances : defaults.appearances,
      withVariants: Boolean(parsed.withVariants),
      firstPrint: Boolean(parsed.firstPrint),
      onlyPrint: Boolean(parsed.onlyPrint),
      onlyTb: Boolean(parsed.onlyTb),
      exclusive: Boolean(parsed.exclusive),
      reprint: Boolean(parsed.reprint),
      otherOnlyTb: Boolean(parsed.otherOnlyTb),
      onlyOnePrint: Boolean(parsed.onlyOnePrint),
      noPrint: Boolean(parsed.noPrint),
      onlyCollected: Boolean(parsed.onlyCollected),
      onlyNotCollected: Boolean(parsed.onlyNotCollected),
      sellable: Boolean(parsed.sellable),
      noCover: Boolean(parsed.noCover),
      noContent: Boolean(parsed.noContent),
      and: Boolean(parsed.and),
    };
  } catch {
    return defaults;
  }
}
