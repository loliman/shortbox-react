import React from "react";
import {generateLabel} from "../../util/util";
import Typography from "@material-ui/core/Typography/Typography";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import {Link} from "react-router-dom";
import {withContext} from "../generic";
import {generateUrl} from "../../util/hierarchiy";
import {generateStoryTitle} from "../../util/issues";
import IssueDetails from "./IssueDetails";

function IssueDetailsUS(props) {
    return <IssueDetails issueStoryTitle={<IssueStoryTitle/>} issueStoryDetails={<IssueStoryDetails/>}/>
}


function IssueStoryTitle(props) {
    return (
        <div className="storyTitle">
            <Typography className="heading">{generateStoryTitle(props.story)}</Typography>
        </div>
    )
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


export default withContext(IssueDetailsUS);