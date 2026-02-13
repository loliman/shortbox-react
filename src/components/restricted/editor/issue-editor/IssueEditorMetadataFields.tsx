import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { FastField } from "formik";
import { TextField } from "../../../generic/FormikTextField";
import AutocompleteField from "../../../generic/AutocompleteField";
import { arcs, individuals } from "../../../../graphql/queriesTyped";
import { getPattern } from "../IssueEditorSections";
import { currencies, formats } from "./constants";
import type { IssueEditorFormValues } from "./types";

interface IssueEditorMetadataFieldsProps {
  values: IssueEditorFormValues;
  isDesktop?: boolean;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
}

function IssueEditorMetadataFields({
  values,
  isDesktop,
  setFieldValue,
}: IssueEditorMetadataFieldsProps) {
  const us = values.series.publisher.us;

  return (
    <Stack spacing={2}>
      {!us ? (
        <FastField
          type="text"
          name="format"
          label="Format"
          select
          component={TextField}
          className={isDesktop ? "field field35" : "field field100"}
          InputLabelProps={{ shrink: true }}
        >
          {formats.map((formatValue) => (
            <MenuItem key={formatValue} value={formatValue}>
              {formatValue}
            </MenuItem>
          ))}
        </FastField>
      ) : null}

      <FastField
        className={isDesktop ? "field field35" : "field field100"}
        name="variant"
        label="Variante"
        component={TextField}
      />

      {!us ? (
        <React.Fragment>
          <FastField
            className={isDesktop ? "field field35" : "field field100"}
            name="limitation"
            label="Limitierung"
            type="number"
            component={TextField}
          />

          <FastField
            className={isDesktop ? "field field35" : "field field100"}
            name="pages"
            label="Seiten"
            type="number"
            component={TextField}
          />

          <FastField
            className={isDesktop ? "field field30" : "field field75"}
            name="price"
            label="Preis"
            component={TextField}
          />

          <FastField
            type="text"
            name="currency"
            label="Währung"
            select
            component={TextField}
            className={isDesktop ? "field field10" : "field field25"}
            InputLabelProps={{ shrink: true }}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </FastField>
        </React.Fragment>
      ) : null}

      <FastField
        className={isDesktop ? "field field35" : "field field100"}
        name="releasedate"
        label="Erscheinungsdatum"
        type="date"
        InputLabelProps={{ shrink: true }}
        component={TextField}
      />

      {us ? (
        <React.Fragment>
          <AutocompleteField
            query={individuals}
            name="individuals"
            type="EDITOR"
            nameField="name"
            label="Verleger"
            multiple
            allowCreate
            variables={{ pattern: getPattern(values.individuals, "name") }}
            onChange={(option) => setFieldValue("individuals", option)}
            generateLabel={(entry) => entry.name}
          />

          <AutocompleteField
            query={arcs}
            name="arcs"
            type="EVENT"
            nameField="title"
            label="Event"
            multiple
            allowCreate
            variables={{ pattern: getPattern(values.arcs, "title"), type: "EVENT" }}
            onChange={(option) => setFieldValue("arcs", option)}
            generateLabel={(entry) => entry.title}
          />

          <AutocompleteField
            query={arcs}
            name="arcs"
            type="STORYARC"
            nameField="title"
            label="Arc"
            multiple
            allowCreate
            variables={{ pattern: getPattern(values.arcs, "title"), type: "STORYARC" }}
            onChange={(option) => setFieldValue("arcs", option)}
            generateLabel={(entry) => entry.title}
          />

          <AutocompleteField
            query={arcs}
            name="arcs"
            type="STORYLINE"
            nameField="title"
            label="Storyline"
            multiple
            allowCreate
            variables={{ pattern: getPattern(values.arcs, "title"), type: "STORYLINE" }}
            onChange={(option) => setFieldValue("arcs", option)}
            generateLabel={(entry) => entry.title}
          />
        </React.Fragment>
      ) : null}
    </Stack>
  );
}

export default IssueEditorMetadataFields;
