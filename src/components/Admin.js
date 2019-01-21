import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import SpeedDial from "@material-ui/lab/SpeedDial/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction/SpeedDialAction";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ListIcon from "@material-ui/icons/List";
import BookIcon from "@material-ui/icons/Book";
import React from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import Typography from "@material-ui/core/es/Typography/Typography";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {AppContext} from "./AppContext";
import DeletionDialog from "./DeletionDialog";

class AddFab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {
        return (
            <AppContext.Consumer>
                {({context}) => {
                    if (context.session)
                        return (
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <div className="speedDialContainer">
                                    <SpeedDial
                                        ariaLabel="Anlegen"
                                        className="speedDial"
                                        icon={<SpeedDialIcon/>}
                                        onBlur={this.handleClose}
                                        onClick={this.handleClick}
                                        onClose={this.handleClose}
                                        open={this.state.open}
                                    >
                                        <SpeedDialAction
                                            key="publisher"
                                            icon={<AccountBalanceIcon/>}
                                            tooltipTitle="Verlag"
                                            tooltipOpen
                                            onClick={this.handleClick}
                                        />
                                        <SpeedDialAction
                                            key="series"
                                            icon={<ListIcon/>}
                                            tooltipTitle="Serie"
                                            tooltipOpen
                                            onClick={this.handleClick}
                                        />
                                        <SpeedDialAction
                                            key="issue"
                                            icon={<BookIcon/>}
                                            tooltipTitle="Ausgabe"
                                            tooltipOpen
                                            onClick={this.handleClick}
                                        />
                                    </SpeedDial>
                                </div>
                            </ClickAwayListener>
                        )
                }}
            </AppContext.Consumer>
        )
    }

    handleClick = () => {
        this.setState(state => ({
            open: !state.open,
        }));
    };

    handleClose = () => {
        this.setState(state => ({
            open: false,
        }));
    };
}

function EditButton(props) {
    return (
        <AppContext.Consumer>
            {({context}) => {
                if (context.session)
                    return (
                        <IconButton
                            className="itemMenuButton"
                            aria-label="More"
                            aria-owns={Boolean(props.anchorEl) ? 'long-menu' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => props.handleMenuOpen(e, props.item)}>
                            <MoreVertIcon/>
                        </IconButton>
                    )
            }}
        </AppContext.Consumer>
    )
}

class EditMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDeletionClose = this.handleDeletionClose.bind(this);

        this.state = {
            deletionOpen: false
        }
    }

    render(props) {
        return (
            <AppContext.Consumer>
                {({context}) => {
                    if (context.session)
                        return (
                            <ClickAwayListener onClickAway={this.props.handleClose}>
                                <div>
                                    <Menu
                                        id="long-menu"
                                        anchorEl={this.props.editMenu.anchorEl}
                                        open={this.props.editMenu.anchorEl !== null}
                                        onClose={() => this.props.handleClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: 48 * 4.5,
                                                width: 200,
                                            },
                                        }}
                                    >
                                        <MenuItem key="edit" onClick={() => this.handleEdit()}>
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

                                    <DeletionDialog context={context}
                                                    handleClose={this.handleDeletionClose}
                                                    open={this.state.deletionOpen}
                                                    item={this.props.editMenu.item}/>
                                </div>
                            </ClickAwayListener>
                        )
                }}
            </AppContext.Consumer>
        );
    }

    handleDelete() {
        this.setState({
            deletionOpen: true
        });

        this.props.handleClose();
    }

    handleEdit() {
        this.props.handleClose();
    }

    handleDeletionClose() {
        this.setState({
            deletionOpen: false
        })
    };
}

export {AddFab, EditButton, EditMenu};