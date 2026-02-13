import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { generateLabel } from "../../../../util/hierarchy";
import { Contains, ContainsTitleDetailed } from "../../IssueDetails";
import { generateComicGuideUrl } from "../utils/externalLinks";
import { IssueDetailsDEStoryDetails } from "./IssueDetailsDEStoryDetails";
import { IssueDetailsDECoverDetails } from "./IssueDetailsDECoverDetails";

interface IssueDetailsDEBottomProps {
  issue?: {
    stories?: unknown[];
    covers?: unknown[];
    comicguideid?: string | number | null;
    series?: Record<string, unknown>;
    number?: string | number;
  };
  [key: string]: any;
}

export function IssueDetailsDEBottom(props: Readonly<IssueDetailsDEBottomProps>) {
  const issue = props.issue || {};
  const stories = Array.isArray(issue.stories) ? issue.stories : [];
  const covers = Array.isArray(issue.covers) ? issue.covers : [];

  return (
    <Box sx={{ mt: 3 }}>
      <Contains
        {...props}
        header=""
        noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet"
        items={stories}
        itemTitle={<ContainsTitleDetailed {...(props as any)} />}
        itemDetails={<IssueDetailsDEStoryDetails />}
      />

      {covers.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Contains
            {...props}
            header="Cover"
            noEntriesHint="Dieser Ausgabe sind noch keine Cover zugeordnet"
            items={covers}
            itemTitle={<ContainsTitleDetailed isCover={true} {...(props as any)} />}
            itemDetails={<IssueDetailsDECoverDetails />}
          />
        </Box>
      ) : null}

      {issue.comicguideid ? (
        <Box sx={{ mt: 3 }}>
          <Typography>
            Das Cover für&nbsp;
            <a href={generateComicGuideUrl(issue as any)} rel="noopener noreferrer nofollow" target="_blank">
              {generateLabel(issue.series as any) + " #" + issue.number}
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
