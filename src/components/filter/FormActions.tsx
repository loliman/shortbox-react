import React from "react";
import Button from "@mui/material/Button";

interface FormActionsProps {
  isSubmitting: boolean;
  onReset: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

function FormActions({ isSubmitting, onReset, onCancel, onSubmit }: FormActionsProps) {
  return (
    <div className="formButtons">
      <Button disabled={isSubmitting} onClick={onReset} color="secondary">
        Zurücksetzen
      </Button>

      <Button disabled={isSubmitting} onClick={onCancel} color="primary">
        Abbrechen
      </Button>

      <Button className="createButton" disabled={isSubmitting} onClick={onSubmit} color="primary">
        Filtern
      </Button>
    </div>
  );
}

export default FormActions;
