import {today} from "../util/util";
import Card from "@material-ui/core/Card";
import {generateLabel, generateUrl} from "../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withContext} from "./generic";
import React from "react";
import CardMedia from "@material-ui/core/CardMedia/CardMedia";

var dateFormat = require('dateformat');

function IssuePreview(props) {
    let date = props.issue.updatedAt.split(" ")[0];
    if(date === today()) date = "heute";
    else date = "am " + date;

    let time = props.issue.updatedAt.split(" ")[1];

    let variant = '';
    if (props.issue.format) {
        variant += props.issue.format;
        if (props.issue.variant)
            variant += "/" + props.issue.variant;
    }

    let coverUrl = (props.issue.cover && props.issue.cover.url && props.issue.cover.url !== '') ? props.issue.cover.url : "/nocover.jpg";

    if (props.issue.comicguideid && props.issue.comicguideid !== 0) {
        coverUrl = "https://www.comicguide.de/pics/small/" + props.issue.comicguideid + ".jpg";
    }

    return (
        <Card className="issuePreview" onClick={() => props.navigate(generateUrl(props.issue, props.us))}>
            <CardMedia
                image={coverUrl}
                style={{float: "left", width: '90px', height: '137px', margin: '5px', border: '1px solid #f0f0f0', borderRadius: '3px'}}/>
            <CardContent>
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
                <Typography variant="caption">{generateLabel(props.issue.series.publisher)}</Typography>

                <br />

                {
                    props.issue.releasedate ?
                        <Typography>Erschienen {dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy")}</Typography> :
                    props.issue.createdAt === props.issue.updatedAt ?
                        <Typography>Hinzugefügt {date} um {time}</Typography> :
                        <Typography>Bearbeitet {date} um {time}</Typography>
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
