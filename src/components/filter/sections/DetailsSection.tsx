import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FastField } from "formik";
import AutocompleteBase from "../../generic/AutocompleteBase";
import { TextField } from "../../generic/FormikTextField";
import FilterSwitch from "../FilterSwitch";
import { FORMAT_OPTIONS } from "../constants";
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
  const switchGridSx = {
    display: "grid",
    gap: 1,
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "1fr 1fr 1fr" },
  } as const;

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

      <Box sx={switchGridSx}>
        <FilterSwitch
          checked={values.withVariants}
          label="Mit Varianten"
          onToggle={() => setFieldValue("withVariants", !values.withVariants)}
        />
      </Box>

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
            sm: "repeat(3, minmax(160px, 1fr))",
          },
        }}
      >
        <FastField
          name="releasedateFrom"
          label="Erscheinungsdatum von"
          type="date"
          InputLabelProps={{ shrink: true }}
          component={TextField}
          disabled={Boolean(values.releasedateExact)}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
          }}
        />
        <FastField
          name="releasedateTo"
          label="Erscheinungsdatum bis"
          type="date"
          InputLabelProps={{ shrink: true }}
          component={TextField}
          disabled={Boolean(values.releasedateExact)}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
          }}
        />
        <FastField
          name="releasedateExact"
          label="Exaktes Erscheinungsdatum"
          type="date"
          InputLabelProps={{ shrink: true }}
          component={TextField}
          disabled={Boolean(values.releasedateFrom) || Boolean(values.releasedateTo)}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
          }}
        />
      </Box>

      {hasSession ? (
        <Box sx={switchGridSx}>
          <FilterSwitch
            checked={values.noComicguideId}
            label="Ohne Comicguide ID"
            onToggle={() => setFieldValue("noComicguideId", !values.noComicguideId)}
          />
          <FilterSwitch
            checked={values.noContent}
            label="Ohne Inhalt"
            onToggle={() => setFieldValue("noContent", !values.noContent)}
          />
          <FilterSwitch
            checked={values.onlyCollected}
            label="Nur in Sammlung"
            disabled={values.onlyNotCollected || values.onlyNotCollectedNoOwnedVariants}
            onToggle={() => {
              const next = !values.onlyCollected;
              setFieldValue("onlyCollected", next);
              if (next) {
                setFieldValue("onlyNotCollected", false);
                setFieldValue("onlyNotCollectedNoOwnedVariants", false);
              }
            }}
          />
          <FilterSwitch
            checked={values.onlyNotCollected}
            label="Nur nicht in Sammlung"
            disabled={values.onlyCollected || values.onlyNotCollectedNoOwnedVariants}
            onToggle={() => {
              const next = !values.onlyNotCollected;
              setFieldValue("onlyNotCollected", next);
              if (next) {
                setFieldValue("onlyCollected", false);
                setFieldValue("onlyNotCollectedNoOwnedVariants", false);
              }
            }}
          />
          <FilterSwitch
            checked={values.onlyNotCollectedNoOwnedVariants}
            label="Nicht in Sammlung (ohne besessene Varianten)"
            disabled={values.onlyCollected || values.onlyNotCollected}
            onToggle={() => {
              const next = !values.onlyNotCollectedNoOwnedVariants;
              setFieldValue("onlyNotCollectedNoOwnedVariants", next);
              if (next) {
                setFieldValue("onlyCollected", false);
                setFieldValue("onlyNotCollected", false);
              }
            }}
          />
        </Box>
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
