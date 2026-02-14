import React from "react";
import Typography from "@mui/material/Typography";
import { IndividualList } from "../../IssueDetails";

type StoryPeopleSectionProps = {
  item: Record<string, unknown>;
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  includeTranslator?: boolean;
  translatorOptional?: boolean;
};

export function StoryPeopleSection(props: Readonly<StoryPeopleSectionProps>) {
  return (
    <React.Fragment>
      <Typography variant="h6">Mitwirkende</Typography>
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
    </React.Fragment>
  );
}
