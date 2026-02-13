import Layout from "./Layout";
import React from "react";
import { withContext } from "./generic";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Impress() {
  return (
    <Layout>
      <CardHeader title="Impressum" />

      <CardContent className="cardContent">
        <Typography>Angaben gemäß § 5 TMG</Typography>

        <br />

        <Typography variant="h6">Verantwortlicher</Typography>

        <Typography>
          Christian Riese <br />
          Königstor 34
          <br />
          34117 Kassel, Deutschland
          <br />
        </Typography>

        <br />

        <Typography variant="h6">Kontakt</Typography>

        <Typography>
          E-Mail: <a href="mailto:christian.riese@gmail.com">christian.riese@gmail.com</a>
          <br />
        </Typography>

        <br />

        <Typography variant="h6">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</Typography>

        <Typography>
          Christian Riese
          <br />
          Königstor 34
          <br />
          34117 Kassel
          <br />
        </Typography>

        <br />

        <Typography>
          Impressum vom{" "}
          <a
            href="https://www.impressum-generator.de"
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            Impressum Generator
          </a>{" "}
          der{" "}
          <a href="https://www.kanzlei-hasselbach.de/">
            Kanzlei Hasselbach, Rechtsanwälte für Arbeitsrecht und Familienrecht
          </a>
        </Typography>
      </CardContent>
    </Layout>
  );
}

export default withContext(Impress);
