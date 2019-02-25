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
import {stripItem} from "../../util/util";
import {withContext} from "../generic";
import {getListQuery} from "../../graphql/queries";
import {compare, generateLabel, generateUrl, HierarchyLevel} from "../../util/hierarchy";

function DeletionDialog(props) {
    let {level} = props;
    const {item, open, handleClose, history, enqueueSnackbar, us} = props;

    let parent;
    if (item.issue)
        parent = {series: item.issue.series};
    else if (item.series)
        parent = {publisher: item.series.publisher};
    else
        parent = {us: us};
    parent = stripItem(parent);

    let deleteMutation = getDeleteMutation(level);
    let getQuery = getListQuery(level);

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
                              try {
                                  let data = cache.readQuery({
                                      query: getQuery,
                                      variables: parent
                                  });

                                  let queryName = getQuery.definitions[0].name.value.toLowerCase();

                                  data[queryName] = data[queryName].filter((e) => !compare(e, item));

                                  cache.writeQuery({
                                      query: getQuery,
                                      variables: parent,
                                      data: data
                                  });
                              } catch (e) {
                                  console.error(e)
                                  //ignore cache exception;
                              }
                          }}
                          onCompleted={(data) => {
                              history.push(generateUrl(parent));

                              let mutationName = deleteMutation.definitions[0].name.value.toLowerCase();

                              if (data[mutationName])
                                  enqueueSnackbar(generateLabel(item) + " erfolgreich gelöscht", {variant: 'success'});

                              handleClose();
                          }}
                          onError={() => {
                              enqueueSnackbar(generateLabel(item) + " konnte nicht gelöscht werden", {variant: 'error'});
                              handleClose();
                          }}>
                    {(deleteMutation) => (
                        <Button color="secondary" onClick={() => {
                            deleteMutation({
                                variables: {
                                    item: stripItem(item)
                                }
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