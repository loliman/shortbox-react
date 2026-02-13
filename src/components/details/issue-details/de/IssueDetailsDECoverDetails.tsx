import React from "react";
import Typography from "@mui/material/Typography";
import { toChipList } from "../../IssueDetails";

interface IssueDetailsDECoverDetailsProps {
  item?: {
    parent?: {
      individuals?: Array<{ type?: string } & Record<string, unknown>>;
    };
  };
  [key: string]: any;
}

export function IssueDetailsDECoverDetails(props: Readonly<IssueDetailsDECoverDetailsProps>) {
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
        {toChipList(artists, props as any, "ARTIST")}
      </div>
    </div>
  );
}
