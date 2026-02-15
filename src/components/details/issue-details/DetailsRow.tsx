import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

interface DetailsRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

export function DetailsRow(props: Readonly<DetailsRowProps>) {
  return (
    <TableRow>
      <TableCell align="left">{props.label}</TableCell>
      <TableCell align="left">{props.value}</TableCell>
    </TableRow>
  );
}
