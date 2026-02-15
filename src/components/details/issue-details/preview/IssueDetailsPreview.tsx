import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { IssueDetailsStoryPreview } from "./IssueDetailsStoryPreview";

export function IssueDetailsPreview() {
  return (
    <React.Fragment>
      <CardHeader
        title={
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" width="48%" height={34} />
            <Skeleton variant="text" width="28%" height={24} />
          </Box>
        }
      />

      <CardContent>
        <div className={"details"}>
          <Paper className="detailsPaper detailsPaperPreview">
            <Table className="table">
              <TableBody>
                <TableRow>
                  <TableCell align="left">
                    <Skeleton variant="text" width="76%" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    <Skeleton variant="text" width="58%" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    <Skeleton variant="text" width="74%" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    <Skeleton variant="text" width="42%" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

          <div className="media">
            <Skeleton variant="rectangular" width={220} height={220} />
          </div>
        </div>

        <Box sx={{ mt: 4 }} className="stories">
          <CardHeader title={<Skeleton variant="text" width={120} height={30} />} />

          <IssueDetailsStoryPreview idx={0} />
          <IssueDetailsStoryPreview idx={1} />
          <IssueDetailsStoryPreview idx={2} />
          <IssueDetailsStoryPreview idx={3} />
        </Box>
      </CardContent>
    </React.Fragment>
  );
}
