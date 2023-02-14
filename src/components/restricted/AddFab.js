import React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import SpeedDial from "@material-ui/lab/SpeedDial/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction/SpeedDialAction";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BookIcon from "@material-ui/icons/Book";
import ListIcon from "@material-ui/icons/List";
import {withContext} from "../generic";
import {generateUrl, HierarchyLevel} from "../../util/hierarchy";
import {FileCopy} from "@material-ui/icons";

class AddFab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.open !== this.state.open;
    }

    render() {
        const {session, navigate} = this.props;

        if (session)
            return (
                <ClickAwayListener onClickAway={this.handleClose}>
                    <div className="speedDialContainer">
                        <SpeedDial
                            ariaLabel="Erstellen"
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
                                onMouseDown={(e) => {
                                    navigate(e, "/create/publisher");
                                    this.handleClick();
                                }}
                            />
                            <SpeedDialAction
                                key="series"
                                icon={<ListIcon/>}
                                tooltipTitle="Serie"
                                tooltipOpen
                                onMouseDown={(e) => {
                                    navigate(e, "/create/series");
                                    this.handleClick();
                                }}
                            />
                            <SpeedDialAction
                                key="issue"
                                icon={<BookIcon/>}
                                tooltipTitle="Ausgabe"
                                tooltipOpen
                                onMouseDown={(e) => {
                                    navigate(e, "/create/issue");
                                    this.handleClick();
                                }}
                            />
                            {        this.props.level === HierarchyLevel.ISSUE ?
                                        <SpeedDialAction
                                            key="issue"
                                            icon={<FileCopy/>}
                                            tooltipTitle="Variant"
                                            tooltipOpen
                                            onMouseDown={(e) => {
                                                let selected = JSON.parse(JSON.stringify(this.props.selected));
                                                selected.issue.format = undefined;
                                                selected.issue.variant = undefined;

                                                navigate(e, "/copy" + generateUrl(selected, this.props.us));
                                                this.handleClick();
                                            }}
                                        /> : null
                            }
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