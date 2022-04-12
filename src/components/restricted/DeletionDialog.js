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
import {getListQuery, issue} from "../../graphql/queries";
import {generateLabel, generateUrl, getHierarchyLevel, HierarchyLevel} from "../../util/hierarchy";
import {removeFromCache, updateInCache} from "./editor/Editor";

function DeletionDialog(props) {
    let {level} = props;
    const {item, open, handleClose, navigate, enqueueSnackbar} = props;

    let parent;
    if (item.__typename === "Issue") {
        parent = {series: JSON.parse(JSON.stringify(item.series))};
        parent.series.publisher.us = undefined;
    }
    else if (item.__typename === "Series") {
        parent = {publisher: JSON.parse(JSON.stringify(item.publisher))};
        parent.publisher.us = undefined;
    }
    else
        parent = {us: item.us};
    parent = stripItem(parent);

    let deleteMutation = getDeleteMutation(level);
    let getQuery = getListQuery(getHierarchyLevel(parent));

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
                              if(level === HierarchyLevel.ISSUE && item.variants.length > 1) {
                                  let variants = item.variants.filter((variant) => {
                                      return (item.number + item.format + item.variant).toLowerCase()
                                          .localeCompare((variant.number + variant.format + variant.variant).toLowerCase()) !== 0;
                                  });

                                  try {
                                      item.variants.forEach(variant => {
                                          let oldVariant = {issue: {}};
                                          oldVariant.issue.series = stripItem(variant.series);
                                          oldVariant.issue.series.publisher.us = undefined;
                                          oldVariant.issue.number = variant.number;
                                          oldVariant.issue.format = variant.format;
                                          if(oldVariant.variant !== '')
                                              oldVariant.issue.variant = variant.variant;

                                          let newVariant = {issue: JSON.parse(JSON.stringify(variant))};
                                          newVariant.issue.variants = variants;

                                          updateInCache(cache, issue, oldVariant, oldVariant, newVariant);
                                      });
                                  } catch (e) {
                                      //ignore cache exception;
                                  }

                                  parent = {issue: stripItem(variants[0])};
                              }
                              else
                                  try {
                                    removeFromCache(cache, getQuery, parent, item);
                                  } catch (e) {
                                      //ignore cache exception;
                                  }
                          }}
                          onCompleted={(data) => {
                              navigate(generateUrl(parent, props.us));

                              let mutationName = deleteMutation.definitions[0].name.value;
                              mutationName = mutationName.substr(0, 1).toLocaleLowerCase() + mutationName.substr(1);

                              if (data[mutationName])
                                  enqueueSnackbar(generateLabel(item) + " erfolgreich gelöscht", {variant: 'success'});
                              else
                                  enqueueSnackbar(generateLabel(item) + " konnte nicht gelöscht werden", {variant: 'error'});

                              handleClose();
                          }}
                          onError={(errors) => {
                              let message = (errors.graphQLErrors && errors.graphQLErrors.length > 0) ? ' [' + errors.graphQLErrors[0].message + ']' : '';
                              enqueueSnackbar(generateLabel(item) + " konnte nicht gelöscht werden" + message, {variant: 'error'});
                              handleClose();
                          }}>
                    {(deleteMutation) => (
                        <Button color="secondary" onClick={() => {
                            let toDelete = {};
                            if(level === HierarchyLevel.ISSUE) {
                                toDelete.number = item.number;
                                toDelete.series = item.series;
                                toDelete.format = item.format;
                                toDelete.variant = item.variant;
                            }
                            else
                                toDelete = item;

                            if(level === HierarchyLevel.SERIES) {
                                toDelete.issueCount = undefined;
                                toDelete.active = undefined;
                                toDelete.genre = undefined;
                                toDelete.firstIssue = undefined;
                                toDelete.lastEdited = undefined;
                                toDelete.lastIssue = undefined;
                            } else if(level === HierarchyLevel.PUBLISHER) {
                                toDelete.seriesCount = undefined;
                                toDelete.issueCount = undefined;
                                toDelete.active = undefined;
                                toDelete.firstIssue = undefined;
                                toDelete.lastEdited = undefined;
                                toDelete.lastIssue = undefined;
                            }

                            deleteMutation({
                                variables: {
                                    item: stripItem(toDelete)
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