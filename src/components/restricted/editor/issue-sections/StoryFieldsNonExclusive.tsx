import React from "react";
import { FastField } from "formik";
import AutocompleteField from "../../../generic/AutocompleteField";
import { TextField } from "../../../generic/FormikTextField";
import { individuals, series } from "../../../../graphql/queriesTyped";
import { generateLabel } from "../../../../util/hierarchy";
import { getPattern, updateField } from "./helpers";
import type { ContainsProps, FieldItem } from "./types";

interface StoryFieldsNonExclusiveProps extends ContainsProps {
  index?: number;
  values?: Record<string, unknown> & { stories?: FieldItem[] };
}

function StoryFieldsNonExclusive(props: StoryFieldsNonExclusiveProps) {
  const index = Number.isInteger(props.index) ? (props.index as number) : 0;
  const values = props.values || {};
  const setFieldValue = props.setFieldValue || (() => undefined);
  const stories = values.stories || [];
  const item = stories[index] || {};
  const parent = (item.parent || {}) as { issue?: { series?: { title?: string } } };
  const parentIssue = parent.issue || {};
  const parentSeries = parentIssue.series || {};

  return (
    <div className="storyAddInputContainer">
      <AutocompleteField
        query={series}
        name={`stories[${index}].parent.issue.series`}
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
              setFieldValue(`stories[${index}].parent.issue.series.title`, option);
            } else {
              const selected = option
                ? { ...option, volume: option.volume || 0 }
                : { title: "", volume: 0 };

              setFieldValue(`stories[${index}].parent.issue.series`, selected);
            }
          }
        }}
        generateLabel={generateLabel}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field25"}
        name={`stories[${index}].parent.issue.series.volume`}
        label="Volume"
        type="number"
        component={TextField}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field60"}
        name={`stories[${index}].parent.issue.number`}
        label="Nummer"
        component={TextField}
      />

      <FastField
        className={props.isDesktop ? "field field5" : "field field10"}
        name={`stories[${index}].parent.number`}
        label="#"
        type="number"
        component={TextField}
      />

      <AutocompleteField
        query={individuals}
        name={`stories[${index}].individuals`}
        type="TRANSLATOR"
        nameField="name"
        label="Übersetzer"
        disabled={props.disabled}
        multiple
        allowCreate
        variables={{ pattern: getPattern((item.individuals as FieldItem[]) || [], "name") }}
        onChange={(option, live) =>
          updateField(
            option as string | { [key: string]: unknown },
            Boolean(live),
            item.individuals as FieldItem[] | undefined,
            setFieldValue,
            `stories[${index}].individuals`,
            "name"
          )
        }
        generateLabel={(entry) => String(entry.name || "")}
      />
    </div>
  );
}

export default StoryFieldsNonExclusive;
