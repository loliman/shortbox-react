import React from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import WarningIcon from "@material-ui/icons/Warning";
import {getDeleteMutation} from "../../graphql/mutations";
import {Mutation} from "react-apollo";
import Typography from "@material-ui/core/es/Typography/Typography";
import {
    capitalize,
    generateLabel,
    getGqlVariables} from "../../util/util";
import {withContext} from "../generic";
import {getListQuery} from "../../graphql/queries";
import {generateUrl, HierarchyLevel} from "../../util/hierarchiy";

function DeletionDialog(props) {
    let {level} = props;
    const {item, open, handleClose, selected, us, history, match, enqueueSnackbar} = props;

    let deleteMutation = getDeleteMutation(level);
    let getQuery = getListQuery(level);

    let deleteVariables = getGqlVariables(item, us);
    let variables = getGqlVariables(selected, us);

    return (
         <Dialog open={open}
                 onClose={handleClose}
                 aria-labelledby="form-delete-dialog-title">
            <DialogTitle id="form-delete-dialog-title">
                <WarningIcon className="deleteTitleIcon"/>Löschen bestätigen
            </DialogTitle>
            <DialogContent>
                {getDeleteConfimText(level, item)}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()} color="primary">
                    Abbrechen
                </Button>

                <Mutation mutation={deleteMutation}
                          update={(cache) => {
                              let data = cache.readQuery({query: getQuery, variables: variables});

                              data[level] = data[level].filter((e) => e.id !== item.id);

                              cache.writeQuery({
                                  query: getQuery,
                                  variables: variables,
                                  data: data,
                              });
                          }}
                          onCompleted={(data) => {
                              if (level.indexOf('issue_details') !== -1 || match.indexOf('edit') !== -1) {
                                  history.push(generateUrl(selected));
                                  if (level.indexOf('issue_details') !== -1)
                                    level = HierarchyLevel.ISSUE;
                              }

                              let mutation = 'delete' + capitalize(level);

                              if (data[mutation])
                                  enqueueSnackbar(generateLabel(item) + " erfolgreich gelöscht", {variant: 'success'});

                              handleClose();

                          }}
                          onError={() => {
                              enqueueSnackbar(generateLabel(item) + " konnte nicht gelöscht werden", {variant: 'error'});
                              handleClose();
                          }}>
                    {(deletepublisher) => (
                        <Button color="secondary" onClick={() => {
                            deletepublisher({
                                variables: deleteVariables
                            })
                        }}>
                            Löschen
                        </Button>
                    )}
                </Mutation>
            </DialogActions>
        </Dialog>
    );
}

function getDeleteConfimText(l, item) {
    switch (l) {
        case HierarchyLevel.PUBLISHER:
            return (
                <Typography>
                    Wollen Sie den <b>{generateLabel(item)}</b> Verlag wirklich löschen?
                    <br/>Alle zugeordneten Serien, deren Ausgaben, zugeordnete Geschichten und US Ausgaben werden damit
                    gelöscht.
                    <br/>US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
                    gelöscht.
                </Typography>
            );
        case HierarchyLevel.SERIES:
            return (
                <Typography>
                    Wollen Sie die Serie <b>{generateLabel(item)}</b> wirklich löschen?
                    <br/>Alle zugeordneten Ausgaben, zugeordnete Geschichten und US Ausgaben werden damit gelöscht.
                    <br/>US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
                    gelöscht.
                </Typography>
            );
        default:
            return (
                <Typography>
                    Wollen Sie die Ausgabe <b>{generateLabel(item)}</b> wirklich löschen?
                    <br/>Alle zugeordnete Geschichten und US Ausgaben werden damit gelöscht.
                    <br/>US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
                    gelöscht.
                </Typography>
            );
    }
}

export default withContext(DeletionDialog);