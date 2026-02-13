import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Auftritte</Typography>

      <AppearanceList us={props.us} navigate={props.navigate} label="Hauptcharaktere" appRole="FEATURED" type="CHARACTER" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Antagonisten" appRole="ANTAGONIST" type="CHARACTER" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Unterstützende Charaktere" appRole="SUPPORTING" type="CHARACTER" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Andere Charaktere" appRole="OTHER" type="CHARACTER" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Teams" type="GROUP" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Rassen" type="RACE" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Tiere" type="ANIMAL" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Gegenstände" type="ITEM" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Fahrzeuge" type="VEHICLE" item={props.item} hideIfEmpty={true} />
      <AppearanceList us={props.us} navigate={props.navigate} label="Orte" type="LOCATION" item={props.item} hideIfEmpty={true} />
    </Box>
  );
}
