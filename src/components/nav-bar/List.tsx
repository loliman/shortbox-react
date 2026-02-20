import React from "react";
import Drawer from "@mui/material/Drawer";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MuiList from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Skeleton from "@mui/material/Skeleton";
import { useQuery } from "@apollo/client";
import { issues, publishers, series } from "../../graphql/queriesTyped";
import type {
  IssuesQuery,
  IssuesQueryVariables,
  PublishersQuery,
  PublishersQueryVariables,
  SeriesQuery,
  SeriesQueryVariables,
} from "../../graphql/typed-documents.generated";
import { generateUrl } from "../../util/hierarchy";
import { withContext } from "../generic";
import { NoEntries, TypeListEntryPlaceholder } from "./ListPlaceholders";
import type { HierarchyLevelType } from "../../util/hierarchy";
import type { Issue, SelectedRoot, Series } from "../../types/domain";
import {
  drawerHeaderAdjustedHeight,
  drawerHeaderTopOffset,
  getNavDrawerWidth,
} from "../layoutMetrics";
import { parseFilter } from "./listUtils";
import { romanize } from "../../util/util";
import CoverTooltip from "./CoverTooltip";

const LIST_PAGE_SIZE = 250;

interface ListProps {
  drawerOpen?: boolean;
  toggleDrawer?: () => void;
  compactLayout?: boolean;
  isPhone?: boolean;
  isPhoneLandscape?: boolean;
  isPhonePortrait?: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
  query?: { filter?: string | null } | null;
  level: HierarchyLevelType;
  selected: SelectedRoot;
  appIsLoading?: boolean;
  session?: unknown;
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  [key: string]: unknown;
}

type PublisherNode = NonNullable<
  NonNullable<NonNullable<NonNullable<PublishersQuery["publisherList"]>["edges"]>[number]>["node"]
>;

type SeriesNode = NonNullable<
  NonNullable<NonNullable<NonNullable<SeriesQuery["seriesList"]>["edges"]>[number]>["node"]
>;

type IssueNode = NonNullable<
  NonNullable<NonNullable<NonNullable<IssuesQuery["issueList"]>["edges"]>[number]>["node"]
>;

let lastPublisherNodesCache: PublisherNode[] = [];
let expandedPublishersCache: Record<string, Record<string, boolean>> = {};
let expandedSeriesCache: Record<string, Record<string, boolean>> = {};
let navScrollTopCache: Record<string, number> = {};

