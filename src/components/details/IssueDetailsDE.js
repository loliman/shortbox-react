import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {withContext} from "../generic";
import IssueDetails, {
    Contains,
    ContainsTitleDetailed,
    ContainsTitleSimple,
    DetailsRow
} from "./IssueDetails";
import {stripItem, toIndividualList} from "../../util/util";
import Chip from "@material-ui/core/Chip";

var dateFormat = require('dateformat');

function IssueDetailsDE(props) {
    return <IssueDetails bottom={<Bottom {...props}/>}
                         details={<Details/>}
                         subheader/>
}

function Details(props) {
    return (
        <React.Fragment>
            <DetailsRow key="format" label="Format" value={props.issue.format}/>
            {
                props.issue.limitation && props.issue.limitation > 0 ?
                    <DetailsRow key="limitation" label="Limitierung"
                                value={props.issue.limitation + " Exemplare"}/> :
                    null
            }
            <DetailsRow key="pages" label="Seiten" value={props.issue.pages}/>
            <DetailsRow key="releasedate" label="Erscheinungsdatum"
                        value={dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy")}/>
            <DetailsRow key="price" label="Preis"
                        value={props.issue.price + ' ' + props.issue.currency}/>
        </React.Fragment>
    );
}

function Bottom(props) {
    return (
        <React.Fragment>
            <br/>
            <br/>

            <Contains {...props} header="Geschichten"
                      noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet"
                      items={props.issue.stories} itemTitle={<ContainsTitleDetailed {...props}/>}
                      itemDetails={<StoryDetails/>}/>

            <br/>
            <br/>

            <Contains {...props} header="Weitere Inhalte"
                      noEntriesHint="Dieser Ausgabe sind noch keine weiteren Inhalte zugeordnet"
                      items={props.issue.features} itemTitle={<ContainsTitleSimple/>}
                      itemDetails={<FeatureDetails/>}/>

            <br/>
            <br/>

            <Contains {...props} header="Covergalerie"
                      noEntriesHint="Dieser Ausgabe sind noch keine Cover zugeordnet"
                      items={props.issue.covers} itemTitle={<ContainsTitleDetailed {...props}/>}
                      itemDetails={<CoverDetails/>}/>
        </React.Fragment>
    );
}

function CoverDetails(props) {
    return (
        <div>
            <div className="individualListContainer"><Typography><b>Artist</b></Typography> {toIndividualList(props.item.parent ? props.item.parent.artists : props.item.artists, props, "artists", "cover")}</div>
        </div>
    );
}

function FeatureDetails(props) {
    return (
        <div>
            <div className="individualListContainer"><Typography><b>Autor</b></Typography> {toIndividualList(props.item.writers, props, "writers", "feature")}</div>
        </div>
    );
}

function StoryDetails(props) {
    return (
        <div>
            {
                (props.item && props.item.parent &&  props.item.parent.issue && props.item.parent.issue.arcs && props.item.parent.issue.arcs.length > 0) ?
                    <div className="individualListContainer"><Typography><b>Teil von</b></Typography>
                        {
                            props.item.parent.issue.arcs.map((arc, i) => {
                                let color;
                                let type;
                                switch (arc.type) {
                                    case "EVENT":
                                        color = "primary";
                                        type = "Event";
                                        break;
                                    case "STORYLINE":
                                        color = "secondary";
                                        type = "Story Line";
                                        break;
                                    default:
                                        color = "default";
                                        type = "Story Arc";
                                }

                                return <Chip key={i} className="chip partOfChip" label={arc.title + " (" + type + ")"} color={color} onClick={() => props.navigate(props.us ? "/us" : "/de", {filter: JSON.stringify({arcs: [stripItem(arc)], story: true, us: props.us})})}/>;
                            })
                        }
                    </div> : null
            }

            <div className="individualListContainer"><Typography><b>Autor</b></Typography> {toIndividualList(props.item.parent ? props.item.parent.writers : props.item.writers, props, "writers")}</div>
            <div className="individualListContainer"><Typography><b>Zeichner</b></Typography> {toIndividualList(props.item.parent ? props.item.parent.pencilers : props.item.pencilers, props, "pencilers")}</div>
            <div className="individualListContainer"><Typography><b>Inker</b></Typography> {toIndividualList(props.item.parent ? props.item.parent.inkers : props.item.inkers, props, "inkers")}</div>
            <div className="individualListContainer"><Typography><b>Kolorist</b></Typography> {toIndividualList(props.item.parent ? props.item.parent.colourists : props.item.colourists, props, "colourists")}</div>
            <div className="individualListContainer"><Typography><b>Letterer</b></Typography> {toIndividualList(props.item.parent ? props.item.parent.letterers : props.item.letterers, props, "letterers")}</div>
            {
                props.item.translators.length > 0 ?
                    <div className="individualListContainer"><Typography><b>Übersetzer</b></Typography> {toIndividualList(props.item.translators, props, "translators")}</div> :
                    null
            }
            <div className="individualListContainer"><Typography><b>Editor</b></Typography> {toIndividualList(props.item.parent ? props.item.parent.editors : props.item.editors, props, "editors")}</div>
        </div>
    );
}

export default withContext(IssueDetailsDE);