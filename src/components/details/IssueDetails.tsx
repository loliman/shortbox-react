import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import { issue } from "../../graphql/queriesTyped";
import QueryResult from "../generic/QueryResult";
import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import { withContext } from "../generic";
import { generateIssueSubHeader } from "../../util/issues";
import Typography from "@mui/material/Typography";
import { generateLabel } from "../../util/hierarchy";
import EditButton from "../restricted/EditButton";
import SnackbarContent from "@mui/material/SnackbarContent";
import TitleLine from "../generic/TitleLine";
import type { Issue, SelectedRoot } from "../../types/domain";
import { sanitizeHtml } from "../../util/sanitizeHtml";
import { StoryArcChips } from "./issue-details/StoryArcChips";
import { IssueCover } from "./issue-details/IssueCover";
import { IssueVariants } from "./issue-details/variants/IssueVariants";
import type { VariantIssue } from "./issue-details/variants/types";
import { IssueDetailsPreview } from "./issue-details/preview/IssueDetailsPreview";
import { DetailsTable } from "./issue-details/DetailsTable";
import type { PreviewIssue } from "../issue-preview/utils/issuePreviewUtils";
import {
  collectIssueArcs,
  getTodayLocalDate,
} from "./issue-details/utils/issueDetailsUtils";

export {
  AppearanceList,
  Contains,
  ContainsTitleDetailed,
  ContainsTitleSimple,
  IndividualList,
  toChipList,
} from "./issue-details/contains";
export { toIsbn10, toIsbn13, toShortboxDate } from "./issue-details/utils/issueMetaFormatters";
export { DetailsRow } from "./issue-details/DetailsRow";

interface IssueDetailsProps {
  selected?: SelectedRoot;
  us?: boolean;
  appIsLoading?: boolean;
  session?: unknown;
  subheader?: boolean;
  details?: React.ReactElement;
  bottom?: React.ReactElement;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  [key: string]: unknown;
}

function IssueDetails(props: IssueDetailsProps) {
  const selected = props.selected || { us: Boolean(props.us) };
  const us = Boolean(props.us);
  const details = props.details || <React.Fragment />;
  const issueVariables = selected.issue
    ? {
        issue: {
          number: selected.issue.number,
          format: selected.issue.format,
          variant: selected.issue.variant,
          series: {
            title: selected.issue.series.title,
            volume: selected.issue.series.volume,
            publisher: { name: selected.issue.series.publisher.name },
          },
        },
      }
    : undefined;
  const { networkStatus, error, data } = useQuery(issue, {
    variables: issueVariables,
    skip: !issueVariables,
    notifyOnNetworkStatusChange: true,
  });

  if (props.appIsLoading || error || !data?.issue || networkStatus < 7) {
    return (
      <Layout>
        <QueryResult
          error={error}
          data={data ? data.issue : null}
          loading={networkStatus < 7}
          selected={selected}
          placeholder={<IssueDetailsPreview />}
          placeholderCount={1}
        />
      </Layout>
    );
  }

  const loadedIssue = data.issue as unknown as Issue;

  const arcs = collectIssueArcs(loadedIssue, us);
  const today = getTodayLocalDate();
  const releaseDate = loadedIssue.releasedate ? new Date(loadedIssue.releasedate) : null;

  return (
    <Layout>
      <React.Fragment>
        {!us && !loadedIssue.verified && releaseDate && today < releaseDate ? (
          <SnackbarContent
            id="notVerifiedWarning"
            message="Diese Ausgabe ist noch nicht im Handel erhältlich und noch nicht vorab verifiziert worden.
                                        Die angezeigten Informationen weichen gegebenenfalls von den tatsächlichen Daten ab."
          />
        ) : null}

        <CardHeader
          title={
            <TitleLine
              title={generateLabel(loadedIssue)}
              id={loadedIssue.id ?? undefined}
              session={props.session}
            />
          }
          subheader={props.subheader ? generateIssueSubHeader(loadedIssue) : ""}
          action={
            <div>
              {loadedIssue.verified ? (
                <img className="verifiedBadge" src="/verified_badge.png" alt="verifiziert" height="35" />
              ) : null}
              {loadedIssue.collected && props.session ? (
                <img className="verifiedBadge" src="/collected_badge.png" alt="gesammelt" height="35" />
              ) : null}
              <EditButton item={loadedIssue} />
            </div>
          }
        />

        <CardContent className="cardContent">
          <IssueVariants
            us={us}
            issue={loadedIssue as unknown as VariantIssue}
            session={props.session}
            navigate={props.navigate}
          />

          <div
            className={"detailsWrapper"}
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div className="details" style={{ flex: "1 1 420px", minWidth: 0 }}>
              <DetailsTable issue={loadedIssue} details={details} navigate={props.navigate} us={us} />
            </div>
            <div style={{ width: "220px", maxWidth: "100%", flex: "0 0 220px" }}>
              <IssueCover us={us} issue={loadedIssue as unknown as PreviewIssue} />
            </div>

            {loadedIssue.addinfo && loadedIssue.addinfo !== "" ? (
                <Paper className="addinfo">
                  <Typography
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(loadedIssue.addinfo),
                      }}
                  />
                </Paper>
            ) : null}
          </div>
          <StoryArcChips arcs={arcs} us={us} navigate={props.navigate} />

          {props.bottom
            ? React.cloneElement(props.bottom, {
                navigate: props.navigate,
                selected: loadedIssue,
                issue: loadedIssue,
                us: us,
              })
            : null}
        </CardContent>
      </React.Fragment>
    </Layout>
  );
}

export default withContext(IssueDetails);
