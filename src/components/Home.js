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
                <Query query={lastEdited}>
                    {({loading, error, data}) => {
                        if (loading || error || !data.lastEdited)
                            return <QueryResult loading={loading} error={error} />;

                        return data.lastEdited.map((i) => <IssuePreview {...props} key={i.id} issue={i} />);
                    }}
                </Query>
            </CardContent>
        </Layout>
    );
}

function IssuePreview(props) {
    let date = props.issue.updatedAt.split(" ")[0];
    if(date === today()) date = "heute";
    else date = "am " + date;

    let time = props.issue.updatedAt.split(" ")[1];

    return (
        <Card className="issuePreview" onClick={() => props.history.push(generateUrl(props.issue), false)}>
            <CardHeader title={generateLabel(props.issue.series) + " #" + props.issue.number}
                        subheader={generateLabel(props.issue.series.publisher)}/>

            <CardContent>
                {
                    props.issue.createdAt === props.issue.updatedAt ?
                        <Typography>Hinzugefügt {date} um {time}</Typography> :
                        <Typography>Zuletzt bearbeitet {date} um {time}</Typography>
                }
            </CardContent>
        </Card>
    );
}

export default withContext(Home);