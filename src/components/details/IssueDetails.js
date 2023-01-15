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
import SnackbarContent from "@material-ui/core/SnackbarContent";

class IssueDetails extends React.Component {
    render() {
        const {selected, us} = this.props;

        return (
            <Layout>
                <Query query={issue} variables={selected} notifyOnNetworkStatusChange>
                    {({networkStatus, error, data}) => {
                        if (this.props.appIsLoading || error || !data.issue || networkStatus < 7)
                            return <QueryResult error={error} data={data ? data.issue : null}
                                                loading={networkStatus < 7}
                                                selected={selected}
                                                placeholder={<IssueDetailsPreview />}
                                                placeholderCount={1}/>;

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

                        let q = new Date();
                        let today = new Date(q.getFullYear(), q.getMonth(), q.getDay());

                        return (
                            <React.Fragment>
                                {
                                    !us && !issue.verified && today < new Date(issue.releasedate)
                                    ? <SnackbarContent id="notVerifiedWarning" message="Diese Ausgabe ist noch nicht im Handel erhältlich und noch nicht vorab verifiziert worden.
                                        Die angezeigten Informationen weichen gegebenenfalls von den tatsächlichen Daten ab."  />
                                    : null
                                }

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

                                <div className={"detailsWrapper"}>
                                    <div className="details">
                                        <DetailsTable issue={issue} details={this.props.details} navigate={this.props.navigate} us={us}/>
                                        <Cover issue={issue}/>
                                    </div>

                                    {
                                        data.issue.addinfo && data.issue.addinfo !== "" ?
                                            <React.Fragment>
                                                <Paper className="addinfo">
                                                    <Typography dangerouslySetInnerHTML={{__html: data.issue.addinfo}} />
                                                </Paper>
                                            </React.Fragment> :
                                            null
                                    }
                                </div>
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

                                            return <Chip key={i} className="chip partOfChip" label={arc.title + " (" + type + ")"} color={color} onClick={() => this.props.navigate(us ? "/us" : "/de", {filter: JSON.stringify({arcs: arc.title, us: us})})}/>;
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
        <ExpansionPanel className="story" defaultExpanded={expanded(props.item, props.query)}>
            <ExpansionPanelSummary className="summary">
                {React.cloneElement(props.itemTitle, {navigate: props.navigate, item: props.item, us: props.us, simple: true})}
            </ExpansionPanelSummary>
        </ExpansionPanel>
    );
}

function ContainsItem(props) {
    return (
        <ExpansionPanel className="story" defaultExpanded={expanded(props.item, props.query)}>
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
                <Typography className="heading">{generateItemTitle(props.item, props.us)}</Typography>
                <Typography className="heading headingAddInfo">
                    {props.item.addinfo ? props.item.addinfo : null}
                </Typography>
            </div>

            <div className="chips">
                {
                    props.item.onlyoneprint && !props.item.parent ?
                        !smallChip ?
                            <Chip className="chip" label="Nur einfach auf deutsch veröffentlicht" color="secondary"/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                {
                    props.item.onlytb && !props.item.parent ?
                        <Chip className="chip"
                              label={!smallChip ? "Nur in Taschenbuch" : "TB"}
                              color="primary"/>
                        : null
                }

                {
                    props.us && props.item.children.length === 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Nicht auf deutsch erschienen" color="default"/>
                            : <Chip className="chip" label="n/a" color="default"/>
                        : null
                }

                {
                    props.item.reprintOf ?
                        !smallChip ?
                            <Chip className="chip" label="Nachdruck" color="default"/>
                            : <Chip className="chip" label="ND" color="default"/>
                        : null
                }

                {
                    props.item.reprints && props.item.reprints.length > 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Nachgedruckt" color="default"/>
                            : <Chip className="chip" label="ND" color="default"/>
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

    let parentTitle;
    if(!props.item.title && props.item.parent && props.item.parent.title)
        parentTitle = props.item.parent.title;

    let addinfoText = "";
    if (props.item.part && props.item.part !== null && props.item.part.indexOf("/x") === -1) {
        addinfoText += "Teil " + props.item.part.replace("/", " von ");
    }
    if(addinfoText !== "" && props.item.addinfo && props.item.addinfo !== null) {
        addinfoText += ", ";
    }
    if(props.item.addinfo && props.item.addinfo !== null) {
        addinfoText += props.item.addinfo;
    }

    return (
        <div className={props.simple ? "storyTitle storyTitleSimple" : "storyTitle"}>
            <div className="headingContainer">
                <div>
                    <Typography
                        className="heading itemTitle">{generateItemTitle(props.item.issue ? props.item.issue : props.item)}
                    </Typography>
                    {parentTitle && !(props.mobile && !props.mobileLandscape)
                        ? <Typography className="parentTitle">{parentTitle}</Typography>
                        : null}
                    {variant && !(props.mobile && !props.mobileLandscape)
                        ? <Typography className="parentTitle">{variant} Variant</Typography>
                        : null}
                </div>

                {props.item.parent && props.item.parent.reprintOf
                    ? <Typography className="parentTitle" onClick={() => props.navigate(generateUrl(props.item.parent.reprintOf.issue, true), {expand: props.item.parent.reprintOf.number, filter: null})}>Original erschienen als
                        <span className="asLink">{generateLabel(props.item.parent.reprintOf.issue)}</span></Typography>
                    : null}

                <Typography className="heading headingAddInfo">
                   {addinfoText !== "" ? addinfoText : null}
                </Typography>
            </div>

            <div className="chips">
                {
                    !props.isCover && props.item.url && props.item.number === 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Cover" color="default"/>
                            : <Chip className="chip" label="C" color="default"/>
                        : null
                }

                {
                    !props.isCover && props.item.onlyapp && props.item.parent ?
                        !smallChip ?
                            <Chip className="chip" label="Einzige Veröffentlichung" color="secondary"/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                {
                    !props.isCover && props.item.firstapp && props.item.parent ?
                        <Chip className="chip"
                              label={!smallChip ? "Erstveröffentlichung" : "1."}
                              color="primary"/>
                        : null
                }

                {
                    !props.isCover && props.item.otheronlytb && props.item.parent ?
                        <Chip className="tbchip chip"
                              label={!smallChip ? "Sonst nur in Taschenbuch" : "TB"}
                              color="default"/>
                        : null
                }

                {
                    exclusive ?
                        !smallChip ?
                            <Chip className="chip" label="Exklusiv" color="secondary"/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                { !exclusive ? <Tooltip title="Zur Ausgabe">
                    <IconButton className="detailsIcon"
                        onClick={() => props.navigate(exclusive ? "" : generateUrl(issue, !props.us), {expand:  props.item.parent.number, filter: null})}
                                aria-label="Details"
                                disabled={exclusive}>
                        <SearchIcon fontSize="small"/>
                    </IconButton>
                </Tooltip> : null}
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
                title={props.variant.format + ' (' + (props.variant.variant ? props.variant.variant + ' Variant' : 'Reguläre Ausgabe') + ')'}
                classes={{
                    root: "titleBar",
                    title: "title",
                }}
            />
        </GridListTile>
    );
}

export function IndividualList(props) {
    return(
        <ChipList us={props.us} navigate={props.navigate} label={props.label} hideIfEmpty={props.hideIfEmpty}
                  type={props.type} appRole={props.role}
                  items={props.item.parent && props.type !== "TRANSLATOR" ? props.item.parent.individuals : props.item.individuals}
                  individual={true}/>
    );
}

export function AppearanceList(props) {
    return(
        <ChipList us={props.us} navigate={props.navigate} label={props.label} hideIfEmpty={props.hideIfEmpty}
                  type={props.type} appRole={props.appRole}
                  items={props.item.parent ? props.item.parent.appearances : props.item.appearances} />
    );
}

function ChipList(props) {
    let items = props.items.filter(item => {
        if(props.individual)
            return item.type.includes(props.type);

        return (item.role === props.appRole || !props.appRole) && item.type === props.type
    });

    if((!items || items.length === 0) && props.hideIfEmpty)
        return null;

    return(
        <div className="individualListContainer"><Typography><b>{props.label}</b></Typography> {toChipList(items, props, props.type, props.appRole)}</div>
    );
}

export function toChipList(items, props, type, role) {
    if(!items || items.length === 0) {
        return <Chip key={0} className="chip" variant={"outlined"} label="Unbekannt"/>;
    }

    let list = [];
    items.forEach((item, i) => {
        let filterType = item.__typename.toLocaleLowerCase() + "s";
        let filter = {};

        filter.story = true;
        if(filterType === 'individuals' && type === 'ARTIST') {
            filter.cover = true;
            filter.story = undefined;
        }

        filter.us = props.us;

        filter[filterType] = [];

        if(item.__typename === "Appearance") {
            filter[filterType] = item.name;
        } else if(item.__typename === "Arc") {
            filter[filterType] = item.title;
        } else {
            let t = {};

            t.name = item.name;
            t.type = type;
            filter[filterType].push(t);
        }

        list.push(
            <Chip key={i} className="chip partOfChip" label={item.name} onClick={() => props.navigate(props.us ? "/us" : "/de", {filter: JSON.stringify(filter)})}/>
        );

        if(i !== items.length-1)
            list.push(<br key={i + "br"} />);
    });

    return list;
}

function expanded(item, query) {
    if(query && query.expand) {
        if(query.expand === item.number + "")
            return true
    }

    let filter = query ? query.filter : null;

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
    expanded = (currentFilter.otherOnlyTb && item.otheronlytb) || expanded;
    expanded = (currentFilter.onlyTb && item.onlytb) || expanded;
    expanded = (currentFilter.onlyOnePrint && item.onlyoneprint) || expanded;
    expanded = (currentFilter.exclusive && item.exclusive) || expanded;
    expanded = (currentFilter.noPrint && item.children.length) || expanded;

    if(currentFilter.series && compare.issue.series) {
        currentFilter.series.forEach(s => {
            if(compare.issue.series.title === s.title && compare.issue.series.volume === s.volume && compare.issue.series.publisher.name === s.publisher.name)
                expanded = true;
        });
    }

    if(currentFilter.publishers && compare.issue.series) {
        currentFilter.publishers.forEach(p => {
            if(compare.issue.series.publisher.name === p.name)
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
            if(compare.issue)
                compare.issue.arcs.forEach(o => {
                    if(currentFilter.arcs === o.title)
                        expanded = true;
                })

        if(currentFilter.individuals)
            currentFilter.individuals.forEach(i => {
                compare.individuals.forEach(o => {
                    if(i.name === o.name && i.type === o.type)
                        expanded = true;
                })
            });

        if(currentFilter.appearances)
            compare.appearances.forEach(o => {
                if(currentFilter.appearances === o.name)
                    expanded = true;
            })
    } else if(item.__typename === 'Cover') {
        if(currentFilter.individuals)
            currentFilter.individuals.forEach(i => {
                item.individuals.forEach(o => {
                    if(i.name === o.name && i.type === o.type)
                        expanded = true;
                })
            });
    } else if(item.__typename === 'Feature') {
        if(currentFilter.individuals)
            currentFilter.individuals.forEach(i => {
                compare.individuals.forEach(o => {
                    if(i.name === o.name && i.type === o.type)
                        expanded = true;
                })
            });
    }

    return expanded;
}

function IssueDetailsPreview() {
    return (
        <React.Fragment>
            <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                <div className={"header"}>
                    <div className="medium line"/>
                    <div className="short line"/>
                </div>
            </div>} />

            <CardContent>
                <div className={"details"}>
                    <Paper className="detailsPaper">
                        <Table className="table">
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left">
                                        <div className="ui placeholder">
                                            <div className="long line"/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left">
                                        <div className="ui placeholder">
                                            <div className="medium line"/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left">
                                        <div className="ui placeholder">
                                            <div className="long line"/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left">
                                        <div className="ui placeholder">
                                            <div className="short line"/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>

                    <div
                        className="media"
                        style={{width: '45vh'}}>
                        <div className="ui placeholder mediaPreview">
                            <div className="square image"></div>
                        </div>
                    </div>
                </div>

                <br />
                <br />
                <br />

                <div className="stories">
                    <CardHeader title={
                        <div className="ui placeholder">
                            <div className="header">
                                <div className="very short line"/>
                            </div>
                        </div>
                    }/>

                    <StoryPreview />
                    <StoryPreview />
                    <StoryPreview />
                    <StoryPreview />
                </div>
            </CardContent>
        </React.Fragment>
    )
}

function StoryPreview(props) {
    let n = Math.floor(Math.random() * 6);
    let lengths = ["very long", "long", "medium", "short", "very short"];

    return (
        <ExpansionPanel className="story storiesPreview">
            <ExpansionPanelSummary className="summary">
                <div className="ui placeholder storyPreview">
                    <div className={lengths[n-1] + " line storyPreviewLine"}/>
                </div>
            </ExpansionPanelSummary>
        </ExpansionPanel>
    );
}

export function toShortboxDate(date) {
    if (date.indexOf("01.01.") > -1) {
        return date.substring(6);
    } else if(date.indexOf("01.") === 0) {
        date = date.substring(2);
    }

    date = date
        .replace(".01.", ". Januar ")
        .replace(".02.", ". Februar ")
        .replace(".03.", ". März ")
        .replace(".04.", ". April ")
        .replace(".05.", ". Mai ")
        .replace(".06.", ". Juni ")
        .replace(".07.", ". Juli ")
        .replace(".08.", ". August ")
        .replace(".09.", ". September ")
        .replace(".10.", ". Oktober ")
        .replace(".11.", ". November ")
        .replace(".12.", ". Dezember ");

    if(date.startsWith("."))
        date = date.substring(2).trim();

    return date;
}

export default withContext(IssueDetails);

