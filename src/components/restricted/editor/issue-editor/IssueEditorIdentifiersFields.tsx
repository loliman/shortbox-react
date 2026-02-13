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
          className={isDesktop ? "field field35" : "field field100"}
          name="comicguideid"
          label="Comicguide ID"
          type="number"
          component={TextField}
        />
      ) : null}

      {!values.series.publisher.us ? (
        <FastField
          className={isDesktop ? "field field35" : "field field100"}
          name="isbn"
          label="ISBN"
          type="string"
          component={TextField}
        />
      ) : null}

      <FastField
        className={isDesktop ? "field field35" : "field field100"}
        name="addinfo"
        label="Weitere Informationen"
        multiline
        rows={10}
        component={TextField}
      />
    </Stack>
  );
}

export default IssueEditorIdentifiersFields;
