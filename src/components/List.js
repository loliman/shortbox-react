import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import {Query} from "react-apollo";
import {generateLabel, getGqlVariables} from "../util/util";
import {getListQuery} from '../graphql/queries'
import QueryResult from './generic/QueryResult';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import EditButton from "./restricted/EditButton";
import Typography from "@material-ui/core/es/Typography/Typography";
import {Link} from "react-router-dom";
import {ScrollContainer} from "react-router-scroll-4";
import {withContext} from "./generic";
import {generateUrl, HierarchyLevel} from "../util/hierarchiy";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollKey: "listContainer-" + new Date().getTime()
        };
    }

    render() {
        const {us, drawerOpen, toogleDrawer, mobile, handleMenuOpen, anchorEl} = this.props;
        let {selected, level} = this.props;

        if(this.props.match.url.indexOf("/edit") === 0) {
            switch (level) {
                case HierarchyLevel.PUBLISHER:
                    selected = null;
                    break;
                case HierarchyLevel.SERIES:
                    selected = selected.publisher;
                    break;
                default:
                    selected = selected.series;
                    break;
            }
        }

        if (level === HierarchyLevel.ISSUE_DETAILS)
            level = HierarchyLevel.ISSUE;

        return (
            <SwipeableDrawer
                disableDiscovery={true}
                variant={mobile ? 'temporary' : 'persistent'}
                open={drawerOpen}
                onClose={() => toogleDrawer()}
                onOpen={() => toogleDrawer()}
                className="drawer"
                id="drawer">
                <ScrollContainer scrollKey={this.state.scrollKey}>
                    <MuiList id="list">
                        <Query query={getListQuery(level)}
                               variables={getGqlVariables(selected, us)}>
                            {({loading, error, data}) => {
                                if (loading || error || !data[level])
                                    return <QueryResult loading={loading} error={error} />;

                                if (!data[level].length === 0)
                                    return <NoEntries />;

                                return data[level].map((i) => {
                                    return <TypeListEntry anchorEl={anchorEl}
                                                          {...this.props}
                                                          handleMenuOpen={handleMenuOpen}
                                                          key={i.id} item={i}/>
                                });
                            }}
                        </Query>
                    </MuiList>
                </ScrollContainer>
            </SwipeableDrawer>
        );
    }
}

function TypeListEntry(props) {
    const {us, item, level, mobile, toogleDrawer, handleMenuOpen} = props;

    return (
        <div id={item.id} className="itemContainer">
            <ListItem component={Link}
                      to={generateUrl(item, us)}
                      onClick={() => {
                          if(mobile && level === HierarchyLevel.ISSUE)
                              toogleDrawer();
                      }}
                      button>
                <ListItemText className="itemText"
                              primary={generateLabel(item)}
                />
            </ListItem>

            <EditButton handleMenuOpen={handleMenuOpen} item={item}/>
        </div>
    );
}

function NoEntries(props) {
    return (
        <div className="queryResult">
            <Typography className="queryResultText">Keine Einträge gefunden</Typography>
        </div>
    );
}

export default withContext(List);