import React from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { cloneFieldItem } from "./defaults";
import type { ContainsProps, FieldItem } from "./types";

interface AddContainsButtonProps extends ContainsProps {
  type: "stories";
  defaultItem: FieldItem;
}

function AddContainsButton(props: AddContainsButtonProps) {
  return (
    <IconButton
      disabled={props.disabled}
      aria-label="Hinzufügen"
      onClick={() => {
        if (!props.setFieldValue) return;

        const items = Array.isArray(props.items) ? props.items : [];
        const nextItem = cloneFieldItem(props.defaultItem);
        nextItem.number = items.length + 1;

        props.setFieldValue(props.type, [...items, nextItem], true);
      }}
    >
      <AddIcon />
    </IconButton>
  );
}

export default AddContainsButton;
