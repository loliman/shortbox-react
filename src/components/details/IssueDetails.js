import Layout from "../Layout";
import {Query} from "react-apollo";
import {issue} from "../../graphql/queries";
import QueryResult from "../generic/QueryResult";
import React from "react";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import Lightbox from "react-images";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import {withContext} from "../generic";
import {generateIssueSubHeader, generateItemTitle} from "../../util/issues";
import Typography from "@material-ui/core/es/Typography/Typography";
import Chip from "@material-ui/core/Chip/Chip";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import SearchIcon from "@material-ui/icons/Search";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {generateLabel, generateUrl} from "../../util/hierarchy";
import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar/GridListTileBar";
import EditButton from "../restricted/EditButton";
import {stripItem, toChipList} from "../../util/util";

class IssueDetails extends React.Component {
    render() {
        const {selected, us} = this.props;

        return (
            <Layout>
                <Query query={issue} variables={selected}>
                    {({loading, error, data}) => {
                        if (loading || error || !data.issue)
                            return <QueryResult loading={loading} error={error} data={data ? data.issue : null}
                                                selected={selected}/>;

                        let issue = JSON.parse(JSON.stringify(data.issue));

                        let arcs = [];
                        if(us)
                            arcs = data.issue.arcs;
                        else {
                            data.issue.stories.forEach(story => {
                               if(story.parent && story.parent.issue && story.parent.issue.arcs) {
                                   story.parent.issue.arcs.forEach(arc => {
                                       if (!arcs.some(e => e.title === arc.title && e.type === arc.type)) {
                                           arcs.push(arc);
                                       }
                                   })
                               }
                            });
                        }

                        return (
                            <React.Fragment>
                                <CardHeader title={generateLabel(issue)}
                                            subheader={this.props.subheader ? generateIssueSubHeader(issue) : ""}
                                            action={
                                                <div>
                                                    {issue.verified ?
                                                        <img className="verifiedBadge" src="/verified_badge.png"
                                                             alt="verifiziert" height="35"/> : null}
                                                    <EditButton item={data.issue}/>
                                                </div>
                                            }/>

                                <CardContent className="cardContent">
                                    <Variants us={us} issue={data.issue} navigate={this.props.navigate}/>

                                    <div className="details">
                                        <DetailsTable issue={issue} details={this.props.details} navigate={this.props.navigate} us={us}/>
                                        <Cover issue={issue}/>
                                    </div>

                                    {
                                        data.issue.addinfo && data.issue.addinfo !== "" ?
                                            <React.Fragment>
                                                <br/>
                                                <Paper className="detailsPaper">
                                                    <Typography dangerouslySetInnerHTML={{__html: data.issue.addinfo}} />
                                                </Paper>
                                            </React.Fragment> :
                                            null
                                    }

                                    {
                                        arcs.length > 0 ? <br /> : null
                                    }
                                    {
                                        arcs.map((arc, i) => {
                                            let color;
                                            let type;
                                            switch (arc.type) {
                                                case "EVENT":
                                                    color = "primary";
                                                    type = "Event";
                                                    break;
                                                case "STORYLINE":
                                                    color = "secondary";
                                                    type = "Story Line";
                                                    break;
                                                default:
                                                    color = "default";
                                                    type = "Story Arc";
                                            }

                                            return <Chip key={i} className="chip partOfChip" label={arc.title + " (" + type + ")"} color={color} onClick={() => this.props.navigate(us ? "/us" : "/de", {filter: JSON.stringify({arcs: [stripItem(arc)], story: true, us: us})})}/>;
                                        })
                                    }

                                    {
                                        this.props.bottom ?
                                            React.cloneElement(this.props.bottom, {
                                                navigate: this.props.navigate,
                                                selected: data.issue,
                                                issue: data.issue,
                                                us: us
                                            }) :
                                            null
                                    }
                                </CardContent>
                            </React.Fragment>
                        );
                    }}
                </Query>
            </Layout>
        );
    }
}

