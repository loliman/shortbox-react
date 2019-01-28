import React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {generateUrl} from "../../../util/hierarchiy";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/es/Typography/Typography";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import DeletionDialog from "../DeletionDialog";
import {withContext} from "../../generic";

class EditDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deletionOpen: false
        }
    }

    render() {
        if(!this.props.EditDropdown.item || !this.props.session)
            return null;

        return (
            <ClickAwayListener onClickAway={this.props.handleClose}>
                <div>
                    <Menu
                        id="long-menu"
                        anchorEl={this.props.EditDropdown.anchorEl}
                        open={this.props.EditDropdown.anchorEl !== null}
                        onClose={() => this.props.handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: 200,
                            },
                        }}>
                        <MenuItem key="edit"
                                  onClick={() => {
                                      this.props.history.push("/edit" + generateUrl(this.props.EditDropdown.item).substring(3));
                                      this.props.handleClose();
                                  }}>
                            <ListItemIcon>
                                <EditIcon/>
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                Bearbeiten
                            </Typography>
                        </MenuItem>

                        <MenuItem key="delete" onClick={() => this.handleDelete()}>
                            <ListItemIcon>
                                <DeleteIcon/>
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                Löschen
                            </Typography>
                        </MenuItem>
                    </Menu>

                    <DeletionDialog handleClose={this.handleDeletionClose}
                                    open={this.state.deletionOpen}
                                    item={this.props.EditDropdown.item}/>
                </div>
            </ClickAwayListener>
        );
    }

    handleDelete = () => {
        this.setState({
            deletionOpen: true
        });

        this.props.handleClose();
    };

    handleDeletionClose = () => {
        this.setState({
            deletionOpen: false
        })
    };
}

export default withContext(EditDropdown);