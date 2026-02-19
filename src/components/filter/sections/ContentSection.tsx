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
        name={"arcs"}
        label="Teil von (Event, Story Arc, Story Line)"
        component={TextField}
        sx={{ width: isDesktop ? "70%" : "100%" }}
      />

      <FastField
        name={"appearances"}
        label="Auftritte (Personen, Gegenstände, Orte, ...)"
        component={TextField}
        sx={{ width: isDesktop ? "70%" : "100%" }}
      />
    </Stack>
  );
}

export default ContentSection;
