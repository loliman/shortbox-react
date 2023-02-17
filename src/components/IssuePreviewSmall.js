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

    let style;
    if(props.idx === 0) {
        if (props.isLast) {
            style = {borderRadius: '8px 8px 8px 8px'};
        } else {
            style = {borderRadius: '8px 8px 0 0'};
        }
    } else if (props.isLast) {
        style = {borderRadius: '0 0 8px 8px'};
    } else {
        style = {borderRadius: '0 0 0 0'};
    }

    if (props.cookies.get('newDesign') === "true")
        style.background = 'linear-gradient(to right, rgba(255, 255, 255, 1) 65%, rgba(255, 255, 255, 0))';

    return (
        <div style={props.cookies.get('newDesign') === "true" ? {background: 'white url(' + coverUrl + ') no-repeat 100% 40%', backgroundSize: '35%'} : {}}
            onMouseDown={(e) => props.cookies.get('newDesign') === "true" ? props.navigate(e, generateUrl(props.issue, props.us)) : null}>
            <ExpansionPanelSummary  className="summary-sm" style={style}>
                <div style={{width: "100%"}}>
                    <div className="issueTitleContainerInner">
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
                                    onMouseDown={(e) => props.navigate(e, generateUrl(props.issue, props.us))}
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

    let style;
    if(props.idx === 0) {
        if (props.isLast) {
            style = {borderRadius: '8px 8px 8px 8px'};
        } else {
            style = {borderRadius: '8px 8px 0 0'};
        }
    } else if (props.isLast) {
        style = {borderRadius: '0 0 8px 8px'};
    } else {
        style = {borderRadius: '0 0 0 0'};
    }

    return (
        <ExpansionPanelSummary className="summary-sm" style={style}>
            <div className="ui placeholder issuePreviewHeaderPlaceholder">
                <div className={lengths[n-1] + " line"}/>
                <div className={lengths[n-1] + " line"}/>
            </div>
        </ExpansionPanelSummary>
    );
}

export default withContext(IssuePreviewSmall);
