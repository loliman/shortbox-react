import React from "react";
import {toIndividualList, wrapItem} from "../../util/util";
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
        </React.Fragment>
    );
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
                                        className="issueStoryIssue">{generateLabel(wrapItem(child.issue.series)) + " #" + child.issue.number}</Typography>
                                    <Typography className="issueStoryIssue issueStoryIssuePublisher">
                                        {generateLabel(wrapItem(child.issue.series.publisher))}
                                    </Typography>
                                </div>
                                <Tooltip title="Zur Ausgabe">
                                    <IconButton className="detailsIcon issueStoryIssueButton"
                                                component={Link}
                                                to={generateUrl(wrapItem(child.issue))}
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