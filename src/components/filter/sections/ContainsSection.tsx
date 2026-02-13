import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { FastField } from "formik";
import AutocompleteField from "../../generic/AutocompleteField";
import { TextField } from "../../generic/FormikTextField";
import FilterSwitch from "../FilterSwitch";
import { COMPARE_OPTIONS } from "../constants";
import { FilterValues } from "../types";
import { generateLabel } from "../../../util/hierarchy";
import { publishers, series } from "../../../graphql/queriesTyped";
import { getPattern, updateField } from "../queryHelpers";

interface ContainsSectionProps {
  values: FilterValues;
  us: boolean;
  isDesktop: boolean;
  setFieldValue: (field: string, value: unknown) => void;
}

function ContainsSection({ values, us, isDesktop, setFieldValue }: ContainsSectionProps) {
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

      <AutocompleteField
        query={publishers}
        name={"publishers"}
        nameField="name"
        label="Verlag"
        multiple
        variables={{ pattern: getPattern(values.publishers, "name"), us: !us }}
        onChange={(option, live) =>
          updateField(option as any, Boolean(live), values.publishers, setFieldValue, "publishers", "name")
        }
        generateLabel={(entry) => String(entry.name || "")}
      />

      <AutocompleteField
        query={series}
        name={"series"}
        nameField="title"
        label="Serie"
        multiple
        variables={{
          pattern: getPattern(values.series, "title"),
          publisher: { name: "*", us: !us },
        }}
        onChange={(option, live) =>
          updateField(option as any, Boolean(live), values.series, setFieldValue, "series", "title")
        }
        generateLabel={(entry) => generateLabel(entry as any)}
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

export default ContainsSection;
