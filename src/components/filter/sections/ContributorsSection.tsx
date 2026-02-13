import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AutocompleteField from "../../generic/AutocompleteField";
import { individuals } from "../../../graphql/queriesTyped";
import { CONTRIBUTOR_FIELDS, TRANSLATOR_FIELD } from "../constants";
import { FilterValues } from "../types";
import { getPattern, updateField } from "../queryHelpers";

interface ContributorsSectionProps {
  values: FilterValues;
  us: boolean;
  setFieldValue: (field: string, value: unknown) => void;
}

function ContributorsSection({ values, us, setFieldValue }: ContributorsSectionProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Mitwirkende</Typography>

      <Stack spacing={1}>
        {CONTRIBUTOR_FIELDS.map((field) => (
          <AutocompleteField
            key={field.type}
            query={individuals}
            name={"individuals"}
            nameField="name"
            type={field.type}
            label={field.label}
            multiple
            variables={{ pattern: getPattern(values.individuals, "name") }}
            onChange={(option, live) =>
              updateField(option as any, Boolean(live), values.individuals, setFieldValue, "individuals", "name")
            }
            generateLabel={(entry) => String(entry.name || "")}
          />
        ))}
      </Stack>

      {!us ? (
        <Stack spacing={1}>
          <AutocompleteField
            query={individuals}
            name={"individuals"}
            type={TRANSLATOR_FIELD.type}
            nameField="name"
            label={TRANSLATOR_FIELD.label}
            multiple
            variables={{ pattern: getPattern(values.individuals, "name") }}
            onChange={(option, live) =>
              updateField(option as any, Boolean(live), values.individuals, setFieldValue, "individuals", "name")
            }
            generateLabel={(entry) => String(entry.name || "")}
          />
        </Stack>
      ) : null}
    </Stack>
  );
}

export default ContributorsSection;
