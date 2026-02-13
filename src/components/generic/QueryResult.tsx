import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import { generateLabel } from "../../util/hierarchy";
import CircularProgress from "@mui/material/CircularProgress";
import withContext from "./withContext";
import Box from "@mui/material/Box";

function QueryResult(props) {
  let { appIsLoading, loading, error, data, selected } = props;

  if (appIsLoading || loading) {
    if (props.placeholder && props.placeholderCount) {
      let placeholder = [];

      for (let i = 0; i < props.placeholderCount; i++)
        placeholder.push(
          React.cloneElement(props.placeholder, {
            key: i,
          })
        );

      return placeholder;
    } else
      return (
        <Box sx={{ p: "15px", display: "flex" }}>
          <CircularProgress />
          <Typography sx={{ pl: "10px", alignSelf: "center" }}>Lade...</Typography>
        </Box>
      );
  }

  if (error || (data && data.errors))
    return (
      <Box sx={{ p: "15px", display: "flex" }}>
        <ErrorIcon fontSize="large" />
        <Typography sx={{ pl: "10px", alignSelf: "center" }}>Fehler</Typography>
      </Box>
    );

  if (!data)
    return (
      <Box sx={{ p: "15px", display: "flex" }}>
        <SearchIcon fontSize="large" />
        <Typography sx={{ pl: "10px", alignSelf: "center" }}>
          {generateLabel(selected)} nicht gefunden
        </Typography>
      </Box>
    );

  return null;
}

export default withContext(QueryResult);
