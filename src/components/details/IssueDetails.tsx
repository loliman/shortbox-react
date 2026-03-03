import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import { issue } from "../../graphql/queriesTyped";
import QueryResult from "../generic/QueryResult";
import React from "react";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import { generateIssueSubHeader } from "../../util/issues";
import Typography from "@mui/material/Typography";
import { generateLabel } from "../../util/hierarchy";
import { getIssueUrl } from "../../util/issuePresentation";
import { isMockMode } from "../../app/mockMode";
import EditButton from "../restricted/EditButton";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import TitleLine from "../generic/TitleLine";
import { IssueReferenceInline } from "../generic/IssueNumberInline";
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

function getIssueSelectionKey(
  issueLike?: {
    number?: string | null;
    format?: string | null;
    variant?: string | null;
    series?: {
      title?: string | null;
      volume?: number | null;
      publisher?: { name?: string | null };
    } | null;
  } | null
) {
  if (!issueLike) return "";
  return [
    String(issueLike.series?.publisher?.name || ""),
    String(issueLike.series?.title || ""),
    String(issueLike.series?.volume || ""),
    String(issueLike.number || ""),
    String(issueLike.format || ""),
    String(issueLike.variant || ""),
  ].join("|");
}

function getIssueVariantKey(
  issueLike?: { format?: string | null; variant?: string | null } | null
) {
  return [String(issueLike?.format || "").trim(), String(issueLike?.variant || "").trim()].join(
    "|"
  );
}

function getIssueIdentityKey(
  issueLike?: {
    number?: string | null;
    series?: {
      title?: string | null;
      volume?: number | null;
      publisher?: { name?: string | null };
    } | null;
  } | null
) {
  if (!issueLike) return "";
  return [
    String(issueLike.series?.publisher?.name || ""),
    String(issueLike.series?.title || ""),
    String(issueLike.series?.volume || ""),
    String(issueLike.number || ""),
  ].join("|");
}

