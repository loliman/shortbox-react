import React from "react";
import Stack from "@mui/material/Stack";
import { apps, individuals } from "../../../../graphql/queriesTyped";
import type { ContainsProps, FieldItem } from "./types";
import TypedRoleAutocomplete from "./TypedRoleAutocomplete";

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
    <>
      <Stack spacing={1.5}>
        {individualFields.map((field) => (
          <TypedRoleAutocomplete
            key={field.type}
            query={individuals}
            field={`stories[${index}].individuals`}
            label={field.label}
            type={field.type}
            values={storyIndividuals}
            setFieldValue={setFieldValue}
            disabled={props.disabled}
          />
        ))}
      </Stack>

      <Stack spacing={1.5}>
        {appearanceFields.map((field) => (
          <TypedRoleAutocomplete
            key={field.type}
            query={apps}
            field={`stories[${index}].appearances`}
            label={field.label}
            type={field.type}
            values={storyAppearances}
            setFieldValue={setFieldValue}
            disabled={props.disabled}
            variables={{
              type: field.queryType || field.type,
            }}
          />
        ))}
      </Stack>
    </>
  );
}

export default StoryFieldsExclusive;
