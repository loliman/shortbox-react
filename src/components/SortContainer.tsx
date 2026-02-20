import { withContext } from "./generic";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { generateUrl } from "../util/hierarchy";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";
import Box from "@mui/material/Box";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { SelectedRoot } from "../types/domain";
import {
  buildSortNavigationQuery,
  getListingDirection,
  getListingOrder,
  type ListingQuery,
} from "../util/listingQuery";

const SORT_OPTIONS = ["updatedat", "createdat", "releasedate", "series", "publisher"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];
const SORT_LABEL_ID = "sort-container-label";
const SORT_SELECT_ID = "sort-container-select";

type SortContainerProps = {
  query?: ListingQuery;
  selected?: SelectedRoot;
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
};

function SortContainer(props: Readonly<SortContainerProps>) {
  const currentOrder = toValidSortOption(getListingOrder(props.query));
  const currentDirection = toDirection(getListingDirection(props.query));

  const target = props.selected || { us: Boolean(props.us) };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
      <FormControl size="small" sx={{ minWidth: 240 }}>
        <InputLabel id={SORT_LABEL_ID}>Sortieren nach</InputLabel>
        <Select
          id={SORT_SELECT_ID}
          labelId={SORT_LABEL_ID}
          value={currentOrder}
          label="Sortieren nach"
          onChange={(e) =>
            props.navigate?.(
              e,
              generateUrl(target, Boolean(props.us)),
              buildSortNavigationQuery(props.query, {
                order: toValidSortOption(String(e.target.value)),
              })
            )
          }
        >
          <MenuItem value={"updatedat"}>Änderungsdatum</MenuItem>
          <MenuItem value={"createdat"}>Erfassungsdatum</MenuItem>
          <MenuItem value={"releasedate"}>Erscheinungsdatum</MenuItem>
          <MenuItem value={"series"}>Serie</MenuItem>
          <MenuItem value={"publisher"}>Verlag</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        color="primary"
        exclusive
        value={currentDirection}
        aria-label="Sortierreihenfolge"
        onChange={(e, value: "ASC" | "DESC" | null) => {
          if (!value) return;
          props.navigate?.(
            e,
            generateUrl(target, Boolean(props.us)),
            buildSortNavigationQuery(props.query, {
              direction: value,
            })
          );
        }}
      >
        <ToggleButton value="ASC" aria-label="Aufsteigend">
          <ArrowUpwardIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="DESC" aria-label="Absteigend">
          <ArrowDownwardIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default withContext(SortContainer);

function toValidSortOption(value: string): SortOption {
  if ((SORT_OPTIONS as readonly string[]).includes(value)) {
    return value as SortOption;
  }
  return "updatedat";
}

function toDirection(value: string): "ASC" | "DESC" {
  return value === "ASC" ? "ASC" : "DESC";
}
