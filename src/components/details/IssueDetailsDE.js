import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {withContext} from "../generic";
import IssueDetails, {IssueContains, IssueContainsTitleDetailed, IssueContainsTitleSimple} from "./IssueDetails";
import {toIndividualList} from "../../util/util";

function IssueDetailsDE(props) {
    return <IssueDetails bottom={<Bottom/>}
                         subheader/>
}

function Bottom(props) {
    return (
        <React.Fragment>
            <br/>
            <br/>

            <IssueContains {...props} header="Geschichten"
                           noEntriesHint="Diesem Comic sind noch keine Geschichten zugeordnet."
                           items={props.issue.stories} itemTitle={<IssueContainsTitleDetailed/>}
                           itemDetails={<IssueStoryDetails/>}/>

            <br/>
            <br/>

            <IssueContains {...props} header="Redaktionelle Inhalte"
                           noEntriesHint="Diesem Comic sind noch keine redaktionellen Inhalte zugeordnet."
                           items={props.issue.features} itemTitle={<IssueContainsTitleSimple/>}
                           itemDetails={<IssueFeatureDetails/>}/>

            <br/>
            <br/>

            <IssueContains {...props} header="Covergalerie"
                           noEntriesHint="Diesem Comic sind noch keine Cover zugeordnet."
                           items={props.issue.covers} itemTitle={<IssueContainsTitleDetailed/>}
                           itemDetails={<IssueCoversDetails/>}/>
        </React.Fragment>
    );
}

function IssueCoversDetails(props) {
    return (
        <div>
            <Typography><b>Artist</b> {toIndividualList(props.item.artists)}</Typography>
        </div>
    );
}

function IssueFeatureDetails(props) {
    return (
        <div>
            <Typography><b>Autor</b> {toIndividualList(props.item.writers)}</Typography>
            <Typography><b>Übersetzer</b> {toIndividualList(props.item.translators)}</Typography>
        </div>
    );
}

function IssueStoryDetails(props) {
    return (
        <div>
            <Typography><b>Autor</b> {toIndividualList(props.item.parent.writers)}</Typography>
            <Typography><b>Zeichner</b> {toIndividualList(props.item.parent.pencilers)}</Typography>
            <Typography><b>Inker</b> {toIndividualList(props.item.parent.inkers)}</Typography>
            <Typography><b>Kolorist</b> {toIndividualList(props.item.parent.colourists)}</Typography>
            <Typography><b>Letterer</b> {toIndividualList(props.item.parent.letteres)}</Typography>
            <Typography><b>Übersetzer</b> {toIndividualList(props.item.translators)}</Typography>
            <Typography><b>Editor</b> {toIndividualList(props.item.parent.editors)}</Typography>
        </div>
    );
}

export default withContext(IssueDetailsDE);