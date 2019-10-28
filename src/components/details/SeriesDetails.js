import React from 'react'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {generateLabel, getSelected} from "../../util/hierarchy";
import Layout from "../Layout";
import {Query} from "react-apollo";
import QueryResult from "../generic/QueryResult";
import {seriesd} from "../../graphql/queries";
import Typography from "@material-ui/core/es/Typography/Typography";
import EditButton from "../restricted/EditButton";
import IssuePreview, {IssuePreviewPlaceholder} from "../IssuePreview";
import withContext from "../generic/withContext";

function SeriesDetails(props) {
    let selected = getSelected(props.match.params);

    return (
        <Layout>
            <Query query={seriesd} variables={selected}>
                {({loading, error, data}) => {
                    if (loading || error || !data.seriesd)
                        return <QueryResult loading={loading} error={error} data={data ? data.seriesd : null}
                                            selected={selected}
                                            placeholder={<SeriesDetailsPlaceholder />}
                                            placeholderCount={1}/>;

                    let first = data.seriesd.issueCount === 1 ? (data.seriesd.active ? "Bisher einziges " : "Einziges ") : "Erstes ";
                    return(
                        <React.Fragment>
                            <CardHeader title={generateLabel(data.seriesd)}
                                        action={<EditButton item={data.seriesd}/>}/>

                            <CardContent className="cardContent">
                                <Typography variant="h6">Allgemeine Informationen</Typography>

                                <br />

                                <Typography>Gestartet: {data.seriesd.startyear}</Typography>
                                <Typography>Beendet: {data.seriesd.active ? "läuft noch" : data.seriesd.endyear}</Typography>
                                <Typography>
                                    {
                                        !props.us ?
                                            "Anzahl Comics mit Marvel Material: " :
                                            "Anzahl Comics mit auf deutsch vorliegendem Material: "
                                    }
                                    {data.seriesd.issueCount}
                                </Typography>

                                <br />
                                <br />
                                {
                                    data.seriesd.addinfo ?
                                        <React.Fragment>
                                            <Typography dangerouslySetInnerHTML={{__html: data.seriesd.addinfo}} />

                                            <br />
                                            <br />
                                        </React.Fragment> : null
                                }

                                {
                                    data.seriesd.firstIssue ?
                                        <React.Fragment>
                                            <Typography variant="h6">
                                                {
                                                    !props.us ?
                                                        first + "veröffentlichtes Comic mit Marvel Material" :
                                                        "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                                                }
                                            </Typography>

                                            <br/>

                                            <IssuePreview {...props} issue={data.seriesd.firstIssue}/>

                                            <br/>
                                        </React.Fragment> : null
                                }

                                {
                                    data.seriesd.lastIssue && data.seriesd.issueCount > 1 ?
                                        <React.Fragment>
                                            <Typography variant="h6">
                                                {
                                                    !props.us ?
                                                        "Letztes veröffentlichtes Comic mit Marvel Material" :
                                                        "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                                                }
                                            </Typography>

                                            <br/>

                                            <IssuePreview {...props} issue={data.seriesd.lastIssue}/>

                                            <br/>
                                        </React.Fragment> : null
                                }

                                <Typography variant="h6">Letzte Änderungen</Typography>

                                <br />

                                <div className="history">
                                    {
                                        data.seriesd.lastEdited.map((i, idx) => <IssuePreview {...props} key={idx} issue={i}/>)
                                    }
                                </div>
                            </CardContent>
                        </React.Fragment>
                    );
                }}
            </Query>
        </Layout>
    )
}

function SeriesDetailsPlaceholder(props) {
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

export default withContext(SeriesDetails);
