import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import {withContext} from "../generic";
import Dropdown from "./Dropdown";

class EditButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            EditDropdown: {
                anchorEl: null,
                item: null
            }
        };
    }

    render() {
        if (this.props.session)
            return (
                <div className="editButton">
                    <IconButton
                        className="itemMenuButton"
                        aria-label="More"
                        aria-owns={Boolean(this.props.anchorEl) ? 'long-menu' : undefined}
                        aria-haspopup="true"
                        onMouseDown={(e) => this.handleEditDropdownOpen(e, this.props.item)}>
                        <MoreVertIcon/>
                    </IconButton>
                    <Dropdown EditDropdown={this.state.EditDropdown}
                              handleOpen={this.handleEditDropdownOpen}
                              handleClose={this.handleEditDropdownClose}/>
                </div>
            );

        return null;
    }

    handleEditDropdownOpen = (e, item) => {
        this.setState({
            EditDropdown: {
                anchorEl: e.currentTarget,
                item: item
            }
        });
    };

    handleEditDropdownClose = () => {
        this.setState({
            EditDropdown: {
                anchorEl: null,
                item: this.state.EditDropdown.item
            }
        });
    };
}

export default withContext(EditButton);