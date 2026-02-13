import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ClearIcon from "@mui/icons-material/Clear";
import ExportDialog from "./ExportDialog";
import { generateUrl } from "../../util/hierarchy";
import type { SelectedRoot } from "../../types/domain";

type TopBarFilterMenuProps = {
  us: boolean;
  selected: SelectedRoot | { us: boolean };
  isFilterActive?: boolean | string | null;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
};

export default function TopBarFilterMenu(props: Readonly<TopBarFilterMenuProps>) {
  const { us, selected, isFilterActive, navigate } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const handleFilterMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ClickAwayListener onClickAway={handleFilterMenuClose}>
      <Box>
        <Tooltip title={isFilterActive ? "Filter aktiv" : "Filtern"}>
          <IconButton
            color={isFilterActive ? "secondary" : "inherit"}
            aria-label={isFilterActive ? "Filteroptionen" : "Filter öffnen"}
            onClick={(e) => {
              if (!isFilterActive) navigate?.(e, us ? "/filter/us" : "/filter/de");
              else handleFilterMenuOpen(e);
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <Menu
          id="topbar-filter-menu"
          anchorEl={anchorEl}
          open={anchorEl !== null}
          onClose={handleFilterMenuClose}
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
              handleFilterMenuClose();
              navigate?.(e, us ? "/filter/us" : "/filter/de");
            }}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Bearbeiten
            </Typography>
          </MenuItem>

          <MenuItem
            key="export"
            onClick={() => {
              handleFilterMenuClose();
              setExportOpen(true);
            }}
          >
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
              handleFilterMenuClose();
              navigate?.(e, generateUrl(selected, us), { filter: null });
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

        <ExportDialog handleClose={() => setExportOpen(false)} open={exportOpen} />
      </Box>
    </ClickAwayListener>
  );
}
