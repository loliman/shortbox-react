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
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Paper sx={{ flex: "1 1 420px", minWidth: 0 }}>
            <Table size="small">
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

          <Box sx={{ width: 220, maxWidth: "100%", flex: "0 0 220px" }}>
            <Skeleton variant="rectangular" width={220} height={220} />
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
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
