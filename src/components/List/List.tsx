import React from "react";
import MuiList from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { getListQuery } from "../../graphql/queriesTyped";
import QueryResult from "../generic/QueryResult";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { withContext } from "../generic";
import { generateLabel, generateUrl, HierarchyLevel } from "../../util/hierarchy";
import Tooltip from "@mui/material/Tooltip";
import { useQuery } from "@apollo/client";
import CoverTooltip from "../CoverTooltip";
import type { Connection, QueryCollection } from "../../types/graphql";
import Box from "@mui/material/Box";

function List(props) {
  const { drawerOpen, toogleDrawer, mobile, tablet, tabletLandscape, handleMenuOpen } = props;
  const temporaryDrawer = Boolean(mobile || (tablet && !tabletLandscape));
  const drawerWidth = temporaryDrawer ? 320 : 360;
  let { selected, level } = props;
  const listRef = React.useRef<HTMLUListElement | null>(null);

  let filter;
  if (props.query && props.query.filter) {
    try {
      filter = JSON.parse(props.query.filter);
    } catch (e) {
      //
    }
  }

  if (level === HierarchyLevel.ISSUE) {
    level = HierarchyLevel.SERIES;
    selected = selected.issue;
  }

  let query = getListQuery(level);
  let queryName = getQueryName(query).toLowerCase();
  const queryVariables = { ...selected, filter, first: 5000 };

  const { error, data, networkStatus } = useQuery(query, {
    variables: queryVariables,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    scroll({ data }, props, listRef.current);
  }, [data, props]);

  let content;

  const items = toNodeList(data, queryName);

  if (props.appIsLoading || error || !data || !items || networkStatus === 2) {
    if (error && error.message.indexOf("400") !== -1 && props.session) {
      props.enqueueSnackbar("Deine Session ist abgelaufen oder ungültig, du wirst ausgeloggt.", {
        variant: "warning",
      });
      props.handleLogout();
    }

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
    content = items.map((i, idx) => (
      <TypeListEntry {...props} handleMenuOpen={handleMenuOpen} idx={idx} key={idx} item={i} />
    ));
  }

  return (
    <SwipeableDrawer
      disableDiscovery={true}
      variant={temporaryDrawer ? "temporary" : "persistent"}
      open={drawerOpen}
      onClose={() => toogleDrawer()}
      onOpen={() => toogleDrawer()}
      PaperProps={{
        sx: {
          width: drawerWidth,
          maxWidth: "100%",
          top: { xs: 56, sm: 64 },
          height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
        },
      }}
    >
      <MuiList
        ref={listRef}
        sx={{ width: "100%", p: 0 }}
      >
        {content}
      </MuiList>
    </SwipeableDrawer>
  );
}

