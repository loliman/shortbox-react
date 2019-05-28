import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";
import AppBar from "@material-ui/core/AppBar/AppBar";
import React from "react";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import {generateLabel, generateUrl, HierarchyLevel} from "../util/hierarchy";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import MenuIcon from "@material-ui/icons/Menu";
import {withContext} from "./generic";
import IconButton from "@material-ui/core/IconButton";
import {search} from "../graphql/queries";
import AutoComplete from "./generic/AutoComplete";
import {Form, Formik} from "formik";
import SearchIcon from '@material-ui/icons/Search';

function TopBar(props) {
    const {drawerOpen, toogleDrawer, us, history, mobile, mobileLandscape, tablet, tabletLandscape} = props;

    return (
        <AppBar position="sticky" id="header">
            <Toolbar id="toolbar">
                <div id="headerSearch">
                    <Formik initialValues={{pattern: ""}}
                            onSubmit={false}>
                        {({values, setFieldValue}) => {
                            return (
                                <Form>
                                    <AutoComplete
                                        query={search}
                                        liveSearch
                                        name="pattern"
                                        placeholder={mobile || (tablet && !tabletLandscape) ? " " : "Suchen"}
                                        variant="outlined"
                                        variables={{pattern: values.pattern, us: us}}
                                        onChange={(node, live) => {
                                            if(!node)
                                                return;

                                            if(live)
                                                setFieldValue("pattern", node);
                                            else {
                                                setFieldValue("pattern", "");
                                                window.focus();
                                                if (document.activeElement) {
                                                    document.activeElement.blur();
                                                }
                                                history.push(node.url, us);
                                            }

                                        }}
                                        dropdownIcon={<SearchIcon />}
                                        style={{
                                            width: "100%"
                                        }}
                                        generateLabel={(node) => getNodeType(node) + node.label}
                                    />
                                </Form>
                            );
                        }}
                    </Formik>
                </div>

                <div id="headerLeft">
                    <IconButton
                        color="inherit"
                        onClick={() => toogleDrawer()}
                        className="menuButton"
                    >
                        <MenuIcon />
                    </IconButton>

                    <img onClick={() => props.history.push("/")}
                         id="logo" src="/android-icon-192x192.png" alt="Shortbox" height="40"/>
                    <Typography variant="h6" color="inherit" className="appTitle" noWrap>
                        {
                            (mobile && !mobileLandscape) ?
                                <BreadCrumbMenu {...props} /> :
                                <BreadCrumbMenuMobile {...props} />
                        }
                    </Typography>
                </div>

                <div id="headerRight">
                    <FormControlLabel
                        id="us"
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

function getNodeType(node) {
    switch (node.type) {
        case "Publisher":
            return "!!Verlag!!";
        case "Series":
            return "!!Serie!!";
        default:
            return "!!Ausgabe!!";
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


export default withContext(TopBar);