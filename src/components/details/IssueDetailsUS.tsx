import React from "react";
import { withContext } from "../generic";
import IssueDetails from "./IssueDetails";
import { IssueDetailsUSBottom } from "./issue-details/us/IssueDetailsUSBottom";
import { IssueDetailsUSDetails } from "./issue-details/us/IssueDetailsUSDetails";

type IssueDetailsUSProps = Record<string, unknown>;

function IssueDetailsUS(props: IssueDetailsUSProps) {
  return (
    <IssueDetails
      {...props}
      bottom={<IssueDetailsUSBottom {...props} />}
      details={<IssueDetailsUSDetails />}
      subheader
    />
  );
}

export default withContext(IssueDetailsUS);
