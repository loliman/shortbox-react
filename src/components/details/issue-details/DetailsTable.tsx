import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

interface DetailsTableProps {
  details: React.ReactElement;
  issue: unknown;
  [key: string]: unknown;
}

export function DetailsTable(props: Readonly<DetailsTableProps>) {
  return (
    <Paper className="detailsPaper">
      <Table className="table">
        <TableBody>
          {React.cloneElement(props.details, {
            ...props,
            issue: props.issue,
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
