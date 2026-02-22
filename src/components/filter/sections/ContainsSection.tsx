import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FastField } from "formik";
import AutocompleteBase from "../../generic/AutocompleteBase";
import { useAutocompleteQuery } from "../../generic/useAutocompleteQuery";
import { TextField } from "../../generic/FormikTextField";
import FilterSwitch from "../FilterSwitch";
import { FilterValues } from "../types";
import { publishers, series } from "../../../graphql/queriesTyped";
import type { FieldItem } from "../../../util/filterFieldHelpers";

const MIN_QUERY_LENGTH = 2;

interface ContainsSectionProps {
  values: FilterValues;
  us: boolean;
  isDesktop: boolean;
  setFieldValue: (field: string, value: unknown) => void;
}

function ContainsSection({
  values,
  us,
  isDesktop: _isDesktop,
  setFieldValue,
}: ContainsSectionProps) {
  const switchGridSx = {
    display: "grid",
    gap: 1,
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "1fr 1fr 1fr" },
  } as const;

  const [publisherInput, setPublisherInput] = React.useState("");
  const [seriesInput, setSeriesInput] = React.useState("");

  const publisherQuery = useAutocompleteQuery<FieldItem>({
    query: publishers,
    variables: { pattern: publisherInput, us: !us },
    searchText: publisherInput,
    minQueryLength: MIN_QUERY_LENGTH,
    debounceMs: 250,
  });

  const seriesQuery = useAutocompleteQuery<FieldItem>({
    query: series,
    variables: {
      pattern: seriesInput,
      publisher: { name: "*", us: !us },
    },
    searchText: seriesInput,
    minQueryLength: MIN_QUERY_LENGTH,
    debounceMs: 250,
  });

  const selectedPublishers = sanitizeNameList(values.publishers);
  const selectedSeries = sanitizeTitleList(values.series);
  const triStateSwitch = (field: keyof FilterValues, negatedField: keyof FilterValues, label: string) => {
    const isPositive = Boolean(values[field]);
    const isNegated = Boolean(values[negatedField]);
    const checked = isPositive || isNegated;
    const effectiveLabel = isNegated ? `Nicht ${label}` : label;

    return (
      <FilterSwitch
        checked={checked}
        label={effectiveLabel}
        sx={
          isNegated
            ? {
                "& > div": {
                  borderColor: "rgba(239,68,68,0.5)",
                  boxShadow: "0 2px 9px rgba(239,68,68,0.14)",
                },
              }
            : undefined
        }
        onToggle={() => {
          if (!isPositive && !isNegated) {
            setFieldValue(field, true);
            setFieldValue(negatedField, false);
            return;
          }
          if (isPositive) {
            setFieldValue(field, false);
            setFieldValue(negatedField, true);
            return;
          }
          setFieldValue(field, false);
          setFieldValue(negatedField, false);
        }}
      />
    );
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{us ? "Enthalten in" : "Enthält"}</Typography>

      {!us ? (
        <Box sx={switchGridSx}>
          {triStateSwitch("onlyPrint", "notOnlyPrint", "Einzige Veröffentlichung")}
          {triStateSwitch("firstPrint", "notFirstPrint", "Erstveröffentlichung")}
          {triStateSwitch("otherOnlyTb", "notOtherOnlyTb", "Sonst nur in Taschenbuch")}
          {triStateSwitch("exclusive", "notExclusive", "Exklusiver Inhalt")}
          {triStateSwitch("reprint", "notReprint", "Reiner Nachdruck")}
        </Box>
      ) : (
        <Box sx={switchGridSx}>
          {triStateSwitch("onlyTb", "notOnlyTb", "Nur in Taschenbuch")}
          {triStateSwitch("onlyOnePrint", "notOnlyOnePrint", "Nur einfach auf deutsch erschienen")}
          {triStateSwitch("noPrint", "notNoPrint", "Nicht auf deutsch erschienen")}
        </Box>
      )}

      <AutocompleteBase
        options={publisherQuery.options}
        value={selectedPublishers}
        inputValue={publisherInput}
        multiple
        label="Verlag"
        loading={publisherQuery.loading}
        noOptionsText={
          publisherQuery.isBelowMinLength
            ? `Mindestens ${MIN_QUERY_LENGTH} Zeichen eingeben`
            : publisherQuery.error
              ? "Fehler!"
              : "Keine Ergebnisse gefunden"
        }
        onListboxScroll={publisherQuery.onListboxScroll}
        getOptionLabel={(option) => String((option as { name?: unknown })?.name || "")}
        isOptionEqualToValue={(option, value) =>
          normalizeText(option.name) === normalizeText((value as { name?: unknown })?.name)
        }
        onInputChange={(_, nextInput, reason) => {
          if (reason !== "input" && reason !== "clear" && reason !== "reset") return;
          setPublisherInput(nextInput);
        }}
        onChange={(_, nextValue) => {
          setFieldValue("publishers", sanitizeNameList(asOptionArray(nextValue)));
          setPublisherInput("");
        }}
      />

      <AutocompleteBase
        options={seriesQuery.options}
        value={selectedSeries}
        inputValue={seriesInput}
        multiple
        label="Serie"
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
          normalizeText(option.title) === normalizeText((value as { title?: unknown })?.title) &&
          normalizeText(String(option.volume || "")) ===
            normalizeText(String((value as { volume?: unknown })?.volume || ""))
        }
        onInputChange={(_, nextInput, reason) => {
          if (reason !== "input" && reason !== "clear" && reason !== "reset") return;
          setSeriesInput(nextInput);
        }}
        onChange={(_, nextValue) => {
          setFieldValue("series", sanitizeTitleList(asOptionArray(nextValue)));
          setSeriesInput("");
        }}
      />

      <Box
        sx={{
          display: "grid",
          alignItems: "end",
          gap: 1,
          px: 1,
          py: 0.9,
          borderRadius: 1.75,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.78)",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(170px, 1fr))",
          },
        }}
      >
        <FastField
          name="numberFrom"
          label="Nummer von"
          component={TextField}
          disabled={Boolean(values.numberExact)}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
          }}
        />
        <FastField
          name="numberTo"
          label="Nummer bis"
          component={TextField}
          disabled={Boolean(values.numberExact)}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
          }}
        />
        <FastField
          name="numberExact"
          label="Exakte Nummer(n)"
          helperText="Mehrere Werte mit Komma trennen, z.B. 1, 1A, Annual 1"
          component={TextField}
          disabled={Boolean(values.numberFrom) || Boolean(values.numberTo)}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
            gridColumn: { xs: "1", sm: "1 / span 2" },
          }}
        />
        <FastField
          name="numberVariant"
          label="Variante (optional)"
          component={TextField}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
            gridColumn: { xs: "1", sm: "1 / span 2" },
          }}
        />
      </Box>
    </Stack>
  );
}

function asOptionArray(value: unknown): FieldItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is FieldItem =>
      Boolean(entry) && typeof entry === "object" && !Array.isArray(entry)
  );
}

function sanitizeNameList(values: FieldItem[]) {
  return values.filter((entry) => !entry.pattern && normalizeText(entry.name).length > 0);
}

function sanitizeTitleList(values: FieldItem[]) {
  return values.filter(
    (entry) =>
      !entry.pattern &&
      normalizeText(entry.title).length > 0 &&
      Number.isFinite(Number(entry.volume))
  );
}

function normalizeText(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function formatSeriesLabel(entry: unknown) {
  const option = entry as { title?: unknown; volume?: unknown };
  const title = String(option?.title || "");
  const volume =
    option?.volume === undefined || option?.volume === null ? "" : String(option.volume);
  if (!volume) return title;
  return `${title} (Vol. ${volume})`;
}

export default ContainsSection;
