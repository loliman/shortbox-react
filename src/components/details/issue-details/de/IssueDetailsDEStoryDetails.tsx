import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { StoryArcChips } from "../StoryArcChips";
import { StoryPeopleSection } from "../sections/StoryPeopleSection";
import { StoryAppearanceSection } from "../sections/StoryAppearanceSection";

interface IssueDetailsDEStoryDetailsProps {
  item?: {
    parent?: {
      issue?: {
        arcs?: unknown[];
      };
    };
  };
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  [key: string]: any;
}

export function IssueDetailsDEStoryDetails(props: Readonly<IssueDetailsDEStoryDetailsProps>) {
  const storyArcs = Array.isArray(props.item?.parent?.issue?.arcs) ? props.item.parent.issue.arcs : [];

  return (
    <div>
      {storyArcs.length > 0 ? (
        <Box className="individualListContainer" sx={{ mb: 2 }}>
          <Typography>
            <b>Teil von</b>
          </Typography>
          <StoryArcChips arcs={storyArcs} us={props.us} navigate={props.navigate} />
        </Box>
      ) : null}

      <StoryPeopleSection item={props.item} us={props.us} navigate={props.navigate} />
      <StoryAppearanceSection item={props.item} us={props.us} navigate={props.navigate} />
    </div>
  );
}
