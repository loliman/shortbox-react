import React from "react";
import Button from "@mui/material/Button";
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
    <div className="formButtons">
      <Button disabled={isSubmitting} onClick={() => resetForm()} color="secondary">
        Zurücksetzen
      </Button>

      <Button disabled={isSubmitting} onClick={onCancel} color="primary">
        Abbrechen
      </Button>

      <div className="createButton">
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
      </div>
    </div>
  );
}

export default IssueEditorActions;
