import React from 'react'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Layout from "../Layout";
import {Query} from "react-apollo";
import QueryResult from "../generic/QueryResult";
import {lastEdited, publisher} from "../../graphql/queries";
import {generateLabel, generateUrl, getSelected} from "../../util/hierarchy";
import Typography from "@material-ui/core/es/Typography/Typography";
import EditButton from "../restricted/EditButton";
import withContext from "../generic/withContext";
import IssuePreview, {IssuePreviewPlaceholder} from "../IssuePreview";
import PaginatedQuery from "../generic/PaginatedQuery";
import {Card, Select} from "@material-ui/core";
import IssuePreviewSmall, {IssuePreviewPlaceholderSmall} from "../IssuePreviewSmall";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

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
                order: this.props.query ? this.props.query.order : 'updatedAt'}}
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
                                                    !this.props.query.filter && data.publisher.firstIssue ?
                                                        <Card className={"issuePreview"}>
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

                                                { !this.props.query.filter ? <br /> : null }

                                                {
                                                    !this.props.query.filter && data.publisher.lastIssue && data.publisher.issueCount > 1 ?
                                                        <Card className={"issuePreview"}>
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

                                                { !this.props.query.filter ? <br /> : null }

                                                <Card className={"issuePreview"}>
                                                    <CardHeader title="Letzte Änderungen"/>

                                                    <CardContent>
                                                        <FormControl className={"field field10"} style={{float:"right", width: "200px"}}>
                                                            <InputLabel id="demo-simple-select-label">Sortieren nach</InputLabel>
                                                            <Select
                                                                id="demo-simple-select"
                                                                value={this.props.query && this.props.query.order ? this.props.query.order : "updatedAt"}
                                                                label="Sortieren nach"
                                                                onChange={e =>
                                                                    this.props.navigate(generateUrl(this.props.selected, this.props.us),
                                                                        {filter: this.props.query.filter, order: e.target.value})}>
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

            { !props.query.filter ? <React.Fragment>
                <Card className={"issuePreview"}>
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

                <Card className={"issuePreview"}>
                    <CardHeader title={<div className="ui placeholder cardHeaderPlaceholder">
                        <div className={"header"}>
                            <div className="medium line"/>
                        </div>
                    </div>} />
                    <CardContent>
                        <IssuePreviewPlaceholder />
                    </CardContent>
                </Card>

                <br /> </React.Fragment> : null}

                <Card className={"issuePreview"}>
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
