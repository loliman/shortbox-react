import React from "react";
import { gql, useQuery } from "@apollo/client";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import Badge from "@mui/material/Badge";
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
  query?: { filter?: string | null } | null;
  session?: { loggedIn?: boolean } | null;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
};

export default function TopBarFilterMenu(props: Readonly<TopBarFilterMenuProps>) {
  const { us, selected, isFilterActive, navigate } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [exportOpen, setExportOpen] = React.useState(false);
  const menuOpen = Boolean(anchorEl);
  const filterVariables = React.useMemo(() => {
    try {
      const parsed = props.query?.filter ? JSON.parse(props.query.filter) : {};
      return { filter: { us, ...(parsed as Record<string, unknown>) } };
    } catch {
      return null;
    }
  }, [props.query?.filter, us]);

  const { data, loading } = useQuery(FILTER_COUNT_QUERY, {
    skip: !isFilterActive || !filterVariables,
    variables: filterVariables || undefined,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const count = data?.filterCount;

  const handleFilterMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tooltip title={isFilterActive ? "Filter aktiv" : "Filtern"}>
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <Badge
            color="secondary"
            max={999999999}
            overlap="circular"
            showZero={false}
            badgeContent={
              isFilterActive ? (loading ? "…" : Number.isFinite(count) ? count : undefined) : undefined
            }
            invisible={!isFilterActive || (!loading && !Number.isFinite(count))}
            slotProps={{
              badge: {
                sx: {
                  fontSize: "0.62rem",
                  minWidth: 17,
                  height: 17,
                  px: 0.45,
                },
              },
            }}
          >
          <IconButton
            color={isFilterActive ? "secondary" : "inherit"}
            aria-label={isFilterActive ? "Filteroptionen" : "Filter öffnen"}
            aria-controls={menuOpen ? "topbar-filter-menu" : undefined}
            aria-haspopup="menu"
            aria-expanded={menuOpen ? "true" : undefined}
            onClick={(e) => {
              if (!isFilterActive) {
                navigate?.(e, us ? "/filter/us" : "/filter/de");
                return;
              }
              if (menuOpen) {
                handleFilterMenuClose();
              } else {
                handleFilterMenuOpen(e);
              }
            }}
          >
            <TuneRoundedIcon />
          </IconButton>
          </Badge>
        </Box>
      </Tooltip>

      <Menu
        id="topbar-filter-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleFilterMenuClose}
        PaperProps={{
          sx: {
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
  );
}

const FILTER_COUNT_QUERY = gql`
  query FilterCount($filter: Filter!) {
    filterCount(filter: $filter)
  }
`;
