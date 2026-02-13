import { HierarchyLevel } from "../../../../util/hierarchy";
import { stripItem } from "../../../../util/util";
import { createEmptyIssueValues } from "./constants";
import type { IssueEditorFormValues } from "./types";

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function normalizeSeries(series: Record<string, unknown> | undefined) {
  if (!series) return createEmptyIssueValues().series;

  const publisher = (series.publisher || {}) as { name?: string; us?: boolean };
  return {
    title: String(series.title || ""),
    volume: (series.volume as number | string) || 0,
    publisher: {
      name: String(publisher.name || ""),
      us: Boolean(publisher.us),
    },
  };
}

function normalizeStory(story: Record<string, unknown>, usIssue: boolean) {
  const parent = (story.parent || {}) as {
    number?: number;
    title?: string;
    issue?: { number?: string; series?: { title?: string; volume?: number } };
  };
  const parentIssue = parent.issue || {};
  const parentSeries = parentIssue.series || {};
  const exclusive = Boolean(story.exclusive || usIssue);

  return {
    title: String(story.title || ""),
    number: story.number,
    addinfo: String(story.addinfo || ""),
    part: String(story.part || ""),
    exclusive,
    individuals:
      !exclusive && !story.individuals
        ? undefined
        : asArray(story.individuals as Array<Record<string, unknown>>).map((entry) => stripItem(entry)),
    appearances:
      !exclusive && !story.individuals
        ? undefined
        : asArray(story.appearances as Array<Record<string, unknown>>).map((entry) =>
            stripItem(entry)
          ),
    parent: exclusive
      ? undefined
      : {
          number: parent.number || 0,
          title: String(parent.title || ""),
          issue: {
            series: {
              title: String(parentSeries.title || ""),
              volume: parentSeries.volume || 0,
            },
            number: String(parentIssue.number || ""),
          },
        },
    children: story.children,
  };
}

function normalizeCover(cover: Record<string, unknown>, usIssue: boolean) {
  const parent = (cover.parent || {}) as {
    issue?: {
      number?: string;
      variant?: string;
      series?: { title?: string; volume?: number };
    };
  };
  const parentIssue = parent.issue || {};
  const parentSeries = parentIssue.series || {};
  const exclusive = Boolean(cover.exclusive || usIssue);

  return {
    number: cover.number,
    addinfo: String(cover.addinfo || ""),
    exclusive,
    individuals: !exclusive
      ? undefined
      : asArray(cover.individuals as Array<Record<string, unknown>>).map((entry) => stripItem(entry)),
    parent: exclusive
      ? undefined
      : {
          number: 0,
          issue: {
            series: {
              title: String(parentSeries.title || ""),
              volume: parentSeries.volume || 0,
            },
            number: String(parentIssue.number || ""),
            variant: String(parentIssue.variant || ""),
          },
        },
    children: cover.children,
  };
}

export function buildIssueCreateDefaultValues(
  selected?: Record<string, unknown>,
  level?: string
): IssueEditorFormValues {
  const defaults = createEmptyIssueValues();

  if (!selected) return defaults;

  if (level === HierarchyLevel.PUBLISHER) {
    defaults.series.publisher = {
      name: String((selected.publisher as { name?: string })?.name || ""),
      us: Boolean((selected.publisher as { us?: boolean })?.us),
    };
  } else if (level === HierarchyLevel.SERIES) {
    defaults.series = normalizeSeries(selected.series as Record<string, unknown> | undefined);
  } else if (level === HierarchyLevel.ISSUE) {
    defaults.series = normalizeSeries(
      ((selected.issue as { series?: Record<string, unknown> }) || {}).series
    );
  }

  return defaults;
}

export function mapIssueToEditorDefaultValues(
  issueData: Record<string, unknown>,
  copyMode: boolean
): IssueEditorFormValues {
  const values = deepClone(issueData || {});
  const defaults = createEmptyIssueValues();
  const series = normalizeSeries(values.series as Record<string, unknown> | undefined);
  const usIssue = Boolean(series.publisher.us);

  const merged: IssueEditorFormValues = {
    ...defaults,
    ...values,
    series,
    cover: values.cover || "",
    pages: Number(values.pages || 0),
    comicguideid: Number(values.comicguideid || 0),
    isbn: String(values.isbn || ""),
    limitation: String(values.limitation || ""),
    individuals: asArray(values.individuals as Array<Record<string, unknown>>).map((individual) => ({
      name: individual.name,
      type: individual.type,
    })),
    arcs: asArray(values.arcs as Array<Record<string, unknown>>).map((arc) => ({
      title: arc.title,
      type: arc.type,
    })),
    stories: asArray(values.stories as Array<Record<string, unknown>>).map((story) =>
      normalizeStory(story, usIssue)
    ),
    features: asArray(values.features as Array<Record<string, unknown>>).map((feature) => ({
      title: feature.title,
      number: feature.number,
      addinfo: feature.addinfo,
      individuals: asArray(feature.individuals as Array<Record<string, unknown>>).map((entry) =>
        stripItem(entry)
      ),
    })),
    covers: asArray(values.covers as Array<Record<string, unknown>>).map((cover) =>
      normalizeCover(cover, usIssue)
    ),
  };

  if (!copyMode) return merged;

  return {
    ...merged,
    variant: "",
    isbn: "",
    stories: [],
    individuals: [],
    arcs: [],
    covers: [],
    cover: undefined,
    features: [],
  };
}