function DetailsTable(props) {
    return (
        <Paper className="detailsPaper">
            <Table className="table">
                <TableBody>
                    {React.cloneElement(props.details, {
                        ...props,
                        issue: props.issue
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

export function DetailsRow(props) {
    return (
        <TableRow>
            <TableCell align="left">{props.label}</TableCell>
            <TableCell align="left">{props.value}</TableCell>
        </TableRow>
    )
}

class Cover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    render() {
        const {issue} = this.props;

        let coverUrl = (issue.cover && issue.cover.url && issue.cover.url !== '') ? issue.cover.url : "/nocover.jpg";

        return (
            <React.Fragment>
                <CardMedia
                    image={coverUrl}
                    title={generateLabel(issue)}
                    className="media"
                    style={{width: '45vh'}}
                    onClick={() => this.triggerIsOpen()}/>

                <Lightbox
                    showImageCount={false}
                    images={[{src: coverUrl}]}
                    isOpen={this.state.isOpen}
                    onClose={() => this.triggerIsOpen()}/>
            </React.Fragment>
        );
    }

    triggerIsOpen() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export function Contains(props) {
    return (
        <div className="stories">
            <CardHeader title={props.header}/>

            {props.items.length === 0 ?
                <Typography className="noRelationsWarning">{props.noEntriesHint}</Typography> :
                props.items.map((item, idx) => {
                    if (!props.itemDetails)
                        return <ContainsSimpleItem {...props} key={idx} item={item}/>;
                    else
                        return <ContainsItem {...props} key={idx} item={item}/>;
                })}
        </div>
    );
}

function ContainsSimpleItem(props) {
    return (
        <ExpansionPanel className="story" defaultExpanded={expanded(props.item, props.query ? props.query.filter : null)}>
            <ExpansionPanelSummary className="summary">
                {React.cloneElement(props.itemTitle, {navigate: props.navigate, item: props.item, us: props.us, simple: true})}
            </ExpansionPanelSummary>
        </ExpansionPanel>
    );
}

function ContainsItem(props) {
    return (
        <ExpansionPanel className="story" defaultExpanded={expanded(props.item, props.query ? props.query.filter : null)}>
            <ExpansionPanelSummary className="summary" expandIcon={<ExpandMoreIcon/>}>
                {React.cloneElement(props.itemTitle, {navigate: props.navigate, item: props.item, us: props.us})}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {React.cloneElement(props.itemDetails, {us: props.us, navigate: props.navigate, item: props.item})}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export function ContainsTitleSimple(props) {
    let smallChip = props.mobile || props.mobileLandscape || ((props.tablet || props.tabletLandscape) && props.drawerOpen);

    return (
        <div className={props.simple ? "storyTitle storyTitleSimple" : "storyTitle"}>
            <div className="headingContainer">
                <Typography className="heading">{generateItemTitle(props.item)}</Typography>
                <Typography className="heading headingAddInfo">
                    {props.item.addinfo ? props.item.addinfo : null}
                </Typography>
            </div>

            <div className="chips">
                {
                    props.us && props.item.children.length === 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Nicht auf deutsch erschienen" color="default"/>
                            : <Chip className="chip" label="n/a" color="default"/>
                        : null
                }

                {
                    props.item.onlytb && !props.item.parent ?
                        <Chip className="chip"
                              label={!smallChip ? "Nur in Taschenbuch" : "TB"}
                              color="primary"/>
                        : null
                }
            </div>
        </div>
    )
}

export function ContainsTitleDetailed(props) {
    let issue = props.item.parent ? props.item.parent.issue : props.item;
    if(issue && issue.issue) {
        issue.number = issue.issue.number;
        issue.series = issue.issue.series;
    }

    let smallChip = props.mobile || props.mobileLandscape || ((props.tablet || props.tabletLandscape) && props.drawerOpen);

    let exclusive = props.item.exclusive && !props.us;
    let variant = (!props.us && issue.variant && issue.variant !== '') ? ' '+ issue.variant : '';

    return (
        <div className={props.simple ? "storyTitle storyTitleSimple" : "storyTitle"}>
            <div className="headingContainer">
                <Typography
                    className="heading">{generateItemTitle(props.item.issue ? props.item.issue : props.item) + variant}</Typography>
                <Typography className="heading headingAddInfo">
                    {props.item.addinfo ? props.item.addinfo : null}
                </Typography>
            </div>

            <div className="chips">
                {
                    props.item.url && props.item.number === 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Cover" color="default"/>
                            : <Chip className="chip" label="C" color="default"/>
                        : null
                }

                {
                    props.item.onlyapp && props.item.parent ?
                        !smallChip ?
                            <Chip className="chip" label="Einzige Ausgabe" color="secondary"
                                  icon={<PriorityHighIcon/>}/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                {
                    props.item.firstapp && props.item.parent ?
                        <Chip className="chip"
                              label={!smallChip ? "Erstausgabe" : "1."}
                              color="primary"/>
                        : null
                }

                {
                    props.item.onlytb && props.item.parent ?
                        <Chip className="chip"
                              label={!smallChip ? "Sonst nur in Taschenbuch" : "TB"}
                              color="default"/>
                        : null
                }

                {
                    exclusive ?
                        !smallChip ?
                            <Chip className="chip" label="Exklusiv" color="secondary"
                                  icon={<PriorityHighIcon/>}/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                <Tooltip title="Zur Ausgabe">
                    <IconButton className="detailsIcon"
                                onClick={() => props.navigate(exclusive ? "" : generateUrl(issue, !props.us))}
                                aria-label="Details"
                                disabled={exclusive}>
                        <SearchIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

function Variants(props) {
    if (props.issue.variants.length === 1)
        return null;

    return (
        <React.Fragment>
            <Typography className="coverGalleryHeader" component="p">
                Erhältlich in {props.issue.variants.length} Varianten
            </Typography>

            <div className="coverGallery">
                <GridList className="gridList" cols={2.5}>
                    {props.issue.variants.map((variant, idx) => {
                            return (<Variant to={generateUrl(variant, props.us)} navigate={props.navigate}
                                                           key={idx} variant={variant}/>);
                    })}
                </GridList>
            </div>
        </React.Fragment>
    );
}

function Variant(props) {
    let coverUrl = (props.variant.cover && props.variant.cover.url && props.variant.cover.url !== '') ? props.variant.cover.url : "/nocover_simple.jpg";

    return (
        <GridListTile onClick={() => props.navigate(props.to)} className="tile">
            <img src={coverUrl}
                 alt={props.variant.variant + ' (' + props.variant.format + ')'}/>
            <GridListTileBar
                title={(props.variant.variant ? props.variant.variant : 'Reguläre Ausgabe') + ' (' + props.variant.format + ')'}
                classes={{
                    root: "titleBar",
                    title: "title",
                }}
            />
        </GridListTile>
    );
}

export function IndividualList(props) {
    let items = props.item.parent ? props.item.parent[props.type] : props.item[props.type];

    if(!items || items.length === 0)
        if(props.hideIfEmpty)
            return null;

    return(
        <div className="individualListContainer"><Typography><b>{props.label}</b></Typography> {toChipList(items, props, props.type)}</div>
    );
}

function expanded(item, filter) {
    if(!filter)
        return false;

    let compare = item.parent ? item.parent : item;
    let currentFilter;
    try {
        currentFilter = JSON.parse(filter)
    } catch (e) {
        return false;
    }

    let expanded = false;

    expanded = (currentFilter.onlyPrint && item.onlyapp) || expanded;
    expanded = (currentFilter.firstPrint && item.firstapp) || expanded;
    expanded = (currentFilter.onlyTb && item.onlytb) || expanded;
    expanded = (currentFilter.exclusive && item.exclusive) || expanded;
    expanded = (currentFilter.otherTb && item.onlytb) || expanded;
    expanded = (currentFilter.noPrint && item.children.length) || expanded;

    if(currentFilter.series && compare.issue.series) {
        currentFilter.series.forEach(s => {
            if(compare.issue.series.title === s.title && compare.issue.series.volume === s.volume && compare.issue.series.publisher.name === s.publisher.name)
                expanded = true;
        });
    }

    if(currentFilter.publishers && compare.issue.series) {
        currentFilter.publishers.forEach(s => {
            if(compare.issue.series.publisher.name === s.publisher.name)
                expanded = true;
        });
    }
    
    if(currentFilter.publisher && compare.issue.series)
        expanded = compare.issue.series.publisher.name === currentFilter.series.publisher.name;

    if(currentFilter.numbers)
        currentFilter.numbers.forEach(number => {
            if(number.compare === "=" && number.number === compare.issue.number) {
                expanded = true;
            } else if(number.compare === ">" && number.number > compare.issue.number) {
                expanded = true;
            } else if(number.compare === "<" && number.number < compare.issue.number) {
                expanded = true;
            } else if(number.compare === ">=" && number.number >= compare.issue.number) {
                expanded = true;
            } else if(number.compare === "<=" && number.number <= compare.issue.number) {
                expanded = true;
            }
        });

    if(item.__typename === 'Story') {
        if(currentFilter.arcs)
            currentFilter.arcs.forEach(i => {
                compare.issue.arcs.forEach(o => {
                    if(i.title === o.title && i.type === o.type)
                        expanded = true;
                })
            });

        if(currentFilter.writers)
            currentFilter.writers.forEach(i => {
                compare.writers.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });

        if(currentFilter.pencilers)
            currentFilter.pencilers.forEach(i => {
                compare.pencilers.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });

        if(currentFilter.inkers)
            currentFilter.inkers.forEach(i => {
                compare.inkers.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });

        if(currentFilter.colourists)
            currentFilter.colourists.forEach(i => {
                compare.colourists.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });

        if(currentFilter.letterers)
            currentFilter.letterers.forEach(i => {
                compare.letterers.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });

        if(currentFilter.editors)
            currentFilter.editors.forEach(i => {
                compare.editors.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });

        if(currentFilter.translators && item.translators)
            currentFilter.translators.forEach(i => {
                item.translators.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });
    } else if(item.__typename === 'Cover') {
        if(currentFilter.artists)
            currentFilter.artists.forEach(i => {
                item.artists.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });
    } else if(item.__typename === 'Feature') {
        if(currentFilter.writers)
            currentFilter.writers.forEach(i => {
                compare.writers.forEach(o => {
                    if(i.name === o.name)
                        expanded = true;
                })
            });
    }

    return expanded;
}

export default withContext(IssueDetails);

