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
import { BreadcrumbCompact, BreadcrumbExpanded } from "./TopBarBreadcrumbs";
import TopBarFilterMenu from "./TopBarFilterMenu";
import Tooltip from "@mui/material/Tooltip";

interface TopBarProps {
  toggleDrawer?: () => void;
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

function TopBar(props: TopBarProps) {
  const { toggleDrawer, navigate } = props;
  const us = Boolean(props.us);
  const selected = props.selected || { us };
  const compactLayout =
    props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const phonePortrait = props.isPhonePortrait ?? Boolean(props.isPhone && !props.isPhoneLandscape);
  const [searchbarFocus, setSearchbarFocus] = useState(false);
  const isFilter = props.query?.filter;

  const onFocus = (e: React.MouseEvent<HTMLElement> | null, focus: boolean) => {
    setSearchbarFocus(focus);
    if (e) e.preventDefault();
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          aria-label="Navigation umschalten"
          onClick={() => toggleDrawer?.()}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, flexGrow: 1, gap: 1 }}>
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

          <Box
            sx={{
              typography: "subtitle1",
              color: "inherit",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {phonePortrait ? (
              <BreadcrumbCompact {...props} selected={selected} us={us} navigate={navigate} />
            ) : (
              <BreadcrumbExpanded {...props} selected={selected} us={us} navigate={navigate} />
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <Box
            sx={{
              width: compactLayout ? 56 : 320,
              minWidth: 56,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <SearchBar focus={searchbarFocus} onFocus={onFocus} />
          </Box>

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
