import React from "react";
import dateFormat from "dateformat";
import { DetailsRow, toChipList, toShortboxDate } from "../../IssueDetails";

interface IssueDetailsUSDetailsProps {
  issue?: {
    releasedate?: string;
    cover?: {
      individuals?: Array<{ type?: string } & Record<string, unknown>>;
    } | null;
    individuals?: Array<{ type?: string } & Record<string, unknown>>;
  };
  [key: string]: any;
}

export function IssueDetailsUSDetails(props: Readonly<IssueDetailsUSDetailsProps>) {
  const issue = props.issue || {};
  return (
    <React.Fragment>
      <DetailsRow
        key="releasedate"
        label="Erscheinungsdatum"
        value={toShortboxDate(dateFormat(new Date(issue.releasedate), "dd.mm.yyyy"))}
      />
      <DetailsRow
        key="coverartists"
        label="Cover Artists"
        value={toChipList(
          issue && issue.cover
            ? issue.cover.individuals.filter((item) => item.type.includes("ARTIST"))
            : null,
          props as any,
          "ARTIST"
        )}
      />
      <DetailsRow
        key="editor"
        label="Editor"
        value={toChipList(
          issue.individuals.filter((item) => item.type.includes("EDITOR")),
          props as any,
          "EDITOR"
        )}
      />
    </React.Fragment>
  );
}
