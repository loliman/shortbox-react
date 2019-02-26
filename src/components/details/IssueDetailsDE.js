import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {withContext} from "../generic";
import IssueDetails, {
    IssueContains,
    IssueContainsTitleDetailed,
    IssueContainsTitleSimple,
    IssueDetailsRow
} from "./IssueDetails";
import {toIndividualList} from "../../util/util";
import Paper from "@material-ui/core/Paper/Paper";

function IssueDetailsDE(props) {
    return <IssueDetails bottom={<Bottom/>}
                         details={<Details/>}
                         subheader/>
}

function Details(props) {
    return (
        <React.Fragment>
            <IssueDetailsRow key="format" label="Format" value={props.issue.format}/>
            {
                props.issue.limitation && props.issue.limitation > 0 ?
                    <IssueDetailsRow key="limitation" label="Limitierung"
                                     value={props.issue.limitation + " Exemplare"}/> :
                    null
            }
            <IssueDetailsRow key="pages" label="Seiten" value={props.issue.pages}/>
            <IssueDetailsRow key="releasedate" label="Erscheinungsdatum"
                             value={props.issue.releasedate}/>
            <IssueDetailsRow key="price" label="Preis"
                             value={props.issue.price + ' ' + props.issue.currency}/>
        </React.Fragment>
    );
}

function Bottom(props) {
    return (
        <React.Fragment>
            {
                props.issue.addinfo && props.issue.addinfo !== "" ?
                    <React.Fragment>
                        <br/>
                        <Paper className="detailsPaper">
                            <Typography>{props.issue.addinfo}</Typography>
                        </Paper>
                    </React.Fragment>:
                    null
            }

            <br/>
            <br/>

            <IssueContains {...props} header="Geschichten"
                           noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet."
                           items={props.issue.stories} itemTitle={<IssueContainsTitleDetailed/>}
                           itemDetails={<IssueStoryDetails/>}/>

            <br/>
            <br/>

            <IssueContains {...props} header="Weitere Inhalte"
                           noEntriesHint="Dieser Ausgabe sind noch keine weiteren Inhalte zugeordnet."
                           items={props.issue.features} itemTitle={<IssueContainsTitleSimple/>}
                           itemDetails={<IssueFeatureDetails/>}/>

            <br/>
            <br/>

            <IssueContains {...props} header="Covergalerie"
                           noEntriesHint="Dieser Ausgabe sind noch keine Cover zugeordnet."
                           items={props.issue.covers} itemTitle={<IssueContainsTitleDetailed/>}
                           itemDetails={<IssueCoversDetails/>}/>
        </React.Fragment>
    );
}

function IssueCoversDetails(props) {
    return (
        <div>
            <Typography><b>Artist</b> {toIndividualList(props.item.parent ? props.item.parent.artists : props.item.artists)}
            </Typography>
        </div>
    );
}

function IssueFeatureDetails(props) {
    return (
        <div>
            <Typography><b>Autor</b> {toIndividualList(props.item.writers)}</Typography>
            {
                props.item.translators.length > 0 ?
                <Typography><b>Übersetzer</b> {toIndividualList(props.item.translators)}</Typography> :
                null
            }
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
            {
                props.item.translators.length > 0 ?
                    <Typography><b>Übersetzer</b> {toIndividualList(props.item.translators)}</Typography> :
                    null
            }
            <Typography><b>Editor</b> {toIndividualList(props.item.parent.editors)}</Typography>
        </div>
    );
}

export default withContext(IssueDetailsDE);