import React from "react";
import Stack from "@mui/material/Stack";
import { Covers, Stories } from "../IssueEditorSections";
import type { IssueEditorFormValues } from "./types";

interface IssueEditorRelationsProps {
  values: IssueEditorFormValues;
  isDesktop?: boolean;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
}

function IssueEditorRelations({ values, isDesktop, setFieldValue }: IssueEditorRelationsProps) {
  return (
    <Stack spacing={2}>
      <Stories
        setFieldValue={setFieldValue}
        items={values.stories}
        isDesktop={isDesktop}
        values={values}
        us={values.series.publisher.us}
      />

      <Covers
        setFieldValue={setFieldValue}
        items={values.covers}
        isDesktop={isDesktop}
        us={values.series.publisher.us}
        values={values}
      />
    </Stack>
  );
}

export default IssueEditorRelations;
