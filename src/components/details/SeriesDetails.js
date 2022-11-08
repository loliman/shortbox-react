import React from 'react'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {generateLabel} from "../../util/hierarchy";
import Layout from "../Layout";
import {Query} from "react-apollo";
import QueryResult from "../generic/QueryResult";
import {lastEdited, seriesd} from "../../graphql/queries";
import Typography from "@material-ui/core/es/Typography/Typography";
import EditButton from "../restricted/EditButton";
import IssuePreview, {IssuePreviewPlaceholder} from "../IssuePreview";
import withContext from "../generic/withContext";
import PaginatedQuery from "../generic/PaginatedQuery";
import {Card} from "@material-ui/core";
import IssuePreviewSmall, {IssuePreviewPlaceholderSmall} from "../IssuePreviewSmall";

class SeriesDetails extends React.Component {
    componentDidMount() {
        this.props.registerLoadingComponent("SeriesDetails_history");
        this.props.registerLoadingComponent("SeriesDetails_details");
    }

    render() {
        return (
            <PaginatedQuery query={lastEdited} variables={{
                filter: {
                    us: this.props.us,
                    series: [{
                        title: this.props.selected.series.title,
                        volume: this.props.selected.series.volume
                    }],
                    publishers: [{
                        name: this.props.selected.series.publisher.name
                    }]
                }
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
                                                            placeholder={<SeriesDetailsPlaceholder />}
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
                                                            <br />

                                                            <Typography dangerouslySetInnerHTML={{__html: data.seriesd.addinfo}} />

                                                            <br />
                                                        </React.Fragment> : null
                                                }

                                                {
                                                    data.seriesd.firstIssue ?
                                                        <Card>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    first + "veröffentlichtes Comic mit Marvel Material" :
                                                                    "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.seriesd.firstIssue}/>
                                                            </CardContent>
                                                        </Card>: null
                                                }

                                                <br />

                                                {
                                                    data.seriesd.lastIssue && data.seriesd.issueCount > 1 ?
                                                        <Card>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    "Letztes veröffentlichtes Comic mit Marvel Material" :
                                                                    "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.seriesd.lastIssue}/>
                                                            </CardContent>
                                                        </Card> : null
                                                }

                                                <br />

                                                <Card>
                                                    <CardHeader title="Letzte Änderungen"/>

                                                    <CardContent>
                                                        {
                                                            lastEdited.map((i, idx) => <IssuePreviewSmall {...this.props} key={idx} issue={i}/>)
                                                        }
                                                    </CardContent>
                                                </Card>
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
                <Card>
                    <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                        <div className={"header"}>
                            <div className="medium line"/>
                        </div>
                    </div>} />
                    <CardContent>
                        <IssuePreviewPlaceholder />
                    </CardContent>
                </Card>

                <br/>

                <Card>
                    <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                        <div className={"header"}>
                            <div className="medium line"/>
                        </div>
                    </div>} />
                    <CardContent>
                        <IssuePreviewPlaceholder />
                    </CardContent>
                </Card>

                <br />

                <Card>
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
                </Card>
            </CardContent>
        </React.Fragment>
    );
}

export default withContext(SeriesDetails);
