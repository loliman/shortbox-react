import React from "react";
import Box from "@mui/material/Box";
import { FastField } from "formik";
import { TextField } from "../../../generic/FormikTextField";
import ExclusiveToggle from "./ExclusiveToggle";
import StoryFieldsExclusive from "./StoryFieldsExclusive";
import StoryFieldsNonExclusive from "./StoryFieldsNonExclusive";
import type { ContainsProps, FieldItem } from "./types";

interface StoryFieldsProps extends ContainsProps {
  index?: number;
  values?: Record<string, unknown> & { stories?: FieldItem[] };
  items?: FieldItem[];
}

function StoryFields(props: StoryFieldsProps) {
  const index = Number.isInteger(props.index) ? (props.index as number) : 0;
  const stories = props.items || [];
  const item = stories[index] || {};
  const isExclusive = Boolean(item.exclusive) || Boolean(props.us);

  const parent = (item.parent || {}) as { title?: string };
  const parentTitle = String(parent.title || "");

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <Box sx={{ width: "100%" }}>
          {parentTitle}
        </Box>

        <FastField
          name={`stories[${index}].number`}
          disabled={props.disabled}
          label="#"
          type="number"
          component={TextField}
          sx={{ width: props.isDesktop ? "12%" : "25%" }}
        />

        <FastField
          name={`stories[${index}].title`}
          disabled={props.disabled}
          label="Titel"
          component={TextField}
          sx={{ width: props.isDesktop ? "35%" : "100%" }}
        />

        <FastField
          name={`stories[${index}].addinfo`}
          disabled={props.disabled}
          label="Weitere Informationen"
          component={TextField}
          sx={{ width: props.isDesktop ? "30%" : "100%" }}
        />

        <FastField
          name={`stories[${index}].part`}
          disabled={props.disabled}
          label="Teil"
          component={TextField}
          sx={{ width: props.isDesktop ? "10%" : "100%" }}
        />

        {!props.us ? <ExclusiveToggle {...props} type="stories" index={index} /> : null}
      </Box>

      {isExclusive ? (
        <StoryFieldsExclusive {...props} index={index} />
      ) : (
        <StoryFieldsNonExclusive {...props} index={index} />
      )}
    </React.Fragment>
  );
}

export default StoryFields;
