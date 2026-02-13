import React from "react";
import { withContext } from "../generic";
import IssueDetails from "./IssueDetails";
import { IssueDetailsDEBottom } from "./issue-details/de/IssueDetailsDEBottom";
import { IssueDetailsDEDetails } from "./issue-details/de/IssueDetailsDEDetails";

type IssueDetailsDEProps = Record<string, unknown>;

function IssueDetailsDE(props: IssueDetailsDEProps) {
  return <IssueDetails bottom={<IssueDetailsDEBottom {...props} />} details={<IssueDetailsDEDetails />} subheader />;
}

export default withContext(IssueDetailsDE);
