import { withContext } from "./generic";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Divider, Select } from "@mui/material";
import { generateUrl } from "../util/hierarchy";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import React from "react";
import Box from "@mui/material/Box";
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
  const currentDirection = getListingDirection(props.query);
  const isDescending = currentDirection === "DESC";

  const target = props.selected || { us: Boolean(props.us) };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id={SORT_LABEL_ID}>Sortieren</InputLabel>
          <Select
            id={SORT_SELECT_ID}
            labelId={SORT_LABEL_ID}
            value={currentOrder}
            label="Sortieren"
            sx={{
              "& .MuiSelect-select": { py: 0.625 },
              "& .Mui-focused": {
                borderRadius: "15px",
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
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

        <Divider orientation="vertical" flexItem />

        <IconButton
          aria-label="Reihenfolge"
          onClick={(e) =>
            props.navigate?.(
              e,
              generateUrl(target, Boolean(props.us)),
              buildSortNavigationQuery(props.query, {
                direction: isDescending ? "ASC" : "DESC",
              })
            )
          }
        >
          {isDescending ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Box>
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
