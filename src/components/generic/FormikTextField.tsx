import React from "react";
import { getIn } from "formik";
import TextField from "@mui/material/TextField";

function FormikTextField({ field, form, helperText, ...props }) {
  const touched = getIn(form.touched, field.name);
  const error = getIn(form.errors, field.name);
  const showError = Boolean(touched && error);

  return (
    <TextField
      {...field}
      {...props}
      value={field.value !== undefined && field.value !== null ? field.value : ""}
      error={showError}
      helperText={showError ? error : helperText}
      onChange={props.onChange || field.onChange}
      onBlur={props.onBlur || field.onBlur}
    />
  );
}

export { FormikTextField as TextField };
