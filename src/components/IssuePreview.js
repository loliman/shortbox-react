import {today} from "../util/util";
import Card from "@material-ui/core/Card";
import {generateLabel, generateUrl} from "../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withContext} from "./generic";
import React from "react";
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import Chip from "@material-ui/core/Chip/Chip";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";

function IssuePreview(props) {
    let date = props.issue.updatedAt.split(" ")[0];
    if(date === today()) date = "heute";
    else date = "am " + date;

    let variant = '';
    if (props.issue.format) {
        variant += props.issue.format;
        if (props.issue.variant)
            variant += " (" + props.issue.variant + ' Variant)';
    }

    let coverUrl = (props.issue.cover && props.issue.cover.url && props.issue.cover.url !== '') ? props.issue.cover.url : "/nocover.jpg";
    let smallChip = props.mobile || props.mobileLandscape || ((props.tablet || props.tabletLandscape) && props.drawerOpen);

    return (
        <Card className="issuePreview" onClick={() => props.navigate(generateUrl(props.issue, props.us))}>
            <CardMedia
                image={coverUrl}
                style={{float: "left", width: '91px', height: '141px', margin: '5px', marginRight: '20px', border: '1px solid #f0f0f0', borderRadius: '3px'}}/>
            <CardContent style={{paddingBottom: '20px'}}>
                <div className="issueTitleContainer">
                    <Typography variant="subtitle1" className="issuePreviewTitle">{generateLabel(props.issue.series) + " #" + props.issue.number}</Typography>

                    {
                        props.issue.title !== '' ?
                            <Typography className="issuePreviewSubTitle" variant={"subtitle2"}>{props.issue.title}</Typography> :
                            null
                    }

                    {props.issue.verified ?
                        <img style={{float: 'right', marginTop: '-10px'}} className="verifiedBadge" src="/verified_badge.png"
                             alt="verifiziert" height="35"/> : null}
                </div>

                {
                    variant !== '' ?
                        <Typography className="issuePreviewTitleVariant" variant={"caption"}>{variant}</Typography> :
                        null
                }

                <br />
                <br />

                {
                    !props.us && props.issue.stories.filter(s => s.onlyapp).length > 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Einzige Veröffentlichung" color="secondary"/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/> : null
                }

                {
                    !props.us && props.issue.stories.filter(s => s.firstapp).length > 0 ?
                        <Chip className="chip"
                              label={!smallChip ? "Erstveröffentlichung" : "1."}
                              color="primary"/>
                        : null
                }

                {
                    !props.us && props.issue.stories.filter(s => s.otheronlytb).length > 0 ?
                        <Chip className="tbchip chip"
                              label={!smallChip ? "Sonst nur in Taschenbuch" : "TB"}
                              color="default"/>
                        : null
                }

                {
                    !props.us && props.issue.stories.filter(s => s.exclusive).length > 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Exklusiv" color="secondary"/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                {
                    !props.us && props.issue.stories.filter(s => s.parent && s.parent.children.length > 1).length === props.issue.stories.length
                    && props.issue.stories.filter(s => s.firstapp).length === 0 && props.issue.stories.length > 0?
                        !smallChip ?
                            <Chip className="chip" label="Reiner Nachdruck" color="default"/>
                            : <Chip className="chip" label="ND" color="default"/>
                        : null
                }

                {
                    !props.us && props.issue.stories.length === 0?
                        !smallChip ?
                            <Chip className="chip" label="Keine Geschichten zugeordnet" color="default"/>
                            : <Chip className="chip" label="n/a" color="default"/>
                        : null
                }

                {
                    props.us && props.issue.stories.filter(s => s.onlyoneprint).length > 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Nur einfach auf deutsch veröffentlicht" color="secondary"/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                {
                    props.us && props.issue.stories.filter(s => s.onlytb).length > 0 ?
                        <Chip className="chip"
                              label={!smallChip ? "Nur in Taschenbuch" : "TB"}
                              color="primary"/>
                        : null
                }

                {
                    props.us && props.issue.stories.filter(s => s.children.length > 0).length === 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Nicht auf deutsch erschienen" color="default"/>
                            : <Chip className="chip" label="n/a" color="default"/>
                        : null
                }

                {
                    props.us && props.issue.stories.filter(s => s.reprintOf).length > 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Nachdruck" color="default"/>
                            : <Chip className="chip" label="ND" color="default"/>
                        : null
                }

                {
                    props.us && props.issue.stories.filter(s => s.reprints.length > 0).length > 0 ?
                        !smallChip ?
                            <Chip className="chip" label="Nachgedruckt" color="default"/>
                            : <Chip className="chip" label="ND" color="default"/>
                        : null
                }
            </CardContent>
        </Card>
    );
}

export function IssuePreviewPlaceholder(props) {
    let n = Math.floor(Math.random() * 6);
    let lengths = ["very long", "long", "medium", "short", "very short"];

    return (
        <Card className="issuePreview issuePreviewPlaceholder">
            <CardContent>
                <div className="ui placeholder issuePreviewHeaderPlaceholder">
                    <div className="header">
                        <div className={lengths[n-1] + " line"}/>
                    </div>
                    <div className="paragraph">
                        <div className="extremly short line"/>
                        <div className="extremly short line"/>
                    </div>
                </div>

                <br />

                <div className="ui placeholder">
                    <div className="very short line"/>
                </div>
            </CardContent>
        </Card>
    );
}

export default withContext(IssuePreview);
