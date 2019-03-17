import Layout from "./Layout";
import React from "react";
import {withContext} from "./generic";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

function Contact(props) {
    return (
        <Layout>
            <CardHeader title="Kontakt"/>

            <CardContent className="cardContent">
                <Typography>
                    Shortbox.de ist eine Eigenentwicklung von mir und wird ausschließlich von mir weiterentwickelt.
                    Da ich Shortbox.de in meiner Freizeit entwickle und nur in einem kleinem Personenkreis teste werden
                    hier und da Fehler auftauchen. Zwar versuche ich vor jedem neuen Release alle noch so kleinen Fehler
                    zu finden und zu beheben, aber wie jeder weiß: Es gibt keine Software ohne Fehler.<br/>
                    Solltet ihr einen Fehler finden oder Vorschläge zur Verbesserung haben meldet euch bitte per Mail
                    bei mir. <br />
                    Schreibt dazu bitte eine Mail mit dem Betreff <b>[Shortbox]</b> und einer kurzen Beschreibung des Fehlers/
                    des Vorschlags an <a href='mailto:christian.riese@gmail.com'>christian.riese@gmail.com</a>.<br/>
                </Typography>
            </CardContent>
        </Layout>
    );
}

export default withContext(Contact);

