import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import IssueEditorActions from "./IssueEditorActions";
import IssueEditorIdentifiersFields from "./IssueEditorIdentifiersFields";
import IssueEditorMetadataFields from "./IssueEditorMetadataFields";
import IssueEditorRelations from "./IssueEditorRelations";
import IssueEditorSeriesFields from "./IssueEditorSeriesFields";
import type { IssueEditorFormContentProps } from "./types";
import { editorSectionSx } from "../editorLayout";
import TitleLine from "../../../generic/TitleLine";

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
    <>
      <CardHeader
        title={<TitleLine title={header} id={id} session={session} />}
        action={
          <FormControlLabel
            sx={{ m: 0 }}
            control={
              <Tooltip title={(values.series.publisher.us ? "Deutsche" : "US") + " Ausgabe"}>
                <Switch
                  disabled={edit}
                  checked={values.series.publisher.us}
                  onChange={() => {
                    onToggleUs();
                    resetForm();
                  }}
                  color="secondary"
                />
              </Tooltip>
            }
            label="US"
          />
        }
      />

      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={2.25}>
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

          <Paper elevation={0} sx={editorSectionSx}>
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
      </CardContent>
    </>
  );
}

interface IssueEditorSectionProps {
  title: string;
  children: React.ReactNode;
}

function IssueEditorSection({ title, children }: Readonly<IssueEditorSectionProps>) {
  return (
    <Paper elevation={0} sx={editorSectionSx}>
      <Stack spacing={2}>
        <Typography variant="subtitle1">{title}</Typography>
        {children}
      </Stack>
    </Paper>
  );
}

export default IssueEditorFormContent;
