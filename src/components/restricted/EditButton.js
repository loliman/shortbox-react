import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import {withContext} from "../generic";

function EditButton(props) {
    if (props.session)
        return (
            <IconButton
                className="itemMenuButton"
                aria-label="More"
                aria-owns={Boolean(props.anchorEl) ? 'long-menu' : undefined}
                aria-haspopup="true"
                onClick={(e) => props.handleMenuOpen(e, props.item)}>
                <MoreVertIcon/>
            </IconButton>
        );

    return null;
}

export default withContext(EditButton);