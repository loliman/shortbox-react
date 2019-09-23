import React from "react";
import {toChipList} from "../../util/util";
import Typography from "@material-ui/core/Typography/Typography";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import {withContext} from "../generic";
import {generateLabel, generateUrl} from "../../util/hierarchy";
import IssueDetails, {
    Contains,
    ContainsTitleDetailed,
    ContainsTitleSimple,
    DetailsRow, IndividualList
} from "./IssueDetails";

var dateFormat = require('dateformat');

function IssueDetailsUS(props) {
    return <IssueDetails bottom={<Bottom/>}
                         details={<Details/>}
                         subheader/>
}

function Details(props) {
    return (
        <React.Fragment>
            <DetailsRow key="releasedate" label="Erscheinungsdatum"
                        value={dateFormat(new Date(props.issue.releasedate), "dd.mm.yyyy")}/>
            <DetailsRow key="coverartists" label="Cover Artists"
                        value={toChipList(props.issue ? props.issue.cover.artists : null, props, "artists",  true)}/>
            <DetailsRow key="editor" label="Editor"
                        value={toChipList(props.issue.editors, props, "editors",  true)}/>
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
                      items={props.issue.stories} itemTitle={<ContainsTitleSimple/>}
                      itemDetails={<StoryDetails/>}/>

            <br/>
            <br/>

            <Contains {...props} header="Cover erschienen in"
                      noEntriesHint="Das Cover ist noch keinen deutschen Ausgaben zugeordnet"
                      items={props.issue.covers[0] ? props.issue.covers[0].children.map(c => c.issue) : []}
                      itemTitle={<ContainsTitleDetailed/>}/>

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
                <IndividualList us={props.us} navigate={props.navigate} label={"Autor"} type={"writers"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Zeichner"} type={"pencilers"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Inker"} type={"inkers"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Kolorist"} type={"colourists"} item={props.item} />
                <IndividualList us={props.us} navigate={props.navigate} label={"Letterer"} type={"letterers"} item={props.item} />

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

            {props.item.children.length === 0 ? null :
            <React.Fragment>
                <br/>

                <List className="issueStoryIssueList">
                    {
                        props.item.children.map((child, idx) => {
                            if (!child.issue)
                                return null;

                            return (
                                <ListItem key={idx} className="issueStoryIssueItem" divider={props.item.children.length-1 !== idx}>
                                    <div>
                                        <Typography
                                            className="issueStoryIssue">{generateLabel(child.issue.series) + " #" + child.issue.number}</Typography>
                                        <Typography className="issueStoryIssue issueStoryIssuePublisher">
                                            {generateLabel(child.issue.series.publisher)}
                                        </Typography>
                                    </div>
                                    <Tooltip title="Zur Ausgabe">
                                        <IconButton className="detailsIcon issueStoryIssueButton"
                                                    onClick={() => props.navigate(generateUrl(child.issue))}
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