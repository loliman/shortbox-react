import React from "react";
import { FastField } from "formik";
import AutocompleteBase from "../../../generic/AutocompleteBase";
import { useAutocompleteQuery } from "../../../generic/useAutocompleteQuery";
import { TextField } from "../../../generic/FormikTextField";
import { individuals, series } from "../../../../graphql/queriesTyped";
import type { ContainsProps, FieldItem } from "./types";
import TypedRoleAutocomplete from "./TypedRoleAutocomplete";

const MIN_QUERY_LENGTH = 2;

interface StoryFieldsNonExclusiveProps extends ContainsProps {
  index?: number;
  values?: Record<string, unknown> & { stories?: FieldItem[] };
}

function StoryFieldsNonExclusive(props: StoryFieldsNonExclusiveProps) {
  const index = Number.isInteger(props.index) ? (props.index as number) : 0;
  const values = props.values || {};
  const setFieldValue = props.setFieldValue || (() => undefined);
  const stories = values.stories || [];
  const item = stories[index] || {};
  const parent = (item.parent || {}) as {
    issue?: { series?: { title?: string; volume?: number } };
  };
  const parentIssue = parent.issue || {};
  const parentSeries = parentIssue.series || {};
  const seriesPattern = String(parentSeries.title || "");

  const seriesQuery = useAutocompleteQuery<FieldItem>({
    query: series,
    variables: {
      pattern: seriesPattern,
      publisher: { name: "*", us: true },
    },
    searchText: seriesPattern,
    minQueryLength: MIN_QUERY_LENGTH,
    debounceMs: 250,
  });

  const currentSeriesValue =
    seriesQuery.options.find(
      (entry) =>
        normalizeText(entry.title) === normalizeText(parentSeries.title) &&
        normalizeText(String(entry.volume || "")) ===
          normalizeText(String(parentSeries.volume || ""))
    ) || (seriesPattern.trim().length > 0 ? seriesPattern : null);

  return (
    <div className="storyAddInputContainer">
      <AutocompleteBase
        options={seriesQuery.options}
        value={currentSeriesValue}
        inputValue={seriesPattern}
        label="Serie"
        freeSolo
        loading={seriesQuery.loading}
        noOptionsText={
          seriesQuery.isBelowMinLength
            ? `Mindestens ${MIN_QUERY_LENGTH} Zeichen eingeben`
            : seriesQuery.error
              ? "Fehler!"
              : "Keine Ergebnisse gefunden"
        }
        onListboxScroll={seriesQuery.onListboxScroll}
        getOptionLabel={(option) => formatSeriesLabel(option)}
        isOptionEqualToValue={(option, value) =>
          normalizeText(getSeriesKey(option)) ===
          normalizeText(typeof value === "string" ? value : getSeriesKey(value))
        }
        onInputChange={(_, inputValue, reason) => {
          if (reason !== "input" && reason !== "clear") return;
          setFieldValue(`stories[${index}].parent.issue.series.title`, inputValue);
        }}
        onChange={(_, option) => {
          const selectedOption = Array.isArray(option) ? option[0] || null : option;

          const selected = isOptionLike(selectedOption)
            ? { ...selectedOption, volume: selectedOption.volume || 0 }
            : { title: "", volume: 0 };

          setFieldValue(`stories[${index}].parent.issue.series`, selected);
        }}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field25"}
        name={`stories[${index}].parent.issue.series.volume`}
        label="Volume"
        type="number"
        component={TextField}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field60"}
        name={`stories[${index}].parent.issue.number`}
        label="Nummer"
        component={TextField}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field10"}
        name={`stories[${index}].parent.number`}
        label="#"
        type="number"
        component={TextField}
      />

      <TypedRoleAutocomplete
        query={individuals}
        field={`stories[${index}].individuals`}
        label="Übersetzer"
        type="TRANSLATOR"
        values={(item.individuals as FieldItem[]) || []}
        setFieldValue={setFieldValue}
        disabled={props.disabled}
      />
    </div>
  );
}

function isOptionLike(value: unknown): value is FieldItem {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatSeriesLabel(entry: unknown) {
  const option = entry as { title?: unknown; volume?: unknown };
  const title = String(option?.title || "");
  const volume =
    option?.volume === null || option?.volume === undefined ? "" : String(option.volume);
  if (!volume) return title;
  return `${title} (Vol. ${volume})`;
}

function getSeriesKey(value: unknown) {
  const option = value as { title?: unknown; volume?: unknown };
  return `${String(option?.title || "")}::${String(option?.volume || "")}`;
}

function normalizeText(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default StoryFieldsNonExclusive;
