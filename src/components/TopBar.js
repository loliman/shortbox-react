import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";
import AppBar from "@material-ui/core/AppBar/AppBar";
import React from "react";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Button from "@material-ui/core/es/Button/Button";
import LoginDialog from "./admin/LoginDialog";
import {Mutation} from "react-apollo";
import {logout} from "../graphql/mutations";
import {generateLabel, getHierarchyLevel, HierarchyLevel} from "../util/util";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {AppContext} from "./generic/AppContext";
import {withSnackbar} from "notistack";
import Hamburger from 'react-hamburgers';

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loginOpen: false
        };
    }

    render() {
        return (
            <AppContext.Consumer>
                {({context, handleLogout, toogleUs, handleDrawerOpen}) => (
                    <AppBar position="fixed" className="appBar">
                        <Toolbar>
                            <Hamburger
                                active={context.drawerOpen}
                                type="slider"
                                onClick={() => handleDrawerOpen()}/>
                            <Typography variant="h6" color="inherit" className="appTitle" noWrap>
                                {this.generateHeader(context)}
                            </Typography>
                            <div className="grow"/>
                            <div>
                                <FormControlLabel
                                    className="switch"
                                    control={
                                        <Tooltip title={"Wechseln zu " + (!context.us ? "US" : "Deutsch")}>
                                            <Switch
                                                checked={context.us}
                                                onChange={toogleUs}
                                                color="secondary"
                                            />
                                        </Tooltip>
                                    }
                                    label="US"
                                />

                                {
                                    !context.session
                                        ?
                                        <Button color="secondary" onClick={() => this.handleLoginOpen()}>
                                            Login
                                        </Button>
                                        :
                                        <Mutation mutation={logout}
                                                  onCompleted={(data) => {
                                                      if (!data.logout)
                                                          this.props.enqueueSnackbar("Logout fehlgeschlagen", {variant: 'error'});
                                                      else
                                                          handleLogout()
                                                  }}
                                                  onError={() => this.props.enqueueSnackbar("Logout fehlgeschlagen", {variant: 'error'})}
                                                  ignoreResults>
                                            {(logout) => (
                                                <Button color="secondary" onClick={() => {
                                                    logout({
                                                        variables: {
                                                            id: parseInt(context.session.id),
                                                            sessionid: context.session.sessionid
                                                        }
                                                    })
                                                }}>
                                                    Logout
                                                </Button>
                                            )}
                                        </Mutation>
                                }

                                <LoginDialog handleClose={this.handleLoginClose} handleLogin={this.handleLogin}
                                             open={this.state.loginOpen}/>
                            </div>
                        </Toolbar>
                    </AppBar>
                )}
            </AppContext.Consumer>
        );
    }

    handleLogin = (user, handleLogin) => {
        this.setState({
            loginOpen: false
        });

        handleLogin(user);
    };

    handleLoginOpen = () => {
        this.setState({
            loginOpen: true
        })
    };

    handleLoginClose = () => {
        this.setState({
            loginOpen: false
        })
    };

    generateHeader(context) {
        switch (getHierarchyLevel(context.selected)) {
            case HierarchyLevel.SERIES:
                return <span>{generateLabel(context.selected)}</span>;
            case HierarchyLevel.ISSUE:
                return (
                    <React.Fragment>
                        <span>{generateLabel(context.selected.publisher)}</span>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <span>{generateLabel(context.selected)}</span>
                    </React.Fragment>
                );
            case HierarchyLevel.ISSUE_DETAILS:
            case HierarchyLevel.ISSUE_DETAILS_US:
                return (
                    <React.Fragment>
                        <span>{generateLabel(context.selected.series.publisher)}</span>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <span>{generateLabel(context.selected.series)}</span>
                    </React.Fragment>
                );
            case HierarchyLevel.PUBLISHER:
            default:
                return <span>{'Shortbox'}</span>;
        }
    }
}

export default withSnackbar(TopBar);