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
                    Da ich Shortbox.de in meiner Freizeit entwickle und nur in einem kleinen Personenkreis teste, werden
                    hier und da Fehler auftauchen. Zwar versuche ich vor jedem neuen Release alle noch so kleinen Fehler
                    zu finden und zu beheben, aber wie jeder weiß: Es gibt keine Software ohne Fehler.<br/>
                    Solltet ihr einen Fehler finden oder Vorschläge zur Verbesserung haben, meldet euch bitte per Mail
                    bei mir. <br />
                    Schreibt dazu bitte eine Mail mit dem Betreff <b>[Shortbox]</b> und einer kurzen Beschreibung des
                    Fehlers/des Vorschlags an <a href='mailto:christian.riese@gmail.com'>christian.riese@gmail.com</a>.<br/>
                </Typography>

                <br />

                <Typography variant="h6">Unterstützen</Typography>
                <Typography>
                    Shortbox.de ist und bleibt eine kostenlose Datenbank, die von jedem jederzeit kostenlos genutzt werden kann. <br/>
                    Dennoch verursacht Shortbox.de laufend Kosten, die ich privat trage. Wenn ihr das Projekt unterstützen wollt,
                    so bin ich für jede kleine finanzielle Unterstützung über <a href="https://paypal.me/ChristianRiese">paypal.me/ChristianRiese</a>
                    &nbsp;dankbar!
                </Typography>
            </CardContent>
        </Layout>
    );
}

export default withContext(Contact);

