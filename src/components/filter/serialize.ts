import { stripItem } from "../../util/util";
import { FILTER_MULTI_VALUE_SEPARATOR } from "./constants";
import { FilterSubmitValues, FilterValues } from "./types";

function hasPayload(payload: FilterSubmitValues): boolean {
  return Object.keys(payload).length > 0;
}

function joinMultiValues(values: string[]): string | undefined {
  const normalized = values.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  if (normalized.length === 0) return undefined;
  return normalized.join(FILTER_MULTI_VALUE_SEPARATOR);
}

export function serializeFilterValues(
  values: FilterValues,
  us: boolean
): FilterSubmitValues | null {
  const payload: FilterSubmitValues = {};

  if (values.formats.length > 0) {
    payload.formats = values.formats.map((option) => option.name);
  }

  if (values.withVariants) {
    payload.withVariants = true;
  }

  const releasedates = values.releasedates.filter((entry) => entry.date.trim() !== "1900-01-01");
  if (releasedates.length > 0) {
    payload.releasedates = releasedates;
  }

  if (values.publishers.length > 0) {
    payload.publishers = values.publishers.map((publisher) => {
      const normalizedPublisher = stripItem(publisher);
      normalizedPublisher.us = undefined;
      return normalizedPublisher;
    });
  }

  if (values.series.length > 0) {
    payload.series = values.series.map((entry) => stripItem(entry));
  }

  const numbers = values.numbers.filter((entry) => entry.number.trim() !== "");
  if (numbers.length > 0) {
    payload.numbers = numbers;
  }

  const arcsValue = joinMultiValues(values.arcs.map((entry) => String(entry.title || "")));
  if (arcsValue) payload.arcs = arcsValue;

  if (values.individuals.length > 0) {
    payload.individuals = values.individuals.map((entry) => {
      const normalizedIndividual = stripItem(entry);
      normalizedIndividual.role = undefined;
      return normalizedIndividual;
    });
  }

  const appearancesValue = joinMultiValues(
    values.appearances.map((entry) => String(entry.name || ""))
  );
  if (appearancesValue) payload.appearances = appearancesValue;

  if (values.firstPrint) payload.firstPrint = true;
  if (values.onlyPrint) payload.onlyPrint = true;
  if (values.onlyTb) payload.onlyTb = true;
  if (values.exclusive) payload.exclusive = true;
  if (values.reprint) payload.reprint = true;
  if (values.otherOnlyTb) payload.otherOnlyTb = true;
  if (values.noPrint) payload.noPrint = true;
  if (values.onlyOnePrint) payload.onlyOnePrint = true;
  if (values.onlyCollected) payload.onlyCollected = true;
  if (values.onlyNotCollected) payload.onlyNotCollected = true;
  if (values.sellable) payload.sellable = true;
  if (values.noCover) payload.noCover = true;
  if (values.noContent) payload.noContent = true;
  if (values.and) payload.and = true;

  if (!hasPayload(payload)) {
    return null;
  }

  return {
    ...payload,
    us,
  };
}
