import React from "react";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Typography from "@material-ui/core/Typography/Typography";
import Layout from "./Layout";

function Home(props) {
    let data = ["1", "2", "3", "4", "5", "6", "7", "8", "9",
        "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
        "20", "21", "22", "23", "24", "25"];

    return (
        <Layout>
            <CardHeader title="Willkommen auf Shortbox"
                        subheader="Das deutsche Archiv für Marvel Comics"/>

            <CardContent>
                <h3 className="lastAdded">Zuletzt hinzugefügt</h3>

                {data.map((i) => <IssuePreview key={i} issue={i} />)}
            </CardContent>
        </Layout>
    );
}

function IssuePreview(props) {
    return (
        <Card className="issuePreview">
            <CardHeader title="Test" subheader="Dies ist ein Issue"/>

            <CardContent>
                <Typography>1. Lorem ipsum</Typography>
                <Typography>2. Lorem ipsum</Typography>
            </CardContent>
        </Card>
    );
}

export default Home;