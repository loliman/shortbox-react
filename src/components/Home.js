import React from "react";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import Layout from "./Layout";
import {lastEdited} from "../graphql/queries";
import {Query} from "react-apollo";
import QueryResult from "./generic/QueryResult";
import {withContext} from "./generic";
import IssuePreview from "./IssuePreview";

function Home(props) {
    return (
        <Layout>
            <CardHeader title="Willkommen auf Shortbox"
                        subheader="Das deutsche Archiv für Marvel Comics"/>

            <CardContent className="cardContent">
                <Typography>
                    Shortbox.de ist ein 2018 gestartetes, privates Projekt von Marvel Fans für Marvel Fans, welches
                        den Anspruch hat, jede je erschienene deutsche Marvel-Veröffentlichung detailliert zu katalogisieren.<br />
                    Alle auf Shortbox.de gelisteten Informationen unterliegen der&nbsp;
                        <a href="https://creativecommons.org/licenses/by/3.0/de/" rel="noopener noreferrer nofollow"
                           target="_blank">Creative Commons License 3.0</a> und stehen somit, unter Angabe der Quelle,
                        jedem zur freien und kostenlosen Verfügung.
                </Typography>

                <br />
                <br />

                <Typography variant="h6">Letzte Änderungen</Typography>

                <br />
                
                <div className="history">
                    <Query query={lastEdited} variables={{us: props.us}}>
                        {({loading, error, data}) => {
                            if (loading || error || !data.lastEdited)
                                return <QueryResult loading={loading} error={error} />;

                            return data.lastEdited.map((i, idx) => <IssuePreview {...props} key={idx} issue={i}/>);
                        }}
                    </Query>
                </div>
            </CardContent>
        </Layout>
    );
}

export default withContext(Home);