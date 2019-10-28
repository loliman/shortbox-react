import React from "react";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import Layout from "./Layout";
import {lastEdited} from "../graphql/queries";
import {Query} from "react-apollo";
import QueryResult from "./generic/QueryResult";
import {withContext} from "./generic";
import IssuePreview, {IssuePreviewPlaceholder} from "./IssuePreview";

function Home(props) {
    return (
        <Layout>
            <CardHeader title="Willkommen auf Shortbox "
                        subheader="Das deutsche Archiv für Marvel Comics "/>

            <CardContent className="cardContent">
                <Typography>
                    Shortbox listet alle deutschen Marvel Veröffentlichungen detailliert auf und ordnet diese den entsprechenden US Geschichten zu.<br /><br />

                    Angefangen über Geschichten der bekanntesten Superhelden Spider-Man, Deadpool, den X-Men oder den Avengers oder unbekannteren Helden wie Moon Knight und den New Mutants, über Comics zum
                    Marvel Cinematic Universe mit Captain America, Captain Marvel und Iron Man bis hin zu Western-Comics, Horror-Comics und Kinder-Comics wie den Glücksbärchis
                    oder der Police Acadamy findet ihr hier alle Veröffentlichungen in offiziellen Ausgaben, Raubkopien oder Fan-Comics.<br /><br />

                    Shortbox wurde 2018 gestartet und ist privates Projekt von mir für alle Marvel Fans.<br />
                    Aus diesem Grund unterliegen alle auf Shortbox gelisteten Informationen der&nbsp;
                        <a href="https://creativecommons.org/licenses/by/3.0/de/" rel="noopener noreferrer nofollow"
                           target="_blank">Creative Commons License 3.0</a> und stehen somit, unter Angabe der Quelle,
                        jedem zur freien und kostenlosen Verfügung.
                </Typography>

                <br />
                <br />

                <div className="history">
                    <Query query={lastEdited} variables={{us: props.us}}>
                        {({loading, error, data}) => {
                            if (loading || error || !data.lastEdited)
                                return <QueryResult loading={loading} error={error}
                                                    placeholder={<IssuePreviewPlaceholder />}
                                                    placeholderCount={7}/>;

                            return data.lastEdited.map((i, idx) => <IssuePreview {...props} key={idx} issue={i}/>);
                        }}
                    </Query>
                </div>
            </CardContent>
        </Layout>
    );
}

export default withContext(Home);
