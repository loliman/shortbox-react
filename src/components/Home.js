import React from "react";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import Layout from "./Layout";
import {lastEdited} from "../graphql/queries";
import QueryResult from "./generic/QueryResult";
import {withContext} from "./generic";
import IssuePreview, {IssuePreviewPlaceholder} from "./IssuePreview";
import PaginatedQuery from "./generic/PaginatedQuery";

class Home extends React.Component {
    componentDidMount() {
        this.props.registerLoadingComponent(this.constructor.name);
    }

    render() {
        return (
            <PaginatedQuery query={lastEdited} variables={{filter: {us: this.props.us}}}
                            onCompleted={() => this.props.unregisterLoadingComponent(this.constructor.name)}>
                {({error, data, fetchMore, fetching, hasMore}) => {
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
                            {
                                (this.props.appIsLoading || error || !data.lastEdited) ?
                                    <QueryResult error={error} placeholder={<HomePlaceholder/>} placeholderCount={1}/> :
                                    (
                                        <React.Fragment>
                                            <CardHeader title="Willkommen auf Shortbox "
                                                        subheader="Das deutsche Archiv für Marvel Comics "/>

                                            <CardContent className="cardContent">
                                                <Typography>
                                                    Shortbox listet alle deutschen Marvel Veröffentlichungen detailliert auf und ordnet diese den entsprechenden US Geschichten zu.<br /><br />

                                                    Angefangen über Geschichten der bekanntesten Superhelden Spider-Man, Deadpool, den X-Men oder den Avengers oder unbekannteren Helden wie Moon Knight und den New Mutants, über Comics zum
                                                    Marvel Cinematic Universe mit Captain America, Captain Marvel und Iron Man bis hin zu Western-Comics, Horror-Comics und Kinder-Comics wie den Glücksbärchis
                                                    oder der Police Acadamy findet ihr hier alle Veröffentlichungen in offiziellen Ausgaben, Raubkopien oder Fan-Comics.<br /><br />

                                                    Inspiriert durch <a href="http://www.maxithecat.de/UHBMCC/INDEX.HTM" rel="noopener noreferrer nofollow" target="_blank">maxithecat's UHBMCC</a> wurde
                                                    Shortbox 2018 ins Leben gerufen. Shortbox ist ein vollständig privates Projekt von mir für alle Marvel Fans.<br />
                                                    Aus diesem Grund unterliegen alle auf Shortbox gelisteten Informationen der&nbsp;
                                                    <a href="https://creativecommons.org/licenses/by/3.0/de/" rel="noopener noreferrer nofollow"
                                                       target="_blank">Creative Commons License 3.0</a> und stehen somit, unter Angabe der Quelle,
                                                    jedem zur freien und kostenlosen Verfügung.
                                                </Typography>

                                                <br />
                                                <br />

                                                <div className="history">
                                                    {data.lastEdited.map((i, idx) => <IssuePreview {...this.props} key={idx} issue={i}/>)}

                                                    {loading}
                                                </div>
                                            </CardContent>
                                        </React.Fragment>
                                    )
                            }
                        </Layout>
                    )
                }}
            </PaginatedQuery>
        );
    }
}

function HomePlaceholder(props) {
    return (
        <React.Fragment>
            <CardHeader
                title={
                    <div className="ui placeholder">
                        <div className="header">
                            <div className="short line"/>
                        </div>
                    </div>
                }
                subheader={
                    <div className="ui placeholder">
                        <div className="short line"/>
                    </div>
                }
            />

            <CardContent className="cardContent">
                <br />

                <div className="ui placeholder">
                    <div className="very long line"/>
                </div>

                <br />

                <div className="ui placeholder">
                    <div className="full line"/>
                    <div className="full line"/>
                    <div className="very short line"/>
                </div>

                <br />

                <div className="ui placeholder">
                    <div className="medium line"/>
                    <div className="very long line"/>
                </div>

                <br />
                <br />

                <div className="history">
                    <IssuePreviewPlaceholder />
                    <IssuePreviewPlaceholder />
                    <IssuePreviewPlaceholder />
                    <IssuePreviewPlaceholder />
                    <IssuePreviewPlaceholder />
                    <IssuePreviewPlaceholder />
                </div>
            </CardContent>
        </React.Fragment>
    )
}

export default withContext(Home);
