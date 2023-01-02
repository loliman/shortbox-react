import React from 'react'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {generateLabel, generateUrl} from "../../util/hierarchy";
import Layout from "../Layout";
import {Query} from "react-apollo";
import QueryResult from "../generic/QueryResult";
import {lastEdited, seriesd} from "../../graphql/queries";
import Typography from "@material-ui/core/es/Typography/Typography";
import EditButton from "../restricted/EditButton";
import IssuePreview, {IssuePreviewPlaceholder} from "../IssuePreview";
import withContext from "../generic/withContext";
import PaginatedQuery from "../generic/PaginatedQuery";
import {Select} from "@material-ui/core";
import IssuePreviewSmall, {IssuePreviewPlaceholderSmall} from "../IssuePreviewSmall";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

class SeriesDetails extends React.Component {
    componentDidMount() {
        this.props.registerLoadingComponent("SeriesDetails_history");
        this.props.registerLoadingComponent("SeriesDetails_details");
    }

    render() {
        let filter;

        if(this.props.query && this.props.query.filter) {
            try {
                filter = JSON.parse(this.props.query.filter);
                filter.us = this.props.us;
                filter.series = [{
                    title: this.props.selected.series.title,
                    volume: this.props.selected.series.volume,
                    publisher: {
                        us: this.props.us
                    }
                }];
                filter.publishers = [{
                    name: this.props.selected.series.publisher.name,
                    us: this.props.us
                }];
            } catch (e) {
                //
            }
        } else {
            filter = {
                us: this.props.us,
                series: [{
                    title: this.props.selected.series.title,
                    volume: this.props.selected.series.volume,
                    publisher: {
                        us: this.props.us
                    }
                }],
                publishers: [{
                    name: this.props.selected.series.publisher.name,
                    us: this.props.us
                }]
            };
        }

        return (
            <PaginatedQuery query={lastEdited} variables={{
                filter: filter,
                order: this.props.query ? this.props.query.order : 'updatedAt'
            }}
                onCompleted={() => this.props.unregisterLoadingComponent("SeriesDetails_history")}
            >
                {({error, data, fetchMore, hasMore, fetching}) => {
                    let lastEdited = data? data.lastEdited : [];
                    let lastEditedError = error;

                    let loading;
                    if(hasMore)
                        loading = (
                            <div className="ballsContainer">
                                {fetching ?
                                    <React.Fragment>
                                        <div className="ball ball-one" />
                                        <div className="ball ball-two" />
                                        <div className="ball ball-three" />
                                    </React.Fragment> : null}
                            </div>
                        );

                    return (
                        <Layout handleScroll={fetchMore}>
                            <Query query={seriesd} variables={this.props.selected} notifyOnNetworkStatusChange
                                   onCompleted={() => this.props.unregisterLoadingComponent("SeriesDetails_details")}
                                   onError={() => this.props.unregisterLoadingComponent("SeriesDetails_details")}>
                                {({error, data}) => {
                                    if (this.props.appIsLoading || error || lastEditedError || !data.seriesd)
                                        return <QueryResult error={error || lastEditedError} data={data ? data.seriesd : null}
                                                            selected={this.props.elected}
                                                            placeholder={<SeriesDetailsPlaceholder  {...this.props} />}
                                                            placeholderCount={1}/>;

                                    let first = data.seriesd.issueCount === 1 ? (data.seriesd.active ? "Bisher einziges " : "Einziges ") : "Erstes ";
                                    return(
                                        <React.Fragment>
                                            <CardHeader title={generateLabel(data.seriesd)}
                                                        subheader={data.seriesd.startyear + ' - ' + (data.seriesd.active ? "heute" : data.seriesd.endyear)}
                                                        action={<EditButton item={data.seriesd}/>}/>

                                            <CardContent className="cardContent">
                                                {
                                                    data.seriesd.addinfo ?
                                                        <React.Fragment>
                                                            <br />

                                                            <Typography dangerouslySetInnerHTML={{__html: data.seriesd.addinfo}} />

                                                            <br />
                                                            <br />
                                                        </React.Fragment> : null
                                                }

                                                {
                                                    (!this.props.query || !this.props.query.filter) && data.seriesd.firstIssue ?
                                                        <React.Fragment>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    first + "veröffentlichtes Comic mit Marvel Material" :
                                                                    "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.seriesd.firstIssue}/>
                                                            </CardContent>
                                                        </React.Fragment>: null
                                                }

                                                { (!this.props.query || !this.props.query.filter) ? <br /> : null }

                                                {
                                                    (!this.props.query || !this.props.query.filter) && data.seriesd.lastIssue && data.seriesd.issueCount > 1 ?
                                                        <React.Fragment>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    "Letztes veröffentlichtes Comic mit Marvel Material" :
                                                                    "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.seriesd.lastIssue}/>
                                                            </CardContent>
                                                        </React.Fragment> : null
                                                }

                                                { (!this.props.query || !this.props.query.filter) ? <br /> : null }

                                                <React.Fragment>
                                                    <FormControl className={"field field10"} style={{float:"right", width: "200px"}}>
                                                        <InputLabel id="demo-simple-select-label">Sortieren nach</InputLabel>
                                                        <Select
                                                            id="demo-simple-select"
                                                            value={this.props.query && this.props.query.order ? this.props.query.order : "updatedAt"}
                                                            label="Sortieren nach"
                                                            onChange={e =>
                                                                this.props.navigate(generateUrl(this.props.selected, this.props.us),
                                                                    {filter: this.props.query ? this.props.query.filter : null, order: e.target.value})}>
                                                            <MenuItem value={"updatedAt"}>Änderungsdatum</MenuItem>
                                                            <MenuItem value={"createdAt"}>Erfassungsdatum</MenuItem>
                                                            <MenuItem value={"releasedate"}>Erscheinungsdatum</MenuItem>
                                                            <MenuItem value={"series"}>Serie</MenuItem>
                                                            <MenuItem value={"publisher"}>Verlag</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    <br />
                                                    <br />
                                                    <br />

                                                    <CardContent>
                                                        {
                                                            lastEdited ? lastEdited.map((i, idx) => <IssuePreviewSmall {...this.props} key={idx} issue={i}/>) : null
                                                        }
                                                    </CardContent>
                                                </React.Fragment>
                                            </CardContent>

                                            {loading}
                                        </React.Fragment>
                                    );
                                }}
                            </Query>
                        </Layout>
                    )
                }}
            </PaginatedQuery>
        );
    }
}

