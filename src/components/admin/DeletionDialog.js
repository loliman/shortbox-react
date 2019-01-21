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
import {capitalize, generateLabel, getHierarchyLevel, HierarchyLevel} from "../../util/util";
import {AppContext} from "../generic/AppContext";
import {withSnackbar} from 'notistack';
import {getListQuery} from "../../graphql/queries";

function DeletionDialog(props) {
    let deleteMutation = getDeleteMutation(getHierarchyLevel(props.context.selected));
    let getQuery = getListQuery(getHierarchyLevel(props.context.selected));

    let id = props.context.selected ? props.context.selected.id : null;
    let variables = {
        us: (!props.context.us ? false : true),
        publisher_id: id,
        series_id: id
    };

    return (
        <AppContext.Consumer>
            {({handleNavigation}) => (
                <Dialog open={props.open}
                        onClose={props.handleClose}
                        aria-labelledby="form-delete-dialog-title">
                    <DialogTitle id="form-delete-dialog-title">
                        <WarningIcon className="deleteTitleIcon"/>Löschen bestätigen
                    </DialogTitle>
                    <DialogContent>
                        {getDeleteConfimText(props.context.selected)}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => props.handleClose()} color="primary">
                            Abbrechen
                        </Button>

                        <Mutation mutation={deleteMutation}
                                  update={async (cache) => {
                                      let data = cache.readQuery({query: getQuery, variables: variables});
                                      let updated = data[getHierarchyLevel(props.context.selected)];
                                      updated = updated.filter((e) => e.id !== props.item.id);
                                      let newData = {};
                                      newData[getHierarchyLevel(props.context.selected)] = updated;

                                      cache.writeQuery({
                                          query: getQuery,
                                          variables: variables,
                                          data: newData,
                                      });
                                  }}
                                  onCompleted={(data) => {
                                      let level = getHierarchyLevel(props.context.selected);
                                      if (level.indexOf('issue_details') !== -1) {
                                          handleNavigation(props.context.selected.series);
                                          level = HierarchyLevel.ISSUE;
                                      }

                                      let mutation = 'delete' + capitalize(level);

                                      if (data[mutation])
                                          props.enqueueSnackbar(generateLabel(props.item) + " erfolgreich gelöscht", {variant: 'success'});

                                      props.handleClose();
                                  }}
                                  onError={() => {
                                      props.enqueueSnackbar(generateLabel(props.item) + " konnte nicht gelöscht werden", {variant: 'error'});
                                      props.handleClose();
                                  }}>
                            {(deletepublisher) => (
                                <Button color="secondary" onClick={() => {
                                    deletepublisher({
                                        variables: {
                                            id: parseInt(props.item.id)
                                        }
                                    })
                                }}>
                                    Löschen
                                </Button>
                            )}
                        </Mutation>
                    </DialogActions>
                </Dialog>
            )}
        </AppContext.Consumer>
    );
}

function getDeleteConfimText(s) {
    switch (getHierarchyLevel(s)) {
        case HierarchyLevel.PUBLISHER:
            return (
                <Typography>
                    Wollen Sie den Verlag wirklich löschen?
                    <br/>Alle zugeordneten Serien, deren Ausgaben, zugeordnete Geschichten und US Ausgaben werden damit
                    gelöscht.
                    <br/>US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
                    gelöscht.
                </Typography>
            );
        case HierarchyLevel.SERIES:
            return (
                <Typography>
                    Wollen Sie die Serie wirklich löschen?
                    <br/>Alle zugeordneten Ausgaben, zugeordnete Geschichten und US Ausgaben werden damit gelöscht.
                    <br/>US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
                    gelöscht.
                </Typography>
            );
        default:
            return (
                <Typography>
                    Wollen Sie die Ausgabe wirklich löschen?
                    <br/>Alle zugeordnete Geschichten und US Ausgaben werden damit gelöscht.
                    <br/>US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
                    gelöscht.
                </Typography>
            );
    }
}

export default withSnackbar(DeletionDialog);