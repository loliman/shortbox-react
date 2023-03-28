import React from 'react';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import {getListQuery} from '../graphql/queries'
import QueryResult from './generic/QueryResult';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import Typography from "@material-ui/core/es/Typography/Typography";
import {withContext} from "./generic";
import {generateLabel, generateUrl, HierarchyLevel} from "../util/hierarchy";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import {Query} from "react-apollo";
import CoverTooltip from "./CoverTooltip";

class List extends React.Component {
    componentDidUpdate() {
        scroll(this.state, this.props)
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
                <Query  query={query} variables={selected}
                        fetchPolicy={this.state && this.state.data ? null : "cache-and-network"}
                        onCompleted={(data) => {
                            this.setState({data: data});
                        }}>
                    {({error, data, networkStatus}) => {
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
                                                      idx={idx} key={idx} item={i}/>
                            });

                        return (
                            <MuiList id="list">
                                {content}
                            </MuiList>
                        )
                    }}
                </Query>
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

    let variants = item.variants ? (item.variants.length - 1) : 0;

    if(level === HierarchyLevel.ISSUE || level === HierarchyLevel.SERIES)
        return <CoverTooltip issue={item}>
            <div className="itemContainer" id={"itemContainer" + props.idx}>
                <ListItem onMouseDown={(e) => {
                    if ((mobile && !mobileLandscape) && (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE))
                        toogleDrawer();

                    props.navigate(e, generateUrl(item, us), {expand: null, filter: props.query ? props.query.filter : null});
                }} button>
                    <ListItemText className="itemText"
                                  primary={<Typography style={isBold}>
                                      <div style={{display: "flex", justifyContent: "space-between"}}>
                                          <div>{label}</div>
                                          <div style={{display: "flex"}}>{item.variants && item.variants.length > 1 ?
                                              <Tooltip title={"+" + variants + (variants === 1 ? " Variante" : " Varianten")}>
                                                  <Typography className={"material-icons"}
                                                              style={{color: "gray", paddingLeft: '2px', fontSize: "8px"}}
                                                              color={"disabled"}>+{item.variants.length - 1}</Typography>
                                              </Tooltip> :
                                              null}

                                              {(item.collected || (item.variants && item.variants.filter(v => v.collected).length > 0)) && props.session ?
                                                  <img className="verifiedBadge" style={{margin: "0"}} src="/collected_badge.png"
                                                       alt="gesammelt" height="21"/> : null}</div>
                                      </div>
                                  </Typography>}
                    />
                </ListItem>
            </div>
        </CoverTooltip>;
    else
        return <div className="itemContainer" id={"itemContainer" + props.idx}>
            <ListItem onMouseDown={(e) => {
                if ((mobile && !mobileLandscape) && (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE))
                    toogleDrawer();

                props.navigate(e, generateUrl(item, us), {expand: null, filter: props.query ? props.query.filter : null});
            }} button>
                <ListItemText className="itemText"
                              primary={<Typography style={isBold}>
                                  <div style={{display: "flex", justifyContent: "space-between"}}>
                                      <div>{label}</div>
                                      <div style={{display: "flex"}}>{item.variants && item.variants.length > 1 ?
                                          <Tooltip title={"+" + variants + (variants === 1 ? " Variante" : " Varianten")}>
                                              <Typography className={"material-icons"}
                                                          style={{color: "gray", paddingLeft: '2px', fontSize: "8px"}}
                                                          color={"disabled"}>+{item.variants.length - 1}</Typography>
                                          </Tooltip> :
                                          null}

                                          {(item.collected || (item.variants && item.variants.filter(v => v.collected).length > 0)) && props.session ?
                                              <img className="verifiedBadge" style={{margin: "0"}} src="/collected_badge.png"
                                                   alt="gesammelt" height="21"/> : null}</div>
                                  </div>
                              </Typography>}
                />
            </ListItem>
        </div>;
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

function scroll(state, props) {
    if(props && props.level) {
        let level = props.level;
        if (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE)  {
            let query = getListQuery(level);
            let queryName = query.definitions[0].name.value.toLowerCase();

            if (state &&
                state.data && state.data[queryName] &&
                props.selected.issue) {
                let idx = state.data[queryName].findIndex(d => d.number === props.selected.issue.number);

                let height = 0;

                let offsets = state.data[queryName]
                    .filter((d, i) => i <= idx)
                    .map((d, idx) => document.getElementById("itemContainer" + idx) ? document.getElementById("itemContainer" + idx).offsetHeight : 0);

                if(offsets.length > 0)
                    height = offsets.reduce((a, b) => a + b);

                height -= document.getElementById("itemContainer" + idx) ? document.getElementById("itemContainer" + idx).offsetHeight : 0;
                document.getElementById("list").scrollTop = height - 100;
            }
        }
    }
}

export default withContext(List);
