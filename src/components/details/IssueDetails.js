import Layout from "../Layout";
import {Query} from "react-apollo";
import {issue} from "../../graphql/queries";
import {generateLabel, getGqlVariables} from "../../util/util";
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
import {generateIssueSubHeader} from "../../util/issues";

function IssueDetails(props) {
    const {selected} = props;

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
                                issue.coverurl = v.coverurl;
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

                            <CardContent>
                                {props.issueDetailsVariants ?
                                    React.cloneElement(props.issueDetailsVariants, {
                                        selected: data.issue,
                                        issue: data.issue
                                    }) :
                                    null}

                                <div className="details">
                                    <IssueDetailsTable issue={issue}/>
                                    <IssueDetailsCover issue={issue}/>
                                </div>

                                <IssueStories {...props} stories={issue.stories}/>
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

function IssueStories(props) {
    return (
        <div className="stories">
            <CardHeader title="Geschichten"/>

            {props.stories.map(story => <IssueStory {...props} key={story.id} story={story}/>)}
        </div>
    );
}

function IssueStory(props) {
    return (
        <ExpansionPanel className="story">
            <ExpansionPanelSummary className="summary" expandIcon={<ExpandMoreIcon/>}>
                {React.cloneElement(props.issueStoryTitle, {story: props.story})}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {React.cloneElement(props.issueStoryDetails, {story: props.story})}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default withContext(IssueDetails);

