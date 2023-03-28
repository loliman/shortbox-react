import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import React from "react";
import {withContext} from "./generic";

function CoverTooltip(props) {
    let coverUrl;
    let blurCover = false;

    if(props.issue.cover && props.issue.cover.url && props.issue.cover.url !== '') {
        coverUrl = props.issue.cover.url;
    } else if (!props.issue.series.publisher.us
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

    return <Tooltip PopperProps={{
                        className: "tooltipCover",
                    }}
                    title={<img className={blurCover ? "blurredImage" : ""}
                                style={{borderRadius: "3px"}}
                                src={coverUrl} width="65px" alt="Zur Ausgabe"/>}
    >
        {props.children}
    </Tooltip>
}

export default withContext(CoverTooltip);
