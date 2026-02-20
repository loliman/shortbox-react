import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

interface FormActionsProps {
  isSubmitting: boolean;
  onReset: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

function FormActions({ isSubmitting, onReset, onCancel, onSubmit }: FormActionsProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      justifyContent="flex-end"
      sx={{ pt: 1 }}
    >
      <Button disabled={isSubmitting} onClick={onReset} variant="text" color="inherit">
        Zurücksetzen
      </Button>

      <Button disabled={isSubmitting} onClick={onCancel} variant="outlined" color="inherit">
        Abbrechen
      </Button>

      <Box>
        <Button disabled={isSubmitting} onClick={onSubmit} variant="contained" color="primary">
          Filtern
        </Button>
      </Box>
    </Stack>
  );
}

export default FormActions;
