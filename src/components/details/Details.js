import React from "react";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import {IssueDetails} from "./IssueDetails";
import {getHierarchyLevel, HierarchyLevel} from "../../util/util";

export function Details(props) {
    switch (getHierarchyLevel(props.context.selected)) {
        case HierarchyLevel.ISSUE_DETAILS:
        case HierarchyLevel.ISSUE_DETAILS_US:
            return <IssueDetails/>;
        case HierarchyLevel.ISSUE:
        case HierarchyLevel.SERIES:
        case HierarchyLevel.PUBLISHER:
        default:
            return <GenericDetails/>;
    }
}

function GenericDetails(props) {
    return (
        <CardContent>
            <Typography component="p">
                Willkommen zu Shortbox, DEM deutschen Marvel Archiv im Internet.
            </Typography>
        </CardContent>
    );
}