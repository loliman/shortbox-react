import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { toChipList } from "./toChipList";

type ChipNavigationProps = {
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
};

type ChipListItem = {
  type?: string;
  role?: string;
  [key: string]: unknown;
};

type ChipListProps = ChipNavigationProps & {
  label?: string;
  hideIfEmpty?: boolean;
  type?: string;
  appRole?: string;
  items?: unknown[] | null;
  individual?: boolean;
};

export function ChipList(props: Readonly<ChipListProps>) {
  const sourceItems = Array.isArray(props.items) ? props.items : [];
  const items = sourceItems
    .map((item) => (item || {}) as ChipListItem)
    .filter((item) => {
      if (props.individual) {
        return (item.type || "").includes(props.type || "");
      }
      return (item.role === props.appRole || !props.appRole) && item.type === props.type;
    });

  if (items.length === 0 && props.hideIfEmpty) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography>
        <b>{props.label}</b>
      </Typography>
      {toChipList(items, props, props.type || "")}
    </Box>
  );
}
