import type { FieldItem } from "./types";

function keyValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function getContainsKey(type: string, item: FieldItem, index: number) {
  const parent = (item.parent || {}) as {
    issue?: {
      number?: string | number;
      variant?: string;
      series?: { title?: string; volume?: string | number };
    };
  };
  const parentIssue = parent.issue || {};
  const parentSeries = parentIssue.series || {};

  return [
    type,
    keyValue(item.number),
    keyValue(item.title),
    keyValue(item.addinfo),
    keyValue(item.exclusive),
    keyValue(parentIssue.number),
    keyValue(parentIssue.variant),
    keyValue(parentSeries.title),
    keyValue(parentSeries.volume),
    String(index),
  ].join("|");
}
