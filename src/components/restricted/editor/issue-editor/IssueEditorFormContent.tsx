import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
    <Box sx={{ width: "100%", maxWidth: 1280, mx: "auto" }}>
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

      <Box sx={{ mt: 2 }}>
        <Stack spacing={2.5}>
          <IssueEditorSection title="Basisdaten">
            <IssueEditorSeriesFields
              values={values}
              isDesktop={isDesktop}
              setFieldValue={setFieldValue}
            />
          </IssueEditorSection>

          <IssueEditorSection title="Metadaten">
            <IssueEditorMetadataFields
              values={values}
              isDesktop={isDesktop}
              setFieldValue={setFieldValue}
            />
          </IssueEditorSection>

          <IssueEditorSection title="Kennungen und Beschreibung">
            <IssueEditorIdentifiersFields values={values} isDesktop={isDesktop} />
          </IssueEditorSection>

          <IssueEditorSection title="Geschichten">
            <IssueEditorRelations
              values={values}
              isDesktop={isDesktop}
              setFieldValue={setFieldValue}
            />
          </IssueEditorSection>

          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
            <IssueEditorActions
              isSubmitting={isSubmitting}
              submitLabel={submitLabel}
              submitAndCopyLabel={submitAndCopyLabel}
              resetForm={resetForm}
              onCancel={onCancel}
              onSubmitMode={onSubmitMode}
            />
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}

interface IssueEditorSectionProps {
  title: string;
  children: React.ReactNode;
}

function IssueEditorSection({ title, children }: Readonly<IssueEditorSectionProps>) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600 }}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
}

export default IssueEditorFormContent;
