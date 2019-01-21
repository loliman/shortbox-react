import React from "react";
import {Query} from "react-apollo";
import {issue} from "../../graphql/queries";
import {QueryResult} from "../generic/QueryResult";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import {generateIssueSubHeader, generateLabel, generateStoryTitle} from "../../util/util";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar/GridListTileBar";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import CardMedia from "@material-ui/core/CardMedia";
import Lightbox from "react-images";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Chip from "@material-ui/core/Chip/Chip";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import {AppContext} from "../generic/AppContext";

export class IssueDetails extends React.Component {
    render() {
        return (
            <AppContext.Consumer>
                {({context}) => (
                    <Query query={issue} variables={{id: parseInt(context.selected.id)}}>
                        {({loading, error, data}) => {
                            if (loading || error)
                                return <QueryResult loading={loading} error={error}/>;

                            let selectedVariant = context.selected.format ? context.selected : data.issue;

                            return (
                                <React.Fragment>
                                    <CardHeader title={generateLabel(context.selected)}
                                                subheader={generateIssueSubHeader(selectedVariant)}/>

                                    <CardContent>
                                        <IssueDetailsVariants handleVariantSelection={this.handleVariantSelection}
                                                              selected={data.issue}/>

                                        <div className="details">
                                            <IssueDetailsTable issue={data.issue} selectedVariant={selectedVariant}/>
                                            <IssueDetailsCover selectedVariant={selectedVariant}/>
                                        </div>

                                        <IssueStories stories={data.issue.stories}
                                                      handleStorySelection={this.props.onSelection}/>
                                    </CardContent>
                                </React.Fragment>
                            );
                        }}
                    </Query>
                )}
            </AppContext.Consumer>
        );
    }

    handleVariantSelection = (e, context, handleNavigation) => {
        let issue = context.selected;
        issue.format = e.format;
        issue.variant = e.variant;
        issue.coverurl = e.coverurl;
        issue.price = e.price;
        issue.currency = e.currency;
        issue.releasedate = e.releasedate;
        issue.limitation = e.limitation;

        handleNavigation(issue);
    };
}

function IssueStories(props) {
    return (
        <div className="stories">
            <CardHeader title="Geschichten"/>

            {props.stories.map(story => <IssueStory key={story.id} story={story}/>)}
        </div>
    );
}

function IssueStory(props) {
    return (
        <AppContext.Consumer>
            {({context}) => (
                <ExpansionPanel className="story">
                    <ExpansionPanelSummary className="summary" expandIcon={<ExpandMoreIcon/>}>
                        <IssueStoryTitle story={props.story} goToDetails={props.goToDetails}/>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <IssueStoryDetails/>
                        {
                            context.us ? <IssueStoryIssues goToDetails={props.goToDetails} story={props.story}/> : null
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
        </AppContext.Consumer>
    );
}

function IssueStoryDetails(props) {
    return null;
}

function IssueStoryIssues(props) {
    return (
        <AppContext.Consumer>
            {({handleNavigation}) => (
                <List className="issueStoryIssueList">
                    {
                        props.story.children.map((child) =>
                            <ListItem key={child.id} className="issueStoryIssueItem" divider>
                                <div>
                                    <Typography
                                        className="issueStoryIssue">{generateLabel(child.issue.series) + " #" + child.issue.number}</Typography>
                                    <Typography className="issueStoryIssue issueStoryIssuePublisher">
                                        {generateLabel(child.issue.series.publisher)}
                                    </Typography>
                                </div>
                                <Tooltip title="Zur Ausgabe">
                                    <IconButton className="detailsIcon issueStoryIssueButton"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNavigation(child.issue)
                                                }}
                                                aria-label="Details">
                                        <SearchIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        )
                    }
                </List>
            )}
        </AppContext.Consumer>
    )
}

function IssueStoryTitle(props) {
    return (
        <AppContext.Consumer>
            {({context, handleNavigation}) => {
                let extended;
                if (!context.us) {
                    extended = (
                        <div className="chips">
                            {
                                props.story.parent && props.story.parent.children.length <= 2 ?
                                    <Chip className="chip" label="Einzige Ausgabe" color="secondary"
                                          icon={<PriorityHighIcon/>}/>
                                    : null
                            }

                            {
                                props.story.firstapp && props.story.parent ?
                                    <Chip className="chip" label="Erstausgabe" color="primary"/>
                                    : null
                            }

                            <Tooltip title="Zur US Ausgabe">
                                <IconButton className="detailsIcon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNavigation(props.story.parent.issue)
                                            }}
                                            aria-label="Details">
                                    <SearchIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    )
                }

                return (
                    <div className="storyTitle">
                        <Typography className="heading">{generateStoryTitle(props.story)}</Typography>

                        {extended}
                    </div>
                )
            }}
        </AppContext.Consumer>
    );
}

function IssueDetailsTable(props) {
    return (
        <Paper className="detailsPaper">
            <Table className="table">
                <TableBody>
                    <IssueDetailsRow key="format" label="Format" value={props.selectedVariant.format}/>
                    {
                        props.selectedVariant.limitation && props.selectedVariant.limitation > 0
                            ? <IssueDetailsRow key="limitation" label="Limitierung"
                                               value={props.selectedVariant.limitation + " Exemplare"}/>
                            : null
                    }
                    <IssueDetailsRow key="language" label="Sprache" value={props.issue.language}/>
                    <IssueDetailsRow key="pages" label="Seiten" value={props.issue.pages}/>
                    <IssueDetailsRow key="releasedate" label="Erscheinungsdatum"
                                     value={props.selectedVariant.releasedate}/>
                    <IssueDetailsRow key="price" label="Preis"
                                     value={props.selectedVariant.price + ' ' + props.selectedVariant.currency}/>
                </TableBody>
            </Table>
        </Paper>
    );
}

class IssueDetailsCover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    render() {
        const {selectedVariant} = this.props;
        let coverUrl = selectedVariant.coverurl !== '' ? selectedVariant.coverurl : "nocover.jpg";

        return (
            <React.Fragment>
                <CardMedia
                    image={coverUrl}
                    title={generateIssueSubHeader(selectedVariant)}
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

function IssueDetailsRow(props) {
    return (
        <TableRow>
            <TableCell align="left">{props.label}</TableCell>
            <TableCell align="left">{props.value}</TableCell>
        </TableRow>
    )
}

function IssueDetailsVariants(props) {
    return (
        <AppContext.Consumer>
            {({context, handleNavigation}) => {
                if (props.selected.variants.length === 0)
                    return null;

                return (
                    <React.Fragment>
                        <Typography className="coverGalleryHeader" component="p">
                            Erhältlich in {props.selected.variants.length + 1} Varianten
                        </Typography>

                        <div className="coverGallery">
                            <GridList className="gridList" cols={2.5}>
                                <IssueDetailsVariant key={props.selected} variant={props.selected}
                                                     handleSelection={(e) => props.handleVariantSelection(e, context, handleNavigation)}/>

                                {props.selected.variants.map(variant => (
                                    <IssueDetailsVariant key={variant.id} variant={variant}
                                                         handleSelection={(e) => props.handleVariantSelection(e, context, handleNavigation)}/>
                                ))}
                            </GridList>
                        </div>
                    </React.Fragment>
                );
            }}
        </AppContext.Consumer>
    );
}

function IssueDetailsVariant(props) {
    return (
        <GridListTile className="tile" key={props.variant.id} onClick={() => props.handleSelection(props.variant)}>
            <img src={props.variant.coverurl}
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