function IssueDetails(props: IssueDetailsProps) {
  const selected = props.selected || { us: Boolean(props.us) };
  const us = Boolean(props.us);
  const details = props.details || <React.Fragment />;
  const [coverExpanded, setCoverExpanded] = React.useState(true);
  const issueVariables = React.useMemo(
    () =>
      selected.issue
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
        : undefined,
    [
      selected.issue?.number,
      selected.issue?.format,
      selected.issue?.variant,
      selected.issue?.series.title,
      selected.issue?.series.volume,
      selected.issue?.series.publisher.name,
    ]
  );
  const issueQueryOptions = React.useMemo(
    () => ({
      variables: issueVariables,
      skip: !issueVariables,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-first" as const,
      nextFetchPolicy: "cache-first" as const,
    }),
    [issueVariables]
  );
  const { networkStatus, error, data, previousData, loading } = useQuery(issue, issueQueryOptions);
  const requestedIssueKey = getIssueSelectionKey(selected.issue as unknown as any);
  const currentIssue = data?.issueDetails ?? null;
  const previousIssue = previousData?.issueDetails ?? null;
  const currentIssueKey = getIssueSelectionKey(currentIssue as unknown as any);
  const hasRequestedIssueData = currentIssueKey === requestedIssueKey;
  const resolvedIssue = (
    currentIssue && hasRequestedIssueData ? currentIssue : null
  ) as Issue | null;
  const fallbackIssue = (currentIssue || previousIssue || null) as Issue | null;
  const loadedIssue = (resolvedIssue || fallbackIssue) as Issue | null;
  const issueForVariants = loadedIssue ? toIssueWithMockVariants(loadedIssue) : null;
  const isIssueTransitioning =
    Boolean(issueVariables) && !hasRequestedIssueData && (loading || networkStatus < 7);
  const isIssueMissing = Boolean(issueVariables) && !loading && networkStatus >= 7 && !currentIssue;
  const requestedIssueIdentityKey = getIssueIdentityKey(selected.issue as unknown as any);
  const requestedVariantKey = getIssueVariantKey(selected.issue as unknown as any);
  const loadedIssueIdentityKey = getIssueIdentityKey(loadedIssue as unknown as any);
  const loadedVariantKey = getIssueVariantKey(loadedIssue as unknown as any);
  const isVariantTransition =
    Boolean(issueVariables) &&
    requestedIssueIdentityKey !== "" &&
    requestedIssueIdentityKey === loadedIssueIdentityKey &&
    requestedVariantKey !== loadedVariantKey &&
    !isIssueMissing;
  const coverGalleryIssues = React.useMemo(
    () => (issueForVariants ? buildCoverGalleryIssues(issueForVariants) : []),
    [issueForVariants]
  );

  if (isIssueTransitioning && !error && !isVariantTransition) {
    return (
      <Layout>
        <QueryResult
          data={undefined}
          loading={true}
          selected={selected}
          placeholder={<IssueDetailsPreview />}
          placeholderCount={1}
        />
      </Layout>
    );
  }

  if (error || isIssueMissing || !issueForVariants || !loadedIssue) {
    return (
      <Layout>
        <QueryResult
          error={error}
          data={isIssueMissing ? null : resolvedIssue}
          loading={loading || networkStatus < 7}
          selected={selected}
          placeholder={<IssueDetailsPreview />}
          placeholderCount={1}
        />
      </Layout>
    );
  }

  const hasVariantBox = (issueForVariants.variants || []).filter(Boolean).length > 1;

  const arcs = collectIssueArcs(issueForVariants, us);
  const today = getTodayLocalDate();
  const releaseDate = issueForVariants.releasedate ? new Date(issueForVariants.releasedate) : null;
  const gridTemplateColumns = { xs: "1fr", md: "minmax(0, 1fr) auto" };
  const coverWidth = {
    xs: "100%",
    md: "clamp(320px, 36vw, 480px)",
  };

  return (
    <Layout>
      <React.Fragment>
        {!us && !loadedIssue.verified && releaseDate && today < releaseDate ? (
          <SnackbarContent
            id="notVerifiedWarning"
            message="Diese Ausgabe ist noch nicht im Handel erhältlich und noch nicht vorab verifiziert worden.
                                        Die angezeigten Informationen weichen gegebenenfalls von den tatsächlichen Daten ab."
            sx={{
              width: { xs: "calc(100% - 16px)", sm: "100%" },
              mx: "auto",
              borderRadius: { xs: 1, sm: 0 },
            }}
          />
        ) : null}

        <CardHeader
          title={
            <TitleLine
              title={
                <IssueReferenceInline
                  seriesLabel={generateLabel({ series: loadedIssue.series } as any)}
                  number={loadedIssue.number}
                  legacy_number={loadedIssue.legacy_number}
                />
              }
              id={loadedIssue.id ?? undefined}
              session={props.session}
            />
          }
          subheader={props.subheader ? generateIssueSubHeader(loadedIssue) : ""}
          action={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EditButton item={loadedIssue} />
              {loadedIssue.collected && props.session ? (
                <Box
                  component="img"
                  src="/collected_badge.png"
                  alt="gesammelt"
                  sx={{ height: 26, width: "auto", ml: 0.25 }}
                />
              ) : null}
              {loadedIssue.verified ? (
                <Box
                  component="img"
                  src="/verified_badge.png"
                  alt="verifiziert"
                  sx={{ height: 26, width: "auto", ml: 0.25 }}
                />
              ) : null}
            </Box>
          }
        />

        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ pb: 5 }}>
            <IssueVariants
              us={us}
              issue={issueForVariants as unknown as VariantIssue}
              activeFormat={selected.issue?.format ?? undefined}
              activeVariant={selected.issue?.variant ?? undefined}
              session={props.session}
              navigate={props.navigate}
            />
          </Box>

          <Box>
            <Box
            sx={{
              display: "grid",
              gridTemplateColumns,
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
                flexWrap: "wrap",
                alignItems: "flex-start",
                columnGap: 2,
                rowGap: 1.5,
                order: { xs: 2, md: 1 },
              }}
            >
              <Box sx={{ minWidth: 0, flex: "1 1 300px", width: "100%" }}>
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
                    flex: "0 1 220px",
                    alignSelf: { xs: "flex-start", md: "flex-end" },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 500, mb: 0.75, whiteSpace: "nowrap" }}
                  >
                    Enthält Teile von
                  </Typography>
                  <StoryArcChips arcs={arcs} us={us} navigate={props.navigate} inline />
                </Box>
              ) : null}

              {props.bottom ? (
                <Box sx={{ minWidth: 0, width: "100%", mt: 0.5 }}>
                  {React.cloneElement(props.bottom, {
                    navigate: props.navigate,
                    selected: issueForVariants,
                    issue: issueForVariants,
                    us: us,
                  })}
                </Box>
              ) : null}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: { xs: "center", md: "flex-end" },
                minWidth: 0,
                justifySelf: { xs: "stretch", md: "end" },
                gridColumn: { md: "2 / 3" },
                gridRow: { md: "1" },
                order: { xs: 1, md: 3 },
              }}
            >
              <Box sx={{ display: { xs: "none", md: "block" } }}>
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
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}
                  >
                    <IssueCoverGallery
                      us={us}
                      issues={coverGalleryIssues}
                      activeFormat={selected.issue?.format ?? undefined}
                      activeVariant={selected.issue?.variant ?? undefined}
                      navigate={props.navigate}
                      session={props.session}
                    />
                  </Box>
                  {!us && issueForVariants.comicguideid ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        opacity: 0.82,
                        textAlign: "left",
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      Das Cover für&nbsp;
                      <a
                        href={generateComicGuideUrl(issueForVariants as any)}
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        <IssueReferenceInline
                          seriesLabel={generateLabel({ series: issueForVariants.series } as any)}
                          number={issueForVariants.number}
                          legacy_number={issueForVariants.legacy_number}
                        />
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
                      sx={{
                        mt: 1,
                        opacity: 0.82,
                        textAlign: "left",
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      Informationen über&nbsp;
                      <a
                        href={generateMarvelDbUrl(issueForVariants as any)}
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        <IssueReferenceInline
                          seriesLabel={generateLabel({ series: issueForVariants.series } as any)}
                          number={issueForVariants.number}
                          legacy_number={issueForVariants.legacy_number}
                        />
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
                      &nbsp;. Die Informationen wurden aufbereitet und unter Umständen
                      ergänzt.&nbsp;
                    </Typography>
                  ) : null}
                </Box>
              </Box>

              <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
                <Box sx={{ width: coverWidth, maxWidth: "100%", mx: "auto", position: "relative" }}>
                  <IconButton
                    size="small"
                    aria-label={coverExpanded ? "Cover einklappen" : "Cover ausklappen"}
                    onClick={(event) => {
                      event.stopPropagation();
                      setCoverExpanded((prev) => !prev);
                    }}
                    sx={{
                      position: "absolute",
                      top: 1,
                      right: 2,
                      zIndex: 2,
                      color: "common.white",
                      p: 0.25,
                      "&:hover": { bgcolor: "transparent" },
                      transform: coverExpanded ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 180ms ease",
                    }}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <Collapse
                    in={coverExpanded}
                    collapsedSize="25px"
                    sx={{
                      borderRadius: (theme) => `${Number(theme.shape.borderRadius) || 12}px`,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}
                      >
                        <IssueCoverGallery
                          us={us}
                          issues={coverGalleryIssues}
                          activeFormat={selected.issue?.format ?? undefined}
                          activeVariant={selected.issue?.variant ?? undefined}
                          session={props.session}
                          navigate={props.navigate}
                        />
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            </Box>
            </Box>

            {!us && issueForVariants.comicguideid ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 2,
                  opacity: 0.82,
                  textAlign: "left",
                  display: { xs: "block", md: "none" },
                }}
              >
                Das Cover für&nbsp;
                <a
                  href={generateComicGuideUrl(issueForVariants as any)}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  <IssueReferenceInline
                    seriesLabel={generateLabel({ series: issueForVariants.series } as any)}
                    number={issueForVariants.number}
                    legacy_number={issueForVariants.legacy_number}
                  />
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
                sx={{
                  mt: 2,
                  opacity: 0.82,
                  textAlign: "left",
                  display: { xs: "block", md: "none" },
                }}
              >
                Informationen über&nbsp;
                <a
                  href={generateMarvelDbUrl(issueForVariants as any)}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  <IssueReferenceInline
                    seriesLabel={generateLabel({ series: issueForVariants.series } as any)}
                    number={issueForVariants.number}
                    legacy_number={issueForVariants.legacy_number}
                  />
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

            {issueForVariants.addinfo && issueForVariants.addinfo !== "" ? (
              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(issueForVariants.addinfo),
                  }}
                />
              </Paper>
            ) : null}
          </Box>
        </CardContent>
      </React.Fragment>
    </Layout>
  );
}

