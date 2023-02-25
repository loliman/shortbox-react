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
import IssuePreviewSmall, {IssuePreviewPlaceholderSmall} from "../IssuePreviewSmall";
import SortContainer from "../SortContainer";
import TitleLine from "../generic/TitleLine";

class PublisherDetails extends React.Component {
    componentDidMount() {
        this.props.registerLoadingComponent("PublisherDetails_history");
        this.props.registerLoadingComponent("PublisherDetails_details");
    }

    render() {
        let selected = getSelected(this.props.match.params);

        let filter;
        if(this.props.query && this.props.query.filter) {
            try {
                filter = JSON.parse(this.props.query.filter);
                filter.us = this.props.us;
                filter.publishers = [{
                    name: this.props.selected.publisher.name,
                    us: this.props.us
                }];
            } catch (e) {
                //
            }
        } else {
            filter = {us: this.props.us, publishers: [{name: this.props.selected.publisher.name, us: this.props.us}]};
        }

        return (
            <PaginatedQuery query={lastEdited} variables={{filter: filter,
                order: this.props.query && this.props.query.order ? this.props.query.order : 'updatedAt',
                direction: this.props.query && this.props.query.direction ? this.props.query.direction : 'DESC'}}
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
                                                            placeholder={<PublisherDetailsPlaceholder {...this.props} />}
                                                            placeholderCount={1}/>;

                                    let first = data.publisher.issueCount === 1 ? (data.publisher.active ? "Bisher einziges " : "Einziges ") : "Erstes ";
                                    return (
                                        <React.Fragment>
                                            <CardHeader title={<TitleLine title={generateLabel(data.publisher)} id={data.publisher.id} session={this.props.session}/>}
                                                        subheader={data.publisher.startyear + ' - ' + (data.publisher.active ? "heute" : data.publisher.endyear)}
                                                        action={<EditButton item={data.publisher}/>}/>

                                            <CardContent className="cardContent">
                                                {
                                                    data.publisher.addinfo ?
                                                        <React.Fragment>
                                                            <br />

                                                            <Typography dangerouslySetInnerHTML={{__html: data.publisher.addinfo}} />

                                                            <br />
                                                            <br />
                                                        </React.Fragment> : null
                                                }

                                                {
                                                    (!this.props.query || !this.props.query.filter) && data.publisher.firstIssue ?
                                                        <React.Fragment>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    first + "veröffentlichtes Comic mit Marvel Material" :
                                                                    "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.publisher.firstIssue}/>
                                                            </CardContent>
                                                        </React.Fragment>: null
                                                }

                                                { (!this.props.query || !this.props.query.filter) ? <br /> : null }

                                                {
                                                    (!this.props.query || !this.props.query.filter) && data.publisher.lastIssue && data.publisher.issueCount > 1 ?
                                                        <React.Fragment>
                                                            <CardHeader title= {
                                                                !this.props.us ?
                                                                    "Letztes veröffentlichtes Comic mit Marvel Material" :
                                                                    "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                                                            }/>

                                                            <CardContent>
                                                                <IssuePreview {...this.props} issue={data.publisher.lastIssue}/>
                                                            </CardContent>
                                                        </React.Fragment> : null
                                                }

                                                { (!this.props.query || !this.props.query.filter) ? <br /> : null }

                                                <React.Fragment>
                                                    <div style={{display: "flex", justifyContent: "end", marginRight: "1%"}}>
                                                        <SortContainer {...this.props} />
                                                    </div>

                                                    <br />

                                                    <CardContent>
                                                        {   lastEdited ?
                                                            lastEdited.map((i, idx) => <IssuePreviewSmall {...this.props} isLast={idx === lastEdited.length-1} idx={idx} key={idx} issue={i}/>) : null
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

            { !props.query || !props.query.filter ? <React.Fragment>
                <React.Fragment>
                    <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                        <div className={"header"}>
                            <div className="short line"/>
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
                            <div className="very short line"/>
                        </div>
                    </div>} />
                    <CardContent>
                        <IssuePreviewPlaceholderSmall idx={0}/>
                        <IssuePreviewPlaceholderSmall />
                        <IssuePreviewPlaceholderSmall />
                        <IssuePreviewPlaceholderSmall />
                        <IssuePreviewPlaceholderSmall isLast={true}/>
                    </CardContent>
                </React.Fragment>
            </CardContent>
        </React.Fragment>
    );
}

export default withContext(PublisherDetails);
