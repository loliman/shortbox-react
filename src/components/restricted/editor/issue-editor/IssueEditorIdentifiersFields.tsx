import React from "react";
import Stack from "@mui/material/Stack";
import { FastField } from "formik";
import { TextField } from "../../../generic/FormikTextField";
import type { IssueEditorFormValues } from "./types";

interface IssueEditorIdentifiersFieldsProps {
  values: IssueEditorFormValues;
  isDesktop?: boolean;
}

function IssueEditorIdentifiersFields({ values, isDesktop }: IssueEditorIdentifiersFieldsProps) {
  return (
    <Stack spacing={2}>
      {!values.series.publisher.us ? (
        <FastField
          name="comicguideid"
          label="Comicguide ID"
          type="number"
          component={TextField}
          sx={{ width: isDesktop ? "35%" : "100%" }}
        />
      ) : null}

      {!values.series.publisher.us ? (
        <FastField
          name="isbn"
          label="ISBN"
          type="string"
          component={TextField}
          sx={{ width: isDesktop ? "35%" : "100%" }}
        />
      ) : null}

      <FastField
        name="addinfo"
        label="Weitere Informationen"
        multiline
        rows={10}
        component={TextField}
        sx={{ width: isDesktop ? "35%" : "100%" }}
      />
    </Stack>
  );
}

export default IssueEditorIdentifiersFields;
