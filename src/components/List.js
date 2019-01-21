import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Query} from "react-apollo";
import {generateLabel, getHierarchyLevel, HierarchyLevel} from "../util/util";
import {getListQuery} from '../graphql/queries'
import {QueryResult} from './generic/QueryResult';
import Drawer from "@material-ui/core/Drawer/Drawer";
import {EditButton} from "./admin/Admin";
import {AppContext} from "./generic/AppContext";
import Typography from "@material-ui/core/es/Typography/Typography";

export function List(props) {
    return (
        <AppContext.Consumer>
            {({context, handleNavigation}) => (
                <ListContainer context={context}
                               onNavigation={handleNavigation}
                               handleMenuOpen={props.handleMenuOpen}
                               anchorEl={props.editMenuAnchorEl}/>
            )}
        </AppContext.Consumer>
    )
}

class ListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollToId: 0
        }
    }

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
                nextProps.context.drawerOpen !== this.props.context.drawerOpen ||
                nextProps.context.edit !== this.props.context.edit;
    }

    componentDidUpdate() {
        if(this.state.scrollToId && this.state.scrollToId > 0) {
            //daaaaaamn this is ugly
            let el = document.getElementById(this.state.scrollToId);

            if(el && el.previousSibling && el.previousSibling.previousSibling) {
                el = el.previousSibling.previousSibling;
                el.scrollIntoView();
            }

            this.setState(() => ({
                scrollToId: 0
            }));
        }
    }

    render() {
        const {selected, us, drawerOpen, edit} = this.props.context;

        let id = selected ? (selected.series ? parseInt(selected.series.id) : parseInt(selected.id)) : null;

        return (
            <Drawer
                open={drawerOpen}
                variant="persistent"
                className="drawer">
                <div className="toolbar"/>

                <MuiList>
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

                            if (data[level].length === 0)
                                return (
                                    <React.Fragment>
                                        <TypeListBack key="0"
                                                      item={selected.series ? selected.series.publisher : selected.publisher}
                                                      onClick={this.props.onNavigation}/>
                                        <div className="queryResult">
                                            <Typography className="queryResultText">Keine Einträge</Typography>
                                        </div>
                                    </React.Fragment>);

                            let list = data[level].map((i) => {
                                let selectedProp;
                                if(edit)
                                    selectedProp = edit.id === i.id;
                                if(!selectedProp && this.state.scrollToId && this.state.scrollToId !== 0)
                                    selectedProp = this.state.scrollToId === i.id;
                                if(!selectedProp && selected)
                                    selectedProp = selected.id === i.id;

                                return <TypeListEntry anchorEl={this.props.anchorEl}
                                                      handleMenuOpen={this.props.handleMenuOpen}
                                                      key={i.id} item={i}
                                                      onClick={this.handleNavigation}
                                                      selected={selectedProp} />
                            });

                            if (getHierarchyLevel(selected) !== HierarchyLevel.PUBLISHER)
                                list.unshift(
                                    <TypeListBack key="0"
                                                  item={selected.series ? selected.series.publisher : selected.publisher}
                                                  onClick={this.handleBack}/>
                                );


                            return list;
                        }}
                    </Query>
                </MuiList>
            </Drawer>
        );
    }

    handleNavigation = (e) => {
        this.setState({
            scrollToId: e.id
        });

        this.props.onNavigation(e);
    };

    handleBack = (e) => {
        let level = getHierarchyLevel(this.props.context.selected);
        this.setState({
            scrollToId: level.indexOf("issue_details") !== -1 ?
                this.props.context.selected.series.id :
                this.props.context.selected.id
        });

        this.props.onNavigation(e);
    }
}

function TypeListEntry(props) {
    return (
        <div id={props.item.id} className="itemContainer">
            <ListItem button
                      onClick={() => props.onClick(props.item)}>
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
        <div className="itemContainer">
        <ListItem button divider
                  onClick={() => props.onClick(props.item)}>
            <ListItemIcon>
                <ArrowBackIcon/>
            </ListItemIcon>
        </ListItem>
        </div>
    );
}