import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {withContext} from "../generic";
import IssueDetails, {Contains, ContainsTitleDetailed, ContainsTitleSimple, DetailsRow, IndividualList} from "./IssueDetails";
import {stripItem, toChipList} from "../../util/util";
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
            <div className="individualListContainer"><Typography><b>Artist</b></Typography> {toChipList(props.item.parent ? props.item.parent : props.item, props, "artists", "cover")}</div>
        </div>
    );
}

function FeatureDetails(props) {
    return (
        <div>
            <div className="individualListContainer"><Typography><b>Autor</b></Typography> {toChipList(props.item, props, "writers", "feature")}</div>
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

            <IndividualList us={props.us} navigate={props.navigate} label={"Autor"} type={"writers"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Zeichner"} type={"pencilers"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Inker"} type={"inkers"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Kolorist"} type={"colourists"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Letterer"} type={"letterers"} item={props.item} />

            <IndividualList us={props.us} navigate={props.navigate} label={"Übersetzer"} type={"translators"} item={props.item} hideIfEmpty={true}/>

            <IndividualList us={props.us} navigate={props.navigate} label={"Verleger"} type={"editors"} item={props.item} />

            <br />
            <Typography variant="h6">Auftritte</Typography>

            <IndividualList us={props.us} navigate={props.navigate} label={"Hauptcharaktere"} type={"mainchars"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Antagonisten"} type={"antagonists"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Unterstützende Charaktere"} type={"supchars"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Andere Charaktere"} type={"otherchars"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Teams"} type={"teams"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Rassen"} type={"races"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Tiere"} type={"animals"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Gegenstände"} type={"items"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Fahrzeuge"} type={"vehicles"} item={props.item} hideIfEmpty={true}/>
            <IndividualList us={props.us} navigate={props.navigate} label={"Orte"} type={"places"} item={props.item} hideIfEmpty={true}/>
        </div>
    );
}

export default withContext(IssueDetailsDE);