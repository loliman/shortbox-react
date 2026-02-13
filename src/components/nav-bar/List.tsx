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

const LIST_PAGE_SIZE = 250;

function List(props) {
  const { drawerOpen, toggleDrawer } = props;
  const temporaryDrawer =
    props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const drawerWidth = temporaryDrawer ? 320 : 360;
  const listRef = React.useRef<HTMLUListElement | null>(null);

  const filter = parseFilter(props.query?.filter);
  const normalized = normalizeListLevelAndSelected(props.level, props.selected);
  const query = getListQuery(normalized.level);
  const queryName = getQueryName(query).toLowerCase();
  const queryVariables = { ...normalized.selected, filter, first: LIST_PAGE_SIZE };

  const { error, data, networkStatus } = useQuery(query, {
    variables: queryVariables,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  const hasSession400Error = Boolean(error && error.message.includes("400") && props.session);
  const handledSessionErrorRef = React.useRef(false);

  React.useEffect(() => {
    scrollToSelectedIssue(data, normalized.level, props.selected, listRef.current);
  }, [data, normalized.level, props.selected]);

  React.useEffect(() => {
    if (!hasSession400Error) {
      handledSessionErrorRef.current = false;
      return;
    }

    if (handledSessionErrorRef.current) return;
    handledSessionErrorRef.current = true;

    props.enqueueSnackbar?.("Deine Session ist abgelaufen oder ungültig, du wirst ausgeloggt.", {
      variant: "warning",
    });
    props.handleLogout?.();
  }, [hasSession400Error, props.enqueueSnackbar, props.handleLogout]);

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
          top: { xs: 56, sm: 64 },
          height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
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
