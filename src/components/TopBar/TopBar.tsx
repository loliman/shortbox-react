import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { generateLabel, generateUrl, HierarchyLevel } from "../../util/hierarchy";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { withContext } from "../generic";
import IconButton from "@mui/material/IconButton";
import SearchBar from "../SearchBar";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExportDialog from "../ExportDialog";
import type { SelectedRoot } from "../../types/domain";

interface TopBarProps {
  toogleDrawer?: () => void;
  us?: boolean;
  mobile?: boolean;
  mobileLandscape?: boolean;
  tablet?: boolean;
  tabletLandscape?: boolean;
  level?: string;
  query?: { filter?: string | null } | null;
  selected?: SelectedRoot;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  [key: string]: unknown;
}

interface TopBarState {
  searchbarFocus: boolean;
  exportOpen: boolean;
  anchorEl: HTMLElement | null;
}

class TopBar extends React.Component<TopBarProps, TopBarState> {
  constructor(props: TopBarProps) {
    super(props);

    this.state = {
      searchbarFocus: false,
      exportOpen: false,
      anchorEl: null,
    };
  }

  render() {
    const { toogleDrawer, mobile, mobileLandscape, tablet, tabletLandscape } = this.props;
    const us = Boolean(this.props.us);
    const selected = this.props.selected || { us };

    let isFilter;
    if (this.props.query && this.props.query.filter) isFilter = this.props.query.filter;

    return (
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton color="inherit" onClick={() => toogleDrawer?.()}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, flexGrow: 1, gap: 1 }}>
            {mobile &&
            !mobileLandscape &&
            (this.props.level === HierarchyLevel.SERIES ||
              this.props.level === HierarchyLevel.PUBLISHER ||
              this.props.level === HierarchyLevel.ISSUE) ? null : (
              <img
                onMouseDown={(e) => this.props.navigate?.(e, us ? "/us" : "/de")}
                src="/Shortbox_Logo.png"
                alt="Shortbox"
                height="34"
              />
            )}

            <Typography
              variant="subtitle1"
              color="inherit"
              noWrap
              sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}
            >
              {mobile && !mobileLandscape ? (
                <BreadCrumbMenu {...this.props} selected={selected} us={us} />
              ) : (
                <BreadCrumbMenuMobile {...this.props} selected={selected} us={us} />
              )}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: mobile || (tablet && !tabletLandscape) ? 56 : 320 }}>
              <SearchBar focus={this.state.searchbarFocus} onFocus={this.onFocus} />
            </Box>

            <Tooltip title={isFilter ? "Filter aktiv" : "Filtern"}>
              <IconButton
                color={isFilter ? "secondary" : "inherit"}
                onClick={(e) => {
                  if (!isFilter) this.props.navigate?.(e, us ? "/filter/us" : "/filter/de");
                  else this.handleFilterMenuOpen(e);
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            <ClickAwayListener onClickAway={this.handleFilterMenuClose}>
              <Box>
                <Menu
                  id="long-menu"
                  anchorEl={this.state.anchorEl}
                  open={this.state.anchorEl !== null}
                  onClose={this.handleFilterMenuClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: 200,
                    },
                  }}
                >
                  <MenuItem
                    key="edit"
                    onClick={(e) => {
                      this.handleFilterMenuClose();
                      this.props.navigate?.(e, us ? "/filter/us" : "/filter/de");
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Bearbeiten
                    </Typography>
                  </MenuItem>

                  <MenuItem key="export" onClick={(e) => this.handleExport()}>
                    <ListItemIcon>
                      <CloudDownloadIcon />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Exportieren
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    key="reset"
                    onClick={(e) => {
                      this.handleFilterMenuClose();
                      this.props.navigate?.(e, generateUrl(selected, us), { filter: null });
                    }}
                  >
                    <ListItemIcon>
                      <ClearIcon />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Zurücksetzen
                    </Typography>
                  </MenuItem>
                </Menu>

                <ExportDialog handleClose={this.handleExportClose} open={this.state.exportOpen} />
              </Box>
            </ClickAwayListener>

            <FormControlLabel
              label={"US"}
              sx={{ ml: 0.5, mr: 0 }}
              control={
                <Tooltip title={"Wechseln zu " + (us ? "Deutsch" : "US")}>
                  <Switch
                    checked={us}
                    onChange={() => {
                      this.props.navigate?.(null, us ? "/de" : "/us", { filter: null });
                    }}
                    color="secondary"
                  />
                </Tooltip>
              }
            />
          </Box>
        </Toolbar>

        {mobile || (tablet && !tabletLandscape) ? (
          <Box
            onClick={(e) => this.onFocus(e, false)}
            sx={{
              position: "absolute",
              inset: 0,
              display: this.state.searchbarFocus ? "block" : "none",
              zIndex: 1,
            }}
          />
        ) : null}
      </AppBar>
    );
  }

  onFocus = (e: React.MouseEvent<HTMLElement> | null, focus: boolean) => {
    this.setState({ searchbarFocus: focus });
    if (e) e.preventDefault();
  };

  handleFilterMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  };

  handleFilterMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleExport = () => {
    this.setState({
      exportOpen: true,
    });
  };

  handleExportClose = () => {
    this.setState({
      exportOpen: false,
    });
  };
}

