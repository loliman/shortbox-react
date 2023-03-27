import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import {withContext} from "../generic";
import {generateLabel} from "../../util/hierarchy";
import IssueDetails, {
    AppearanceList,
    Contains,
    ContainsTitleDetailed,
    ContainsTitleSimple,
    DetailsRow, IndividualList, toChipList, toShortboxDate
} from "./IssueDetails";
import CoverTooltip from "../CoverTooltip";

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
                        value={toShortboxDate(dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy"))}/>
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
                      itemDetails={<StoryDetails issue={props.issue} session={props.session}/>}/>

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
    let story = props.item.parent ? props.item.parent : props.item;

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

            {!props.item.reprintOf ? null :
                <React.Fragment>
                    <br/>

                    <Typography variant="h6">Nachdruck von</Typography>

                    <List className="issueStoryIssueList">

                        <ListItem className="issueStoryIssueItem">
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
                            <CoverTooltip issue={props.item.reprintOf.issue} us={props.us} number={props.item.reprintOf.number} />
                        </ListItem>
                    </List>
                </React.Fragment>
            }

            {!story.reprints || story.reprints.length === 0 ? null :
                <React.Fragment>
                    <br/>

                    <Typography variant="h6">Nachgedruckt in</Typography>

                    <List className="issueStoryIssueList">
                        {
                            story.reprints.map((child, idx) => {
                                if (!child.issue)
                                    return null;

                                return (
                                    <ListItem key={idx} className="issueStoryIssueItem" divider={story.reprints.length-1 !== idx}>
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
                                        <CoverTooltip issue={child.issue} us={props.us} number={child.number} />
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </React.Fragment>
            }

            {props.item.children.length === 0 ? null :
            <React.Fragment>
                <br/>

                <Typography variant="h6">Auf deutsch erschienen in</Typography>

                <List className="issueStoryIssueList">
                    {
                        props.item.children.map((child, idx) => {
                            if (!child.issue)
                                return null;

                            let addinfoText = "";
                            if (child.part && child.part !== null && child.part.indexOf("/x") === -1) {
                                addinfoText += "Teil " + child.part.replace("/", " von ");
                            }
                            if(addinfoText !== "" && child.addinfo && child.addinfo !== null) {
                                addinfoText += ", ";
                            }
                            if(child.addinfo && child.addinfo !== null) {
                                addinfoText += child.addinfo;
                            }

                            return (
                                <ListItem key={idx} className="issueStoryIssueItem" divider={props.item.children.length-1 !== idx}>
                                    <div>
                                        <div className="headingContainer">
                                            <Typography
                                                className="issueStoryIssue">{generateLabel(child.issue.series) + " #" + child.issue.number} {child.issue.title ? "- " + child.issue.title : ""}</Typography>

                                            <Typography className="issueStoryIssue issueStoryIssuePublisher">
                                                    {generateLabel(child.issue.series.publisher)}
                                            </Typography>
                                        </div>

                                        {
                                            child.parent.issue.number === props.issue.number
                                            && child.parent.issue.series.title === props.issue.series.title
                                            && child.parent.issue.series.volume === props.issue.series.volume
                                                ? null
                                                : <CoverTooltip issue={child.parent.issue} us={props.us} number={child.parent.number} />
                                        }

                                        {addinfoText !== "" ? <Typography className="parentTitle">{addinfoText}</Typography> : null}
                                    </div>

                                    <div style={{display: "flex", alignItems: "center"}}>
                                        {
                                            child.issue.collected && props.session ?  <img src="/collected_badge.png" height={25} style={{justifySelf: "center"}}
                                                                          alt="gesammelt"/> : null
                                        }

                                        <CoverTooltip issue={child.issue} us={props.us} number={child.number} />
                                    </div>
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
