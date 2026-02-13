import { withContext } from "../generic";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Divider, Select } from "@mui/material";
import { generateUrl } from "../../util/hierarchy";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import React from "react";
import Box from "@mui/material/Box";

function SortContainer(props) {
  return (
    <Box>
      <InputLabel>Sortieren</InputLabel>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FormControl sx={{ minWidth: 220 }}>
          <Select
            value={props.query?.order ? props.query.order : "updatedAt"}
            label="Sortieren"
            sx={{
              "& .MuiSelect-select": { py: 0.625 },
              "& .Mui-focused": {
                borderRadius: "15px",
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
            onChange={(e) =>
              props.navigate(e, generateUrl(props.selected, props.us), {
                filter: props.query ? props.query.filter : null,
                order: e.target.value,
                direction: props.query ? props.query.direction : null,
              })
            }
          >
            <MenuItem value={"updatedAt"}>Änderungsdatum</MenuItem>
            <MenuItem value={"createdAt"}>Erfassungsdatum</MenuItem>
            <MenuItem value={"releasedate"}>Erscheinungsdatum</MenuItem>
            <MenuItem value={"series"}>Serie</MenuItem>
            <MenuItem value={"publisher"}>Verlag</MenuItem>
          </Select>
        </FormControl>

        <Divider orientation="vertical" flexItem />

        <IconButton
          aria-label="Reihenfolge"
          onMouseDown={(e) =>
            props.navigate(e, generateUrl(props.selected, props.us), {
              filter: props.query ? props.query.filter : null,
              order: props.query ? props.query.order : null,
              direction:
                props.query && props.query.direction && props.query.direction !== "DESC"
                  ? "DESC"
                  : "ASC",
            })
          }
        >
          {props.query && props.query.direction && props.query.direction !== "DESC" ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}

export default withContext(SortContainer);
