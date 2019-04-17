import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";
import AppBar from "@material-ui/core/AppBar/AppBar";
import React from "react";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Button from "@material-ui/core/es/Button/Button";
import {Mutation} from "react-apollo";
import {logout} from "../graphql/mutations";
import {generateLabel, generateUrl, HierarchyLevel} from "../util/hierarchy";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import MenuIcon from "@material-ui/icons/Menu";
import Hamburger from 'react-hamburgers';
import Link from "react-router-dom/es/Link";
import {withContext} from "./generic";
import IconButton from "@material-ui/core/IconButton";

function TopBar(props) {
    const {drawerOpen, toogleDrawer, us, history, session, mobile, mobileLandscape} = props;

    let isIE = /*@cc_on!@*/false || !!document.documentMode;

    return (
        <AppBar position="sticky" id="header">
            <Toolbar>
                {
                    isIE ?
                        <IconButton
                            color="inherit"
                            onClick={() => toogleDrawer()}
                            className="menuButton"
                        >
                            <MenuIcon />
                        </IconButton> :
                        <Hamburger
                            active={drawerOpen}
                            type="slider"
                            onClick={() => toogleDrawer()}/>
                }

                <Typography variant="h6" color="inherit" className="appTitle" noWrap>
                    {
                        (mobile && !mobileLandscape) ?
                            <BreadCrumbMenu {...props} /> :
                            <BreadCrumbMenuMobile {...props} />
                    }
                </Typography>
                <div className="grow"/>
                <div id="headerRight">
                    <FormControlLabel
                        className="switch"
                        control={
                            <Tooltip title={"Wechseln zu " + (us ? "Deutsch" : "US")}>
                                <Switch
                                    checked={us}
                                    onChange={() => {
                                        history.push(us ? "/de" : "/us");
                                        if(!drawerOpen && (!mobile || mobileLandscape))
                                            toogleDrawer();
                                    }}
                                    color="secondary"/>
                            </Tooltip>
                        }
                        label="US"
                    />

                    {
                        !session ? <LogIn /> : <LogOut {...props}/>
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}

function BreadCrumbMenu(props) {
    const {selected, level, us} = props;

    switch (level) {
        case HierarchyLevel.ROOT:
            return <BreadCrumbLink to={us ? "/us" : "/de"} label="Shortbox" {...props}/>;
        case HierarchyLevel.PUBLISHER:
            return (
                <React.Fragment>
                    <BreadCrumbLink to={us ? "/us" : "/de"}
                                    label={<KeyboardArrowLeftIcon className="navArrow navArrowLeft"/>} {...props}/>
                    <BreadCrumbLabel label={generateLabel(selected)}/>
                </React.Fragment>
            );
        case HierarchyLevel.SERIES:
            return (
                <React.Fragment>
                    <BreadCrumbLink to={generateUrl(selected.series, us)}
                                    label={<KeyboardArrowLeftIcon className="navArrow navArrowLeft"/>} {...props}/>
                    <BreadCrumbLabel label={generateLabel(selected)}/>
                </React.Fragment>
            );
        default:
            return (
                <React.Fragment>
                    <BreadCrumbLink to={generateUrl(selected.issue, us)}
                                    label={<KeyboardArrowLeftIcon className="navArrow navArrowLeft"/>} {...props}/>
                    <BreadCrumbLabel label={"#" + selected.issue.number}/>
                </React.Fragment>
            );
    }
}

function BreadCrumbMenuMobile(props) {
    const {selected, level, us} = props;

    switch (level) {
        case HierarchyLevel.ROOT:
            return <BreadCrumbLink to={us ? "/us" : "/de"} label="Shortbox" {...props}/>;
        case HierarchyLevel.PUBLISHER:
            return (
                <React.Fragment>
                    <BreadCrumbLink to={us ? "/us" : "/de"} label="Shortbox" {...props}/>
                    <KeyboardArrowRightIcon className="navArrow"/>
                    <BreadCrumbLabel label={generateLabel(selected)}/>
                </React.Fragment>
            );
        case HierarchyLevel.SERIES:
            return (
                <React.Fragment>
                    <BreadCrumbLink to={us ? "/us" : "/de"} label="Shortbox" {...props}/>
                    <KeyboardArrowRightIcon className="navArrow"/>
                    <BreadCrumbLink to={generateUrl(selected.series, us)}
                                    label={generateLabel(selected.series)}
                                    {...props}/>
                    <KeyboardArrowRightIcon className="navArrow"/>
                    <BreadCrumbLabel label={generateLabel(selected)}/>
                </React.Fragment>
            );
        default:
            return (
                <React.Fragment>
                    <React.Fragment>
                        <BreadCrumbLink to={us ? "/us" : "/de"} label="Shortbox" {...props}/>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <BreadCrumbLink to={generateUrl(selected.issue.series, us)}
                                        label={generateLabel(selected.issue.series)}
                                        {...props}/>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <BreadCrumbLink to={generateUrl(selected.issue, us)}
                                        label={generateLabel(selected.issue)}
                                        {...props}/>
                        <KeyboardArrowRightIcon className="navArrow"/>
                        <BreadCrumbLabel label={"#" + selected.issue.number}/>
                    </React.Fragment>
                </React.Fragment>
            );
    }
}

function BreadCrumbLink(props) {
    return (
        <React.Fragment>
            <span className="breadCrumbLink"
                  onClick={() => {
                      props.history.push(props.to);
                      if (!props.drawerOpen && (!props.mobile || props.mobileLandscape))
                          props.toogleDrawer();
                  }}>
                {props.label}
            </span>
        </React.Fragment>
    )
}

function BreadCrumbLabel(props) {
    return <span>{props.label}</span>;
}

function LogIn(props) {
    return (
        <Button color="secondary" component={Link}
                to="/login">
            Login
        </Button>
    );
}

function LogOut(props) {
    const {session, enqueueSnackbar, handleLogout} = props;

    return (
        <Mutation mutation={logout}
                  onCompleted={(data) => {
                      if (!data.logout)
                          enqueueSnackbar("Logout fehlgeschlagen", {variant: 'error'});
                      else {
                          enqueueSnackbar("Auf Wiedersehen!", {variant: 'success'});
                          handleLogout();
                      }
                  }}
                  onError={(errors) => enqueueSnackbar("Logout fehlgeschlagen [" + errors[0].message + "]", {variant: 'error'})}
                  ignoreResults>
            {(logout) => (
                <Button color="secondary" onClick={() => {
                    logout({
                        variables: {
                            user: {
                                id: parseInt(session.id),
                                sessionid: session.sessionid
                            }
                        }
                    })
                }}>
                    Logout
                </Button>
            )}
        </Mutation>
    );
}


export default withContext(TopBar);