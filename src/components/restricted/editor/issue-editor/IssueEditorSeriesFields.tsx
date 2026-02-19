import React from "react";
import Grid from "@mui/material/Grid";
import { FastField } from "formik";
import { TextField } from "../../../generic/FormikTextField";
import AutocompleteBase from "../../../generic/AutocompleteBase";
import { useAutocompleteQuery } from "../../../generic/useAutocompleteQuery";
import { publishers, series } from "../../../../graphql/queriesTyped";
import type { IssueEditorFormValues } from "./types";

interface IssueEditorSeriesFieldsProps {
  values: IssueEditorFormValues;
  isDesktop?: boolean;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
}

interface PublisherOption {
  name?: string;
  us?: boolean;
  [key: string]: unknown;
}

interface SeriesOption {
  title?: string;
  volume?: number | string;
  publisher?: { name?: string; us?: boolean };
  [key: string]: unknown;
}

const MIN_QUERY_LENGTH = 2;

function IssueEditorSeriesFields({
  values,
  isDesktop: _isDesktop,
  setFieldValue,
}: IssueEditorSeriesFieldsProps) {
  const publisherPattern = String(values.series.publisher.name || "");
  const seriesPattern = String(values.series.title || "");
  const publisherUs = Boolean(values.series.publisher.us);
  const isSeriesDisabled = publisherPattern.trim().length === 0;

  const publisherQuery = useAutocompleteQuery<PublisherOption>({
    query: publishers,
    variables: {
      pattern: publisherPattern,
      us: publisherUs,
    },
    searchText: publisherPattern,
    minQueryLength: MIN_QUERY_LENGTH,
    debounceMs: 250,
  });

  const seriesQuery = useAutocompleteQuery<SeriesOption>({
    query: series,
    variables: {
      pattern: seriesPattern,
      publisher: { name: publisherPattern },
    },
    enabled: !isSeriesDisabled,
    searchText: seriesPattern,
    minQueryLength: MIN_QUERY_LENGTH,
    debounceMs: 250,
  });

  const publisherValue =
    publisherQuery.options.find(
      (entry) => normalizeText(entry.name) === normalizeText(values.series.publisher.name)
    ) || (publisherPattern.trim().length > 0 ? publisherPattern : null);

  const seriesValue =
    seriesQuery.options.find(
      (entry) =>
        normalizeText(entry.title) === normalizeText(values.series.title) &&
        normalizeText(entry.publisher?.name) === normalizeText(values.series.publisher.name)
    ) || (seriesPattern.trim().length > 0 ? seriesPattern : null);

  const publisherNoOptionsText = publisherQuery.isBelowMinLength
    ? `Mindestens ${MIN_QUERY_LENGTH} Zeichen eingeben`
    : publisherQuery.error
      ? "Fehler!"
      : "Keine Ergebnisse gefunden";

  const seriesNoOptionsText = isSeriesDisabled
    ? "Bitte zuerst Verlag wählen"
    : seriesQuery.isBelowMinLength
      ? `Mindestens ${MIN_QUERY_LENGTH} Zeichen eingeben`
      : seriesQuery.error
        ? "Fehler!"
        : "Keine Ergebnisse gefunden";

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 8 }}>
        <FastField name="title" label="Titel" component={TextField} fullWidth />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <AutocompleteBase
          options={publisherQuery.options}
          value={publisherValue}
          inputValue={publisherPattern}
          label="Verlag"
          loading={publisherQuery.loading}
          freeSolo
          noOptionsText={publisherNoOptionsText}
          onListboxScroll={publisherQuery.onListboxScroll}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : formatPublisherLabel(option as PublisherOption)
          }
          isOptionEqualToValue={(option, value) =>
            normalizeText(option.name) ===
            normalizeText(typeof value === "string" ? value : value?.name)
          }
          onInputChange={(_, value, reason) => {
            if (reason !== "input" && reason !== "clear") return;
            setFieldValue("series.publisher.name", value);
          }}
          onChange={(_, option) => {
            const selectedOption = Array.isArray(option) ? option[0] || null : option;

            setFieldValue("series", {
              title: "",
              volume: "",
              publisher: { name: "", us: values.series.publisher.us },
            });

            if (selectedOption && typeof selectedOption !== "string") {
              setFieldValue("series.publisher", selectedOption);
            }
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <AutocompleteBase
          disabled={isSeriesDisabled}
          options={seriesQuery.options}
          value={seriesValue}
          inputValue={seriesPattern}
          label="Serie"
          loading={seriesQuery.loading}
          freeSolo
          noOptionsText={seriesNoOptionsText}
          onListboxScroll={seriesQuery.onListboxScroll}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : formatSeriesLabel(option as SeriesOption)
          }
          isOptionEqualToValue={(option, value) =>
            normalizeText(getSeriesKey(option)) ===
            normalizeText(typeof value === "string" ? value : getSeriesKey(value))
          }
          onInputChange={(_, value, reason) => {
            if (reason !== "input" && reason !== "clear") return;
            setFieldValue("series.title", value);
          }}
          onChange={(_, option) => {
            const selectedOption = Array.isArray(option) ? option[0] || null : option;

            setFieldValue(
              "series",
              selectedOption && typeof selectedOption !== "string"
                ? {
                    title: selectedOption.title,
                    volume: selectedOption.volume,
                    publisher: {
                      name: values.series.publisher.name,
                      us: values.series.publisher.us,
                    },
                  }
                : {
                    title: "",
                    volume: "",
                    publisher: {
                      name: values.series.publisher.name,
                      us: values.series.publisher.us,
                    },
                  }
            );
          }}
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <FastField
          disabled={isSeriesDisabled}
          name="series.volume"
          label="Volume"
          type="number"
          component={TextField}
          fullWidth
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <FastField name="number" label="Nummer" component={TextField} fullWidth />
      </Grid>
    </Grid>
  );
}

function normalizeText(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function formatPublisherLabel(option: PublisherOption) {
  return String(option.name || "");
}

function formatSeriesLabel(option: SeriesOption) {
  const title = String(option.title || "");
  const volume = option.volume === null || option.volume === undefined ? "" : String(option.volume);
  if (!volume) return title;
  return `${title} (Vol. ${volume})`;
}

function getSeriesKey(value: SeriesOption | Record<string, unknown> | null | undefined) {
  if (!value) return "";
  return `${String((value as SeriesOption).title || "")}::${String((value as SeriesOption).volume || "")}`;
}

export default IssueEditorSeriesFields;
