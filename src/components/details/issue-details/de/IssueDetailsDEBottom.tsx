import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { generateLabel } from "../../../../util/hierarchy";
import { Contains, ContainsTitleDetailed } from "../../IssueDetails";
import { generateComicGuideUrl } from "../utils/externalLinks";
import { IssueDetailsDEStoryDetails } from "./IssueDetailsDEStoryDetails";
import { IssueDetailsDECoverDetails } from "./IssueDetailsDECoverDetails";

export function IssueDetailsDEBottom(props) {
  const stories = Array.isArray(props.issue?.stories) ? props.issue.stories : [];
  const covers = Array.isArray(props.issue?.covers) ? props.issue.covers : [];

  return (
    <Box sx={{ mt: 3 }}>
      <Contains
        {...props}
        header=""
        noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet"
        items={stories}
        itemTitle={<ContainsTitleDetailed {...props} />}
        itemDetails={<IssueDetailsDEStoryDetails />}
      />

      {covers.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Contains
            {...props}
            header="Cover"
            noEntriesHint="Dieser Ausgabe sind noch keine Cover zugeordnet"
            items={covers}
            itemTitle={<ContainsTitleDetailed isCover={true} {...props} />}
            itemDetails={<IssueDetailsDECoverDetails />}
          />
        </Box>
      ) : null}

      {props.issue.comicguideid ? (
        <Box sx={{ mt: 3 }}>
          <Typography>
            Das Cover für&nbsp;
            <a href={generateComicGuideUrl(props.issue)} rel="noopener noreferrer nofollow" target="_blank">
              {generateLabel(props.issue.series) + " #" + props.issue.number}
            </a>
            &nbsp;wird bereitgestellt vom&nbsp;
            <a href="https://www.comicguide.de" rel="noopener noreferrer nofollow" target="_blank">
              deutschen ComicGuide
            </a>
            &nbsp;und darf nicht ohne Genehmigung weiterverbreitet werden.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