function List(props: Readonly<ListProps>) {
  const { drawerOpen, toggleDrawer } = props;
  const temporaryDrawer =
    props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const drawerWidth = getNavDrawerWidth(temporaryDrawer);
  const filterQuery = props.query?.filter ?? null;
  const filter = React.useMemo(
    () => parseFilter(filterQuery) as PublishersQueryVariables["filter"],
    [filterQuery]
  );
  const us = Boolean(props.us);
  const navStateKey = React.useMemo(() => `${us}|${filterQuery || ""}`, [us, filterQuery]);
  const phonePortrait = props.isPhonePortrait ?? Boolean(props.isPhone && !props.isPhoneLandscape);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const navScrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const storeScrollTop = React.useCallback(() => {
    const container = navScrollContainerRef.current;
    if (container) {
      navScrollTopCache[navStateKey] = container.scrollTop;
      return;
    }

    const listElement = listRef.current;
    if (listElement) {
      navScrollTopCache[navStateKey] = listElement.scrollTop;
    }
  }, [navStateKey]);
  const [expandedPublishers, setExpandedPublishers] = React.useState<Record<string, boolean>>(
    () => expandedPublishersCache[navStateKey] || {}
  );

  React.useEffect(() => {
    setExpandedPublishers(expandedPublishersCache[navStateKey] || {});
  }, [navStateKey]);

  React.useEffect(() => {
    expandedPublishersCache[navStateKey] = expandedPublishers;
  }, [expandedPublishers, navStateKey]);

  const {
    data: publisherData,
    error: publisherError,
    networkStatus: publisherNetworkStatus,
  } = useQuery<PublishersQuery, PublishersQueryVariables>(publishers, {
    variables: { us, filter, first: LIST_PAGE_SIZE },
    fetchPolicy: "cache-first",
  });

  const publisherNodes = React.useMemo(() => toPublisherNodes(publisherData), [publisherData]);
  if (publisherNodes.length > 0) {
    lastPublisherNodesCache = publisherNodes;
  }
  const visiblePublisherNodes =
    publisherNodes.length > 0 ? publisherNodes : lastPublisherNodesCache;

  React.useLayoutEffect(() => {
    const container = navScrollContainerRef.current;
    const targetScrollTop = navScrollTopCache[navStateKey] || 0;
    if (container) container.scrollTop = targetScrollTop;

    const listElement = listRef.current;
    if (listElement) listElement.scrollTop = targetScrollTop;
  }, [navStateKey, visiblePublisherNodes.length]);

  React.useEffect(() => {
    return () => {
      storeScrollTop();
    };
  }, [storeScrollTop]);

  const selectedPublisherName = getSelectedPublisherName(props.selected);
  const selectedSeriesKey = getSelectedSeriesKey(props.selected);
  const selectedIssueMatchKey = getIssueMatchKey(props.selected?.issue);
  // Keep nav loading isolated from content-area loading to avoid full-nav skeleton flashes
  // when switching detail routes from the list.
  const isInitialLoading = publisherNetworkStatus === 1 && visiblePublisherNodes.length === 0;

  React.useEffect(() => {
    if (!selectedPublisherName) return;

    setExpandedPublishers((prev) =>
      prev[selectedPublisherName] ? prev : { ...prev, [selectedPublisherName]: true }
    );
  }, [selectedPublisherName]);

  const navigateTo = React.useCallback(
    (event: unknown, item: SelectedRoot, closeOnPhone = false) => {
      storeScrollTop();
      if (closeOnPhone && phonePortrait) toggleDrawer?.();

      props.navigate?.(event, generateUrl(item, us), {
        expand: null,
        filter: filterQuery,
      });
    },
    [storeScrollTop, phonePortrait, toggleDrawer, props.navigate, filterQuery, us]
  );
  const handleTogglePublisher = React.useCallback((publisherName: string) => {
    setExpandedPublishers((prev) => ({ ...prev, [publisherName]: !prev[publisherName] }));
  }, []);
  const handlePublisherClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, publisherName: string) => {
      navigateTo(event, {
        publisher: {
          name: publisherName,
          us,
        },
      });
    },
    [navigateTo, us]
  );

  let content: React.ReactNode;

  if (isInitialLoading) {
    content = Array.from({ length: 25 }).map((_, idx) => <TypeListEntryPlaceholder key={idx} />);
  } else if (publisherError) {
    content = <NestedErrorRow depth={0} message="Fehler beim Laden der Navigation" />;
  } else if (visiblePublisherNodes.length === 0) {
    content = <NoEntries />;
  } else {
    content = visiblePublisherNodes.map((publisherNode) => {
      const publisherName = publisherNode.name || "";
      const expanded = Boolean(expandedPublishers[publisherName]);
      const selected = Boolean(selectedPublisherName && selectedPublisherName === publisherName);

      return (
        <Box key={publisherName || "publisher-empty"}>
          <Divider
            sx={{
              mx: "5%",
              width: "90%",
              borderColor: (theme) => theme.palette.grey[300],
              borderBottomWidth: 1,
              opacity: 0.95,
            }}
          />

          <NestedRow
            rowKey={publisherName}
            depth={0}
            selected={selected}
            label={publisherName}
            expanded={expanded}
            onToggle={handleTogglePublisher}
            onClick={handlePublisherClick}
          />

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <SeriesBranch
              us={us}
              filter={filter as SeriesQueryVariables["filter"]}
              publisher={publisherNode}
              navStateKey={navStateKey}
              activeSeriesKey={selected ? selectedSeriesKey : null}
              selectedIssueMatchKey={selected ? selectedIssueMatchKey : null}
              session={props.session}
              navigateTo={navigateTo}
              listRef={listRef}
            />
          </Collapse>
        </Box>
      );
    });
  }

  const paperSx = {
    width: drawerWidth,
    maxWidth: "100%",
    top: drawerHeaderTopOffset,
    height: drawerHeaderAdjustedHeight,
  };

  const handleNavScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    navScrollTopCache[navStateKey] = event.currentTarget.scrollTop;
  }, [navStateKey]);

  const drawerContent = (
    <MuiList ref={listRef} sx={{ width: "100%", p: 0 }}>
      {content}
    </MuiList>
  );

  if (temporaryDrawer) {
    return (
      <SwipeableDrawer
        disableDiscovery={true}
        variant="temporary"
        open={Boolean(drawerOpen)}
        onClose={() => toggleDrawer?.()}
        onOpen={() => toggleDrawer?.()}
        PaperProps={{
          sx: paperSx,
          ref: navScrollContainerRef,
          onScroll: handleNavScroll,
        }}
      >
        {drawerContent}
      </SwipeableDrawer>
    );
  }

  return (
    <Drawer
      variant="persistent"
      open={Boolean(drawerOpen)}
      PaperProps={{
        sx: paperSx,
        ref: navScrollContainerRef,
        onScroll: handleNavScroll,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

type SeriesBranchProps = {
  us: boolean;
  filter: SeriesQueryVariables["filter"];
  publisher: PublisherNode;
  navStateKey: string;
  activeSeriesKey: string | null;
  selectedIssueMatchKey: string | null;
  session?: unknown;
  navigateTo: (event: unknown, item: SelectedRoot, closeOnPhone?: boolean) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
};

const SeriesBranch = React.memo(function SeriesBranch(props: Readonly<SeriesBranchProps>) {
  const { publisher, us, filter } = props;
  const publisherName = publisher.name || "";
  const seriesStateKey = `${props.navStateKey}|${publisherName}`;
  const [expandedSeries, setExpandedSeries] = React.useState<Record<string, boolean>>(
    () => expandedSeriesCache[seriesStateKey] || {}
  );
  const publisherUs = publisher.us ?? us;

  React.useEffect(() => {
    setExpandedSeries(expandedSeriesCache[seriesStateKey] || {});
  }, [seriesStateKey]);

  React.useEffect(() => {
    expandedSeriesCache[seriesStateKey] = expandedSeries;
  }, [expandedSeries, seriesStateKey]);

  const {
    data: seriesData,
    error: seriesError,
    loading: seriesLoading,
  } = useQuery<SeriesQuery, SeriesQueryVariables>(series, {
    variables: {
      publisher: { name: publisherName, us: publisherUs },
      filter,
      first: LIST_PAGE_SIZE,
    },
    fetchPolicy: "cache-first",
  });

  const seriesNodes = React.useMemo(() => toSeriesNodes(seriesData), [seriesData]);
  const seriesSelectionByKey = React.useMemo(() => {
    const selection: Record<string, Series> = {};
    for (const seriesNode of seriesNodes) {
      selection[getSeriesKey(seriesNode)] = toSeriesSelected(seriesNode, us);
    }
    return selection;
  }, [seriesNodes, us]);

  React.useEffect(() => {
    if (!props.activeSeriesKey) return;
    const activeSeriesKey = props.activeSeriesKey;

    setExpandedSeries((prev) =>
      prev[activeSeriesKey] ? prev : { ...prev, [activeSeriesKey]: true }
    );
  }, [props.activeSeriesKey]);
  const handleToggleSeries = React.useCallback((seriesKey: string) => {
    setExpandedSeries((prev) => ({ ...prev, [seriesKey]: !prev[seriesKey] }));
  }, []);
  const handleSeriesClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, seriesKey: string) => {
      const selectedSeries = seriesSelectionByKey[seriesKey];
      if (!selectedSeries) return;
      props.navigateTo(
        event,
        {
          series: selectedSeries,
        },
        true
      );
    },
    [props.navigateTo, seriesSelectionByKey]
  );

  if (seriesLoading && seriesNodes.length === 0) return <NestedLoadingRow depth={1} />;
  if (seriesError) return <NestedErrorRow depth={1} />;
  if (seriesNodes.length === 0) return <NestedEmptyRow depth={1} />;

  return (
    <MuiList disablePadding>
      {seriesNodes.map((seriesNode) => {
        const seriesKey = getSeriesKey(seriesNode);
        const selected = Boolean(props.activeSeriesKey && props.activeSeriesKey === seriesKey);
        const expanded = Boolean(expandedSeries[seriesKey]);

        return (
          <Box key={seriesKey}>
            <NestedRow
              rowKey={seriesKey}
              depth={1}
              label={createSeriesLabel(seriesNode)}
              selected={selected}
              expanded={expanded}
              onToggle={handleToggleSeries}
              onClick={handleSeriesClick}
            />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <IssuesBranch
                us={us}
                filter={filter as IssuesQueryVariables["filter"]}
                series={seriesNode}
                selectedIssueMatchKey={selected ? props.selectedIssueMatchKey : null}
                session={props.session}
                navigateTo={props.navigateTo}
                listRef={props.listRef}
              />
            </Collapse>
          </Box>
        );
      })}
    </MuiList>
  );
});

type IssuesBranchProps = {
  us: boolean;
  filter: IssuesQueryVariables["filter"];
  series: SeriesNode;
  selectedIssueMatchKey: string | null;
  session?: unknown;
  navigateTo: (event: unknown, item: SelectedRoot, closeOnPhone?: boolean) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
};

const IssuesBranch = React.memo(function IssuesBranch(props: Readonly<IssuesBranchProps>) {
  const { series, us, filter } = props;
  const seriesInput = toSeriesInput(series, us);

  const {
    data: issuesData,
    error: issuesError,
    loading: issuesLoading,
  } = useQuery<IssuesQuery, IssuesQueryVariables>(issues, {
    variables: {
      series: seriesInput,
      filter,
      first: LIST_PAGE_SIZE,
    },
    fetchPolicy: "cache-first",
  });

  const issueNodes = React.useMemo(() => toIssueNodes(issuesData), [issuesData]);

  React.useEffect(() => {
    if (!props.selectedIssueMatchKey || !props.listRef.current) return;

    const activeIssueRow = props.listRef.current.querySelector(
      '[data-selected-issue="true"]'
    ) as HTMLElement | null;

    if (!activeIssueRow) return;

    activeIssueRow.scrollIntoView({
      block: "center",
      inline: "nearest",
    });
  }, [issueNodes, props.selectedIssueMatchKey, props.listRef]);

  if (issuesLoading && issueNodes.length === 0) return <NestedLoadingRow depth={2} />;
  if (issuesError) return <NestedErrorRow depth={2} />;
  if (issueNodes.length === 0) return <NestedEmptyRow depth={2} />;

  return (
    <MuiList disablePadding>
      {issueNodes.map((issueNode, idx) => {
        const selected = getIssueNodeMatchKey(issueNode) === props.selectedIssueMatchKey;
        const issueNumber = issueNode.number || "";
        const issueSeries = toIssueSeriesSelected(issueNode, series, us);
        const variantCount = getVariantCount(issueNode);
        const hasVariants = variantCount > 0;

        return (
          <Box
            key={[
              issueSeries.publisher.name,
              issueSeries.title,
              issueSeries.volume,
              issueNumber,
              issueNode.format || "",
              idx,
            ].join("|")}
            data-selected-issue={selected ? "true" : undefined}
          >
            <ListItemButton
              divider={false}
              selected={selected}
              sx={{
                pl: getDepthPadding(2) + 1.3,
                py: 0.3,
                "&.Mui-selected": { backgroundColor: "transparent" },
                "&.Mui-selected:hover": { backgroundColor: "action.hover" },
              }}
              onClick={(e) =>
                props.navigateTo(
                  e,
                  {
                    issue: {
                      number: issueNumber,
                      title: issueNode.title,
                      format: issueNode.format,
                      variant: issueNode.variant,
                      series: issueSeries,
                    },
                  },
                  true
                )
              }
            >
              <CoverTooltip issue={issueNode} us={us}>
                <Box sx={{ width: "100%", minWidth: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                        <Typography
                          component="span"
                          noWrap
                          sx={{
                            minWidth: 0,
                            flex: 1,
                            fontSize: "0.9rem",
                            fontWeight: selected ? 700 : 400,
                          }}
                        >
                          {createIssueLabel(issueNode, us)}
                        </Typography>
                        {hasVariants ? (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.disabled"
                            sx={{ flexShrink: 0, fontSize: "0.68rem" }}
                          >
                            {variantCount} {variantCount === 1 ? "Variante" : "Varianten"}
                          </Typography>
                        ) : null}
                      </Box>
                    }
                    secondary={createIssueSecondary(issueNode, Boolean(props.session))}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </Box>
              </CoverTooltip>
            </ListItemButton>
          </Box>
        );
      })}
    </MuiList>
  );
});

type NestedRowProps = {
  rowKey: string;
  depth: number;
  label: string;
  selected?: boolean;
  expanded: boolean;
  onToggle: (rowKey: string) => void;
  onClick: (event: React.MouseEvent<HTMLElement>, rowKey: string) => void;
};

const NestedRow = React.memo(function NestedRow(props: Readonly<NestedRowProps>) {
  const handleToggle = React.useCallback(() => {
    props.onToggle(props.rowKey);
  }, [props.onToggle, props.rowKey]);
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      props.onClick(event, props.rowKey);
    },
    [props.onClick, props.rowKey]
  );

  return (
    <ListItemButton
      divider={false}
      selected={props.selected ?? false}
      onClick={handleClick}
      sx={{
        pl: getDepthPadding(props.depth),
        "&.Mui-selected": { backgroundColor: "transparent" },
        "&.Mui-selected:hover": { backgroundColor: "action.hover" },
      }}
    >
      <ExpandToggle expanded={props.expanded} onToggle={handleToggle} />
      <ListItemText
        primary={props.label}
        primaryTypographyProps={{ noWrap: true, sx: { fontWeight: props.selected ? 700 : 400 } }}
      />
    </ListItemButton>
  );
});

