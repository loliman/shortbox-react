import { stripItem } from "../../../../util/util";
import type { IssueEditorFormValues } from "./types";

interface NamedTypeEntry {
  name?: string;
  type?: string[] | string;
}

interface MutationVariables {
  item: IssueEditorFormValues & Record<string, unknown>;
  old?: Record<string, unknown>;
}

function normalizeTypeList(typeValue: string[] | string | undefined): string[] {
  if (Array.isArray(typeValue)) return typeValue.filter(Boolean);
  if (!typeValue) return [];
  return [typeValue];
}

function dedupeNamedTypes(entries: NamedTypeEntry[] | undefined) {
  const byName = new Map<string, { name: string; type: string[] }>();

  (entries || []).forEach((entry) => {
    const name = (entry.name || "").trim();
    if (!name) return;

    if (!byName.has(name)) byName.set(name, { name, type: [] });
    const target = byName.get(name)!;

    normalizeTypeList(entry.type).forEach((typeValue) => {
      if (!target.type.includes(typeValue)) target.type.push(typeValue);
    });
  });

  return Array.from(byName.values()).filter((entry) => entry.type.length > 0);
}

function normalizeAppearanceType(type: unknown) {
  const value = String(type || "");

  if (value === "FEATURED" || value === "ANTAGONIST" || value === "SUPPORTING" || value === "OTHER")
    return "CHARACTER";

  return value;
}

function stripParentSeries(item: Record<string, unknown>) {
  const parent = (item.parent || {}) as {
    issue?: { series?: Record<string, unknown> };
  };

  if (parent.issue?.series) {
    parent.issue.series = stripItem(parent.issue.series);
  }
}

function normalizeStory(story: Record<string, unknown>, usIssue: boolean) {
  const next = stripItem(story) as Record<string, unknown> & {
    exclusive?: boolean;
    appearances?: Array<Record<string, unknown>>;
    individuals?: NamedTypeEntry[];
  };

  if (next.exclusive || usIssue) next.parent = undefined;
  next.children = undefined;

  if (next.series) next.series = stripItem(next.series as Record<string, unknown>);
  if (next.individuals) next.individuals = dedupeNamedTypes(next.individuals);

  if (next.appearances) {
    next.appearances = next.appearances.map((appearance) => {
      const normalized = stripItem(appearance) as Record<string, unknown>;
      normalized.type = normalizeAppearanceType(normalized.type);
      return normalized;
    });
  }

  stripParentSeries(next);
  return next;
}

function normalizeCover(cover: Record<string, unknown>, usIssue: boolean) {
  const next = stripItem(cover) as Record<string, unknown> & {
    exclusive?: boolean;
    individuals?: NamedTypeEntry[];
  };

  if (next.exclusive || usIssue) next.parent = undefined;
  next.children = undefined;

  if (next.series) next.series = stripItem(next.series as Record<string, unknown>);
  if (next.individuals) next.individuals = dedupeNamedTypes(next.individuals);

  stripParentSeries(next);
  return next;
}

function normalizeFeature(feature: Record<string, unknown>) {
  const next = stripItem(feature) as Record<string, unknown> & {
    individuals?: NamedTypeEntry[];
  };

  if (next.individuals) next.individuals = dedupeNamedTypes(next.individuals);
  return next;
}

export function buildIssueMutationVariables(
  values: IssueEditorFormValues,
  defaultValues: IssueEditorFormValues,
  edit?: boolean
): MutationVariables {
  const usIssue = Boolean(values.series.publisher.us);
  const itemPayload = stripItem(values) as IssueEditorFormValues & Record<string, unknown>;

  itemPayload.cover = undefined;
  itemPayload.stories = (values.stories || []).map((story) =>
    normalizeStory(story as Record<string, unknown>, usIssue)
  );
  itemPayload.covers = (values.covers || []).map((cover) =>
    normalizeCover(cover as Record<string, unknown>, usIssue)
  );
  itemPayload.features = (values.features || []).map((feature) =>
    normalizeFeature(feature as Record<string, unknown>)
  );
  itemPayload.individuals = dedupeNamedTypes(values.individuals as NamedTypeEntry[]);
  itemPayload.arcs = (values.arcs || []).map((arc) => stripItem(arc));

  if (itemPayload.publisher) {
    itemPayload.publisher = stripItem(itemPayload.publisher as Record<string, unknown>);
  }

  if (itemPayload.series) {
    itemPayload.series = stripItem(
      itemPayload.series as Record<string, unknown>
    ) as IssueEditorFormValues["series"];
  }

  if (usIssue) {
    itemPayload.format = undefined;
    itemPayload.limitation = undefined;
    itemPayload.pages = undefined;
    itemPayload.comicguideid = undefined;
    itemPayload.isbn = undefined;
    itemPayload.price = undefined;
    itemPayload.currency = undefined;
  }

  const variables: MutationVariables = {
    item: itemPayload,
  };

  if (edit) {
    variables.old = {
      series: stripItem(defaultValues.series),
      number: defaultValues.number,
      format: defaultValues.format,
      variant: defaultValues.variant,
    };
  }

  return variables;
}
