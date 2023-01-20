import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {withContext} from "../generic";
import IssueDetails, {
    AppearanceList,
    Contains,
    ContainsTitleDetailed,
    DetailsRow,
    IndividualList, toChipList, toShortboxDate
} from "./IssueDetails";
import Chip from "@material-ui/core/Chip";
import {generateLabel} from "../../util/hierarchy";

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

            {
                props.issue.pages && props.issue.pages > 0 ?
                    <DetailsRow key="pages" label="Seiten"
                                value={props.issue.pages}/> :
                    null
            }

            <DetailsRow key="releasedate" label="Erscheinungsdatum"
                        value={toShortboxDate(dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy"))}/>

            {
                props.issue.price && props.issue.price > 0 ?
                    <DetailsRow key="price" label="Preis"
                                value={props.issue.price + ' ' + props.issue.currency}/> :
                    null
            }
        </React.Fragment>
    );
}

function Bottom(props) {
    return (
        <React.Fragment>
            <br/>
            <br/>

            <Contains {...props} header=""
                      noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet"
                      items={props.issue.stories} itemTitle={<ContainsTitleDetailed {...props}/>}
                      itemDetails={<StoryDetails/>}/>

            <br/>
            <br/>

            { props.issue.covers && props.issue.covers.length > 0 ?
                <div><Contains {...props} header="Cover"
                               noEntriesHint="Dieser Ausgabe sind noch keine Cover zugeordnet"
                               items={props.issue.covers} itemTitle={<ContainsTitleDetailed isCover={true} {...props}/>}
                               itemDetails={<CoverDetails/>}/>

                    <br/>
                    <br/></div> : null
            }

            {
                props.issue.comicguideid ?
                    <Typography className="spanLink">
                        Das Cover für&nbsp;
                        <a href={generateComicGuideId(props.issue)} rel="noopener noreferrer nofollow"
                           target="_blank">{generateLabel(props.issue.series) + " #" + props.issue.number}</a>
                        &nbsp;wird bereitgestellt vom&nbsp;
                        <a href="https://www.comicguide.de" rel="noopener noreferrer nofollow" target="_blank">deutschen ComicGuide</a>
                        &nbsp;und darf nicht ohne Genehmigung weiterverbreitet werden.
                    </Typography>:
                    null
            }
        </React.Fragment>
    );
}

function generateComicGuideId(issue) {
    return " https://www.comicguide.de/book/" + issue.comicguideid;
}

function CoverDetails(props) {
    return (
        <div>
            <div className="individualListContainer"><Typography><b>Artist</b></Typography> {
                props.item.parent ? toChipList(props.item.parent.individuals.filter(item => item.type.includes('ARTIST')) ? props.item.parent.individuals.filter(item => item.type.includes('ARTIST')) : props.item, props, "ARTIST") : ""
            } </div>
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

                                return <Chip key={i} className="chip partOfChip" label={arc.title + " (" + type + ")"} color={color} onMouseDown={(e) => props.navigate(e, props.us ? "/us" : "/de", {filter: JSON.stringify({arcs: arc.title, us: props.us})})}/>;
                            })
                        }
                        <br /><br /><br />
                    </div> : null
            }

            <Typography variant="h6">Mitwirkende</Typography>
            <IndividualList us={props.us} navigate={props.navigate} label={"Autor"} type={"WRITER"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Zeichner"} type={"PENCILER"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Inker"} type={"INKER"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Kolorist"} type={"COLORIST"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Letterer"} type={"LETTERER"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Übersetzer"} type={"TRANSLATOR"} item={props.item} />
            <IndividualList us={props.us} navigate={props.navigate} label={"Verleger"} type={"EDITOR"} item={props.item} />

            {
                (props.item.parent ? props.item.parent.appearances.length : props.item.appearances.length) > 0 ?
                    (
                        <React.Fragment>
                            <br />
                            <Typography variant="h6">Auftritte</Typography>

                            <AppearanceList us={props.us} navigate={props.navigate} label={"Hauptcharaktere"} appRole={"FEATURED"} type={"CHARACTER"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Antagonisten"} appRole={"ANTAGONIST"} type={"CHARACTER"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Unterstützende Charaktere"} appRole={"SUPPORTING"} type={"CHARACTER"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Andere Charaktere"} appRole={"OTHER"} type={"CHARACTER"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Teams"} type={"GROUP"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Rassen"} type={"RACE"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Tiere"} type={"ANIMAL"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Gegenstände"} type={"ITEM"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Fahrzeuge"} type={"VEHICLE"} item={props.item} hideIfEmpty={true}/>
                            <AppearanceList us={props.us} navigate={props.navigate} label={"Orte"} type={"LOCATION"} item={props.item} hideIfEmpty={true}/>
                        </React.Fragment>
                    ) : null
            }

        </div>
    );
}

export default withContext(IssueDetailsDE);