type ExpandToggleProps = {
  expanded: boolean;
  onToggle: () => void;
};

const ExpandToggle = React.memo(function ExpandToggle(props: Readonly<ExpandToggleProps>) {
  const Icon = props.expanded ? ExpandMoreIcon : ChevronRightIcon;

  return (
    <ListItemIcon sx={{ minWidth: 32 }}>
      <IconButton
        size="small"
        aria-label={props.expanded ? "Einklappen" : "Ausklappen"}
        onClick={(e) => {
          e.stopPropagation();
          props.onToggle();
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </ListItemIcon>
  );
});

function NestedLoadingRow({ depth }: { depth: number }) {
  return (
    <ListItem sx={{ pl: getDepthPadding(depth) }}>
      <Box sx={{ width: "100%" }}>
        <Skeleton variant="text" width="72%" height={26} />
      </Box>
    </ListItem>
  );
}

function NestedErrorRow({
  depth,
  message = "Fehler beim Laden",
}: {
  depth: number;
  message?: string;
}) {
  return (
    <ListItem sx={{ pl: getDepthPadding(depth) }}>
      <ListItemIcon sx={{ minWidth: 32 }}>
        <ErrorOutlineIcon fontSize="small" color="error" />
      </ListItemIcon>
      <ListItemText primary={message} />
    </ListItem>
  );
}

function NestedEmptyRow({ depth }: { depth: number }) {
  return (
    <ListItem sx={{ pl: getDepthPadding(depth) }}>
      <ListItemText primary="Keine Eintraege" />
    </ListItem>
  );
}

function getDepthPadding(depth: number) {
  return 2 + depth * 2;
}

function createIssueSecondary(issueNode: IssueNode, showCollected: boolean): string | undefined {
  const parts: string[] = [];

  if (
    showCollected &&
    (issueNode.collected || issueNode.variants?.some((entry) => entry?.collected))
  ) {
    parts.push("Gesammelt");
  }

  return parts.length > 0 ? parts.join(" • ") : undefined;
}

function getVariantCount(issueNode: IssueNode): number {
  const total = issueNode.variants?.length || 0;
  return total > 1 ? total - 1 : 0;
}

function toPublisherNodes(data?: PublishersQuery): PublisherNode[] {
  return (data?.publisherList?.edges || [])
    .map((edge) => edge?.node)
    .filter((node): node is PublisherNode => Boolean(node?.name));
}

function toSeriesNodes(data?: SeriesQuery): SeriesNode[] {
  return (data?.seriesList?.edges || [])
    .map((edge) => edge?.node)
    .filter((node): node is SeriesNode => Boolean(node?.title && node?.publisher?.name));
}

function toIssueNodes(data?: IssuesQuery): IssueNode[] {
  return (data?.issueList?.edges || [])
    .map((edge) => edge?.node)
    .filter((node): node is IssueNode => Boolean(node?.number && node?.series?.title));
}

function createSeriesLabel(seriesNode: SeriesNode): string {
  const title = seriesNode.title || "";
  const year = seriesNode.startyear && seriesNode.startyear > 0 ? String(seriesNode.startyear) : "?";
  const volume = seriesNode.volume;
  if (volume === null || volume === undefined) return `${title} (${year})`;
  return `${title} (Vol. ${romanize(volume)}) (${year})`;
}

function createIssueLabel(issueNode: IssueNode, us: boolean): string {
  const number = issueNode.number || "";
  const seriesTitle = issueNode.series?.title || "";
  const variantLabel = issueNode.variant ? ` [${issueNode.variant}]` : "";
  if (us) return `#${number} ${seriesTitle}`;
  if (issueNode.title && issueNode.title !== "") return `#${number} ${issueNode.title}${variantLabel}`;
  return `#${number} ${seriesTitle}${variantLabel}`;
}

function getSelectedPublisherName(selected: SelectedRoot): string {
  return (
    selected?.publisher?.name ||
    selected?.series?.publisher?.name ||
    selected?.issue?.series?.publisher?.name ||
    ""
  );
}

function getSeriesKey(seriesNode: SeriesNode): string {
  return [seriesNode.publisher?.name || "", seriesNode.title || "", seriesNode.volume || ""].join(
    "|"
  );
}

function getSelectedSeriesKey(selected: SelectedRoot): string | null {
  const seriesNode = selected?.series || selected?.issue?.series;
  if (!seriesNode?.title) return null;
  return [
    seriesNode.publisher?.name || "",
    seriesNode.title,
    seriesNode.volume === null || seriesNode.volume === undefined ? "" : seriesNode.volume,
  ].join("|");
}

function toSeriesSelected(seriesNode: SeriesNode, us: boolean): Series {
  return {
    title: seriesNode.title || "",
    volume: seriesNode.volume ?? 1,
    publisher: {
      name: seriesNode.publisher?.name || "",
      us: seriesNode.publisher?.us ?? us,
    },
  };
}

function toSeriesInput(seriesNode: SeriesNode, us: boolean): IssuesQueryVariables["series"] {
  return {
    title: seriesNode.title || "",
    volume: seriesNode.volume ?? 1,
    publisher: {
      name: seriesNode.publisher?.name || "",
      us: seriesNode.publisher?.us ?? us,
    },
  };
}

function toIssueSeriesSelected(
  issueNode: IssueNode,
  fallbackSeries: SeriesNode,
  us: boolean
): Series {
  return {
    title: issueNode.series?.title || fallbackSeries.title || "",
    volume: issueNode.series?.volume ?? fallbackSeries.volume ?? 1,
    publisher: {
      name: issueNode.series?.publisher?.name || fallbackSeries.publisher?.name || "",
      us: issueNode.series?.publisher?.us ?? fallbackSeries.publisher?.us ?? us,
    },
  };
}

function getIssueMatchKey(selectedIssue?: Issue): string | null {
  if (!selectedIssue?.number) return null;
  return [selectedIssue.number, selectedIssue.format || "", selectedIssue.variant || ""].join("|");
}

function getIssueNodeMatchKey(issueNode: IssueNode): string {
  return [issueNode.number || "", issueNode.format || "", issueNode.variant || ""].join("|");
}

export default withContext(List);
