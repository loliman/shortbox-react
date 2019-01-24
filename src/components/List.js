import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Query} from "react-apollo";
import {
    generateLabel,
    generateUrl,
    getHierarchyLevel,
    getHierarchyLevelFromUrl,
    getSelected,
    HierarchyLevel
} from "../util/util";
import {getListQuery} from '../graphql/queries'
import {QueryResult} from './generic/QueryResult';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import {EditButton} from "./admin/Admin";
import {AppContext} from "./generic/AppContext";
import Typography from "@material-ui/core/es/Typography/Typography";
import {withRouter} from "react-router-dom";
import {Link} from 'react-router-dom';

function List(props) {
    return (
        <AppContext.Consumer>
            {({context, handleNavigation, handleScroll, handleDrawerOpen}) => (
                <ListContainer us={props.match.url.indexOf("/us") === 0}
                               selected={getSelected(props.match.url)}
                               history={props.history}


                               context={context}
                               onNavigation={handleNavigation}
                               handleScroll={handleScroll}
                               handleMenuOpen={props.handleMenuOpen}
                               anchorEl={props.editMenuAnchorEl}
                               handleDrawerOpen={handleDrawerOpen}/>
            )}
        </AppContext.Consumer>
    )
}

class ListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            highlight: -1
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.selected.length !== this.props.selected.length;
        /*
        let beforeLevel = getHierarchyLevel(this.props.context.selected);
        let afterLevel = getHierarchyLevel(nextProps.context.selected);
        let beforeIsIssue = beforeLevel.indexOf("issue_details") !== -1;
        let afterIsIssue = afterLevel.indexOf("issue_details") !== -1;
        let beforeAnchor = this.props.anchorEl !== null;
        let afterAnchor = nextProps.anchorEl !== null;
        let drawerChangedState = nextProps.context.drawerOpen !== this.props.context.drawerOpen;
        if (beforeIsIssue || afterIsIssue) {
            if (beforeIsIssue && afterIsIssue)
                return beforeLevel !== afterLevel || drawerChangedState;
            else
                return true;
        } else if ((beforeAnchor && !afterAnchor) || (!beforeAnchor && afterAnchor))
            return true;
        else
            return nextProps.context.selected !== this.props.context.selected ||
                nextProps.context.drawerOpen !== this.props.context.drawerOpen ||
                nextProps.context.edit !== this.props.context.edit ||
                nextState.highlight !== this.state.highlight;*/
    }

    /*componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.highlight !== this.state.highlight)
            return;

        let back = prevProps.context.lastSelected.length > this.props.context.lastSelected.length;
        let drawer = document.getElementById("drawer");

        if (drawer) {
            let drawerScrollEl = drawer.children[1];

            if (back) {
                let el = prevProps.context.lastSelected[prevProps.context.lastSelected.length - 1];
                drawerScrollEl.scrollTop = el.drawerScrollTop;
                this.setState(() => ({
                    highlight: el.highlight
                }));
            } else if (getHierarchyLevel(this.props.context.selected).indexOf("issue_details") === -1 && !this.props.context.edit)
                drawerScrollEl.scrollTop = 0;
        }
    }*/

    render() {
        const {drawerOpen, edit} = this.props.context;
        console.log(this.props);
        const {us, selected, history} = this.props;

     //   let id = selected ? (selected.series ? parseInt(selected.series.id) : parseInt(selected.id)) : null;
        const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

        let variables = {
            us: us,
            publisher_name: selected.length >= 1 ? selected[0] : null,
            series_title: selected.length >= 2 ? selected[1].substring(0, selected[1].indexOf("_")) : null,
            series_volume: selected.length >= 2 ? parseInt(selected[1].substring(selected[1].lastIndexOf("_")+1, selected[1].length)) : null
        };

        return (
            <SwipeableDrawer
                disableBackdropTransition={true} disableDiscovery={iOS}
                open={drawerOpen}
                onClose={() => this.props.handleDrawerOpen()}
                onOpen={() => this.props.handleDrawerOpen()}
                className="drawer"
                id="drawer">

                <MuiList id="list">
                    <Query query={getListQuery(selected)}
                           variables={variables}>
                        {({loading, error, data}) => {
                            if (loading || error)
                                return <QueryResult loading={loading} error={error}/>;

                            let level = getHierarchyLevelFromUrl(selected);
                            if (level.indexOf("issue_details") !== -1)
                                level = HierarchyLevel.ISSUE;

                            let backKey = null;
                            if (getHierarchyLevelFromUrl(selected) !== HierarchyLevel.PUBLISHER)
                                backKey =(
                                    <TypeListBack key="0"
                                                  onClick={history.goBack} />
                                );

                            if (data[level].length === 0)
                                return (
                                    <React.Fragment>
                                        {backKey}
                                        <div className="queryResult">
                                            <Typography className="queryResultText">Keine Einträge</Typography>
                                        </div>
                                    </React.Fragment>);

                            let list = data[level].map((i) => {
                                let selectedProp;
                      /*          if(edit)
                                    selectedProp = edit.id === i.id;
                                if (!selectedProp && this.state.highlight && this.state.highlight !== -1)
                                    selectedProp = this.state.highlight === i.id;
                                if (!selectedProp && selected && selected.series)
                                    selectedProp = selected.id === i.id;*/

                                return <TypeListEntry anchorEl={this.props.anchorEl}
                                                      handleMenuOpen={this.props.handleMenuOpen}
                                                      key={i.id} item={i}
                                                      selected={selectedProp} />
                            });

                            if (getHierarchyLevelFromUrl(selected) !== HierarchyLevel.PUBLISHER)
                                list.unshift(backKey);

                            return list;
                        }}
                    </Query>
                </MuiList>
            </SwipeableDrawer>
        );
    }
}

function TypeListEntry(props) {
    return (
        <div id={props.item.id} className="itemContainer">
            <ListItem component={Link}
                      to={generateUrl(props.item)}
                      button>
                <ListItemText className={props.selected ? "itemText selected" : "itemText"}
                    primary={generateLabel(props.item)}
                />
            </ListItem>

            <EditButton handleMenuOpen={props.handleMenuOpen} item={props.item}/>
        </div>
    );
}

function TypeListBack(props) {
    return (
        <div className="itemContainer sticky">
            <ListItem button divider
                      onClick={props.onClick}>
                <ListItemIcon><ArrowBackIcon/></ListItemIcon>
            </ListItem>
        </div>
    );
}

export default withRouter(List);