import type { FieldItem } from "../../util/filterFieldHelpers";
import { FILTER_MULTI_VALUE_SEPARATOR } from "./constants";
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

function normalizeSeries(rawSeries: unknown): FieldItem[] {
  if (!Array.isArray(rawSeries)) {
    return [];
  }

  return rawSeries
    .filter((entry): entry is FieldItem => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({ ...entry, __typename: "Series" }));
}

function splitMultiValueString(value: string): string[] {
  return value
    .split(FILTER_MULTI_VALUE_SEPARATOR)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function normalizeArcFilters(rawArcs: unknown): FilterValues["arcs"] {
  if (Array.isArray(rawArcs)) {
    return rawArcs
      .map((entry) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
        const title = String((entry as { title?: unknown }).title || "").trim();
        if (!title) return null;
        const typeValue = (entry as { type?: unknown }).type;
        return typeof typeValue === "string" && typeValue.trim()
          ? { title, type: typeValue.trim() }
          : { title };
      })
      .filter((entry): entry is { title: string; type?: string } => Boolean(entry));
  }

  if (typeof rawArcs === "string") {
    return splitMultiValueString(rawArcs).map((title) => ({ title }));
  }

  return [];
}

function normalizeAppearanceFilters(rawAppearances: unknown): FilterValues["appearances"] {
  if (Array.isArray(rawAppearances)) {
    return rawAppearances
      .map((entry) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
        const name = String((entry as { name?: unknown }).name || "").trim();
        if (!name) return null;
        const typeValue = (entry as { type?: unknown }).type;
        return typeof typeValue === "string" && typeValue.trim()
          ? { name, type: typeValue.trim() }
          : { name };
      })
      .filter((entry): entry is { name: string; type?: string } => Boolean(entry));
  }

  if (typeof rawAppearances === "string") {
    return splitMultiValueString(rawAppearances).map((name) => ({ name }));
  }

  return [];
}

export function createDefaultFilterValues(): FilterValues {
  return {
    formats: [],
    withVariants: false,
    releasedates: [{ ...DEFAULT_RELEASE_DATE }],
    publishers: [],
    series: [],
    numbers: [{ ...DEFAULT_NUMBER_FILTER }],
    arcs: [],
    individuals: [],
    appearances: [],
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
      releasedates:
        Array.isArray(parsed.releasedates) && parsed.releasedates.length > 0
          ? parsed.releasedates
          : defaults.releasedates,
      publishers: Array.isArray(parsed.publishers) ? parsed.publishers : defaults.publishers,
      series: normalizeSeries(parsed.series),
      numbers:
        Array.isArray(parsed.numbers) && parsed.numbers.length > 0
          ? parsed.numbers
          : defaults.numbers,
      individuals: Array.isArray(parsed.individuals) ? parsed.individuals : defaults.individuals,
      arcs: normalizeArcFilters(parsed.arcs),
      appearances: normalizeAppearanceFilters(parsed.appearances),
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
