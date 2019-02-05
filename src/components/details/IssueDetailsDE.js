import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar/GridListTileBar";
import SearchIcon from '@material-ui/icons/Search';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Chip from "@material-ui/core/Chip/Chip";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import {Link} from "react-router-dom";
import {withContext} from "../generic";
import {generateUrl} from "../../util/hierarchiy";
import IssueDetails from "./IssueDetails";
import {generateStoryTitle} from "../../util/issues";

function IssueDetailsDE(props) {
    return <IssueDetails issueStoryTitle={<IssueStoryTitle/>}
                         issueStoryDetails={<IssueStoryDetails/>}
                         issueDetailsVariants={<IssueDetailsVariants/>}
                         subheader/>
}

function IssueStoryTitle(props) {
    return (
        <div className="storyTitle">
            <Typography className="heading">{generateStoryTitle(props.story)}</Typography>

            <div className="chips">
                {
                    props.story.parent && props.story.parent.children.length < 2 ?
                        Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600 ?
                            <Chip className="chip" label="Einzige Ausgabe" color="secondary"
                                  icon={<PriorityHighIcon/>}/>
                            : <Chip className="chip" label={<PriorityHighIcon className="
                            mobileChip"/>}
                                    color="secondary"/>
                        : null
                }

                {
                    props.story.firstapp && props.story.parent ?
                        <Chip className="chip"
                              label={Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600 ? "Erstausgabe" : "1."}
                              color="primary"/>
                        : null
                }

                <Tooltip title="Zur US Ausgabe">
                    <IconButton className="detailsIcon"
                                component={Link}
                                to={generateUrl(props.story.parent.issue, true)}
                                aria-label="Details">
                        <SearchIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

function IssueStoryDetails(props) {
    return <div></div>;
}

function IssueDetailsVariants(props) {
    if (props.selected.variants.length === 0)
        return null;

    let variants = [];
    variants.push(<IssueDetailsVariant to={generateUrl(props.issue, false)}
                                       key={props.issue} variant={props.issue}/>);

    props.selected.variants.forEach(variant => {
        variant.series = props.selected.series;
        variant.number = props.selected.number;

        variants.push(<IssueDetailsVariant to={generateUrl(variant, false)}
                                           key={variant.id} variant={variant}/>);
    });

    return (
        <React.Fragment>
            <Typography className="coverGalleryHeader" component="p">
                Erhältlich in {props.selected.variants.length + 1} Varianten
            </Typography>

            <div className="coverGallery">
                <GridList className="gridList" cols={2.5}>
                    {variants}
                </GridList>
            </div>
        </React.Fragment>
    );
}

function IssueDetailsVariant(props) {
    return (
        <GridListTile component={Link} to={props.to} className="tile" key={props.variant.id}>
            <img src={props.variant.cover.url}
                 alt={props.variant.variant + ' (' + props.variant.format + ')'}/>
            <GridListTileBar
                title={(props.variant.variant ? props.variant.variant : 'Reguläre Ausgabe') + ' (' + props.variant.format + ')'}
                classes={{
                    root: "titleBar",
                    title: "title",
                }}
            />
        </GridListTile>
    );
}

export default withContext(IssueDetailsDE);