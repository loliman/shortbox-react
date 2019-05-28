import React from "react";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Typography from "@material-ui/core/Typography/Typography";
import Layout from "./Layout";
import {lastEdited} from "../graphql/queries";
import {Query} from "react-apollo";
import QueryResult from "./generic/QueryResult";
import {generateLabel, generateUrl} from "../util/hierarchy";
import {today} from "../util/util";
import {withContext} from "./generic";

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

function IssuePreview(props) {
    let date = props.issue.updatedAt.split(" ")[0];
    if(date === today()) date = "heute";
    else date = "am " + date;

    let time = props.issue.updatedAt.split(" ")[1];

    let variant = '';
    if (props.issue.format) {
        variant += props.issue.format;
        if (props.issue.variant)
            variant += "/" + props.issue.variant;
    }

    return (
        <Card className="issuePreview" onClick={() => props.history.push(generateUrl(props.issue, props.us))}>
            <CardContent>
                <div id="issuePreviewTitleContainer">
                <Typography variant="subtitle1" id="issuePreviewTitle">{generateLabel(props.issue.series) + " #" + props.issue.number}</Typography>

                </div>
                {
                    variant !== '' ?
                        <Typography id="issuePreviewTitleVariant" variant={"caption"}>{variant}</Typography> :
                        null
                }
                <Typography variant="caption">{generateLabel(props.issue.series.publisher)}</Typography>

                <br />

                {
                    props.issue.createdAt === props.issue.updatedAt ?
                        <Typography>Hinzugefügt {date} um {time}</Typography> :
                        <Typography>Bearbeitet {date} um {time}</Typography>
                }
            </CardContent>
        </Card>
    );
}

export default withContext(Home);