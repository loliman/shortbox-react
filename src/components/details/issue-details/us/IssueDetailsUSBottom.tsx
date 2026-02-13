import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { generateLabel } from "../../../../util/hierarchy";
import { Contains, ContainsTitleDetailed, ContainsTitleSimple } from "../../IssueDetails";
import { generateMarvelDbUrl } from "../utils/externalLinks";
import { IssueDetailsUSStoryDetails } from "./IssueDetailsUSStoryDetails";

export function IssueDetailsUSBottom(props) {
  const stories = Array.isArray(props.issue?.stories) ? props.issue.stories : [];
  const covers = Array.isArray(props.issue?.covers) ? props.issue.covers : [];
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
        itemTitle={<ContainsTitleSimple {...props} />}
        itemDetails={<IssueDetailsUSStoryDetails issue={props.issue} session={props.session} />}
      />

      {coverChildren.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Contains
            {...props}
            header="Cover erschienen in"
            noEntriesHint="Das Cover ist noch keinen deutschen Ausgaben zugeordnet"
            items={coverChildren}
            itemTitle={<ContainsTitleDetailed {...props} />}
          />
        </Box>
      ) : null}

      <Box sx={{ mt: 3 }}>
        <Typography>
          Informationen über&nbsp;
          <a href={generateMarvelDbUrl(props.issue)} rel="noopener noreferrer nofollow" target="_blank">
            {generateLabel(props.issue.series) + " #" + props.issue.number}
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
