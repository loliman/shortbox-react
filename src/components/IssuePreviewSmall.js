import {today} from "../util/util";
import Card from "@material-ui/core/Card";
import {generateLabel, generateUrl} from "../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withContext} from "./generic";
import React from "react";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/IconButton/IconButton";
import SearchIcon from "@material-ui/icons/Search";

function IssuePreviewSmall(props) {
    let date = props.issue.updatedAt.split(" ")[0];
    if(date === today()) date = "heute";
    else date = "am " + date;

    let variant = '';
    if (props.issue.format) {
        variant += props.issue.format;
        if (props.issue.variant)
            variant += " (" + props.issue.variant + ' Variant)';
    }

    return (
        <ExpansionPanelSummary className="summary-sm">
            <div style={{width: "100%"}}>
                <div className="issueTitleContainer">
                    <Typography variant="subtitle1" className="issuePreviewTitle">{generateLabel(props.issue.series) + " #" + props.issue.number}</Typography>

                    {
                        props.issue.title !== '' ?
                            <Typography className="issuePreviewSubTitle" variant={"subtitle2"}>{props.issue.title}</Typography> :
                            null
                    }
                </div>

                {
                    variant !== '' ?
                        <Typography className="issuePreviewTitleVariant" variant={"caption"}>{variant}</Typography> :
                        null
                }
            </div>

            <div style={{paddingRight: "0"}}>
                <Tooltip title="Zur Serie">
                    <IconButton className="detailsIcon"
                                onClick={() => props.navigate(generateUrl(props.issue, props.us))}
                                aria-label="Details">
                        <SearchIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </div>
        </ExpansionPanelSummary>
    );
}

export function IssuePreviewPlaceholderSmall(props) {
    let n = Math.floor(Math.random() * 6);
    let lengths = ["very long", "long", "medium", "short", "very short"];

    return (
        <ExpansionPanelSummary className="summary-sm">
            <div className="ui placeholder issuePreviewHeaderPlaceholder">
                <div className={lengths[n-1] + " line"}/>
                <div className={lengths[n-1] + " line"}/>
            </div>
        </ExpansionPanelSummary>
    );
}

export default withContext(IssuePreviewSmall);
