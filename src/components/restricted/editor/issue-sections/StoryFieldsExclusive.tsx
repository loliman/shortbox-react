import React from "react";
import AutocompleteField from "../../../generic/AutocompleteField";
import { apps, individuals } from "../../../../graphql/queriesTyped";
import { getPattern, updateField } from "./helpers";
import type { ContainsProps, FieldItem } from "./types";

interface StoryFieldsExclusiveProps extends ContainsProps {
  index?: number;
  values?: Record<string, unknown> & { stories?: FieldItem[] };
}

interface TypedField {
  type: string;
  label: string;
  queryType?: string;
}

const individualFields: TypedField[] = [
  { type: "WRITER", label: "Autor" },
  { type: "PENCILER", label: "Zeichner" },
  { type: "INKER", label: "Inker" },
  { type: "COLORIST", label: "Kolorist" },
  { type: "LETTERER", label: "Letterer" },
  { type: "EDITOR", label: "Verleger" },
];

const appearanceFields: TypedField[] = [
  { type: "FEATURED", label: "Hauptcharaktere", queryType: "CHARACTER" },
  { type: "ANTAGONIST", label: "Antagonisten", queryType: "CHARACTER" },
  { type: "SUPPORTING", label: "Unterstützende Charaktere", queryType: "CHARACTER" },
  { type: "OTHER", label: "Andere Charaktere", queryType: "CHARACTER" },
  { type: "GROUP", label: "Teams", queryType: "GROUP" },
  { type: "RACE", label: "Rassen", queryType: "RACE" },
  { type: "ANIMAL", label: "Tiere", queryType: "ANIMAL" },
  { type: "ITEM", label: "Gegenstände", queryType: "ITEM" },
  { type: "VEHICLE", label: "Fahrzeuge", queryType: "VEHICLE" },
  { type: "LOCATION", label: "Orte", queryType: "LOCATION" },
];

function StoryFieldsExclusive(props: StoryFieldsExclusiveProps) {
  const index = Number.isInteger(props.index) ? (props.index as number) : 0;
  const values = props.values || {};
  const setFieldValue = props.setFieldValue || (() => undefined);
  const stories = values.stories || [];
  const item = stories[index] || {};
  const storyIndividuals = (item.individuals as FieldItem[]) || [];
  const storyAppearances = (item.appearances as FieldItem[]) || [];

  return (
    <React.Fragment>
      <div className="storyAddInputContainer">
        {individualFields.map((field) => (
          <AutocompleteField
            key={field.type}
            query={individuals}
            name={`stories[${index}].individuals`}
            type={field.type}
            nameField="name"
            label={field.label}
            disabled={props.disabled}
            multiple
            allowCreate
            variables={{ pattern: getPattern(storyIndividuals, "name") }}
            onChange={(option, live) =>
              updateField(
                option as string | { [key: string]: unknown },
                Boolean(live),
                storyIndividuals,
                setFieldValue,
                `stories[${index}].individuals`,
                "name"
              )
            }
            generateLabel={(entry) => String(entry.name || "")}
          />
        ))}
      </div>

      <div className="storyAddInputContainer">
        {appearanceFields.map((field) => (
          <AutocompleteField
            key={field.type}
            query={apps}
            name={`stories[${index}].appearances`}
            type={field.type}
            nameField="name"
            label={field.label}
            disabled={props.disabled}
            multiple
            allowCreate
            variables={{
              pattern: getPattern(storyAppearances, "name"),
              type: field.queryType || field.type,
            }}
            onChange={(option, live) =>
              updateField(
                option as string | { [key: string]: unknown },
                Boolean(live),
                storyAppearances,
                setFieldValue,
                `stories[${index}].appearances`,
                "name"
              )
            }
            generateLabel={(entry) => String(entry.name || "")}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

export default StoryFieldsExclusive;
