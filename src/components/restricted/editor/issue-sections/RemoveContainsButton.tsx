import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ContainsProps } from "./types";

interface RemoveContainsButtonProps extends ContainsProps {
  type: "stories";
  index: number;
}

function RemoveContainsButton(props: RemoveContainsButtonProps) {
  return (
    <IconButton
      disabled={props.disabled}
      aria-label="Entfernen"
      onClick={() => {
        if (!props.setFieldValue || !props.items) return;

        props.setFieldValue(
          props.type,
          props.items.filter((_, itemIndex) => itemIndex !== props.index),
          true
        );
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}

export default RemoveContainsButton;
