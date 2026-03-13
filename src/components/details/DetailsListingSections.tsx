import React from "react";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import IssuePreview, { IssuePreviewPlaceholder } from "../issue-preview/IssuePreview";
import SortContainer from "../SortContainer";
import LoadingDots from "../generic/LoadingDots";
import type { PreviewIssue } from "../issue-preview/utils/issuePreviewUtils";

type QueryState = { filter?: string | null } | null | undefined;

type IssueHistoryListProps = {
  issues?: PreviewIssue[] | null;
  query?: QueryState;
  loadingMore?: boolean;
  previewProps?: Record<string, unknown>;
  showSort?: boolean;
};

export function IssueHistoryList(props: Readonly<IssueHistoryListProps>) {
  const issues = props.issues || [];
  const showSort = props.showSort ?? true;

  return (
    <Box component="section">
      {showSort ? <SortContainer {...props.previewProps} /> : null}
      <Stack spacing={1} sx={{ mt: 2 }}>
        {issues.map((issue, idx) => (
          <IssuePreview
            {...props.previewProps}
            key={buildIssueKey(issue, idx)}
            issue={issue}
          />
        ))}
      </Stack>
      {props.loadingMore ? <LoadingDots /> : null}
    </Box>
  );
}

export function IssueHistoryPlaceholder(_props: Readonly<{ query?: QueryState }>) {
  return (
    <Box component="section">
      <CardHeader title={<Skeleton variant="text" width={120} height={30} />} />
      <Stack spacing={1}>
        <IssuePreviewPlaceholder />
        <IssuePreviewPlaceholder />
        <IssuePreviewPlaceholder />
        <IssuePreviewPlaceholder />
        <IssuePreviewPlaceholder />
      </Stack>
    </Box>
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
