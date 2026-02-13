import React from "react";
import dateFormat from "dateformat";
import { DetailsRow, toIsbn10, toIsbn13, toShortboxDate } from "../../IssueDetails";

export function IssueDetailsDEDetails(props) {
  return (
    <React.Fragment>
      <DetailsRow key="format" label="Format" value={props.issue.format} />
      {props.issue.limitation && props.issue.limitation > 0 ? (
        <DetailsRow
          key="limitation"
          label="Limitierung"
          value={props.issue.limitation + " Exemplare"}
        />
      ) : null}

      {props.issue.pages && props.issue.pages > 0 ? (
        <DetailsRow key="pages" label="Seiten" value={props.issue.pages} />
      ) : null}

      <DetailsRow
        key="releasedate"
        label="Erscheinungsdatum"
        value={toShortboxDate(dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy"))}
      />

      {props.issue.price && props.issue.price > 0 ? (
        <DetailsRow key="price" label="Preis" value={props.issue.price + " " + props.issue.currency} />
      ) : null}

      {props.issue.isbn && props.issue.isbn !== "" ? (
        <React.Fragment>
          <DetailsRow key="isbn10" label="ISBN-10" value={toIsbn10(props.issue.isbn)} />
          <DetailsRow key="isbn13" label="ISBN-13" value={toIsbn13(props.issue.isbn)} />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}
