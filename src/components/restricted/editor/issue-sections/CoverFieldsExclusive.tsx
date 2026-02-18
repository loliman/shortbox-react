import React from "react";
import { individuals } from "../../../../graphql/queriesTyped";
import type { ContainsProps, FieldItem } from "./types";
import TypedRoleAutocomplete from "./TypedRoleAutocomplete";

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
    <TypedRoleAutocomplete
      query={individuals}
      label="Zeichner"
      field={`covers[${index}].individuals`}
      type="ARTIST"
      values={itemIndividuals}
      setFieldValue={setFieldValue}
      disabled={props.disabled}
    />
  );
}

export default CoverFieldsExclusive;
