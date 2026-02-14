import React from "react";
import Stack from "@mui/material/Stack";
import { FastField } from "formik";
import { TextField } from "../../../generic/FormikTextField";
import AutocompleteField from "../../../generic/AutocompleteField";
import { publishers, series } from "../../../../graphql/queriesTyped";
import { generateLabel } from "../../../../util/hierarchy";
import type { IssueEditorFormValues } from "./types";

interface IssueEditorSeriesFieldsProps {
  values: IssueEditorFormValues;
  isDesktop?: boolean;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
}

function IssueEditorSeriesFields({
  values,
  isDesktop,
  setFieldValue,
}: IssueEditorSeriesFieldsProps) {
  return (
    <Stack spacing={2}>
      <FastField
        className={isDesktop ? "field field35" : "field field100"}
        name="title"
        label="Titel"
        component={TextField}
      />

      <AutocompleteField
        query={publishers}
        name="series.publisher.name"
        label="Verlag"
        variables={{
          pattern: values.series.publisher.name,
          us: values.series.publisher.us ? values.series.publisher.us : false,
        }}
        onChange={(option, live) => {
          if (typeof option !== "string" || option.trim() !== "") {
            if (live) {
              setFieldValue("series.publisher.name", option);
              return;
            }

            setFieldValue("series", {
              title: "",
              volume: "",
              publisher: { name: "", us: values.series.publisher.us },
            });

            if (option) setFieldValue("series.publisher", option);
          }
        }}
        generateLabel={generateLabel}
      />

      <AutocompleteField
        disabled={!values.series.publisher.name || values.series.publisher.name.trim().length === 0}
        query={series}
        variables={{
          pattern: values.series.title,
          publisher: { name: values.series.publisher.name },
        }}
        name="series.title"
        label="Serie"
        onChange={(option, live) => {
          if (typeof option !== "string" || option.trim() !== "") {
            if (live) {
              setFieldValue("series.title", option);
              return;
            }

            setFieldValue(
              "series",
              option
                ? {
                    title: option.title,
                    volume: option.volume,
                    publisher: {
                      name: values.series.publisher.name,
                      us: values.series.publisher.us,
                    },
                  }
                : {
                    title: "",
                    volume: "",
                    publisher: {
                      name: values.series.publisher.name,
                      us: values.series.publisher.us,
                    },
                  }
            );
          }
        }}
        generateLabel={generateLabel}
      />

      <FastField
        disabled={!values.series.publisher.name || values.series.publisher.name.trim().length === 0}
        className={isDesktop ? "field field10" : "field field25"}
        name="series.volume"
        label="Volume"
        type="number"
        component={TextField}
      />

      <FastField
        className={isDesktop ? "field field35" : "field field100"}
        name="number"
        label="Nummer"
        component={TextField}
      />
    </Stack>
  );
}

export default IssueEditorSeriesFields;
