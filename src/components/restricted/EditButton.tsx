import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { withContext } from "../generic";
import Dropdown from "./Dropdown";

interface EditDropdownState {
  anchorEl: HTMLElement | null;
  item: unknown;
}

interface EditButtonProps {
  session?: unknown;
  anchorEl?: HTMLElement | null;
  item?: unknown;
  [key: string]: unknown;
}

interface EditButtonState {
  EditDropdown: EditDropdownState;
}

class EditButton extends React.Component<EditButtonProps, EditButtonState> {
  constructor(props: EditButtonProps) {
    super(props);

    this.state = {
      EditDropdown: {
        anchorEl: null,
        item: null,
      },
    };
  }

  render() {
    if (this.props.session)
      return (
        <div className="editButton">
          <IconButton
            className="itemMenuButton"
            aria-label="More"
            aria-owns={this.props.anchorEl ? "long-menu" : undefined}
            aria-haspopup="true"
            onClick={(e) => this.handleEditDropdownOpen(e, this.props.item)}
          >
            <MoreVertIcon />
          </IconButton>
          <Dropdown
            EditDropdown={this.state.EditDropdown}
            handleOpen={this.handleEditDropdownOpen}
            handleClose={this.handleEditDropdownClose}
          />
        </div>
      );

    return null;
  }

  handleEditDropdownOpen = (e: React.MouseEvent<HTMLElement>, item: unknown) => {
    this.setState({
      EditDropdown: {
        anchorEl: e.currentTarget,
        item: item,
      },
    });
  };

  handleEditDropdownClose = () => {
    this.setState({
      EditDropdown: {
        anchorEl: null,
        item: this.state.EditDropdown.item,
      },
    });
  };
}

export default withContext(EditButton);