interface BreadCrumbProps extends TopBarProps {
  to: string;
  label: React.ReactNode;
}

function BreadCrumbMenu(props: TopBarProps) {
  const level = props.level;
  const us = Boolean(props.us);
  const selected = props.selected || { us };

  switch (level) {
    case HierarchyLevel.ROOT:
      return null;
    case HierarchyLevel.PUBLISHER:
      return (
        <React.Fragment>
          <BreadCrumbLink
            to={us ? "/us" : "/de"}
            label={<KeyboardArrowLeftIcon fontSize="small" />}
            {...props}
          />
          <BreadCrumbLabel label={generateLabel(selected)} />
        </React.Fragment>
      );
    case HierarchyLevel.SERIES:
      return (
        <React.Fragment>
          <BreadCrumbLink
            to={generateUrl(selected.series, us)}
            label={<KeyboardArrowLeftIcon fontSize="small" />}
            {...props}
          />
          <BreadCrumbLabel label={generateLabel(selected)} />
        </React.Fragment>
      );
    default:
      return (
        <React.Fragment>
          <BreadCrumbLink
            to={generateUrl(selected.issue, us)}
            label={<KeyboardArrowLeftIcon fontSize="small" />}
            {...props}
          />
          <BreadCrumbLabel label={"#" + selected.issue.number} />
        </React.Fragment>
      );
  }
}

function BreadCrumbMenuMobile(props: TopBarProps) {
  const level = props.level;
  const us = Boolean(props.us);
  const selected = props.selected || { us };

  switch (level) {
    case HierarchyLevel.ROOT:
      return null;
    case HierarchyLevel.PUBLISHER:
      return (
        <React.Fragment>
          <BreadCrumbLabel label={generateLabel(selected)} />
        </React.Fragment>
      );
    case HierarchyLevel.SERIES:
      return (
        <React.Fragment>
          <BreadCrumbLink
            to={generateUrl(selected.series, us)}
            label={generateLabel(selected.series)}
            {...props}
          />
          <KeyboardArrowRightIcon fontSize="small" />
          <BreadCrumbLabel label={generateLabel(selected)} />
        </React.Fragment>
      );
    default:
      return (
        <React.Fragment>
          <React.Fragment>
            <BreadCrumbLink
              to={generateUrl(selected.issue.series, us)}
              label={generateLabel(selected.issue.series)}
              {...props}
            />
            <KeyboardArrowRightIcon fontSize="small" />
            <BreadCrumbLink
              to={generateUrl(selected.issue, us)}
              label={generateLabel(selected.issue)}
              {...props}
            />
            <KeyboardArrowRightIcon fontSize="small" />
            <BreadCrumbLabel label={"#" + selected.issue.number} />
          </React.Fragment>
        </React.Fragment>
      );
  }
}

function BreadCrumbLink(props: BreadCrumbProps) {
  return (
    <React.Fragment>
      <Typography
        component="span"
        sx={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "underline",
          mr: "4px",
        }}
        onMouseDown={(e) => {
          props.navigate?.(e, props.to);
        }}
      >
        {props.label}
      </Typography>
    </React.Fragment>
  );
}

function BreadCrumbLabel(props: { label: React.ReactNode }) {
  return <span>{props.label}</span>;
}

export default withContext(TopBar);
