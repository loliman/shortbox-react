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
import {pagesArrayToString} from "../../util/util";
import Chip from "@material-ui/core/Chip/Chip";

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
                        value={toChipList(props.issue && props.issue.cover && props.issue.cover.individuals
                            ? props.issue.cover.individuals.filter(item => item.type.includes('ARTIST'))
                            : null, props, "ARTIST")}/>
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

            <Contains {...props} header="Geschichten"
                      noEntriesHint="Dieser Ausgabe sind noch keine Geschichten zugeordnet"
                      items={props.issue.stories} itemTitle={<ContainsTitleSimple {...props}/>}
                      itemDetails={<StoryDetails/>}/>

            <br/>
            <br/>

            <Contains {...props} header="Cover erschienen in"
                      noEntriesHint="Das Cover ist noch keinen deutschen Ausgaben zugeordnet"
                      items={props.issue.covers[0] ? props.issue.covers[0].children.map(c => c.issue) : []}
                      itemTitle={<ContainsTitleDetailed {...props}/>}/>

            <br/>
            <br/>

            {!props.issue.edited ?
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
                . Die Informationen wurden aufbereitet und unter Umständen ergänzt.&nbsp;
            </Typography> : null }
        </React.Fragment>
    );
}

function StoryDetails(props) {
    let story = props.item.parent ? props.item.parent : props.item;
    let smallChip = props.mobile || props.mobileLandscape || ((props.tablet || props.tabletLandscape) && props.drawerOpen);

    return (
        <div className="usStoryContainer">
            <div className="usStoryDetails">
                {!props.item.reprintOf ? null :
                    <React.Fragment>
                        <Typography variant="h6">Nachdruck von</Typography>

                        <List className="issueStoryIssueList">
                            <ListItem className="issueStoryIssueReprint">
                                <div>
                                    <div className="headingContainer">
                                        <Typography
                                            className="issueStoryIssue">{generateLabel(props.item.reprintOf.issue.series) + " #" + props.item.reprintOf.issue.number}</Typography>
                                        <Typography className="parentTitle">
                                            {props.item.reprintOf.addinfo ? props.item.reprintOf.addinfo : null}
                                        </Typography>
                                    </div>
                                    <Typography className="issueStoryIssue issueStoryIssuePublisher">
                                        {generateLabel(props.item.reprintOf.issue.series.publisher)}
                                    </Typography>
                                </div>
                                <Tooltip title="Zur Ausgabe">
                                    <IconButton className="detailsIcon issueStoryIssueButton"
                                                onClick={() => props.navigate(generateUrl(props.item.reprintOf.issue, true), {filter: null})}
                                                aria-label="Details">
                                        <SearchIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        </List>
                    </React.Fragment>
                }

                {!story.reprints || story.reprints.length === 0 ? null :
                    <React.Fragment>
                        <Typography variant="h6">Nachgedruckt in</Typography>

                        <List className="issueStoryIssueList">
                            {
                                story.reprints.map((child, idx) => {
                                    if (!child.issue)
                                        return null;

                                    return (
                                        <ListItem key={idx} className="issueStoryIssueReprint" divider={story.reprints.length-1 !== idx}>
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
                                                            onClick={() => props.navigate(generateUrl(child.issue, true), {filter: null})}
                                                            aria-label="Details">
                                                    <SearchIcon fontSize="small"/>
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>
                                    );
                                })
                            }
                        </List>
                    </React.Fragment>
                }

                <Typography variant="h6">Mitwirkende</Typography>
                <IndividualList us={props.us} navigate={props.navigate} label={"Autor"} type={"WRITER"} item={story} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Zeichner"} type={"PENCILER"} item={story} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Inker"} type={"INKER"} item={story} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Kolorist"} type={"COLORIST"} item={story} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Letterer"} type={"LETTERER"} item={story} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Übersetzer"} type={"TRANSLATOR"} item={story} hideIfEmpty={true}/>
                <IndividualList us={props.us} navigate={props.navigate} label={"Verleger"} type={"EDITOR"} item={story} />

                {
                    (story.parent ? story.parent.appearances.length : story.appearances.length) > 0 ?
                        (
                            <React.Fragment>
                                <br />
                                <Typography variant="h6">Auftritte</Typography>

                                <AppearanceList us={props.us} navigate={props.navigate} label={"Hauptcharaktere"} appRole={"FEATURED"} type={"CHARACTER"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Antagonisten"} appRole={"ANTAGONIST"} type={"CHARACTER"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Unterstützende Charaktere"} appRole={"SUPPORTING"} type={"CHARACTER"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Andere Charaktere"} appRole={"OTHER"} type={"CHARACTER"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Teams"} type={"GROUP"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Rassen"} type={"RACE"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Tiere"} type={"ANIMAL"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Gegenstände"} type={"ITEM"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Fahrzeuge"} type={"VEHICLE"} item={story} hideIfEmpty={true}/>
                                <AppearanceList us={props.us} navigate={props.navigate} label={"Orte"} type={"LOCATION"} item={story} hideIfEmpty={true}/>
                            </React.Fragment>
                        ) : null
                }

                {story.children.length === 0 ? null :
                <React.Fragment>
                    <br/>

                    <Typography variant="h6">Erschienen in</Typography>

                    <List className="issueStoryIssueList">
                        {
                            story.children.map((child, idx) => {
                                if (!child.issue)
                                    return null;

                                return (
                                    <ListItem key={idx} className="issueStoryIssueItem" divider={story.children.length-1 !== idx}>
                                        <div>
                                            <div className="headingContainer">
                                                <Typography
                                                    className="issueStoryIssue">{generateLabel(child.issue.series) + " #" + child.issue.number}</Typography>
                                                <Typography className="parentTitle">
                                                    {child.addinfo ? child.addinfo : null}
                                                </Typography>
                                                <Typography className="parentTitle">
                                                    {child.pages && child.pages.length > 0 ? "Seiten " + pagesArrayToString(child.pages) : null}
                                                </Typography>
                                                <Typography className="parentTitle">
                                                    &nbsp;
                                                    {child.coloured === false ? "Schwarz-Weiß" : null}
                                                </Typography>
                                            </div>
                                            <Typography className="issueStoryIssue issueStoryIssuePublisher">
                                                {generateLabel(child.issue.series.publisher)}
                                            </Typography>
                                        </div>
                                        <div className="chips">
                                            {
                                                child.firstapp ?
                                                    <Chip className="chip"
                                                          label={!smallChip ? "Erstveröffentlichung" : "1."}
                                                          color="primary"/>
                                                    : null
                                            }

                                            {
                                                child.firstpartly ?
                                                    <Chip className="chip"
                                                          label={!smallChip ? "Erste Teilveröffentlichung" : "1."}
                                                          color="primary"/>
                                                    : null
                                            }

                                            {
                                                child.firstcomplete ?
                                                    <Chip className="chip"
                                                          label={!smallChip ? "Erste Komplettveröffentlichung" : "1."}
                                                          color="primary"/>
                                                    : null
                                            }

                                            {
                                                child.firstsmall ?
                                                    <Chip className="chip"
                                                          label={!smallChip ? "Erstveröffentlichung (Verkleinert)" : "1."}
                                                          color="primary"/>
                                                    : null
                                            }

                                            {
                                                child.firstfullsize ?
                                                    <Chip className="chip"
                                                          label={!smallChip ? "Erstveröffentlichung (Originalgröße)" : "1."}
                                                          color="primary"/>
                                                    : null
                                            }

                                            {
                                                child.firstmonochrome ?
                                                    <Chip className="chip"
                                                          label={!smallChip ? "Erste S/W Veröffentlichung" : "1."}
                                                          color="primary"/>
                                                    : null
                                            }

                                            {
                                                child.firstcoloured ?
                                                    <Chip className="chip"
                                                          label={!smallChip ? "Erste Farbveröffentlichung" : "1."}
                                                          color="primary"/>
                                                    : null
                                            }

                                            <Tooltip title="Zur Ausgabe">
                                                <IconButton className="detailsIcon issueStoryIssueButton"
                                                            onClick={() => props.navigate(generateUrl(child.issue), {filter: null})}
                                                            aria-label="Details">
                                                    <SearchIcon fontSize="small"/>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </React.Fragment>}
            </div>
        </div>
    )
}

function generateMarvelDbUrl(issue) {
    let url = "https://marvel.fandom.com/wiki/" + encodeURIComponent(issue.series.title) + "_Vol_" + issue.series.volume + "_" + issue.number;
    return url.replace(new RegExp(" ", 'g'), "_");
}

export default withContext(IssueDetailsUS);
