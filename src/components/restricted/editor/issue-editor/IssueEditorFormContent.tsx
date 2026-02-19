import React from "react";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { Cover } from "../IssueEditorSections";
import IssueEditorActions from "./IssueEditorActions";
import IssueEditorHeader from "./IssueEditorHeader";
import IssueEditorIdentifiersFields from "./IssueEditorIdentifiersFields";
import IssueEditorMetadataFields from "./IssueEditorMetadataFields";
import IssueEditorRelations from "./IssueEditorRelations";
import IssueEditorSeriesFields from "./IssueEditorSeriesFields";
import type { IssueEditorFormContentProps } from "./types";

function IssueEditorFormContent(props: IssueEditorFormContentProps) {
  const {
    values,
    edit,
    isDesktop,
    id,
    session,
    header,
    submitLabel,
    submitAndCopyLabel,
    isSubmitting,
    setFieldValue,
    resetForm,
    onToggleUs,
    onCancel,
    onSubmitMode,
  } = props;

  return (
    <React.Fragment>
      <IssueEditorHeader
        header={header}
        id={id}
        session={session}
        edit={edit}
        us={values.series.publisher.us}
        onToggle={() => {
          onToggleUs();
          resetForm();
        }}
      />

      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          {isDesktop ? <Cover isDesktop={isDesktop} cover={values.cover} /> : null}

          <IssueEditorSeriesFields
            values={values}
            isDesktop={isDesktop}
            setFieldValue={setFieldValue}
          />

          {!isDesktop ? <Cover isDesktop={isDesktop} cover={values.cover} /> : null}

          <IssueEditorMetadataFields
            values={values}
            isDesktop={isDesktop}
            setFieldValue={setFieldValue}
          />

          <IssueEditorIdentifiersFields values={values} isDesktop={isDesktop} />

          <IssueEditorRelations
            values={values}
            isDesktop={isDesktop}
            setFieldValue={setFieldValue}
          />

          <IssueEditorActions
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            submitAndCopyLabel={submitAndCopyLabel}
            resetForm={resetForm}
            onCancel={onCancel}
            onSubmitMode={onSubmitMode}
          />
        </Stack>
      </CardContent>
    </React.Fragment>
  );
}

export default IssueEditorFormContent;
