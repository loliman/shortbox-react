import React from "react";
import Typography from "@mui/material/Typography";
import { toChipList } from "../../IssueDetails";

export function IssueDetailsDECoverDetails(props) {
  const individuals = Array.isArray(props.item?.parent?.individuals)
    ? props.item.parent.individuals
    : [];
  const artists = individuals.filter((individual) => (individual.type || "").includes("ARTIST"));

  return (
    <div>
      <div className="individualListContainer">
        <Typography>
          <b>Artist</b>
        </Typography>
        {toChipList(artists, props, "ARTIST")}
      </div>
    </div>
  );
}
