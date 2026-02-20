import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { cloneFieldItem } from "./defaults";
import type { ContainsProps, FieldItem } from "./types";

interface AddContainsButtonProps extends ContainsProps {
  type: "stories";
  defaultItem: FieldItem;
}

function AddContainsButton(props: AddContainsButtonProps) {
  return (
    <Button
      disabled={props.disabled}
      variant="outlined"
      size="small"
      startIcon={<AddIcon />}
      onClick={() => {
        if (!props.setFieldValue) return;

        const items = Array.isArray(props.items) ? props.items : [];
        const nextItem = cloneFieldItem(props.defaultItem);
        nextItem.number = items.length + 1;

        props.setFieldValue(props.type, [...items, nextItem], true);
      }}
    >
      Geschichte
    </Button>
  );
}

export default AddContainsButton;
