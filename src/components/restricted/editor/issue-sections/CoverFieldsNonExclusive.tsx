import React from "react";
import { FastField } from "formik";
import AutocompleteField from "../../../generic/AutocompleteField";
import { TextField } from "../../../generic/FormikTextField";
import { series } from "../../../../graphql/queriesTyped";
import { generateLabel } from "../../../../util/hierarchy";
import type { ContainsProps, FieldItem } from "./types";

interface CoverFieldsNonExclusiveProps extends ContainsProps {
  index?: number;
  values?: Record<string, unknown> & { covers?: FieldItem[] };
}

function CoverFieldsNonExclusive(props: CoverFieldsNonExclusiveProps) {
  const index = Number.isInteger(props.index) ? (props.index as number) : 0;
  const values = props.values || {};
  const setFieldValue = props.setFieldValue || (() => undefined);
  const covers = values.covers || [];
  const item = covers[index] || {};
  const parent = (item.parent || {}) as { issue?: { series?: { title?: string } } };
  const parentIssue = parent.issue || {};
  const parentSeries = parentIssue.series || {};

  return (
    <div className="storyAddInputContainer">
      <AutocompleteField
        query={series}
        name={`covers[${index}].parent.issue.series`}
        nameField="title"
        label="Serie"
        allowCreate
        variables={{
          pattern: parentSeries.title || "",
          publisher: { name: "*", us: true },
        }}
        onChange={(option, live) => {
          if (typeof option !== "string" || option.trim() !== "") {
            if (live) {
              setFieldValue(`covers[${index}].parent.issue.series.title`, option);
            } else {
              const selected = option
                ? { ...option, volume: option.volume || 0 }
                : { title: "", volume: 0 };

              setFieldValue(`covers[${index}].parent.issue.series`, selected);
            }
          }
        }}
        generateLabel={generateLabel}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field25"}
        name={`covers[${index}].parent.issue.series.volume`}
        label="Volume"
        type="number"
        component={TextField}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field73"}
        name={`covers[${index}].parent.issue.number`}
        label="Nummer"
        component={TextField}
      />

      <FastField
        className={props.isDesktop ? "field field30" : "field field100"}
        name={`covers[${index}].parent.issue.variant`}
        label="Variante"
        component={TextField}
      />
    </div>
  );
}

export default CoverFieldsNonExclusive;
