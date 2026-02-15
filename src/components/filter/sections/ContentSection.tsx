import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { FastField } from "formik";
import { TextField } from "../../generic/FormikTextField";

interface ContentSectionProps {
  isDesktop: boolean;
}

function ContentSection({ isDesktop }: ContentSectionProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Inhalt</Typography>

      <FastField
        className={isDesktop ? "field field40" : "field field90"}
        name={"arcs"}
        label="Teil von (Event, Story Arc, Story Line)"
        component={TextField}
      />

      <FastField
        className={isDesktop ? "field field40" : "field field90"}
        name={"appearances"}
        label="Auftritte (Personen, Gegenstände, Orte, ...)"
        component={TextField}
      />
    </Stack>
  );
}

export default ContentSection;
