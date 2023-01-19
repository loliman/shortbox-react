import {today} from "../util/util";
import {generateLabel, generateUrl} from "../util/hierarchy";
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

    let coverUrl = (props.issue.cover && props.issue.cover.url && props.issue.cover.url !== '') ? props.issue.cover.url : "";

    return (
        <div style={props.cookies.get('newDesign') === "true" ? {background: 'white url(' + coverUrl + ') no-repeat 100% 40%', backgroundSize: '35%'} : {}}
            onClick={() => props.cookies.get('newDesign') === "true" ? props.navigate(generateUrl(props.issue, props.us)) : null}>
            <ExpansionPanelSummary className="summary-sm" style={props.cookies.get('newDesign') === "true" ? {background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 65%, rgba(255, 255, 255, 0))'} : {}}>
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

                {
                    props.cookies.get('newDesign') === "true"
                        ? null
                        : <div style={{paddingRight: "0", paddingTop: "2px"}}>
                            <Tooltip title="Zur Ausgabe">
                                <IconButton className="detailsIcon"
                                    style={{marginLef: '5px', background: 'rgba(255, 255, 255, 0.75)'}}
                                    onClick={() => props.navigate(generateUrl(props.issue, props.us))}
                                    aria-label="Details">
                                    <SearchIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </div>

                }
            </ExpansionPanelSummary>
        </div>
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
