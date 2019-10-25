import {today} from "../util/util";
import Card from "@material-ui/core/Card";
import {generateLabel, generateUrl} from "../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withContext} from "./generic";
import React from "react";

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

    return (
        <Card className="issuePreview" onClick={() => props.navigate(generateUrl(props.issue, props.us))}>
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

export default withContext(IssuePreview);
