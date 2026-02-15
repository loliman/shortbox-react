import React from "react";
import AutocompleteField from "../../../generic/AutocompleteField";
import { individuals } from "../../../../graphql/queriesTyped";
import { getPattern, updateField } from "./helpers";
import type { ContainsProps, FieldItem } from "./types";

interface CoverFieldsExclusiveProps extends ContainsProps {
  index?: number;
  values?: Record<string, unknown> & { covers?: FieldItem[] };
}

function CoverFieldsExclusive(props: CoverFieldsExclusiveProps) {
  const index = Number.isInteger(props.index) ? (props.index as number) : 0;
  const values = props.values || {};
  const setFieldValue = props.setFieldValue || (() => undefined);
  const covers = values.covers || [];
  const item = covers[index] || {};
  const itemIndividuals = (item.individuals as FieldItem[]) || [];

  return (
    <AutocompleteField
      query={individuals}
      name={`covers[${index}].individuals`}
      nameField="name"
      type="ARTIST"
      label="Zeichner"
      multiple
      allowCreate
      disabled={props.disabled}
      variables={{ pattern: getPattern(itemIndividuals, "name") }}
      onChange={(option, live) =>
        updateField(
          option as string | { [key: string]: unknown },
          Boolean(live),
          itemIndividuals,
          setFieldValue,
          `covers[${index}].individuals`,
          "name"
        )
      }
      generateLabel={(entry) => String(entry.name || "")}
    />
  );
}

export default CoverFieldsExclusive;
