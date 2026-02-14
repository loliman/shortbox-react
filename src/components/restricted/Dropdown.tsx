import React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { generateUrl, HierarchyLevel } from "../../util/hierarchy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeletionDialog from "./DeletionDialog";
import { withContext } from "../generic";

interface DropdownStory {
  children?: unknown[];
}

interface DropdownItem {
  series?: { publisher?: { us?: boolean; name?: string }; title?: string; volume?: number };
  publisher?: { us?: boolean; name?: string };
  number?: string;
  format?: string;
  variant?: string;
  us?: boolean | null;
  stories?: DropdownStory[];
  __typename?: string;
  [key: string]: unknown;
}

interface DropdownProps {
  session?: unknown;
  level?: string;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  handleClose?: () => void;
  EditDropdown?: {
    anchorEl: HTMLElement | null;
    item?: DropdownItem | null;
  };
  us?: boolean;
}

interface DropdownState {
  deletionOpen: boolean;
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps) {
    super(props);

    this.state = {
      deletionOpen: false,
    };
  }

  render() {
    const selectedItem = this.props.EditDropdown?.item;
    if (!selectedItem || !this.props.session) return null;

    const isUsIssue =
      this.props.level === HierarchyLevel.ISSUE && Boolean(selectedItem.series?.publisher?.us);
    const canDelete =
      !isUsIssue ||
      (selectedItem.stories || []).every((story) => (story.children?.length || 0) === 0);

    return (
      <ClickAwayListener onClickAway={() => this.props.handleClose?.()}>
        <div>
          <Menu
            id="edit-item-menu"
            anchorEl={this.props.EditDropdown.anchorEl}
            open={this.props.EditDropdown.anchorEl !== null}
            onClose={() => this.props.handleClose?.()}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: 200,
              },
            }}
          >
            <MenuItem
              key="edit"
              onClick={() => {
                const us = resolveItemUs(selectedItem, this.props.level, Boolean(this.props.us));

                this.props.navigate?.(
                  null,
                  "/edit" +
                    generateUrl(
                      selectedItem as unknown as import("../../types/domain").SelectedRoot,
                      us
                    )
                );
                this.props.handleClose?.();
              }}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                Bearbeiten
              </Typography>
            </MenuItem>

            <MenuItem disabled={!canDelete} key="delete" onClick={() => this.handleDelete()}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                Löschen
              </Typography>
            </MenuItem>
          </Menu>

          <DeletionDialog
            handleClose={this.handleDeletionClose}
            open={this.state.deletionOpen}
            item={selectedItem}
          />
        </div>
      </ClickAwayListener>
    );
  }

  handleDelete = () => {
    this.setState({
      deletionOpen: true,
    });

    this.props.handleClose?.();
  };

  handleDeletionClose = () => {
    this.setState({
      deletionOpen: false,
    });
  };
}

function resolveItemUs(
  item: DropdownItem,
  level: string | undefined,
  fallbackUs: boolean
): boolean {
  switch (level) {
    case HierarchyLevel.ISSUE:
      return Boolean(item.series?.publisher?.us);
    case HierarchyLevel.SERIES:
      return Boolean(item.publisher?.us);
    default:
      return item.us === null || item.us === undefined ? fallbackUs : Boolean(item.us);
  }
}

export default withContext(Dropdown);
