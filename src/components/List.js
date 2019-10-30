import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import {getListQuery} from '../graphql/queries'
import QueryResult from './generic/QueryResult';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import Typography from "@material-ui/core/es/Typography/Typography";
import {ScrollContainer} from "react-router-scroll-4";
import {withContext} from "./generic";
import {generateLabel, generateUrl, HierarchyLevel} from "../util/hierarchy";
import PaginatedQuery from "./generic/PaginatedQuery";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollKey: "listContainer-" + new Date().getTime()
        };
    }

    componentDidMount() {
        this.props.registerLoadingComponent(this.constructor.name);
    }

    render() {
        const {drawerOpen, toogleDrawer, mobile, tablet, tabletLandscape, handleMenuOpen} = this.props;
        let {selected, level} = this.props;

        let filter;
        if(this.props.query && this.props.query.filter) {
            try {
                filter = JSON.parse(this.props.query.filter);
            } catch (e) {
                //
            }
        }

        if (level === HierarchyLevel.ISSUE) {
            level = HierarchyLevel.SERIES;
            selected = selected.issue;
        }

        let query = getListQuery(level);
        let queryName = query.definitions[0].name.value.toLowerCase();

        selected.filter = filter;
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
                    <PaginatedQuery query={query} variables={selected} onCompleted={() => this.props.unregisterLoadingComponent(this.constructor.name)}>
                        {({error, data, fetchMore, fetching, hasMore}) => {
                            let content;

                            if (this.props.appIsLoading || error || !data[queryName]) {
                                if(error && error.message.indexOf("400") !== -1 && this.props.session) {
                                    this.props.enqueueSnackbar("Deine Session ist abgelaufen oder ungültig, du wirst ausgeloggt.", {variant: 'warning'});
                                    this.props.handleLogout();
                                }

                                content = <QueryResult error={error}
                                                    placeholder={<TypeListEntryPlaceholder />}
                                                    placeholderCount={25}/>;
                            } else if (data[queryName].length === 0)
                                content = <NoEntries />;
                            else content = data[queryName].map((i, idx) => {
                                    return <TypeListEntry {...this.props}
                                                          handleMenuOpen={handleMenuOpen}
                                                          key={idx} item={i}/>
                                });

                            if(hasMore && content.length > 0)
                                content.push(
                                    <ListItem key={"balls"}>
                                        <ListItemText>
                                            <div className="ballsContainer">
                                                {fetching ?
                                                    <React.Fragment>
                                                        <div className="ball ball-one" />
                                                        <div className="ball ball-two" />
                                                        <div className="ball ball-three" />
                                                    </React.Fragment> : null}
                                            </div>
                                        </ListItemText>
                                    </ListItem>
                                );

                            return (
                                <MuiList id="list" onScroll={fetchMore}>
                                    {content}
                                </MuiList>
                            )
                        }}
                    </PaginatedQuery>
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
            <ListItem onClick={() => {
                          if ((mobile && !mobileLandscape) && (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE))
                              toogleDrawer();

                          props.navigate(generateUrl(item, us));
                      }}
                      button>
                <ListItemText className="itemText"
                              primary={label}
                />
            </ListItem>
        </div>
    );
}

function TypeListEntryPlaceholder(props) {
    let n = Math.floor(Math.random() * 6);
    let lengths = ["very long", "long", "medium", "short", "very short"];

    return (
        <div className="itemContainer">
            <ListItem className="typeListEntryPlaceholder">
                <ListItemText>
                    <div className="ui placeholder">
                        <div className="header">
                            <div className={lengths[n-1] + " line"}/>
                        </div>
                    </div>
                </ListItemText>
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
