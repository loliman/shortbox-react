import React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import SpeedDial from "@material-ui/lab/SpeedDial/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction/SpeedDialAction";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BookIcon from "@material-ui/icons/Book";
import ListIcon from "@material-ui/icons/List";
import {withContext} from "../generic";

class AddFab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {
        const {session, us, history} = this.props;

        if (session && !us)
            return (
                <ClickAwayListener onClickAway={this.handleClose}>
                    <div className="speedDialContainer">
                        <SpeedDial
                            ariaLabel="Anlegen"
                            className="speedDial"
                            icon={<SpeedDialIcon/>}
                            onClick={this.handleClick}

                            open={this.state.open}
                        >
                            <SpeedDialAction
                                key="publisher"
                                icon={<AccountBalanceIcon/>}
                                tooltipTitle="Verlag"
                                tooltipOpen
                                onClick={() => {
                                    history.push("/create/publisher");
                                    this.handleClick();
                                }}
                            />
                            <SpeedDialAction
                                key="series"
                                icon={<ListIcon/>}
                                tooltipTitle="Serie"
                                tooltipOpen
                                onClick={() => {
                                    history.push("/create/series");
                                    this.handleClick();
                                }}
                            />
                            <SpeedDialAction
                                key="issue"
                                icon={<BookIcon/>}
                                tooltipTitle="Ausgabe"
                                tooltipOpen
                                onClick={() => {
                                    history.push("/create/issue");
                                    this.handleClick();
                                }}
                            />
                        </SpeedDial>
                    </div>
                </ClickAwayListener>
            );
        else
            return null;
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

export default withContext(AddFab);