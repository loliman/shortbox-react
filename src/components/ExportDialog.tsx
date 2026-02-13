import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { withContext } from "./generic";
import Typography from "@mui/material/Typography";
import { exportQuery } from "../graphql/queriesTyped";
import { ApolloConsumer } from "@apollo/client/react";

function ExportDialog(props) {
  return (
    <ApolloConsumer>
      {(client) => (
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="form-delete-dialog-title"
        >
          <DialogTitle id="form-delete-dialog-title">
            <CloudDownloadIcon className="exportTitleIcon" />
            Format auswählen
          </DialogTitle>
          <DialogContent>
            <Typography>
              <b>TXT:</b> Einfacher Export im Textformat. Beinhaltet Verlagsnamen, Serientitel und
              Ausgabennummern.
              <br />
              <b>CSV:</b> Detaillierter Export im CSV Format. Beinhaltet alle Metainformationen zu
              gefilterten Ausgaben.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={async () => triggerExport(props, client, "txt")}>
              txt
            </Button>

            <Button color="secondary" onClick={async () => triggerExport(props, client, "csv")}>
              csv
            </Button>

            <Button onMouseDown={(e) => props.handleClose()} color="primary">
              Abbrechen
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ApolloConsumer>
  );
}

async function triggerExport(props, client, type) {
  const { data, error } = await client.query({
    query: exportQuery,
    variables: { filter: JSON.parse(props.query.filter), type: type },
  });

  if (error || !data.export) {
    props.enqueueSnackbar("Export fehlgeschlagen", { variant: "error" });
  } else {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");

    let content = data.export;
    content = content.replaceAll('"', "");
    content = content.replaceAll(String.raw`\n`, "\r\n");
    content = content.replaceAll(String.raw`\t`, "\t");

    let blob = new Blob([content], {
      type: type === "txt" ? "text/plain" : "text/comma-separated-values",
    });
    let url = globalThis.URL.createObjectURL(blob);
    let filename = "shortbox." + type;

    a.href = url;
    a.download = filename;
    a.click();
    globalThis.URL.revokeObjectURL(url);
  }

  props.handleClose();
}

export default withContext(ExportDialog);
