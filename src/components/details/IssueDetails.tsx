import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import { issue } from "../../graphql/queriesTyped";
import QueryResult from "../generic/QueryResult";
import React from "react";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import { withContext } from "../generic";
import { generateIssueSubHeader } from "../../util/issues";
import Typography from "@mui/material/Typography";
import { generateLabel } from "../../util/hierarchy";
import { isMockMode } from "../../app/mockMode";
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
import { collectIssueArcs, getTodayLocalDate } from "./issue-details/utils/issueDetailsUtils";

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

  if (props.appIsLoading || error || !data?.issueDetails || networkStatus < 7) {
    return (
      <Layout>
        <QueryResult
          error={error}
          data={data ? data.issueDetails : null}
          loading={networkStatus < 7}
          selected={selected}
          placeholder={<IssueDetailsPreview />}
          placeholderCount={1}
        />
      </Layout>
    );
  }

  const loadedIssue = data.issueDetails as unknown as Issue;
  const issueForVariants = toIssueWithMockVariants(loadedIssue);

  const arcs = collectIssueArcs(issueForVariants, us);
  const today = getTodayLocalDate();
  const releaseDate = issueForVariants.releasedate ? new Date(issueForVariants.releasedate) : null;

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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {loadedIssue.verified ? (
                <Box
                  component="img"
                  src="/verified_badge.png"
                  alt="verifiziert"
                  sx={{ height: 35, width: "auto" }}
                />
              ) : null}
              {loadedIssue.collected && props.session ? (
                <Box
                  component="img"
                  src="/collected_badge.png"
                  alt="gesammelt"
                  sx={{ height: 35, width: "auto" }}
                />
              ) : null}
              <EditButton item={loadedIssue} />
            </Box>
          }
        />

        <CardContent sx={{ pt: 1 }}>
          <IssueVariants
            us={us}
            issue={issueForVariants as unknown as VariantIssue}
            session={props.session}
            navigate={props.navigate}
          />

          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 500px) 260px" },
              gap: 2,
              alignItems: "stretch",
              justifyContent: { xs: "stretch", md: "center" },
            }}
          >
            <Box sx={{ minWidth: 0, width: "100%", display: "flex", alignItems: "center" }}>
              <DetailsTable
                issue={issueForVariants}
                details={details}
                navigate={props.navigate}
                us={us}
              />
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}
            >
              <Box sx={{ width: 260, display: "flex", justifyContent: "center" }}>
                <IssueCover us={us} issue={issueForVariants as unknown as PreviewIssue} />
              </Box>
            </Box>
          </Box>

          {issueForVariants.addinfo && issueForVariants.addinfo !== "" ? (
            <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(issueForVariants.addinfo),
                }}
              />
            </Paper>
          ) : null}

          {arcs.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              <StoryArcChips arcs={arcs} us={us} navigate={props.navigate} />
            </Box>
          ) : null}

          {props.bottom
            ? React.cloneElement(props.bottom, {
                navigate: props.navigate,
                selected: issueForVariants,
                issue: issueForVariants,
                us: us,
              })
            : null}
        </CardContent>
      </React.Fragment>
    </Layout>
  );
}

function toIssueWithMockVariants(issue: Issue): Issue {
  if (!isMockMode) return issue;

  const cover = issue.cover?.url ? issue.cover : { url: "/nocover_simple.jpg" };
  const primaryVariant: Issue = {
    ...issue,
    cover,
    variants: null,
  };
  const secondaryVariant: Issue = {
    ...issue,
    variant: issue.variant && issue.variant !== "" ? `${issue.variant}-2` : "B",
    cover,
    variants: null,
  };

  return {
    ...issue,
    variants: [primaryVariant, secondaryVariant],
  };
}

export default withContext(IssueDetails);
