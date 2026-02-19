import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import type { MouseEvent } from "react";

interface IssueEditorActionsProps {
  isSubmitting: boolean;
  submitLabel: string;
  submitAndCopyLabel: string;
  resetForm: () => void;
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
  onSubmitMode: (copyMode: boolean) => void;
}

function IssueEditorActions({
  isSubmitting,
  submitLabel,
  submitAndCopyLabel,
  resetForm,
  onCancel,
  onSubmitMode,
}: IssueEditorActionsProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="flex-end">
      <Button disabled={isSubmitting} onClick={() => resetForm()} color="secondary">
        Zurücksetzen
      </Button>

      <Button disabled={isSubmitting} onClick={onCancel} color="primary">
        Abbrechen
      </Button>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <Button disabled={isSubmitting} onClick={() => onSubmitMode(false)} color="primary">
          {submitLabel}
        </Button>

        <Button
          value="createAndCopy"
          disabled={isSubmitting}
          onClick={() => onSubmitMode(true)}
          color="primary"
        >
          {submitAndCopyLabel}
        </Button>
      </Box>
    </Stack>
  );
}

export default IssueEditorActions;
