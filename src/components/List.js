import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import {Query} from "react-apollo";
import {wrapItem} from "../util/util";
import {getListQuery} from '../graphql/queries'
import QueryResult from './generic/QueryResult';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import EditButton from "./restricted/EditButton";
import Typography from "@material-ui/core/es/Typography/Typography";
import {Link} from "react-router-dom";
import {ScrollContainer} from "react-router-scroll-4";
import {withContext} from "./generic";
import {generateLabel, generateUrl, HierarchyLevel} from "../util/hierarchy";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollKey: "listContainer-" + new Date().getTime()
        };
    }

    render() {
        const {drawerOpen, toogleDrawer, mobile, handleMenuOpen, anchorEl} = this.props;
        let {selected, level} = this.props;

        if (level === HierarchyLevel.ISSUE) {
            level = HierarchyLevel.SERIES;
            selected = selected.issue;
        }

        let query = getListQuery(level);
        let queryName = query.definitions[0].name.value.toLowerCase();

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
                        <Query query={query}
                               variables={selected}>
                            {({loading, error, data}) => {
                                if (loading || error || !data[queryName])
                                    return <QueryResult loading={loading} error={error} />;

                                if (data[queryName].length === 0)
                                    return <NoEntries />;

                                return data[queryName].map((i) => {
                                    return <TypeListEntry anchorEl={anchorEl}
                                                          {...this.props}
                                                          handleMenuOpen={handleMenuOpen}
                                                          key={i.id} item={wrapItem(i)}/>
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