import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IndividualList } from "../../IssueDetails";

type StoryPeopleSectionProps = {
  item: Record<string, unknown>;
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  includeTranslator?: boolean;
  translatorOptional?: boolean;
};

export function StoryPeopleSection(props: Readonly<StoryPeopleSectionProps>) {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="h6">Mitwirkende</Typography>
        <IconButton
          size="small"
          aria-label={expanded ? "Mitwirkende einklappen" : "Mitwirkende ausklappen"}
          onClick={() => setExpanded((prev) => !prev)}
          sx={{
            ml: 1,
            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 180ms ease",
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <IndividualList
          us={props.us}
          navigate={props.navigate}
          label="Autor"
          type="WRITER"
          item={props.item}
        />
        <IndividualList
          us={props.us}
          navigate={props.navigate}
          label="Zeichner"
          type="PENCILER"
          item={props.item}
        />
        <IndividualList
          us={props.us}
          navigate={props.navigate}
          label="Inker"
          type="INKER"
          item={props.item}
        />
        <IndividualList
          us={props.us}
          navigate={props.navigate}
          label="Kolorist"
          type="COLORIST"
          item={props.item}
        />
        <IndividualList
          us={props.us}
          navigate={props.navigate}
          label="Letterer"
          type="LETTERER"
          item={props.item}
        />
        {props.includeTranslator === false ? null : (
          <IndividualList
            us={props.us}
            navigate={props.navigate}
            label="Übersetzer"
            type="TRANSLATOR"
            item={props.item}
            hideIfEmpty={Boolean(props.translatorOptional)}
          />
        )}
        <IndividualList
          us={props.us}
          navigate={props.navigate}
          label="Verleger"
          type="EDITOR"
          item={props.item}
        />
      </Collapse>
    </Box>
  );
}
