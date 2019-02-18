import Layout from "./Layout";
import React from "react";
import {withContext} from "./generic";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

function Impress(props) {
    return (
        <Layout>
            <CardHeader title="Impressum"/>

            <CardContent className="cardContent">
                <Typography>
                    <p>Angaben gemäß § 5 TMG <br/>
                        <br/></p>
                    <h3 id="dsg-general-controller">Verantwortlicher</h3>
                    <p>
                        Christian Riese <br/>
                        Humperdinckweg 15<br/>
                        33102 Paderborn, Deutschland <br/>
                    </p>

                    <h3>Kontakt</h3>
                    <p>
                        E-Mail: <a href='mailto:christian.riese@gmail.com'>christian.riese@gmail.com</a><br/>
                    </p>

                    <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                    <p>
                        Christian Riese <br/>
                        Humperdinckweg 15 <br/>
                        33102 Paderborn <br/>
                    </p>
                    <br/>
                    Impressum vom <a href="https://www.impressum-generator.de" rel="noopener noreferrer nofollow"
                                     target="_blank">Impressum Generator</a> der <a
                    href="https://www.kanzlei-hasselbach.de/">Kanzlei Hasselbach, Rechtsanwälte für Arbeitsrecht und
                    Familienrecht</a>
                </Typography>
            </CardContent>
        </Layout>
    );
}

export default withContext(Impress);

