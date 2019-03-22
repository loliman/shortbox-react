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
import {Link} from "react-router-dom";
import {generateLabel, generateUrl} from "../../util/hierarchy";
import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar/GridListTileBar";
import EditButton from "../restricted/EditButton";

function IssueDetails(props) {
    const {selected, us} = props;

    return (
        <Layout>
            <Query query={issue} variables={selected}>
                {({loading, error, data}) => {
                    if (loading || error || !data.issue)
                        return <QueryResult loading={loading} error={error} data={data.issue} selected={selected}/>;

                    let issue = JSON.parse(JSON.stringify(data.issue));

                    return (
                        <React.Fragment>
                            <CardHeader title={generateLabel(issue)}
                                        subheader={props.subheader ? generateIssueSubHeader(issue) : ""}
                                        action={
                                            <div>
                                                {issue.verified ?
                                                    <img className="verifiedBadge" src="/verified_badge.png"
                                                         alt="verifiziert" height="35"/> : null}
                                                <EditButton item={data.issue}/>
                                            </div>
                                        }/>

                            <CardContent className="cardContent">
                                <Variants us={us} issue={data.issue}/>

                                <div className="details">
                                    <DetailsTable issue={issue} details={props.details} us={us}/>
                                    <Cover issue={issue}/>
                                </div>

                                {props.bottom ?
                                    React.cloneElement(props.bottom, {
                                        selected: data.issue,
                                        issue: data.issue,
                                        us: us
                                    }) :
                                    null}
                            </CardContent>
                        </React.Fragment>
                    );
                }}
            </Query>
        </Layout>
    );
}

function DetailsTable(props) {
    return (
        <Paper className="detailsPaper">
            <Table className="table">
                <TableBody>
                    {React.cloneElement(props.details, {
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
        <ExpansionPanel className="story" expanded={false}>
            <ExpansionPanelSummary className="summary">
                {React.cloneElement(props.itemTitle, {item: props.item, us: props.us, simple: true})}
            </ExpansionPanelSummary>
        </ExpansionPanel>
    );
}

function ContainsItem(props) {
    return (
        <ExpansionPanel className="story">
            <ExpansionPanelSummary className="summary" expandIcon={<ExpandMoreIcon/>}>
                {React.cloneElement(props.itemTitle, {item: props.item, us: props.us})}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {React.cloneElement(props.itemDetails, {item: props.item})}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export function ContainsTitleSimple(props) {
    return (
        <div className={props.simple ? "storyTitle storyTitleSimple" : "storyTitle"}>
            <div className="headingContainer">
                <Typography className="heading">{generateItemTitle(props.item)}</Typography>
                <Typography className="heading headingAddInfo">
                    {props.item.addinfo ? props.item.addinfo : null}
                </Typography>
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

    let exclusive = props.item.exclusive && !props.us;
    let variant = (!props.us && issue.variant && issue.variant !== '') ? ' [' + issue.variant + ']' : '';

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
                        !(props.mobile || props.mobileLandscape) ?
                            <Chip className="chip" label="Cover" color="default"/>
                            : <Chip className="chip" label="C" color="default"/>
                        : null
                }

                {
                    props.item.onlyapp && props.item.parent ?
                        !(props.mobile || props.mobileLandscape) ?
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
                              label={!(props.mobile || props.mobileLandscape) ? "Erstausgabe" : "1."}
                              color="primary"/>
                        : null
                }

                {
                    exclusive ?
                        !(props.mobile || props.mobileLandscape) ?
                            <Chip className="chip" label="Exklusiv" color="secondary"
                                  icon={<PriorityHighIcon/>}/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                <Tooltip title="Zur Ausgabe">
                    <IconButton className="detailsIcon"
                                component={Link}
                                to={exclusive ? "" : generateUrl(issue, !props.us)}
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
                            return (<Variant to={generateUrl(variant, props.us)}
                                                           key={idx} variant={variant}/>);
                    })}
                </GridList>
            </div>
        </React.Fragment>
    );
}

function Variant(props) {
    let coverUrl = (props.variant.cover && props.variant.cover.url && props.variant.cover.url !== '') ? props.variant.cover.url : "/nocover.jpg";

    return (
        <GridListTile component={Link} to={props.to} className="tile">
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

export default withContext(IssueDetails);

