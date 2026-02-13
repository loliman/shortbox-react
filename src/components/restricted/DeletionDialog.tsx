import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import WarningIcon from "@mui/icons-material/Warning";
import { getDeleteMutation } from "../../graphql/mutationsTyped";
import { useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { stripItem } from "../../util/util";
import { withContext } from "../generic";
import { getListQuery, issue } from "../../graphql/queriesTyped";
import {
  generateLabel,
  generateUrl,
  getHierarchyLevel,
  HierarchyLevel,
} from "../../util/hierarchy";
import { removeFromCache, updateInCache } from "./editor/Editor";

function DeletionDialog(props) {
  let { level } = props;
  const { item, open, handleClose, navigate, enqueueSnackbar } = props;

  let parent;
  if (item.__typename === "Issue") {
    parent = { series: structuredClone(item.series) };
    parent.series.publisher.us = undefined;
  } else if (item.__typename === "Series") {
    parent = { publisher: structuredClone(item.publisher) };
    parent.publisher.us = undefined;
  } else parent = { us: item.us };
  parent = stripItem(parent);

  let deleteMutation = getDeleteMutation(level);
  let getQuery = getListQuery(getHierarchyLevel(parent));
  const [runDeleteMutation] = useMutation(deleteMutation, {
    update: (cache) => {
      if (level === HierarchyLevel.ISSUE && item.variants.length > 1) {
        let variants = item.variants.filter((variant) => {
          return (
            (item.number + item.format + item.variant)
              .toLowerCase()
              .localeCompare((variant.number + variant.format + variant.variant).toLowerCase()) !==
            0
          );
        });

        try {
          item.variants.forEach((variant) => {
            let oldVariant: { issue: Record<string, unknown> } = { issue: {} };
            const oldSeries = stripItem(variant.series) as {
              publisher?: { us?: boolean };
            } & Record<string, unknown>;
            oldVariant.issue.series = oldSeries;
            if (oldSeries.publisher) {
              oldSeries.publisher.us = undefined;
            }
            oldVariant.issue.number = variant.number;
            oldVariant.issue.format = variant.format;
            if (oldVariant.issue.variant !== "") oldVariant.issue.variant = variant.variant;

            let newVariant: { issue: Record<string, unknown> } = {
              issue: structuredClone(variant),
            };
            newVariant.issue.variants = variants;

            updateInCache(cache, issue, oldVariant, oldVariant, newVariant);
          });
        } catch (e) {
          //ignore cache exception;
        }

        parent = { issue: stripItem(variants[0]) };
      } else
        try {
          removeFromCache(cache, getQuery, parent, item);
        } catch (e) {
          //ignore cache exception;
        }
    },
    onCompleted: (data) => {
      navigate(null, generateUrl(parent, props.us));

      const mutationDefinition = deleteMutation.definitions[0] as { name?: { value?: string } };
      let mutationName = mutationDefinition.name?.value ?? "";
      mutationName = mutationName.substr(0, 1).toLocaleLowerCase() + mutationName.substr(1);

      if (data[mutationName])
        enqueueSnackbar(generateLabel(item) + " erfolgreich gelöscht", { variant: "success" });
      else
        enqueueSnackbar(generateLabel(item) + " konnte nicht gelöscht werden", {
          variant: "error",
        });

      handleClose();
    },
    onError: (errors) => {
      let message =
        errors.graphQLErrors && errors.graphQLErrors.length > 0
          ? " [" + errors.graphQLErrors[0].message + "]"
          : "";
      enqueueSnackbar(generateLabel(item) + " konnte nicht gelöscht werden" + message, {
        variant: "error",
      });
      handleClose();
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-delete-dialog-title">
      <DialogTitle id="form-delete-dialog-title">
        <WarningIcon className="deleteTitleIcon" />
        Löschen bestätigen
      </DialogTitle>
      <DialogContent>{getDeleteConfimText(level, item)}</DialogContent>
      <DialogActions>
        <Button onMouseDown={(e) => handleClose()} color="primary">
          Abbrechen
        </Button>

        <Button
          color="secondary"
          onMouseDown={() => {
            let toDelete: Record<string, unknown> = {};
            if (level === HierarchyLevel.ISSUE) {
              toDelete.number = item.number;
              toDelete.series = item.series;
              toDelete.format = item.format;
              toDelete.variant = item.variant;
            } else toDelete = item;

            if (level === HierarchyLevel.SERIES) {
              toDelete.issueCount = undefined;
              toDelete.active = undefined;
              toDelete.firstIssue = undefined;
              toDelete.lastEdited = undefined;
              toDelete.lastIssue = undefined;
            } else if (level === HierarchyLevel.PUBLISHER) {
              toDelete.seriesCount = undefined;
              toDelete.issueCount = undefined;
              toDelete.active = undefined;
              toDelete.firstIssue = undefined;
              toDelete.lastEdited = undefined;
              toDelete.lastIssue = undefined;
            }

            runDeleteMutation({
              variables: {
                item: stripItem(toDelete),
              },
            });
          }}
        >
          Löschen
        </Button>
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
          <br />
          Alle zugeordneten Serien, deren Ausgaben, zugeordnete Geschichten und US Ausgaben werden
          damit gelöscht.
          <br />
          US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
          gelöscht.
        </Typography>
      );
    case HierarchyLevel.SERIES:
      return (
        <Typography>
          Wollen Sie die Serie <b>{generateLabel(item)}</b> wirklich löschen?
          <br />
          Alle zugeordneten Ausgaben, zugeordnete Geschichten und US Ausgaben werden damit gelöscht.
          <br />
          US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
          gelöscht.
        </Typography>
      );
    default:
      return (
        <Typography>
          Wollen Sie die Ausgabe <b>{generateLabel(item)}</b> wirklich löschen?
          <br />
          Alle zugeordnete Geschichten und US Ausgaben werden damit gelöscht.
          <br />
          US Ausgaben und Geschichten, die anderen deutschen Ausgaben zugeordnet sind werden nicht
          gelöscht.
        </Typography>
      );
  }
}

export default withContext(DeletionDialog);
