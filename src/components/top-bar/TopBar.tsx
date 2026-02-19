import Toolbar from "@mui/material/Toolbar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { HierarchyLevel, type HierarchyLevelType } from "../../util/hierarchy";
import MenuIcon from "@mui/icons-material/Menu";
import { withContext } from "../generic";
import IconButton from "@mui/material/IconButton";
import SearchBar from "./SearchBar";
import type { SelectedRoot } from "../../types/domain";
import TopBarFilterMenu from "./TopBarFilterMenu";
import Tooltip from "@mui/material/Tooltip";
import { getNavDrawerWidth } from "../layoutMetrics";

interface TopBarProps {
  toggleDrawer?: () => void;
  drawerOpen?: boolean;
  us?: boolean;
  isPhone?: boolean;
  isPhoneLandscape?: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
  isPhonePortrait?: boolean;
  compactLayout?: boolean;
  level?: HierarchyLevelType;
  query?: { filter?: string | null; order?: string | null; direction?: string | null } | null;
  selected?: SelectedRoot;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
}

export function TopBar(props: TopBarProps) {
  const { toggleDrawer, navigate } = props;
  const us = Boolean(props.us);
  const selected = props.selected || { us };
  const compactLayout =
    props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const phonePortrait = props.isPhonePortrait ?? Boolean(props.isPhone && !props.isPhoneLandscape);
  const [searchbarFocus, setSearchbarFocus] = useState(false);
  const isFilter = props.query?.filter;
  const drawerWidth = getNavDrawerWidth(compactLayout);
  const searchOffsetWidth = !compactLayout && props.drawerOpen ? `${drawerWidth}px` : "auto";

  const onFocus = (e: React.MouseEvent<HTMLElement> | null, focus: boolean) => {
    setSearchbarFocus(focus);
    if (e) e.preventDefault();
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            flexShrink: 0,
            width: searchOffsetWidth,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="Navigation umschalten"
            onClick={() => toggleDrawer?.()}
            sx={{ mr: 0.5 }}
          >
            <MenuIcon />
          </IconButton>

          {phonePortrait &&
          (props.level === HierarchyLevel.SERIES ||
            props.level === HierarchyLevel.PUBLISHER ||
            props.level === HierarchyLevel.ISSUE) ? null : (
            <Box
              component="button"
              type="button"
              aria-label="Zur Startseite"
              onClick={() => navigate?.(null, us ? "/us" : "/de")}
              sx={{
                p: 0,
                border: 0,
                background: "transparent",
                display: "inline-flex",
                cursor: "pointer",
                lineHeight: 0,
              }}
            >
              <img src="/Shortbox_Logo.png" alt="Shortbox" height="34" />
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, flexGrow: 1 }}>
          <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: 420 } }}>
            <SearchBar alignLeft focus={searchbarFocus} onFocus={onFocus} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <TopBarFilterMenu
            us={us}
            selected={selected}
            isFilterActive={isFilter}
            navigate={navigate}
          />

          <FormControlLabel
            label={"US"}
            sx={{ ml: 0.5, mr: 0 }}
            control={
              <Tooltip title={"Wechseln zu " + (us ? "Deutsch" : "US")}>
                <Switch
                  checked={us}
                  color="secondary"
                  inputProps={{ "aria-label": us ? "Zu Deutsch wechseln" : "Zu US wechseln" }}
                  onChange={() => {
                    navigate?.(null, us ? "/de" : "/us", { filter: null });
                  }}
                />
              </Tooltip>
            }
          />
        </Box>
      </Toolbar>

      {compactLayout ? (
        <Box
          data-testid="topbar-search-overlay"
          onClick={(e) => onFocus(e, false)}
          sx={{
            position: "absolute",
            inset: 0,
            display: searchbarFocus ? "block" : "none",
            zIndex: 1,
          }}
        />
      ) : null}
    </AppBar>
  );
}

export default withContext(TopBar);