function TypeListEntry(props) {
  const { us, item, level, mobile, mobileLandscape, toogleDrawer } = props;

  let label = generateLabel(item);
  if (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE) {
    if (level === HierarchyLevel.ISSUE && us) label = "#" + item.number + " " + item.series.title;
    else if (item.title && item.title !== "") label = "#" + item.number + " " + item.title;
    else label = "#" + item.number + " " + item.series.title;
  }

  let isBold = {};

  if (level === HierarchyLevel.ISSUE && props.selected.issue.number === item.number) {
    isBold = { fontWeight: "bold" };
  }

  let variants = item.variants ? item.variants.length - 1 : 0;

  if (level === HierarchyLevel.ISSUE || level === HierarchyLevel.SERIES)
    return (
      <CoverTooltip issue={item}>
        <Box data-item-index={props.idx}>
          <ListItemButton
            divider
            onMouseDown={(e) => {
              if (
                mobile &&
                !mobileLandscape &&
                (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE)
              )
                toogleDrawer();

              props.navigate(e, generateUrl(item, us), {
                expand: null,
                filter: props.query ? props.query.filter : null,
              });
            }}
          >
            <ListItemText
              sx={{ whiteSpace: "normal", m: 0 }}
              primary={
                <Typography component="div" style={isBold}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>{label}</div>
                    <div style={{ display: "flex" }}>
                      {item.variants && item.variants.length > 1 ? (
                        <Tooltip
                          title={"+" + variants + (variants === 1 ? " Variante" : " Varianten")}
                        >
                          <Typography
                            className={"material-icons"}
                            style={{ color: "gray", paddingLeft: "2px", fontSize: "8px" }}
                            color={"disabled"}
                          >
                            +{item.variants.length - 1}
                          </Typography>
                        </Tooltip>
                      ) : null}

                      {(item.collected ||
                        (item.variants && item.variants.filter((v) => v.collected).length > 0)) &&
                      props.session ? (
                        <img
                          src="/collected_badge.png"
                          alt="gesammelt"
                          height="21"
                          style={{ margin: "0" }}
                        />
                      ) : null}
                    </div>
                  </div>
                </Typography>
              }
            />
          </ListItemButton>
        </Box>
      </CoverTooltip>
    );
  else
    return (
      <Box data-item-index={props.idx}>
        <ListItemButton
          divider
          onMouseDown={(e) => {
            if (
              mobile &&
              !mobileLandscape &&
              (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE)
            )
              toogleDrawer();

            props.navigate(e, generateUrl(item, us), {
              expand: null,
              filter: props.query ? props.query.filter : null,
            });
          }}
        >
          <ListItemText
            sx={{ whiteSpace: "normal", m: 0 }}
            primary={
              <Typography component="div" style={isBold}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{label}</div>
                  <div style={{ display: "flex" }}>
                    {item.variants && item.variants.length > 1 ? (
                      <Tooltip
                        title={"+" + variants + (variants === 1 ? " Variante" : " Varianten")}
                      >
                        <Typography
                          className={"material-icons"}
                          style={{ color: "gray", paddingLeft: "2px", fontSize: "8px" }}
                          color={"disabled"}
                        >
                          +{item.variants.length - 1}
                        </Typography>
                      </Tooltip>
                    ) : null}

                    {(item.collected ||
                      (item.variants && item.variants.filter((v) => v.collected).length > 0)) &&
                    props.session ? (
                      <img
                        src="/collected_badge.png"
                        alt="gesammelt"
                        height="21"
                        style={{ margin: "0" }}
                      />
                    ) : null}
                  </div>
                </div>
              </Typography>
            }
          />
        </ListItemButton>
      </Box>
    );
}

function TypeListEntryPlaceholder(props) {
  let n = Math.floor(Math.random() * 6);
  let lengths = ["very long", "long", "medium", "short", "very short"];

  return (
    <Box>
      <ListItem sx={{ py: 2 }}>
        <ListItemText>
          <div className="ui placeholder">
            <div className="header">
              <div className={lengths[n - 1] + " line"} />
            </div>
          </div>
        </ListItemText>
      </ListItem>
    </Box>
  );
}

function NoEntries(props) {
  return (
    <Box sx={{ p: 2, display: "flex" }}>
      <Typography sx={{ alignSelf: "center" }}>Keine Einträge gefunden</Typography>
    </Box>
  );
}

function scroll(state, props, listElement: HTMLUListElement | null) {
  if (props && props.level) {
    let level = props.level;
    if (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE) {
      let query = getListQuery(level);
      let queryName = getQueryName(query).toLowerCase();

      const items = toNodeList(state ? state.data : null, queryName);

      if (state && items && props.selected.issue) {
        let idx = items.findIndex((d) => d.number === props.selected.issue.number);

        let height = 0;

        let offsets = items
          .filter((d, i) => i <= idx)
          .map((d, idx) => {
            const listItem = listElement?.querySelector(
              `[data-item-index="${idx}"]`
            ) as HTMLElement | null;
            return listItem ? listItem.offsetHeight : 0;
          });

        if (offsets.length > 0) height = offsets.reduce((a, b) => a + b);

        const currentItem = listElement?.querySelector(
          `[data-item-index="${idx}"]`
        ) as HTMLElement | null;
        height -= currentItem ? currentItem.offsetHeight : 0;
        if (listElement) listElement.scrollTop = height - 100;
      }
    }
  }
}

function toNodeList(data, queryName) {
  if (!data || !data[queryName]) return null;

  const value = data[queryName];
  if (Array.isArray(value)) return value;

  if (isConnection(value)) return value.edges.map((edge) => edge.node).filter(Boolean);

  return null;
}

function isConnection(value: QueryCollection<unknown>): value is Connection<unknown> {
  return !!value && !Array.isArray(value) && "edges" in value && "pageInfo" in value;
}

function getQueryName(query: { definitions?: ReadonlyArray<unknown> }): string {
  const firstDefinition = query.definitions?.[0];
  if (!firstDefinition || typeof firstDefinition !== "object") return "";

  const withName = firstDefinition as { name?: { value?: string } };
  return withName.name?.value || "";
}

export default withContext(List);
