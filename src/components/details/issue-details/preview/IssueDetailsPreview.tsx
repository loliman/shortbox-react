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
        <Box
          sx={{
            mt: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 500px) 260px" },
            gap: 2,
            alignItems: "stretch",
            justifyContent: { xs: "stretch", md: "center" },
          }}
        >
          <Box sx={{ minWidth: 0, display: "flex", alignItems: "center" }}>
            <Paper variant="outlined" sx={{ width: "100%" }}>
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
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Skeleton variant="rectangular" width={260} height={390} />
          </Box>
        </Box>

        <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="84%" />
        </Paper>

        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Skeleton variant="rounded" width={180} height={32} />
          <Skeleton variant="rounded" width={168} height={32} />
          <Skeleton variant="rounded" width={150} height={32} />
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