function IssueCoverGallery(props: {
  us: boolean;
  issues: PreviewIssue[];
  activeFormat?: string;
  activeVariant?: string;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  session: unknown
}) {
  const maxIndex = Math.max(0, props.issues.length - 1);
  const activeIssueKey = getIssueVariantKey({
    format: props.activeFormat ?? null,
    variant: props.activeVariant ?? null,
  });
  const activeIndex = React.useMemo(() => {
    const idx = props.issues.findIndex((item) => getIssueVariantKey(item) === activeIssueKey);
    return idx >= 0 ? idx : 0;
  }, [activeIssueKey, props.issues]);
  const activeIssue = props.issues[activeIndex] || props.issues[0];
  const hasStories = Boolean(props.session) && ((activeIssue?.stories || []).filter(Boolean).length || 0) > 0;

  if (!activeIssue) return null;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <IssueCover us={props.us} issue={activeIssue} />

      {hasStories ? (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 3,
            color: "common.white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textShadow: "0 1px 2px rgba(0,0,0,0.7)",
          }}
          title="Eigene Stories"
          aria-label="Eigene Stories"
        >
          <BookmarkBorderIcon sx={{ fontSize: 24 }} />
        </Box>
      ) : null}

      {props.issues.length > 1 ? (
        <React.Fragment>
          {activeIndex > 0 ? (
            <IconButton
              aria-label="Vorheriges Cover"
              onClick={(event) => {
                event.stopPropagation();
                const prevIssue = props.issues[Math.max(0, activeIndex - 1)];
                if (!prevIssue) return;
                props.navigate?.(event, getIssueUrl(prevIssue, props.us));
              }}
              sx={coverGalleryArrowSx("left")}
            >
              <ChevronLeftIcon />
            </IconButton>
          ) : null}

          {activeIndex < maxIndex ? (
            <IconButton
              aria-label="Nächstes Cover"
              onClick={(event) => {
                event.stopPropagation();
                const nextIssue = props.issues[Math.min(maxIndex, activeIndex + 1)];
                if (!nextIssue) return;
                props.navigate?.(event, getIssueUrl(nextIssue, props.us));
              }}
              sx={coverGalleryArrowSx("right")}
            >
              <ChevronRightIcon />
            </IconButton>
          ) : null}
        </React.Fragment>
      ) : null}
    </Box>
  );
}