function SeriesDetailsPlaceholder(props) {
    return (
        <React.Fragment>
            <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                <div className={"header"}>
                    <div className="medium line"/>
                    <div className="short line"/>
                </div>
            </div>} />

            <CardContent className="cardContent">
                { !props.query || !props.query.filter ? <React.Fragment>
                    <React.Fragment>
                        <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                            <div className={"header"}>
                                <div className="medium line"/>
                            </div>
                        </div>} />
                        <CardContent>
                            <IssuePreviewPlaceholder />
                        </CardContent>
                    </React.Fragment>

                    <br/>
                    <br/>

                    <React.Fragment>
                        <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                            <div className={"header"}>
                                <div className="medium line"/>
                            </div>
                        </div>} />
                        <CardContent>
                            <IssuePreviewPlaceholder />
                        </CardContent>
                    </React.Fragment>

                    <br /> </React.Fragment> : null}

                <React.Fragment>
                    <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                        <div className={"header"}>
                            <div className="medium line"/>
                        </div>
                    </div>} />
                    <CardContent>
                        <IssuePreviewPlaceholderSmall />
                        <IssuePreviewPlaceholderSmall />
                        <IssuePreviewPlaceholderSmall />
                        <IssuePreviewPlaceholderSmall />
                        <IssuePreviewPlaceholderSmall />
                    </CardContent>
                </React.Fragment>
            </CardContent>
        </React.Fragment>
    );
}

export default withContext(SeriesDetails);
