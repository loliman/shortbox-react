import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import {Query} from "react-apollo";
import {getListQuery} from '../graphql/queries'
import QueryResult from './generic/QueryResult';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
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
        const {drawerOpen, toogleDrawer, mobile, tablet, tabletLandscape, handleMenuOpen} = this.props;
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
                variant={mobile || (tablet && !tabletLandscape) ? 'temporary' : 'persistent'}
                open={drawerOpen}
                onClose={() => toogleDrawer()}
                onOpen={() => toogleDrawer()}
                className={drawerOpen ? 'drawer-open' : 'drawer-close'}
                id="drawer">
                <ScrollContainer scrollKey={this.state.scrollKey}>
                    <MuiList id="list">
                        <Query query={query}
                               variables={selected}>
                            {({loading, error, data}) => {
                                if (loading || error || !data[queryName]) {
                                    if(error && error.message.indexOf("400") !== -1 && this.props.session) {
                                        this.props.enqueueSnackbar("Deine Session ist abgelaufen oder ungültig, du wirst ausgeloggt.", {variant: 'warning'});
                                        this.props.handleLogout();
                                    }

                                    return <QueryResult loading={loading} error={error} />;
                                }

                                if (data[queryName].length === 0)
                                    return <NoEntries />;

                                return data[queryName].map((i, idx) => {
                                    return <TypeListEntry {...this.props}
                                                          handleMenuOpen={handleMenuOpen}
                                                          key={idx} item={i}/>
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
    const {us, item, level, mobile, mobileLandscape, toogleDrawer} = props;

    let label = generateLabel(item);
    if(level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE) {
        if(level === HierarchyLevel.ISSUE && us)
            label = '#' + item.number + ' ' + item.series.title;
        else if(item.title && item.title !== '')
            label = '#' + item.number + ' ' + item.title;
        else
            label = '#' + item.number + ' ' + item.series.title;
    }

    return (
        <div className="itemContainer">
            <ListItem component={Link}
                      to={generateUrl(item, us)}
                      onClick={() => {
                          if ((mobile && !mobileLandscape) && level === HierarchyLevel.SERIES)
                              toogleDrawer();
                      }}
                      button>
                <ListItemText className="itemText"
                              primary={label}
                />
            </ListItem>
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