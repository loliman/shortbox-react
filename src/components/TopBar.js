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
import SearchBar from "./SearchBar";
import FilterListIcon from '@material-ui/icons/FilterList';

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchbarFocus: false
        };
    }

    render() {
        const {toogleDrawer, us, mobile, mobileLandscape, tablet, tabletLandscape} = this.props;

        let isFilter;
        if(this.props.query && this.props.query.filter)
            isFilter = this.props.query.filter;

        return (
            <AppBar position="sticky" id="header">
                <Toolbar id="toolbar" className={(mobile || (tablet && !tabletLandscape)) && this.state.searchbarFocus ? "headerSearchFocusedToolbar" : ""}>
                    <SearchBar focus={this.state.searchbarFocus} onFocus={this.onFocus}/>

                    <div id="headerLeft">
                        <IconButton
                            color="inherit"
                            onClick={() => toogleDrawer()}
                            className="menuButton"
                        >
                            <MenuIcon />
                        </IconButton>

                        <img onClick={() => this.props.navigate("/", {filter: null})}
                             id="logo" src="/android-icon-192x192.png" alt="Shortbox" height="40"/>
                        <Typography variant="h6" color="inherit" className="appTitle" noWrap>
                            {
                                (mobile && !mobileLandscape) ?
                                    <BreadCrumbMenu {...this.props} /> :
                                    <BreadCrumbMenuMobile {...this.props} />
                            }
                        </Typography>
                    </div>

                    <div id="headerRight">
                        <Tooltip title={isFilter ? "Filter aktiv" : "Filtern"}>
                            <IconButton
                                color={isFilter ? "secondary" : "inherit"}
                                onClick={() => this.props.navigate(us ? "/filter/us" : "/filter/de")}
                                id="filterIcon"
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>

                        <FormControlLabel
                            id="us"
                            className="switch"
                            label={"US"}
                            control={
                                <Tooltip title={"Wechseln zu " + (us ? "Deutsch" : "US")}>
                                    <Switch
                                        checked={us}
                                        onChange={() => this.props.navigate(us ? "/de" : "/us", {filter: null})}
                                        color="secondary"/>
                                </Tooltip>
                            }
                        />
                    </div>
                </Toolbar>

                {
                    (mobile || (tablet && !tabletLandscape)) ? <div id="searchOverlay" className={this.state.searchbarFocus ? "" : "searchOverlayHidden"} onClick={(e) => this.onFocus(e, false)}/> : null
                }
            </AppBar>
        );
    }

    onFocus = (e, focus) => {
        this.setState({searchbarFocus: focus});
        if(e) e.preventDefault();
    }
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
                      props.navigate(props.to);
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