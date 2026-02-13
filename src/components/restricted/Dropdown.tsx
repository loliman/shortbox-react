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
  series?: { publisher?: { us?: boolean } };
  publisher?: { us?: boolean };
  us?: boolean;
  stories?: DropdownStory[];
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
  [key: string]: unknown;
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
    if (!this.props.EditDropdown?.item || !this.props.session) return null;

    let canDelete = true;

    if (
      this.props.level === HierarchyLevel.ISSUE &&
      this.props.EditDropdown.item.series?.publisher?.us
    ) {
      this.props.EditDropdown.item.stories?.forEach((story) => {
        if (canDelete) canDelete = (story.children?.length || 0) === 0;
      });
    }

    return (
      <ClickAwayListener onClickAway={() => this.props.handleClose?.()}>
        <div>
          <Menu
            id="long-menu"
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
                let us = false;
                switch (this.props.level) {
                  case HierarchyLevel.ISSUE:
                    us = this.props.EditDropdown.item.series.publisher.us;
                    break;
                  case HierarchyLevel.SERIES:
                    us = this.props.EditDropdown.item.publisher.us;
                    break;
                  default:
                    us = this.props.EditDropdown.item.us;
                }

                this.props.navigate?.(
                  null,
                  "/edit" +
                    generateUrl(
                      this.props.EditDropdown
                        .item as unknown as import("../../types/domain").SelectedRoot,
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
            item={this.props.EditDropdown.item}
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

export default withContext(Dropdown);
