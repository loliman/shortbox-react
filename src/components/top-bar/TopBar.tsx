import Toolbar from "@mui/material/Toolbar";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { styled } from "@mui/material/styles";
import { HierarchyLevel, type HierarchyLevelType } from "../../util/hierarchy";
import { withContext } from "../generic";
import IconButton from "@mui/material/IconButton";
import ButtonBase from "@mui/material/ButtonBase";
import SearchBar from "./SearchBar";
import type { SelectedRoot } from "../../types/domain";
import TopBarFilterMenu from "./TopBarFilterMenu";
import Tooltip from "@mui/material/Tooltip";

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
  resetNavigationState?: () => void;
}

const SEARCH_MAX_WIDTH = 520;
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  width: 62,
  height: 34,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    opacity: 1,
    backgroundColor: "rgba(255, 255, 255, 0.24)",
    border: "1px solid rgba(255, 255, 255, 0.32)",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-switchBase": {
    margin: 0,
    padding: 7,
    transitionDuration: "220ms",
    "&.Mui-checked": {
      transform: "translateX(28px)",
      color: "#ffffff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#22c55e",
        borderColor: "#22c55e",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
    backgroundColor: "#ffffff",
    width: 20,
    height: 20,
    margin: 0,
  },
}));

export function TopBar(props: TopBarProps) {
  const { toggleDrawer, navigate, drawerOpen } = props;
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
            <HamburgerIcon open={Boolean(drawerOpen)} />
          </IconButton>

          {phonePortrait &&
          (props.level === HierarchyLevel.SERIES ||
            props.level === HierarchyLevel.PUBLISHER ||
            props.level === HierarchyLevel.ISSUE) ? null : (
            <ButtonBase
              aria-label="Zur Startseite"
              onClick={(e) => {
                props.resetNavigationState?.();
                navigate?.(e, us ? "/us" : "/de");
              }}
              sx={{
                display: "inline-flex",
                lineHeight: 0,
                borderRadius: 1,
                px: 0.25,
              }}
            >
              <Box component="img" src="/Shortbox_Logo.png" alt="Shortbox" sx={{ height: 34 }} />
            </ButtonBase>
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
          <SearchBar us={us} navigate={navigate} />
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

          <Box sx={{ ml: 0.75, display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: 0.2, opacity: 0.95 }}>
              US
            </Typography>
            <Tooltip title={"Wechseln zu " + (us ? "Deutsch" : "US")}>
              <Android12Switch
                checked={us}
                color="primary"
                inputProps={{ "aria-label": us ? "Zu Deutsch wechseln" : "Zu US wechseln" }}
                onChange={() => {
                  props.resetNavigationState?.();
                  navigate?.(null, us ? "/de" : "/us", { filter: null });
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default withContext(TopBar);

function HamburgerIcon(props: { open: boolean }) {
  const barSx = {
    position: "absolute" as const,
    left: 0,
    width: "100%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "currentColor",
    transition: "transform 220ms ease, opacity 220ms ease, top 220ms ease",
  };

  return (
    <Box
      component="span"
      sx={{
        position: "relative",
        display: "inline-block",
        width: 18,
        height: 14,
      }}
      aria-hidden
    >
      <Box
        component="span"
        sx={{
          ...barSx,
          top: props.open ? 6 : 0,
          transform: props.open ? "rotate(45deg)" : "none",
        }}
      />
      <Box
        component="span"
        sx={{
          ...barSx,
          top: 6,
          opacity: props.open ? 0 : 1,
          transform: props.open ? "scaleX(0.7)" : "none",
        }}
      />
      <Box
        component="span"
        sx={{
          ...barSx,
          top: props.open ? 6 : 12,
          transform: props.open ? "rotate(-45deg)" : "none",
        }}
      />
    </Box>
  );
}
