import React from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {withContext} from "./generic";
import Typography from "@material-ui/core/Typography";
import {exportQuery} from "../graphql/queries";
import {ApolloConsumer} from "react-apollo";

function ExportDialog(props) {
    return (
        <ApolloConsumer>
            {client => (
                <Dialog open={props.open}
                        onClose={props.handleClose}
                        aria-labelledby="form-delete-dialog-title">
                    <DialogTitle id="form-delete-dialog-title">
                        <CloudDownloadIcon className="exportTitleIcon"/>Format auswählen
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            <b>TXT:</b> Einfacher Export im Textformat. Beinhaltet Verlagsnamen, Serientitel und Ausgabennummern.<br/>
                            <b>CSV:</b> Detaillierter Export im CSV Format. Beinhaltet alle Metainformationen zu gefilterten Ausgaben.
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
                        )}
                    </DialogActions>
                </Dialog>)
            }
        </ApolloConsumer>
    );
}

async function triggerExport(props, client, type) {
    const {data, error} = await client.query({
        query: exportQuery,
        variables: {filter: JSON.parse(props.query.filter), type: type}
    });

    if (error || !data.export) {
        props.enqueueSnackbar("Export fehlgeschlagen", {variant: 'error'});
    } else {
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');

        let content = data.export;
        content = content.replaceAll("\"", "");
        content = content.replaceAll("\\n", "\r\n");
        content = content.replaceAll("\\t", "\t");

        let blob = new Blob([content], {type: type === "txt" ? 'text/plain' : 'text/comma-separated-values'});
        let url = window.URL.createObjectURL(blob);
        let filename = 'shortbox.' + type;

        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    props.handleClose();
}

export default withContext(ExportDialog);
