import Toolbar from "@mui/material/Toolbar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import React from "react";
import { HierarchyLevel, type HierarchyLevelType } from "../../util/hierarchy";
import MenuIcon from "@mui/icons-material/Menu";
import { withContext } from "../generic";
import IconButton from "@mui/material/IconButton";
import SearchBar from "./SearchBar";
import type { SelectedRoot } from "../../types/domain";
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

const SEARCH_MAX_WIDTH = 520;

export function TopBar(props: TopBarProps) {
  const { toggleDrawer, navigate } = props;
  const us = Boolean(props.us);
  const selected = props.selected || { us };
  const phonePortrait = props.isPhonePortrait ?? Boolean(props.isPhone && !props.isPhoneLandscape);
  const isFilter = props.query?.filter;

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar
        sx={{
          display: "grid",
          alignItems: "center",
          columnGap: 1,
          gridTemplateColumns: {
            xs: "auto minmax(148px, 1fr) auto",
            sm: "minmax(0, 1fr) minmax(220px, 520px) minmax(0, 1fr)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            flexShrink: 0,
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

        <Box
          data-testid="topbar-search-center"
          sx={{
            minWidth: 0,
            width: "100%",
            maxWidth: SEARCH_MAX_WIDTH,
            justifySelf: "center",
            px: 1,
          }}
        >
          <SearchBar />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            minWidth: 0,
            justifySelf: "end",
          }}
        >
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
    </AppBar>
  );
}

export default withContext(TopBar);
