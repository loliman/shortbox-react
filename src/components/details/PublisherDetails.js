import React from 'react'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Layout from "../Layout";
import {Query} from "react-apollo";
import QueryResult from "../generic/QueryResult";
import {lastEdited, publisher} from "../../graphql/queries";
import {generateLabel, getSelected} from "../../util/hierarchy";
import Typography from "@material-ui/core/es/Typography/Typography";
import EditButton from "../restricted/EditButton";
import withContext from "../generic/withContext";
import IssuePreview, {IssuePreviewPlaceholder} from "../IssuePreview";
import PaginatedQuery from "../generic/PaginatedQuery";

class PublisherDetails extends React.Component {
    componentDidMount() {
        this.props.registerLoadingComponent("PublisherDetails_history");
        this.props.registerLoadingComponent("PublisherDetails_details");
    }

    render() {
        let selected = getSelected(this.props.match.params);

        return (
            <PaginatedQuery query={lastEdited} variables={{filter: {us: this.props.us, publishers: [{name: this.props.selected.publisher.name}]}}}
                            onCompleted={() => this.props.unregisterLoadingComponent("PublisherDetails_history")}>
                {({error, data, fetchMore, fetching, hasMore}) => {
                    let lastEdited = data ? data.lastEdited : [];
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
                            <Query query={publisher} variables={{publisher: {name: this.props.selected.publisher.name, us: this.props.us}}} notifyOnNetworkStatusChange
                                   onCompleted={() => this.props.unregisterLoadingComponent("PublisherDetails_details")}
                                   onError={() => this.props.unregisterLoadingComponent("PublisherDetails_details")}>
                                {({error, data}) => {
                                    if (this.props.appIsLoading || error || lastEditedError || !data.publisher)
                                        return <QueryResult error={error || lastEditedError} data={data ? data.publisher : null}
                                                            selected={selected}
                                                            placeholder={<PublisherDetailsPlaceholder />}
                                                            placeholderCount={1}/>;

                                    let first = data.publisher.issueCount === 1 ? (data.publisher.active ? "Bisher einziges " : "Einziges ") : "Erstes ";
                                    return (
                                        <React.Fragment>
                                            <CardHeader title={generateLabel(data.publisher)}
                                                        action={<EditButton item={data.publisher}/>}/>

                                            <CardContent className="cardContent">
                                                <Typography variant="h6">Allgemeine Informationen</Typography>

                                                <br />

                                                <Typography>Gründung: {data.publisher.startyear}</Typography>
                                                <Typography>Auflösung: {data.publisher.active ? "noch aktiv" : data.publisher.endyear}</Typography>

                                                <Typography>
                                                    {
                                                        !this.props.us ?
                                                            "Anzahl Serien mit Marvel Material: " :
                                                            "Anzahl Serien mit auf deutsch vorliegendem Material: "
                                                    }
                                                    {data.publisher.seriesCount}
                                                </Typography>

                                                <Typography>
                                                    {
                                                        !this.props.us ?
                                                            "Anzahl Comics mit Marvel Material: " :
                                                            "Anzahl Comics mit auf deutsch vorliegendem Material: "
                                                    }
                                                    {data.publisher.issueCount}
                                                </Typography>

                                                <br />
                                                <br />
                                                {
                                                    data.publisher.addinfo ?
                                                        <React.Fragment>
                                                            <Typography dangerouslySetInnerHTML={{__html: data.publisher.addinfo}} />

                                                            <br />
                                                            <br />
                                                        </React.Fragment> : null
                                                }

                                                {
                                                    data.publisher.firstIssue ?
                                                        <React.Fragment>
                                                            <Typography variant="h6">
                                                                {
                                                                    !this.props.us ?
                                                                        first + "veröffentlichtes Comic mit Marvel Material" :
                                                                        "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                                                                }
                                                            </Typography>

                                                            <br/>

                                                            <IssuePreview {...this.props} issue={data.publisher.firstIssue}/>

                                                            <br/>
                                                        </React.Fragment> : null
                                                }

                                                {
                                                    data.publisher.lastIssue && data.publisher.issueCount > 1 ?
                                                        <React.Fragment>
                                                            <Typography variant="h6">
                                                                {
                                                                    !this.props.us ?
                                                                        "Letztes veröffentlichtes Comic mit Marvel Material" :
                                                                        "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                                                                }
                                                            </Typography>

                                                            <br/>

                                                            <IssuePreview {...this.props} issue={data.publisher.lastIssue}/>

                                                            <br/>
                                                        </React.Fragment> : null
                                                }

                                                <Typography variant="h6">Letzte Änderungen</Typography>

                                                <br />

                                                <div className="history">
                                                    {
                                                        lastEdited.map((i, idx) => <IssuePreview {...this.props} key={idx} issue={i}/>)
                                                    }

                                                    {loading}
                                                </div>
                                            </CardContent>
                                        </React.Fragment>
                                    );
                                }}
                            </Query>
                        </Layout>
                    )
                }}
            </PaginatedQuery>
        )
    }
}

function PublisherDetailsPlaceholder(props) {
    return (
        <React.Fragment>
            <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                <div className={"header"}>
                    <div className="medium line"/>
                </div>
            </div>} />

            <CardContent className="cardContent">
                <br />
                <div className="ui placeholder">
                    <div className="header">
                        <div className="short line"/>
                    </div>
                </div>

                <br />

                <div className="ui placeholder placeholderTypographyLine"><div className="very short line"/></div>
                <div className="ui placeholder placeholderTypographyLine"><div className="very short line"/></div>
                <div className="ui placeholder placeholderTypographyLine"><div className="short line"/></div>
                <div className="ui placeholder placeholderTypographyLine"><div className="short line"/></div>

                <br />
                <br />
                <br />

                <div className="ui placeholder">
                    <div className="header">
                        <div className="long line"/>
                    </div>
                </div>

                <br/>

                <IssuePreviewPlaceholder />

                <br/>
                <br />

                <div className="ui placeholder">
                    <div className="header">
                        <div className="long line"/>
                    </div>
                </div>

                <br/>

                <IssuePreviewPlaceholder />
                <br />
                <br />

                <div className="ui placeholder">
                    <div className="header">
                        <div className="long line"/>
                    </div>
                </div>

                <br />

                <div className="history">
                    <IssuePreviewPlaceholder key={1} />
                    <IssuePreviewPlaceholder key={2} />
                    <IssuePreviewPlaceholder key={3} />
                    <IssuePreviewPlaceholder key={4} />
                    <IssuePreviewPlaceholder key={5} />
                </div>
            </CardContent>
        </React.Fragment>
    );
}

export default withContext(PublisherDetails);
