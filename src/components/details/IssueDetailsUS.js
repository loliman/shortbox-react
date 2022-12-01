import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import {withContext} from "../generic";
import {generateLabel, generateUrl} from "../../util/hierarchy";
import IssueDetails, {
    AppearanceList,
    Contains,
    ContainsTitleDetailed,
    ContainsTitleSimple,
    DetailsRow, IndividualList, toChipList
} from "./IssueDetails";

var dateFormat = require('dateformat');

function IssueDetailsUS(props) {
    return <IssueDetails bottom={<Bottom {...props}/>}
                         details={<Details/>}
                         subheader/>
}

function Details(props) {
    return (
        <React.Fragment>
            <DetailsRow key="releasedate" label="Erscheinungsdatum"
                        value={dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy")}/>
            <DetailsRow key="coverartists" label="Cover Artists"
                        value={toChipList(props.issue && props.issue.cover ? props.issue.cover.individuals.filter(item => item.type.includes('ARTIST')) : null, props, "ARTIST")}/>
            <DetailsRow key="editor" label="Editor"
                        value={toChipList(props.issue.individuals.filter(item => item.type.includes('EDITOR')), props, "EDITOR")}/>
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
                      items={props.issue.stories} itemTitle={<ContainsTitleSimple {...props}/>}
                      itemDetails={<StoryDetails/>}/>

            <br/>
            <br/>

            { props.issue.covers && props.issue.covers.length > 0 && props.issue.covers[0].children
            && props.issue.covers[0].children.length > 0 ?

            <Contains {...props} header="Cover erschienen in"
                      noEntriesHint="Das Cover ist noch keinen deutschen Ausgaben zugeordnet"
                      items={props.issue.covers[0] ? props.issue.covers[0].children.map(c => c.issue) : []}
                      itemTitle={<ContainsTitleDetailed {...props}/>}/> : null
            }

            <br/>
            <br/>

            <Typography className="spanLink">
                Informationen über&nbsp;
                <a href={generateMarvelDbUrl(props.issue)} rel="noopener noreferrer nofollow"
                   target="_blank">{generateLabel(props.issue.series) + " #" + props.issue.number}</a>
                &nbsp;werden bezogen aus der&nbsp;
                <a href="https://marvel.fandom.com" rel="noopener noreferrer nofollow" target="_blank">Marvel
                    Database</a>
                &nbsp;und stehen unter der&nbsp;
                <a href="https://creativecommons.org/licenses/by/3.0/de/" rel="noopener noreferrer nofollow"
                   target="_blank">Creative Commons License 3.0</a>
                &nbsp;. Die Informationen wurden aufbereitet und unter Umständen ergänzt.&nbsp;
            </Typography>
        </React.Fragment>
    );
}

function StoryDetails(props) {
    return (
        <div className="usStoryContainer">
            <div className="usStoryDetails">
                <Typography variant="h6">Mitwirkende</Typography>
                <IndividualList us={props.us} navigate={props.navigate} label={"Autor"} type={"WRITER"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Zeichner"} type={"PENCILER"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Inker"} type={"INKER"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Kolorist"} type={"COLORIST"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Letterer"} type={"LETTERER"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Übersetzer"} type={"TRANSLATOR"} item={props.item} hideIfEmpty={true}/>
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

            {props.item.children.length === 0 ? null :
            <React.Fragment>
                <br/>

                <List className="issueStoryIssueList">
                    {
                        props.item.children.map((child, idx) => {
                            if (!child.issue)
                                return null;

                            console.log(props.item.children);

                            return (
                                <ListItem key={idx} className="issueStoryIssueItem" divider={props.item.children.length-1 !== idx}>
                                    <div>
                                        <div className="headingContainer">
                                            <Typography
                                                className="issueStoryIssue">{generateLabel(child.issue.series) + " #" + child.issue.number}</Typography>
                                            <Typography className="parentTitle">
                                                {child.addinfo ? child.addinfo : null}
                                            </Typography>
                                        </div>
                                        <Typography className="issueStoryIssue issueStoryIssuePublisher">
                                            {generateLabel(child.issue.series.publisher)}
                                        </Typography>
                                    </div>
                                    <Tooltip title="Zur Ausgabe">
                                        <IconButton className="detailsIcon issueStoryIssueButton"
                                            onClick={() => props.navigate(generateUrl(child.issue), {expand: child.number, filter: null})}
                                                    aria-label="Details">
                                            <SearchIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            );
                        })
                    }
                </List>
            </React.Fragment>}
        </div>
    )
}

function generateMarvelDbUrl(issue) {
    let url = "https://marvel.fandom.com/wiki/" + encodeURIComponent(issue.series.title) + "_Vol_" + issue.series.volume + "_" + issue.number;
    return url.replace(new RegExp(" ", 'g'), "_");
}

export default withContext(IssueDetailsUS);
