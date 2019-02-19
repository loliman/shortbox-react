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
import Hamburger from 'react-hamburgers';
import Link from "react-router-dom/es/Link";
import {withContext} from "./generic";

function TopBar(props) {
    const {drawerOpen, toogleDrawer, us, history, session, mobile} = props;

    return (
        <AppBar position="fixed" className="appBar">
            <Toolbar>
                <Hamburger
                    active={drawerOpen}
                    type="slider"
                    onClick={() => toogleDrawer()}/>
                <Typography variant="h6" color="inherit" className="appTitle" noWrap>
                    {
                        mobile ?
                            <BreadCrumbMenu {...props} /> :
                            <BreadCrumbMenuMobile {...props} />
                    }
                </Typography>
                <div className="grow"/>
                <div>
                    <FormControlLabel
                        className="switch"
                        control={
                            <Tooltip title={"Wechseln zu " + (us ? "Deutsch" : "US")}>
                                <Switch
                                    checked={us}
                                    onChange={() => {
                                        history.push(us ? "/de" : "/us");
                                        if(!drawerOpen)
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
                    <BreadCrumbLink to={generateUrl(selected.issue.series, us)}
                                    label={<KeyboardArrowLeftIcon className="navArrow navArrowLeft"/>} {...props}/>
                    <BreadCrumbLabel label={generateLabel(selected.issue)}/>
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
                    <BreadCrumbLink to={us ? "/us" : "/de"} label="Shortbox" {...props}/>
                    <KeyboardArrowRightIcon className="navArrow"/>
                    <BreadCrumbLink to={generateUrl(selected.issue.series, us)}
                                    label={generateLabel(selected.issue.series)}
                                    {...props}/>
                    <KeyboardArrowRightIcon className="navArrow"/>
                    <BreadCrumbLabel label={generateLabel(selected.issue)}/>
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
                      if (!props.drawerOpen)
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
                  onError={() => enqueueSnackbar("Logout fehlgeschlagen", {variant: 'error'})}
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