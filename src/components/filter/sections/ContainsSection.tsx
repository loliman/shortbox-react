import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { FastField } from "formik";
import AutocompleteBase from "../../generic/AutocompleteBase";
import { useAutocompleteQuery } from "../../generic/useAutocompleteQuery";
import { TextField } from "../../generic/FormikTextField";
import FilterSwitch from "../FilterSwitch";
import { COMPARE_OPTIONS } from "../constants";
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

function ContainsSection({ values, us, isDesktop, setFieldValue }: ContainsSectionProps) {
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

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{us ? "Enthalten in" : "Enthält"}</Typography>

      {!us ? (
        <Stack spacing={1}>
          <FilterSwitch
            checked={values.onlyPrint}
            label="Einzige Veröffentlichung"
            onToggle={() => setFieldValue("onlyPrint", !values.onlyPrint)}
          />
          <FilterSwitch
            checked={values.firstPrint}
            label="Erstveröffentlichung"
            onToggle={() => setFieldValue("firstPrint", !values.firstPrint)}
          />
          <FilterSwitch
            checked={values.otherOnlyTb}
            label="Sonst nur in Taschenbuch"
            onToggle={() => setFieldValue("otherOnlyTb", !values.otherOnlyTb)}
          />
          <FilterSwitch
            checked={values.exclusive}
            label="Exklusiver Inhalt"
            onToggle={() => setFieldValue("exclusive", !values.exclusive)}
          />
          <FilterSwitch
            checked={values.reprint}
            label="Reiner Nachdruck"
            onToggle={() => setFieldValue("reprint", !values.reprint)}
          />
        </Stack>
      ) : (
        <Stack spacing={1}>
          <FilterSwitch
            checked={values.onlyTb}
            label="Nur in Taschenbuch"
            onToggle={() => setFieldValue("onlyTb", !values.onlyTb)}
          />
          <FilterSwitch
            checked={values.onlyOnePrint}
            label="Nur einfach auf deutsch erschienen"
            onToggle={() => setFieldValue("onlyOnePrint", !values.onlyOnePrint)}
          />
          <FilterSwitch
            checked={values.noPrint}
            label="Nicht auf deutsch erschienen"
            onToggle={() => setFieldValue("noPrint", !values.noPrint)}
          />
        </Stack>
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
          if (reason !== "input" && reason !== "clear") return;
          setPublisherInput(nextInput);
        }}
        onChange={(_, nextValue) => {
          setFieldValue("publishers", sanitizeNameList(asOptionArray(nextValue)));
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
          if (reason !== "input" && reason !== "clear") return;
          setSeriesInput(nextInput);
        }}
        onChange={(_, nextValue) => {
          setFieldValue("series", sanitizeTitleList(asOptionArray(nextValue)));
        }}
      />

      <Stack spacing={1.5}>
        {values.numbers.map((entry, index) => {
          const key = `${entry.number || "empty"}-${entry.compare}-${entry.variant || "base"}-${index}`;
          return (
            <Box key={key}>
              <FastField
                className={isDesktop ? "field field352" : "field field90"}
                name={`numbers[${index}].number`}
                label="Nummer"
                component={TextField}
              />

              <FastField
                type="text"
                name={`numbers[${index}].compare`}
                label="ist"
                select
                component={TextField}
                className={"field field5"}
                InputLabelProps={{ shrink: true }}
              >
                {COMPARE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FastField>

              {index === values.numbers.length - 1 ? (
                <IconButton
                  className="addBtnFilter"
                  aria-label="Hinzufügen"
                  onClick={() =>
                    setFieldValue("numbers", [
                      ...values.numbers,
                      {
                        number: "",
                        compare: ">",
                        variant: "",
                      },
                    ])
                  }
                >
                  <AddIcon />
                </IconButton>
              ) : null}
            </Box>
          );
        })}
      </Stack>
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
  return values.filter((entry) => !entry.pattern && normalizeText(entry.title).length > 0);
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
