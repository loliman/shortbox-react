import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

export function DetailsRow(props) {
  return (
    <TableRow>
      <TableCell align="left">{props.label}</TableCell>
      <TableCell align="left">{props.value}</TableCell>
    </TableRow>
  );
}
