import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AppearanceList } from "../../IssueDetails";

type StoryAppearanceSectionProps = {
  item: Record<string, unknown>;
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
};

export function StoryAppearanceSection(props: Readonly<StoryAppearanceSectionProps>) {
  const source = props.item as { parent?: { appearances?: unknown[] }; appearances?: unknown[] };
  const appearances = source.parent ? source.parent.appearances : source.appearances;
  if (!appearances || appearances.length === 0) return null;
  const [expanded, setExpanded] = React.useState(true);

  return (
    <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="h6">Auftritte</Typography>
        <IconButton
          size="small"
          aria-label={expanded ? "Auftritte einklappen" : "Auftritte ausklappen"}
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
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Hauptcharaktere"
          appRole="FEATURED"
          type="CHARACTER"
          item={props.item}
          hideIfEmpty={true}
        />
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Antagonisten"
          appRole="ANTAGONIST"
          type="CHARACTER"
          item={props.item}
          hideIfEmpty={true}
        />
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Teams"
          type="GROUP"
          item={props.item}
          hideIfEmpty={true}
        />
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Rassen"
          type="RACE"
          item={props.item}
          hideIfEmpty={true}
        />
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Tiere"
          type="ANIMAL"
          item={props.item}
          hideIfEmpty={true}
        />
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Gegenstände"
          type="ITEM"
          item={props.item}
          hideIfEmpty={true}
        />
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Fahrzeuge"
          type="VEHICLE"
          item={props.item}
          hideIfEmpty={true}
        />
        <AppearanceList
          us={props.us}
          navigate={props.navigate}
          label="Orte"
          type="LOCATION"
          item={props.item}
          hideIfEmpty={true}
        />
      </Collapse>
    </Box>
  );
}