function coverGalleryArrowSx(side: "left" | "right") {
  return {
    position: "absolute",
    top: "50%",
    [side]: 8,
    transform: "translateY(-50%)",
    zIndex: 2,
    color: "common.white",
    bgcolor: "rgba(0,0,0,0.44)",
    border: "1px solid rgba(255,255,255,0.35)",
    width: 34,
    height: 34,
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.6)",
    },
  };
}

function buildCoverGalleryIssues(issue: Issue): PreviewIssue[] {
  const variants = (issue.variants || []).filter(Boolean) as Issue[];
  const candidates = variants.length > 0 ? variants : [issue];
  const seenIssueKeys = new Set<string>();
  const gallery: PreviewIssue[] = [];

  for (const candidate of candidates) {
    const dedupeKey = [String(candidate.format || ""), String(candidate.variant || "")].join("|");
    if (seenIssueKeys.has(dedupeKey)) continue;
    seenIssueKeys.add(dedupeKey);

    gallery.push({
      ...(issue as unknown as PreviewIssue),
      ...(candidate as unknown as PreviewIssue),
      cover: candidate.cover || issue.cover,
    });
  }

  return gallery.length > 0 ? gallery : [issue as unknown as PreviewIssue];
}

function toIssueWithMockVariants(issue: Issue): Issue {
  if (!isMockMode) return issue;

  const cover = issue.cover?.url ? issue.cover : { url: "/nocover_simple.png" };
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

export default IssueDetails;
