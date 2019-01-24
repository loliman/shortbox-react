import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import {Query} from "react-apollo";
import {generateLabel, generateUrl, getHierarchyLevelFromUrl, getSelected, HierarchyLevel} from "../util/util";
import {getListQuery} from '../graphql/queries'
import {QueryResult} from './generic/QueryResult';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import {EditButton} from "./admin/Admin";
import {AppContext} from "./generic/AppContext";
import Typography from "@material-ui/core/es/Typography/Typography";
import {Link, withRouter} from "react-router-dom";
import {ScrollContainer} from "react-router-scroll-4";

function List(props) {
    return (
        <AppContext.Consumer>
            {({context, toogleDrawer}) => (
                <ListContainer us={props.match.url.indexOf("/us") === 0}
                               selected={getSelected(props.match.url)}
                               history={props.history}
                               match={props.match}
                               context={context}
                               handleMenuOpen={props.handleMenuOpen}
                               anchorEl={props.editMenuAnchorEl}
                               toogleDrawer={toogleDrawer}/>
            )}
        </AppContext.Consumer>
    )
}

class ListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollKey: "listContainer-" + new Date().getTime()
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.us !== this.props.us)
            return true;

        if (nextProps.context.drawerOpen !== this.props.context.drawerOpen)
            return true;

        return (nextProps.selected.length !== this.props.selected.length);
    }

    render() {
        const {drawerOpen} = this.props.context;
        const {us, selected, toogleDrawer} = this.props;

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
                onClose={() => toogleDrawer}
                onOpen={() => toogleDrawer}
                className="drawer"
                id="drawer">

                <ScrollContainer scrollKey={this.state.scrollKey}>
                    <MuiList id="list">
                        <Query query={getListQuery(selected)}
                               variables={variables}>
                            {({loading, error, data}) => {
                                if (loading || error)
                                    return <QueryResult loading={loading} error={error}/>;

                                let level = getHierarchyLevelFromUrl(selected);
                                if (level.indexOf("issue_details") !== -1)
                                    level = HierarchyLevel.ISSUE;

                                if (data[level].length === 0)
                                    return (
                                        <React.Fragment>
                                            <div className="queryResult">
                                                <Typography className="queryResultText">Keine Einträge</Typography>
                                            </div>
                                        </React.Fragment>);

                                let list = data[level].map((i) => {
                                    return <TypeListEntry anchorEl={this.props.anchorEl}
                                                          selected={selected}
                                                          us={us}
                                                          handleMenuOpen={this.props.handleMenuOpen}
                                                          key={i.id} item={i}/>
                                });

                                return list;
                            }}
                        </Query>
                    </MuiList>
                </ScrollContainer>
            </SwipeableDrawer>
        );
    }
}

function TypeListEntry(props) {
    return (
        <div id={props.item.id} className="itemContainer">
            <ListItem component={Link}
                      to={generateUrl(props.item, props.us)}
                      button>
                <ListItemText className="itemText"
                              primary={generateLabel(props.item)}
                />
            </ListItem>

            <EditButton handleMenuOpen={props.handleMenuOpen} item={props.item}/>
        </div>
    );
}

export default withRouter(List);