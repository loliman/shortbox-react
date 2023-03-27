import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {generateUrl} from "../util/hierarchy";
import SearchIcon from "@material-ui/icons/Search";
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
        <IconButton className="detailsIcon"
                    style={{marginLeft: '5px'}}
                    onMouseDown={(e) => props.navigate(e, generateUrl(props.issue, props.issue.series.publisher.us), {expand: props.number, filter: props.filter})}
                    aria-label="Details">
            <SearchIcon fontSize="small"/>
        </IconButton>
    </Tooltip>
}

export default withContext(CoverTooltip);
