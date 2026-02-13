import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { withContext } from "../generic";
import Dropdown from "./Dropdown";

interface EditDropdownState {
  anchorEl: HTMLElement | null;
  item: unknown | null;
}

interface EditButtonProps {
  session?: unknown;
  item?: unknown;
}

function EditButton(props: Readonly<EditButtonProps>) {
  const [editDropdown, setEditDropdown] = React.useState<EditDropdownState>({
    anchorEl: null,
    item: null,
  });

  const handleEditDropdownOpen = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setEditDropdown({
        anchorEl: e.currentTarget,
        item: props.item ?? null,
      });
    },
    [props.item]
  );

  const handleEditDropdownClose = React.useCallback(() => {
    setEditDropdown((current) => ({
      anchorEl: null,
      item: current.item,
    }));
  }, []);

  if (!props.session) return null;

  return (
    <div className="editButton">
      <IconButton
        className="itemMenuButton"
        aria-label="Mehr"
        aria-controls={editDropdown.anchorEl ? "edit-item-menu" : undefined}
        aria-expanded={editDropdown.anchorEl ? "true" : undefined}
        aria-haspopup="menu"
        onClick={handleEditDropdownOpen}
      >
        <MoreVertIcon />
      </IconButton>

      <Dropdown EditDropdown={editDropdown} handleClose={handleEditDropdownClose} />
    </div>
  );
}

export default withContext(EditButton);
