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
import {Card} from "@material-ui/core";
import IssuePreviewSmall, {IssuePreviewPlaceholderSmall} from "../IssuePreviewSmall";

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
                            <Query query={publisher} variables={selected} notifyOnNetworkStatusChange
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
                                                        subheader={data.publisher.startyear + ' - ' + (data.publisher.active ? "heute" : data.publisher.endyear)}
                                                        action={<EditButton item={data.publisher}/>}/>

                                            <CardContent className="cardContent">
                                                {
                                                    data.publisher.addinfo ?
                                                        <React.Fragment>
                                                            <br />
                                                            <br />

                                                            <Typography dangerouslySetInnerHTML={{__html: data.publisher.addinfo}} />

                                                            <br />
                                                        </React.Fragment> : null
                                                }

                                                {
                                                    data.publisher.firstIssue ?
                                                        <Card>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    first + "veröffentlichtes Comic mit Marvel Material" :
                                                                    "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.publisher.firstIssue}/>
                                                            </CardContent>
                                                        </Card>: null
                                                }

                                                <br />

                                                {
                                                    data.publisher.lastIssue && data.publisher.issueCount > 1 ?
                                                        <Card>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    "Letztes veröffentlichtes Comic mit Marvel Material" :
                                                                    "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.publisher.lastIssue}/>
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
        )
    }
}

function PublisherDetailsPlaceholder(props) {
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

export default withContext(PublisherDetails);
