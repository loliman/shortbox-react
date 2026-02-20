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
import { generateComicGuideUrl, generateMarvelDbUrl } from "./issue-details/utils/externalLinks";

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
  const { networkStatus, error, data, previousData, loading } = useQuery(issue, {
    variables: issueVariables,
    skip: !issueVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const resolvedIssue = data?.issueDetails ?? (loading ? previousData?.issueDetails : null);

  if (error || !resolvedIssue) {
    return (
      <Layout>
        <QueryResult
          error={error}
          data={resolvedIssue}
          loading={loading || networkStatus < 7}
          selected={selected}
          placeholder={<IssueDetailsPreview />}
          placeholderCount={1}
        />
      </Layout>
    );
  }

  const loadedIssue = resolvedIssue as unknown as Issue;
  const issueForVariants = toIssueWithMockVariants(loadedIssue);
  const hasVariantBox = (issueForVariants.variants || []).filter(Boolean).length > 1;

  const arcs = collectIssueArcs(issueForVariants, us);
  const today = getTodayLocalDate();
  const releaseDate = issueForVariants.releasedate ? new Date(issueForVariants.releasedate) : null;
  const gridTemplateColumns = arcs.length
    ? { xs: "1fr", md: "minmax(0, 1.1fr) minmax(180px, 20vw) auto" }
    : { xs: "1fr", md: "minmax(0, 1fr) auto" };
  const coverGridColumn = arcs.length ? "3 / 4" : "2 / 3";
  const bottomGridColumn = arcs.length ? "1 / 3" : "1 / 2";
  const coverWidth = {
    xs: "100%",
    md: "46.03vw",
    lg: "clamp(262px, 27.64vw, 478px)",
  };

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
                  sx={{ height: 35, width: "auto", ml: 0.75 }}
                />
              ) : null}
              {loadedIssue.collected && props.session ? (
                <Box
                  component="img"
                  src="/collected_badge.png"
                  alt="gesammelt"
                  sx={{ height: 35, width: "auto", ml: 0.75 }}
                />
              ) : null}
              <EditButton item={loadedIssue} />
            </Box>
          }
        />

        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ pb: hasVariantBox ? 5 : 0 }}>
            <IssueVariants
              us={us}
              issue={issueForVariants as unknown as VariantIssue}
              session={props.session}
              navigate={props.navigate}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns,
              gridTemplateRows: { xs: "auto", md: props.bottom ? "auto 1fr" : "auto" },
              gap: 2,
              alignItems: "start",
              width: "100%",
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                order: { xs: 2, md: 1 },
              }}
            >
              <DetailsTable
                issue={issueForVariants}
                details={details}
                navigate={props.navigate}
                us={us}
              />
            </Box>

            {arcs.length > 0 ? (
              <Box
                sx={{
                  minWidth: 0,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  gap: 1,
                  alignSelf: { md: "end" },
                  justifySelf: "start",
                  pb: { md: 0.5 },
                  order: { xs: 3, md: 2 },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                  Enthält Teile von
                </Typography>
                <StoryArcChips arcs={arcs} us={us} navigate={props.navigate} inline />
              </Box>
            ) : null}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: { xs: "center", md: "flex-end" },
                minWidth: 0,
                justifySelf: { xs: "stretch", md: "end" },
                gridColumn: { md: coverGridColumn },
                gridRow: { md: props.bottom ? "1 / span 2" : "1" },
                order: { xs: 1, md: 3 },
              }}
            >
              <Box
                sx={{
                  width: coverWidth,
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
                  <IssueCover us={us} issue={issueForVariants as unknown as PreviewIssue} />
                </Box>
                {!us && issueForVariants.comicguideid ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, opacity: 0.82, textAlign: "left", display: { xs: "none", md: "block" } }}
                  >
                    Das Cover für&nbsp;
                    <a
                      href={generateComicGuideUrl(issueForVariants as any)}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                    >
                      {generateLabel(issueForVariants.series as any) +
                        " #" +
                        issueForVariants.number}
                    </a>
                    &nbsp;wird bereitgestellt vom&nbsp;
                    <a
                      href="https://www.comicguide.de"
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                    >
                      deutschen ComicGuide
                    </a>
                    &nbsp;und darf nicht ohne Genehmigung weiterverbreitet werden.
                  </Typography>
                ) : null}
                {us ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, opacity: 0.82, textAlign: "left", display: { xs: "none", md: "block" } }}
                  >
                    Informationen über&nbsp;
                    <a
                      href={generateMarvelDbUrl(issueForVariants as any)}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                    >
                      {generateLabel(issueForVariants.series as any) +
                        " #" +
                        issueForVariants.number}
                    </a>
                    &nbsp;werden bezogen aus der&nbsp;
                    <a
                      href="https://marvel.fandom.com"
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                    >
                      Marvel Database
                    </a>
                    &nbsp;und stehen unter der&nbsp;
                    <a
                      href="https://creativecommons.org/licenses/by/3.0/de/"
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                    >
                      Creative Commons License 3.0
                    </a>
                    &nbsp;. Die Informationen wurden aufbereitet und unter Umständen ergänzt.&nbsp;
                  </Typography>
                ) : null}
              </Box>
            </Box>

            {props.bottom ? (
              <Box
                sx={{
                  minWidth: 0,
                  gridColumn: { md: bottomGridColumn },
                  gridRow: { md: 2 },
                  order: { xs: 4, md: 4 },
                }}
              >
                {React.cloneElement(props.bottom, {
                  navigate: props.navigate,
                  selected: issueForVariants,
                  issue: issueForVariants,
                  us: us,
                })}
              </Box>
            ) : null}

          </Box>

          {!us && issueForVariants.comicguideid ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, opacity: 0.82, textAlign: "left", display: { xs: "block", md: "none" } }}
            >
              Das Cover für&nbsp;
              <a
                href={generateComicGuideUrl(issueForVariants as any)}
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {generateLabel(issueForVariants.series as any) + " #" + issueForVariants.number}
              </a>
              &nbsp;wird bereitgestellt vom&nbsp;
              <a href="https://www.comicguide.de" rel="noopener noreferrer nofollow" target="_blank">
                deutschen ComicGuide
              </a>
              &nbsp;und darf nicht ohne Genehmigung weiterverbreitet werden.
            </Typography>
          ) : null}
          {us ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, opacity: 0.82, textAlign: "left", display: { xs: "block", md: "none" } }}
            >
              Informationen über&nbsp;
              <a
                href={generateMarvelDbUrl(issueForVariants as any)}
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {generateLabel(issueForVariants.series as any) + " #" + issueForVariants.number}
              </a>
              &nbsp;werden bezogen aus der&nbsp;
              <a href="https://marvel.fandom.com" rel="noopener noreferrer nofollow" target="_blank">
                Marvel Database
              </a>
              &nbsp;und stehen unter der&nbsp;
              <a
                href="https://creativecommons.org/licenses/by/3.0/de/"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Creative Commons License 3.0
              </a>
              &nbsp;. Die Informationen wurden aufbereitet und unter Umständen ergänzt.&nbsp;
            </Typography>
          ) : null}

          {issueForVariants.addinfo && issueForVariants.addinfo !== "" ? (
            <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(issueForVariants.addinfo),
                }}
              />
            </Paper>
          ) : null}
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
