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
import {generateLabel, generateUrl, getHierarchyLevelFromUrl, getSelected, HierarchyLevel} from "../util/util";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {AppContext} from "./generic/AppContext";
import {withSnackbar} from "notistack";
import Hamburger from 'react-hamburgers';
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Link from "react-router-dom/es/Link";

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loginOpen: false
        };
    }

    render() {
        let us = this.props.match.url.indexOf("/us") === 0;

        return (
            <AppContext.Consumer>
                {({context, handleLogout, toogleDrawer}) => (
                    <AppBar position="fixed" className="appBar">
                        <Toolbar>
                            <Hamburger
                                active={context.drawerOpen}
                                type="slider"
                                onClick={() => toogleDrawer()}/>
                            <Typography variant="h6" color="inherit" className="appTitle" noWrap>
                                {this.generateHeader(context.drawerOpen, toogleDrawer)}
                            </Typography>
                            <div className="grow"/>
                            <div>
                                <FormControlLabel
                                    className="switch"
                                    control={
                                        <Tooltip title={"Wechseln zu " + (us ? "Deutsch" : "US")}>
                                            <Switch
                                                checked={us}
                                                onChange={() => this.props.history.push(us ? "/" : "/us")}
                                                color="secondary"/>
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

    generateHeader(drawerOpen, toogleDrawer) {
        let selected = getSelected(this.props.match.url);
        let us = this.props.match.url.indexOf("/us") === 0;

        switch (getHierarchyLevelFromUrl(selected)) {
            case HierarchyLevel.SERIES:
                return (
                    <React.Fragment>
                        <Link to={us ? "/us" : "/"} onClick={() => {
                            if (!drawerOpen) toogleDrawer()
                        }}>{"Shortbox"}</Link>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <span>{generateLabel({name: selected[0]})}</span>
                    </React.Fragment>
                );
            case HierarchyLevel.ISSUE:
            case HierarchyLevel.ISSUE_DETAILS:
            case HierarchyLevel.ISSUE_DETAILS_US:
                return (
                    <React.Fragment>
                        <Link to={us ? "/us" : "/"} onClick={() => {
                            if (!drawerOpen) toogleDrawer()
                        }}>{"Shortbox"}</Link>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <Link to={generateUrl({name: selected[0]}, us)} onClick={() => {
                            if (!drawerOpen) toogleDrawer()
                        }}>
                            {generateLabel({name: selected[0]})}
                        </Link>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <span>
                            {generateLabel({
                                title: selected[1].substring(0, selected[1].indexOf("_")),
                                volume: parseInt(selected[1].substring(selected[1].lastIndexOf("_") + 1)),
                            })}
                        </span>
                    </React.Fragment>
                );
            case HierarchyLevel.PUBLISHER:
            default:
                return <span>{"Shortbox"}</span>;
        }
    }
}

export default compose(
    withSnackbar,
    withRouter)(TopBar);