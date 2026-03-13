import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { StoryArcChips } from "../StoryArcChips";
import { StoryPeopleSection } from "../sections/StoryPeopleSection";
import { StoryAppearanceSection } from "../sections/StoryAppearanceSection";

interface IssueDetailsDEStoryDetailsProps {
  item?: {
    parent?: {
      issue?: {
        arcs?: Array<{ title?: string | null; type?: string | null } | null>;
      };
    };
  };
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  [key: string]: any;
}

export function IssueDetailsDEStoryDetails(props: Readonly<IssueDetailsDEStoryDetailsProps>) {
  const storyArcs = Array.isArray(props.item?.parent?.issue?.arcs)
    ? props.item.parent.issue.arcs.filter(
        (arc): arc is { title?: string | null; type?: string | null } =>
          Boolean(arc && typeof arc === "object")
      )
    : [];
  const item = (props.item || {}) as Record<string, unknown>;
  const hasStoryArcs = storyArcs.length > 0;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: hasStoryArcs ? "minmax(0, 1.05fr) minmax(0, 0.95fr)" : "1fr",
        },
        columnGap: 3,
        rowGap: 3,
      }}
    >
      <Box>
        {storyArcs.length > 0 ? (
          <Box sx={{ display: "grid", rowGap: 1.25 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                <Typography
                  sx={{
                    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: "0.78rem",
                    lineHeight: 1.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "text.secondary",
                  }}
                >
                  Teil von
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  columnGap: 1,
                  rowGap: 1,
                }}
              >
                <StoryArcChips arcs={storyArcs} us={props.us} navigate={props.navigate} inline />
              </Box>
            </Box>
          </Box>
        ) : null}
      </Box>

      <Box
        sx={(theme) => ({
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          backgroundColor:
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          gridColumn: { xs: "auto", md: hasStoryArcs ? "auto" : "1 / -1" },
        })}
      >
        <StoryPeopleSection item={item} us={props.us} navigate={props.navigate} />
        <StoryAppearanceSection item={item} us={props.us} navigate={props.navigate} />
      </Box>
    </Box>
  );
}
