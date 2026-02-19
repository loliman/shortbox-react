import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { FastField } from "formik";
import AutocompleteBase from "../../generic/AutocompleteBase";
import { TextField } from "../../generic/FormikTextField";
import FilterSwitch from "../FilterSwitch";
import { COMPARE_OPTIONS, FORMAT_OPTIONS } from "../constants";
import { FilterValues } from "../types";

interface DetailsSectionProps {
  values: FilterValues;
  isDesktop: boolean;
  setFieldValue: (field: string, value: unknown) => void;
  hasSession: boolean;
}

function DetailsSection({
  values,
  isDesktop: _isDesktop,
  setFieldValue,
  hasSession,
}: DetailsSectionProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Details</Typography>

      <AutocompleteBase
        options={FORMAT_OPTIONS}
        value={values.formats}
        label="Format"
        multiple
        getOptionLabel={(option) => String((option as { name?: unknown })?.name || "")}
        isOptionEqualToValue={(option, value) =>
          normalizeText(option.name) === normalizeText((value as { name?: unknown })?.name)
        }
        onChange={(_, nextValue) => {
          setFieldValue("formats", asFormatArray(nextValue));
        }}
      />

      <FilterSwitch
        checked={values.withVariants}
        label="Mit Varianten"
        onToggle={() => setFieldValue("withVariants", !values.withVariants)}
      />

      <Stack spacing={1.5}>
        {values.releasedates.map((entry, index) => {
          const key = `${entry.date}-${entry.compare}-${index}`;
          return (
            <Box
              key={key}
              sx={{
                display: "grid",
                alignItems: "end",
                gap: 1,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "minmax(220px, 320px) minmax(120px, 160px) auto",
                },
              }}
            >
              <FastField
                name={`releasedates[${index}].date`}
                label="Erscheinungsdatum"
                type="date"
                InputLabelProps={{ shrink: true }}
                component={TextField}
                sx={{ width: "100%" }}
              />

              <FastField
                type="text"
                name={`releasedates[${index}].compare`}
                label="ist"
                select
                component={TextField}
                InputLabelProps={{ shrink: true }}
                sx={{ width: "100%" }}
              >
                {COMPARE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FastField>

              {index === values.releasedates.length - 1 ? (
                <IconButton
                  aria-label="Hinzufügen"
                  color="primary"
                  onClick={() =>
                    setFieldValue("releasedates", [
                      ...values.releasedates,
                      { date: "1900-01-01", compare: ">" },
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

      <FilterSwitch
        checked={values.and}
        label="Alle Kriterien müssen erfüllt sein"
        onToggle={() => setFieldValue("and", !values.and)}
      />

      <FilterSwitch
        checked={values.noCover}
        label="Ohne Cover"
        onToggle={() => setFieldValue("noCover", !values.noCover)}
      />

      <FilterSwitch
        checked={values.noContent}
        label="Ohne Inhalt"
        onToggle={() => setFieldValue("noContent", !values.noContent)}
      />

      {hasSession ? (
        <Stack spacing={2}>
          <FilterSwitch
            checked={values.onlyCollected}
            label="Nur in Sammlung"
            onToggle={() => setFieldValue("onlyCollected", !values.onlyCollected)}
          />
          <FilterSwitch
            checked={values.onlyNotCollected}
            label="Nur nicht in Sammlung"
            onToggle={() => setFieldValue("onlyNotCollected", !values.onlyNotCollected)}
          />
          <FilterSwitch
            checked={values.sellable}
            label="Verkaufbar"
            onToggle={() => setFieldValue("sellable", !values.sellable)}
          />
        </Stack>
      ) : null}
    </Stack>
  );
}

function asFormatArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const name = String((entry as { name?: unknown }).name || "").trim();
      if (!name) return null;
      return { name };
    })
    .filter((entry): entry is { name: string } => Boolean(entry));
}

function normalizeText(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default DetailsSection;
