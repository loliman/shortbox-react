import React from "react";
import {Query} from "react-apollo";
import {issue} from "../../graphql/queries";
import QueryResult from "../generic/QueryResult";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import {
    generateLabel,
    getGqlVariables
} from "../../util/util";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
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
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import {Link} from "react-router-dom";
import Layout from "../Layout";
import {withContext} from "../generic";
import {generateUrl} from "../../util/hierarchiy";

function IssueDetailsUS(props) {
    const {selected} = props;

    return (
        <Layout>
            <Query query={issue} variables={getGqlVariables(selected)}>
                {({loading, error, data}) => {
                    if (loading || error)
                        return <QueryResult loading={loading} error={error}/>;

                    return (
                        <React.Fragment>
                            <CardHeader title={generateLabel(data.issue)}/>

                            <CardContent>
                                <div className="details">
                                    <IssueDetailsTable issue={data.issue}/>
                                    <IssueDetailsCover issue={data.issue}/>
                                </div>

                                <IssueStories stories={data.issue.stories}/>
                            </CardContent>
                        </React.Fragment>
                    );
                }}
            </Query>
        </Layout>
    );
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
        <ExpansionPanel className="story">
            <ExpansionPanelSummary className="summary" expandIcon={<ExpandMoreIcon/>}>
                <IssueStoryTitle story={props.story}/>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <IssueStoryDetails story={props.story}/>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

function IssueStoryDetails(props) {
    return (
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
                                        component={Link}
                                        to={generateUrl(child.issue)}
                                        aria-label="Details">
                                <SearchIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    </ListItem>
                )
            }
        </List>
    )
}

function IssueStoryTitle(props) {
    return (
        <div className="storyTitle">
            <Typography className="heading">{generateStoryTitle(props.story)}</Typography>
        </div>
    )
}

function IssueDetailsTable(props) {
    return (
        <Paper className="detailsPaper">
            <Table className="table">
                <TableBody>
                    <IssueDetailsRow key="format" label="Format" value={props.issue.format}/>
                    <IssueDetailsRow key="language" label="Sprache" value={props.issue.language}/>
                    <IssueDetailsRow key="pages" label="Seiten" value={props.issue.pages}/>
                    <IssueDetailsRow key="releasedate" label="Erscheinungsdatum"
                                     value={props.issue.releasedate}/>
                    <IssueDetailsRow key="price" label="Preis"
                                     value={props.issue.price + ' ' + props.issue.currency}/>
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

        let coverUrl = issue.coverurl !== '' ? issue.coverurl : "nocover.jpg";

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

function generateStoryTitle(s) {
    if (s.title)
        return s.title;
    else
        return "ohne Titel";
}

export default withContext(IssueDetailsUS);