import Layout from "../Layout";
import {Query} from "react-apollo";
import {issue} from "../../graphql/queries";
import {generateLabel, getGqlVariables, toIndividualList} from "../../util/util";
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
import {generateUrl} from "../../util/hierarchiy";
import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar/GridListTileBar";

function IssueDetails(props) {
    const {selected, us} = props;

    return (
        <Layout>
            <Query query={issue} variables={getGqlVariables(selected)}>
                {({loading, error, data}) => {
                    if (loading || error || !data.issue)
                        return <QueryResult loading={loading} error={error} data={data.issue} selected={selected}/>;

                    let issue = JSON.parse(JSON.stringify(data.issue));
                    if (selected.format)
                        data.issue.variants.forEach((v) => {
                            if (v.format === selected.format && v.variant === selected.variant) {
                                issue.cover.url = v.cover.url;
                                issue.format = v.format;
                                issue.variant = v.variant;
                                issue.limitation = v.limitation;
                                issue.releasedate = v.releasedate;
                                issue.price = v.price;
                                issue.currency = v.currency;
                                issue.verified = v.verified;
                            }
                        });

                    return (
                        <React.Fragment>
                            <CardHeader title={generateLabel(issue)}
                                        subheader={props.subheader ? generateIssueSubHeader(issue) : ""}
                                        action={
                                            issue.verified ?
                                                <img src="/verified_badge.png" alt="verifiziert" height="35"/> :
                                                null
                                        }/>

                            <CardContent className="cardContent">
                                <IssueDetailsVariants selected={data.issue} issue={data.issue}/>

                                <div className="details">
                                    <IssueDetailsTable issue={issue} us={us}/>
                                    <IssueDetailsCover issue={issue}/>
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

function IssueDetailsTable(props) {
    return (
        <Paper className="detailsPaper">
            <Table className="table">
                <TableBody>
                    <IssueDetailsRow key="format" label="Format" value={props.issue.format}/>
                    {
                        props.issue.limitation && props.issue.limitation > 0 ?
                            <IssueDetailsRow key="limitation" label="Limitierung"
                                             value={props.issue.limitation + " Exemplare"}/> :
                            null
                    }
                    <IssueDetailsRow key="language" label="Sprache" value={props.issue.language}/>
                    <IssueDetailsRow key="pages" label="Seiten" value={props.issue.pages}/>
                    <IssueDetailsRow key="releasedate" label="Erscheinungsdatum"
                                     value={props.issue.releasedate}/>
                    <IssueDetailsRow key="price" label="Preis"
                                     value={props.issue.price + ' ' + props.issue.currency}/>
                    {
                        props.us ?
                            <IssueDetailsRow key="coverartists" label="Cover Artists"
                                             value={toIndividualList(props.issue.cover.artists)}/> :
                            null
                    }
                    {
                        props.issue.editors && props.issue.editors.length > 0 ?
                            <IssueDetailsRow key="editor" label="Editor"
                                             value={toIndividualList(props.issue.editors)}/> :
                            null
                    }
                </TableBody>
            </Table>
        </Paper>
    );
}

function IssueDetailsRow(props) {
    return (
        <TableRow>
            <TableCell align="left">{props.label}</TableCell>
            <TableCell align="left">{props.value}</TableCell>
        </TableRow>
    )
}

class IssueDetailsCover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    render() {
        const {issue} = this.props;

        let coverUrl = issue.cover.url !== '' ? issue.cover.url : "nocover.jpg";

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

export function IssueContains(props) {
    return (
        <div className="stories">
            <CardHeader title={props.header}/>

            {props.items.length === 0 ?
                <Typography className="noRelationsWarning">{props.noEntriesHint}</Typography> :
                props.items.map(item => {
                    if (!props.itemDetails)
                        return <IssueContainsSimpleItem {...props} key={item.id} item={item}/>;
                    else
                        return <IssueContainsItem {...props} key={item.id} item={item}/>;
                })}
        </div>
    );
}

function IssueContainsSimpleItem(props) {
    return (
        <ExpansionPanel className="story" expanded={false}>
            <ExpansionPanelSummary className="summary">
                {React.cloneElement(props.itemTitle, {item: props.item, us: props.us, simple: true})}
            </ExpansionPanelSummary>
        </ExpansionPanel>
    );
}

function IssueContainsItem(props) {
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

export function IssueContainsTitleSimple(props) {
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

export function IssueContainsTitleDetailed(props) {
    let issue = props.item.parent ? props.item.parent.issue : props.item.issue;
    if(issue && issue.issue) {
        issue.number = issue.issue.number;
        issue.series = issue.issue.series;
    }

    let exclusive = !props.item.parent && !props.item.issue;

    return (
        <div className={props.simple ? "storyTitle storyTitleSimple" : "storyTitle"}>
            <div className="headingContainer">
                <Typography
                    className="heading">{generateItemTitle(props.item.issue ? props.item.issue : props.item)}</Typography>
                <Typography className="heading headingAddInfo">
                    {props.item.addinfo ? props.item.addinfo : null}
                </Typography>
            </div>

            <div className="chips">
                {
                    props.item.url && props.item.number === 0 ?
                        Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600 ?
                            <Chip className="chip" label="Cover" color="default"/>
                            : <Chip className="chip" label="C" color="default"/>
                        : null
                }

                {
                    props.item.parent && props.item.parent.children.length < 2 ?
                        Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600 ?
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
                              label={Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600 ? "Erstausgabe" : "1."}
                              color="primary"/>
                        : null
                }

                {
                    exclusive ?
                        Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600 ?
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
                                to={generateUrl(issue, !props.us)}
                                aria-label="Details"
                                disabled={exclusive}>
                        <SearchIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

function IssueDetailsVariants(props) {
    if (props.selected.variants.length === 0)
        return null;

    let variants = [];
    variants.push(<IssueDetailsVariant to={generateUrl(props.issue, false)}
                                       key={props.issue} variant={props.issue}/>);

    props.selected.variants.forEach(variant => {
        variant.series = props.selected.series;
        variant.number = props.selected.number;

        variants.push(<IssueDetailsVariant to={generateUrl(variant, false)}
                                           key={variant.id} variant={variant}/>);
    });

    return (
        <React.Fragment>
            <Typography className="coverGalleryHeader" component="p">
                Erhältlich in {props.selected.variants.length + 1} Varianten
            </Typography>

            <div className="coverGallery">
                <GridList className="gridList" cols={2.5}>
                    {variants}
                </GridList>
            </div>
        </React.Fragment>
    );
}

function IssueDetailsVariant(props) {
    return (
        <GridListTile component={Link} to={props.to} className="tile" key={props.variant.id}>
            <img src={props.variant.cover.url}
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

