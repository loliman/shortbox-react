import React from "react";
import {toIndividualList} from "../../util/util";
import Typography from "@material-ui/core/Typography/Typography";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import {Link} from "react-router-dom";
import {withContext} from "../generic";
import {generateLabel, generateUrl} from "../../util/hierarchy";
import IssueDetails, {IssueContains, IssueContainsTitleDetailed, IssueContainsTitleSimple} from "./IssueDetails";

function IssueDetailsUS(props) {
    return <IssueDetails bottom={<Bottom/>}
                         subheader/>
}

function Bottom(props) {
    return (
        <React.Fragment>
            <br/>
            <br/>

            <IssueContains {...props} header="Geschichten"
                           noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet."
                           items={props.issue.stories} itemTitle={<IssueContainsTitleSimple/>}
                           itemDetails={<IssueStoryDetails/>}/>

            <br/>
            <br/>

            <IssueContains {...props} header="Cover erschienen in"
                           noEntriesHint="Dieser Ausgabe sind noch keine Cover zugeordnet."
                           items={props.issue.covers[0].children.map(c => c.issue)}
                           itemTitle={<IssueContainsTitleDetailed/>}/>

            <br/>
            <br/>
            <br/>
            <br/>

            <Typography className="copyright">
                Informationen über&nbsp;
                <a href={generateMarvelDbUrl(props.issue)} rel="noopener noreferrer nofollow"
                   target="_blank">{generateLabel(props.issue.series) + " #" + props.issue.number}</a>
                &nbsp;werden bezogen aus der&nbsp;
                <a href="https://marvel.fandom.com" rel="noopener noreferrer nofollow" target="_blank">Marvel
                    Database</a>
                &nbsp;und stehen unter der&nbsp;
                <a href="unter der https://creativecommons.org/licenses/by-sa/3.0/" rel="noopener noreferrer nofollow"
                   target="_blank">Creative Commons License 3.0</a>
            </Typography>
        </React.Fragment>
    );
}

function generateMarvelDbUrl(issue) {
    let url = "https://marvel.fandom.com/wiki/" + issue.series.title + "_Vol_" + issue.series.volume + "_" + issue.number;
    return url.replace(new RegExp(" ", 'g'), "_");
}

function IssueStoryDetails(props) {
    return (
        <div className="usStoryContainer">
            <div className="usStoryDetails">
                <Typography><b>Autor</b> {toIndividualList(props.item.writers)}</Typography>
                <Typography><b>Zeichner</b> {toIndividualList(props.item.pencilers)}</Typography>
                <Typography><b>Inker</b> {toIndividualList(props.item.inkers)}</Typography>
                <Typography><b>Kolorist</b> {toIndividualList(props.item.colourists)}</Typography>
                <Typography><b>Letterer</b> {toIndividualList(props.item.letteres)}</Typography>
                <Typography><b>Editor</b> {toIndividualList(props.item.editors)}</Typography>
            </div>

            <br/>

            <List className="issueStoryIssueList">
                {
                    props.item.children.map((child) => {
                        if (!child.issue)
                            return null;

                        return (
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
                        );
                    })
                }
            </List>
        </div>
    )
}

export default withContext(IssueDetailsUS);