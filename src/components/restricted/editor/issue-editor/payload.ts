import { stripItem } from "../../../../util/util";
import type { IssueEditorFormValues } from "./types";

interface NamedTypeEntry {
  name?: string;
  type?: string[] | string;
}

interface MutationVariables {
  item: Record<string, unknown>;
  old?: Record<string, unknown>;
}

function toOptionalFloat(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed =
    typeof value === "number"
      ? value
      : Number.parseFloat(String(value).replace(",", ".").trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toOptionalInt(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed =
    typeof value === "number" ? Math.trunc(value) : Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function buildIssueMutationVariables(
  values: IssueEditorFormValues,
  defaultValues: IssueEditorFormValues,
  edit?: boolean
): MutationVariables {
  const usIssue = Boolean(values.series.publisher.us);
  const seriesPayload = stripItem(values.series) as Record<string, unknown>;
  seriesPayload.volume = toOptionalInt(values.series.volume);

  const itemPayload = {
    title: values.title,
    number: values.number,
    format: values.format,
    variant: values.variant,
    releasedate: values.releasedate,
    pages: toOptionalInt(values.pages),
    price: toOptionalFloat(values.price),
    currency: values.currency,
    isbn: values.isbn,
    limitation: values.limitation,
    addinfo: values.addinfo,
    series: seriesPayload,
  } as Record<string, unknown>;

  if (usIssue) {
    itemPayload.format = undefined;
    itemPayload.limitation = undefined;
    itemPayload.pages = undefined;
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
