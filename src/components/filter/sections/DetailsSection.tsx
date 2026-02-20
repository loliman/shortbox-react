import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
                px: 1,
                py: 0.9,
                borderRadius: 1.75,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(255,255,255,0.78)",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "minmax(220px, 1fr) minmax(120px, 170px) auto",
                },
              }}
            >
              <FastField
                name={`releasedates[${index}].date`}
                label="Erscheinungsdatum"
                type="date"
                InputLabelProps={{ shrink: true }}
                component={TextField}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
                }}
              />

              <FastField
                type="text"
                name={`releasedates[${index}].compare`}
                label="ist"
                select
                component={TextField}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
                }}
              >
                {COMPARE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FastField>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                {values.releasedates.length > 1 ? (
                  <IconButton
                    aria-label="Entfernen"
                    color="inherit"
                    size="small"
                    onClick={() =>
                      setFieldValue(
                        "releasedates",
                        values.releasedates.filter((_, entryIndex) => entryIndex !== index)
                      )
                    }
                    sx={{
                      width: 34,
                      height: 34,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                      "&:hover": {
                        bgcolor: "rgba(239,68,68,0.09)",
                        borderColor: "rgba(239,68,68,0.52)",
                      },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                ) : null}

                {index === values.releasedates.length - 1 ? (
                  <IconButton
                    aria-label="Hinzufügen"
                    color="primary"
                    size="small"
                    onClick={() =>
                      setFieldValue("releasedates", [
                        ...values.releasedates,
                        { date: "1900-01-01", compare: ">" },
                      ])
                    }
                    sx={{
                      width: 34,
                      height: 34,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                      "&:hover": {
                        bgcolor: "rgba(34,197,94,0.10)",
                        borderColor: "rgba(34,197,94,0.55)",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Stack>

      <Box sx={switchGridSx}>
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
      </Box>

      {hasSession ? (
        <Box sx={switchGridSx}>
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
