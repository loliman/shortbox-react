import React from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import {IssueDetails} from "./IssueDetails";
import {getHierarchyLevel, HierarchyLevel} from "../util";
import {AppContext} from "./AppContext";
import {PublisherEdit} from "./Edit";

export class Details extends React.Component {
    render() {
        return (
            <AppContext.Consumer>
                {({context}) => (
                    <DetailsMain context={context}/>
                )}
            </AppContext.Consumer>
        )
    }
}

function DetailsMain(props) {
    let details;
    switch (getHierarchyLevel(props.context.selected)) {
        case HierarchyLevel.ISSUE_DETAILS:
        case HierarchyLevel.ISSUE_DETAILS_US:
            details = <IssueDetails/>;
            break;
        case HierarchyLevel.ISSUE:
        case HierarchyLevel.SERIES:
        case HierarchyLevel.PUBLISHER:
        default:
            details = <MainDetails/>;
    }

    return (
        <main className={!props.context.drawerOpen ? 'content contentShift' : 'content'}>
            <Card>
                {details}
            </Card>
        </main>
    );
}

function MainDetails(props) {
    return (
        <CardContent>
            <Typography component="p">
                Willkommen zu Shortbox, DEM deutschen Marvel Archiv im Internet.
            </Typography>
        </CardContent>
    );
}