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
      <TableCell
        align="left"
        sx={{
          width: "38%",
          color: "text.secondary",
          fontWeight: 500,
          verticalAlign: "top",
        }}
      >
        {props.label}
      </TableCell>
      <TableCell align="left" sx={{ width: "62%" }}>
        {props.value}
      </TableCell>
    </TableRow>
  );
}
