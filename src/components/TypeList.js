import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Query} from "react-apollo";
import {generateLabel, getHierarchyLevel, HierarchyLevel} from "../util";
import {getListQuery} from '../queries'
import {QueryResult} from './QueryResult';
import Drawer from "@material-ui/core/Drawer/Drawer";
import {EditButton} from "./Admin";
import {AppContext} from "./AppContext";

export function TypeList(props) {
    return (
        <AppContext.Consumer>
            {({context, handleNavigation}) => (
                <TypeListMain context={context}
                              onNavigation={handleNavigation}
                              handleMenuOpen={props.handleMenuOpen}
                              anchorEl={props.editMenuAnchorEl}/>
            )}
        </AppContext.Consumer>
    )
}

class TypeListMain extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
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
                nextProps.context.us !== this.props.context.us ||
                nextProps.context.drawerOpen !== this.props.context.drawerOpen;
    }

    render() {
        const {selected, us, drawerOpen} = this.props.context;

        let id = selected ? (selected.series ? parseInt(selected.series.id) : parseInt(selected.id)) : null;

        return (
            <Drawer
                open={drawerOpen}
                variant="persistent"
                className="drawer">
                <div className="toolbar"/>

                <List>
                    <Query query={getListQuery(getHierarchyLevel(selected))}
                           variables={{
                               us: (!us ? false : true),
                               publisher_id: id,
                               series_id: id
                           }}>
                        {({loading, error, data}) => {
                            if (loading || error)
                                return <QueryResult loading={loading} error={error}/>;

                            let level = getHierarchyLevel(selected);
                            if (level.indexOf("issue_details") !== -1)
                                level = HierarchyLevel.ISSUE;

                            let list = data[level].map((i) =>
                                <TypeListEntry anchorEl={this.props.anchorEl}
                                               handleMenuOpen={this.props.handleMenuOpen}
                                               key={i.id} item={i}
                                               onClick={this.props.onNavigation}/>
                            );

                            if (getHierarchyLevel(selected) !== HierarchyLevel.PUBLISHER)
                                list.unshift(
                                    <TypeListBack key="0"
                                                  item={selected.series ? selected.series.publisher : selected.publisher}
                                                  onClick={this.props.onNavigation}/>
                                );


                            return list;
                        }}
                    </Query>
                </List>
            </Drawer>
        );
    }
}

function TypeListEntry(props) {
    return (
        <div className="itemContainer">
            <ListItem button
                      onClick={() => props.onClick(props.item)}>
                <ListItemText
                    primary={generateLabel(props.item)}
                />
            </ListItem>

            <EditButton handleMenuOpen={props.handleMenuOpen} item={props.item}/>
        </div>
    );
}

function TypeListBack(props) {
    return (
        <ListItem button divider
                  onClick={() => props.onClick(props.item)}>
            <ListItemIcon>
                <ArrowBackIcon/>
            </ListItemIcon>
        </ListItem>
    );
}