import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { generateLabel } from "../../../../util/hierarchy";
import { Contains, ContainsTitleDetailed, ContainsTitleSimple } from "../../IssueDetails";
import { generateMarvelDbUrl } from "../utils/externalLinks";
import { IssueDetailsUSStoryDetails } from "./IssueDetailsUSStoryDetails";

interface IssueDetailsUSBottomProps {
  issue?: {
    stories?: unknown[];
    covers?: Array<{
      children?: Array<{ issue?: Record<string, unknown> | null } | null>;
    }>;
    series?: Record<string, unknown>;
    number?: string | number;
  };
  session?: unknown;
  [key: string]: any;
}

export function IssueDetailsUSBottom(props: Readonly<IssueDetailsUSBottomProps>) {
  const issue = props.issue || {};
  const stories = Array.isArray(issue.stories) ? issue.stories : [];
  const covers = Array.isArray(issue.covers) ? issue.covers : [];
  const coverChildren =
    covers.length > 0 && Array.isArray(covers[0]?.children)
      ? covers[0].children.map((item) => item?.issue).filter(Boolean)
      : [];

  return (
    <Box sx={{ mt: 3 }}>
      <Contains
        {...props}
        header=""
        noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet"
        items={stories}
        itemTitle={<ContainsTitleSimple {...(props as any)} />}
        itemDetails={<IssueDetailsUSStoryDetails issue={issue as any} session={props.session} />}
      />

      {coverChildren.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Contains
            {...props}
            header="Cover erschienen in"
            noEntriesHint="Das Cover ist noch keinen deutschen Ausgaben zugeordnet"
            items={coverChildren}
            itemTitle={<ContainsTitleDetailed {...(props as any)} />}
          />
        </Box>
      ) : null}

      <Box sx={{ mt: 3 }}>
        <Typography>
          Informationen über&nbsp;
          <a href={generateMarvelDbUrl(issue as any)} rel="noopener noreferrer nofollow" target="_blank">
            {generateLabel(issue.series as any) + " #" + issue.number}
          </a>
          &nbsp;werden bezogen aus der&nbsp;
          <a href="https://marvel.fandom.com" rel="noopener noreferrer nofollow" target="_blank">
            Marvel Database
          </a>
          &nbsp;und stehen unter der&nbsp;
          <a href="https://creativecommons.org/licenses/by/3.0/de/" rel="noopener noreferrer nofollow" target="_blank">
            Creative Commons License 3.0
          </a>
          &nbsp;. Die Informationen wurden aufbereitet und unter Umständen ergänzt.&nbsp;
        </Typography>
      </Box>
    </Box>
  );
}
