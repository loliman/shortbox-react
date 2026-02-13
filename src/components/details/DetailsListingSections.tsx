import React from "react";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import IssuePreview, { IssuePreviewPlaceholder } from "../issue-preview/IssuePreview";
import IssuePreviewSmall, { IssuePreviewPlaceholderSmall } from "../issue-preview/IssuePreviewSmall";
import SortContainer from "../SortContainer";
import LoadingDots from "../generic/LoadingDots";
import type { PreviewIssue } from "../issue-preview/utils/issuePreviewUtils";

type QueryState = { filter?: string | null } | null | undefined;
type FirstLastIssueSectionsProps = {
  query?: QueryState;
  us?: boolean;
  issueCount?: number | null;
  active?: boolean | null;
  firstIssue?: PreviewIssue | null;
  lastIssue?: PreviewIssue | null;
  previewProps?: Record<string, unknown>;
};

type IssueHistoryListProps = {
  issues?: PreviewIssue[] | null;
  query?: QueryState;
  loadingMore?: boolean;
  previewProps?: Record<string, unknown>;
};

export function FirstLastIssueSections(props: Readonly<FirstLastIssueSectionsProps>) {
  if (props.query?.filter) return null;

  const issueCount = props.issueCount || 0;
  const firstTitle =
    issueCount === 1
      ? props.active
        ? "Bisher einziges "
        : "Einziges "
      : "Erstes ";

  return (
    <React.Fragment>
      {props.firstIssue ? (
        <Box component="section" sx={{ mb: 3 }}>
          <CardHeader
            title={
              !props.us
                ? firstTitle + "veröffentlichtes Comic mit Marvel Material"
                : "Frühestes Comic mit auf deutsch veröffentlichtem Material"
            }
          />
          <IssuePreview {...props.previewProps} issue={props.firstIssue} />
        </Box>
      ) : null}

      {props.lastIssue && issueCount > 1 ? (
        <Box component="section" sx={{ mb: 3 }}>
          <CardHeader
            title={
              !props.us
                ? "Letztes veröffentlichtes Comic mit Marvel Material"
                : "Spätestes Comic mit auf deutsch veröffentlichtem Material"
            }
          />
          <IssuePreview {...props.previewProps} issue={props.lastIssue} />
        </Box>
      ) : null}
    </React.Fragment>
  );
}

export function IssueHistoryList(props: Readonly<IssueHistoryListProps>) {
  const issues = props.issues || [];

  return (
    <Box component="section">
      <SortContainer {...props.previewProps} />
      <Box sx={{ mt: 2 }}>
        {issues.map((issue, idx) => (
          <IssuePreviewSmall
            {...props.previewProps}
            isLast={idx === issues.length - 1}
            idx={idx}
            key={buildIssueKey(issue, idx)}
            issue={issue}
          />
        ))}
      </Box>
      {props.loadingMore ? <LoadingDots /> : null}
    </Box>
  );
}

export function IssueHistoryPlaceholder(props: Readonly<{ query?: QueryState }>) {
  return (
    <React.Fragment>
      {!props.query || !props.query.filter ? (
        <React.Fragment>
          <Box component="section" sx={{ mb: 3 }}>
            <CardHeader title={<Skeleton variant="text" width={220} height={30} />} />
            <IssuePreviewPlaceholder />
          </Box>
          <Box component="section" sx={{ mb: 3 }}>
            <CardHeader title={<Skeleton variant="text" width={280} height={30} />} />
            <IssuePreviewPlaceholder />
          </Box>
        </React.Fragment>
      ) : null}

      <Box component="section">
        <CardHeader title={<Skeleton variant="text" width={120} height={30} />} />
        <Box>
          <IssuePreviewPlaceholderSmall idx={0} />
          <IssuePreviewPlaceholderSmall />
          <IssuePreviewPlaceholderSmall />
          <IssuePreviewPlaceholderSmall />
          <IssuePreviewPlaceholderSmall isLast={true} />
        </Box>
      </Box>
    </React.Fragment>
  );
}

function buildIssueKey(issue: PreviewIssue, idx: number): string {
  if (issue.id) return String(issue.id);

  const publisher = issue.series?.publisher?.name || "";
  const series = issue.series?.title || "";
  const volume = issue.series?.volume || "";
  const number = issue.number || "";
  const format = issue.format || "";
  const variant = issue.variant || "";

  if (publisher && series && number) {
    return ["issue", publisher, series, volume, number, format, variant].join("|");
  }

  return "issue|" + idx;
}
