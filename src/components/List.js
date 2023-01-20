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
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";

class List extends React.Component {
    componentDidMount() {
        if (!(this.props.mobile || (this.props.tablet && !this.props.tabletLandscape)))
            this.props.registerLoadingComponent("List");
    }

    render() {
        const {drawerOpen, toogleDrawer, mobile, tablet, tabletLandscape, handleMenuOpen} = this.props;
        let {selected, level} = this.props;

        let filter;
        if (this.props.query && this.props.query.filter) {
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
                <PaginatedQuery query={query} variables={selected}
                                onCompleted={() => this.props.unregisterLoadingComponent("List")}>
                    {({error, data, fetchMore, fetching, hasMore, networkStatus}) => {
                        let content;

                        if (this.props.appIsLoading || error || !data[queryName] || networkStatus === 2) {
                            if (error && error.message.indexOf("400") !== -1 && this.props.session) {
                                this.props.enqueueSnackbar("Deine Session ist abgelaufen oder ungültig, du wirst ausgeloggt.", {variant: 'warning'});
                                this.props.handleLogout();
                            }

                            content = <QueryResult error={error}
                                                   placeholder={<TypeListEntryPlaceholder/>}
                                                   placeholderCount={25}
                                                   loading={networkStatus === 2}
                                                   data={data}/>;
                        } else if (data[queryName].length === 0)
                            content = <NoEntries/>;
                        else content = data[queryName].map((i, idx) => {
                                return <TypeListEntry {...this.props}
                                                      handleMenuOpen={handleMenuOpen}
                                                      onClick={(e) => this.setState({
                                                          scrollPosition: e * idx - (e * 4)
                                                      })}
                                                      idx={idx} key={idx} item={i}/>
                            });

                        if (hasMore && content.length > 0)
                            content.push(
                                <ListItem key={"balls"}>
                                    <ListItemText>
                                        <div className="ballsContainer">
                                            {fetching ?
                                                <React.Fragment>
                                                    <div className="ball ball-one"/>
                                                    <div className="ball ball-two"/>
                                                    <div className="ball ball-three"/>
                                                </React.Fragment> : null}
                                        </div>
                                    </ListItemText>
                                </ListItem>
                            );

                        return (
                            <ScrollContainer scrollKey="listScrollContainer"
                                             shouldUpdateScroll={(prevRouterProps, {location, history}) => {
                                                 return [0, this.state ? this.state.scrollPosition : 0];
                                             }}>
                                <MuiList id="list" onScroll={fetchMore}>
                                    {content}
                                </MuiList>
                            </ScrollContainer>
                        )
                    }}
                </PaginatedQuery>
            </SwipeableDrawer>
        );
    }
}

function TypeListEntry(props) {
    const {us, item, level, mobile, mobileLandscape, toogleDrawer} = props;

    let label = generateLabel(item);
    if (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE) {
        if (level === HierarchyLevel.ISSUE && us)
            label = '#' + item.number + ' ' + item.series.title;
        else if (item.title && item.title !== '')
            label = '#' + item.number + ' ' + item.title;
        else
            label = '#' + item.number + ' ' + item.series.title;
    }

    let isBold = {};

    if (level === HierarchyLevel.ISSUE && props.selected.issue.number === item.number) {
        isBold = {fontWeight: "bold"};
    }

    return (
        <div className="itemContainer" id={"itemContainer" + props.idx}>
            <ListItem onMouseDown={(e) => {
                props.onClick(document.getElementById("itemContainer" + props.idx).offsetHeight);

                if ((mobile && !mobileLandscape) && (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE))
                    toogleDrawer();

                props.navigate(e, generateUrl(item, us), {expand: null, filter: props.query ? props.query.filter : null});
            }}
                      button>
                <ListItemText className="itemText"
                              primary={<Typography style={isBold}>
                                  <div style={{display: "flex"}}>
                                      <div>{label}</div>
                                      {item.variants && item.variants.length > 1 ?
                                          <Tooltip title={"+" + (item.variants.length - 1) + " Varianten"}>
                                              <Typography className={"material-icons"}
                                                          style={{color: "gray", paddingLeft: '2px', fontSize: "8px"}}
                                                          color={"disabled"}>+{item.variants.length - 1}</Typography>
                                          </Tooltip> :
                                          null}
                                  </div>
                              </Typography>}
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
                            <div className={lengths[n - 1] + " line"}/>
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
