import {today} from "../util/util";
import {generateLabel, generateUrl} from "../util/hierarchy";
import Typography from "@material-ui/core/Typography";
import {withContext} from "./generic";
import React from "react";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import CoverTooltip from "./CoverTooltip";
import IconButton from "@material-ui/core/IconButton";
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

    let coverUrl;
    let blurCover = false;

    if(props.issue.cover && props.issue.cover.url && props.issue.cover.url !== '') {
        coverUrl = props.issue.cover.url;
    } else if (!props.us
        && props.issue.covers.length > 0
        && props.issue.covers[0].parent
        && props.issue.covers[0].parent.issue
        && props.issue.covers[0].parent.issue.cover
        && props.issue.covers[0].parent.issue.cover.url) {
        blurCover = true;
        coverUrl = props.issue.covers[0].parent.issue.cover.url;
    } else {
        coverUrl = props.cookies.get('newDesign') === "true" ? "" : "/nocover.jpg";
    }

    let style = {};
    let outerStyle = {};
    if(props.idx === 0) {
        if (props.isLast) {
            outerStyle = {borderRadius: '8px 8px 8px 8px'};
        } else {
            outerStyle = {borderRadius: '8px 8px 0 0'};
        }
    } else if (props.isLast) {
        outerStyle = {borderRadius: '0 0 8px 8px'};
    } else {
        outerStyle = {borderRadius: '0 0 0 0'};
    }

    if (props.cookies.get('newDesign') === "true") {
        style.background = 'linear-gradient(to right, rgba(255, 255, 255, 1) 65%, rgba(255, 255, 255, 0))';
        outerStyle.background = 'white url(' + coverUrl + ') no-repeat 100% 40%';
        outerStyle.backgroundSize = '35%';
    }

    return (
        <div style={outerStyle}
            onMouseDown={(e) => props.cookies.get('newDesign') === "true" ? props.navigate(e, generateUrl(props.issue, props.us)) : null}>
            <ExpansionPanelSummary  className={"summary-sm " + (blurCover ? "blurred" : "")} style={style}>
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
                            <CoverTooltip issue={props.issue} us={props.us} filter={props.filter}>
                                <IconButton className="detailsIcon"
                                    style={{marginLef: '5px', background: 'rgba(255, 255, 255, 0.75)'}}
                                    onMouseDown={(e) => props.navigate(e, generateUrl(props.issue, props.us))}
                                    aria-label="Details">
                                    <SearchIcon fontSize="small"/>
                                </IconButton>
                            </CoverTooltip>
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
