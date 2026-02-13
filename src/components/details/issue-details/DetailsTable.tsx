import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

export function DetailsTable(props) {
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
