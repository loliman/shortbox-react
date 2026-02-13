import React from "react";
import dateFormat from "dateformat";
import { DetailsRow, toChipList, toShortboxDate } from "../../IssueDetails";

export function IssueDetailsUSDetails(props) {
  return (
    <React.Fragment>
      <DetailsRow
        key="releasedate"
        label="Erscheinungsdatum"
        value={toShortboxDate(dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy"))}
      />
      <DetailsRow
        key="coverartists"
        label="Cover Artists"
        value={toChipList(
          props.issue && props.issue.cover
            ? props.issue.cover.individuals.filter((item) => item.type.includes("ARTIST"))
            : null,
          props,
          "ARTIST"
        )}
      />
      <DetailsRow
        key="editor"
        label="Editor"
        value={toChipList(
          props.issue.individuals.filter((item) => item.type.includes("EDITOR")),
          props,
          "EDITOR"
        )}
      />
    </React.Fragment>
  );
}
