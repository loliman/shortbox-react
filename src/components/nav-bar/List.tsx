import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MuiList from "@mui/material/List";
import { useQuery } from "@apollo/client";
import { getListQuery } from "../../graphql/queriesTyped";
import QueryResult from "../generic/QueryResult";
import { withContext } from "../generic";
import TypeListEntry from "./ListEntry";
import { NoEntries, TypeListEntryPlaceholder } from "./ListPlaceholders";
import {
  getItemKey,
  getQueryName,
  normalizeListLevelAndSelected,
  parseFilter,
  scrollToSelectedIssue,
  toNodeList,
} from "./listUtils";
import type { HierarchyLevelType } from "../../util/hierarchy";
import type { SelectedRoot } from "../../types/domain";
import {
  drawerHeaderAdjustedHeight,
  drawerHeaderTopOffset,
  getNavDrawerWidth,
} from "../layoutMetrics";

const LIST_PAGE_SIZE = 250;

interface ListProps {
  drawerOpen?: boolean;
  toggleDrawer?: () => void;
  compactLayout?: boolean;
  isPhone?: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
  query?: { filter?: string | null } | null;
  level: HierarchyLevelType;
  selected: SelectedRoot;
  appIsLoading?: boolean;
  [key: string]: unknown;
}

function List(props: Readonly<ListProps>) {
  const { drawerOpen, toggleDrawer } = props;
  const temporaryDrawer =
    props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const drawerWidth = getNavDrawerWidth(temporaryDrawer);
  const listRef = React.useRef<HTMLUListElement | null>(null);

  const filter = parseFilter(props.query?.filter);
  const normalized = normalizeListLevelAndSelected(props.level, props.selected);
  const query = getListQuery(normalized.level);
  const queryName = getQueryName(query);
  const queryVariables = { ...normalized.selected, filter, first: LIST_PAGE_SIZE };

  const { error, data, networkStatus } = useQuery(
    query as any,
    {
      variables: queryVariables as any,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    } as any
  );

  React.useEffect(() => {
    scrollToSelectedIssue(data, normalized.level, props.selected, listRef.current);
  }, [data, normalized.level, props.selected]);

  const items = toNodeList(data, queryName);
  let content: React.ReactNode;

  if (props.appIsLoading || error || !data || !items || networkStatus === 2) {
    content = (
      <QueryResult
        error={error}
        placeholder={<TypeListEntryPlaceholder />}
        placeholderCount={25}
        loading={networkStatus === 2}
        data={data}
      />
    );
  } else if (items.length === 0) {
    content = <NoEntries />;
  } else {
    content = items.map((item, idx) => (
      <TypeListEntry {...props} idx={idx} key={getItemKey(item, idx)} item={item} />
    ));
  }

  return (
    <SwipeableDrawer
      disableDiscovery={true}
      variant={temporaryDrawer ? "temporary" : "persistent"}
      open={drawerOpen}
      onClose={() => toggleDrawer?.()}
      onOpen={() => toggleDrawer?.()}
      PaperProps={{
        sx: {
          width: drawerWidth,
          maxWidth: "100%",
          top: drawerHeaderTopOffset,
          height: drawerHeaderAdjustedHeight,
        },
      }}
    >
      <MuiList ref={listRef} sx={{ width: "100%", p: 0 }}>
        {content}
      </MuiList>
    </SwipeableDrawer>
  );
}

export default withContext(List);
