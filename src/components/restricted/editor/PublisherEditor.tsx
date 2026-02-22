import { useMutation } from "@apollo/client";
import { PublisherSchema } from "../../../util/yupSchema";
import { FastField, Form, Formik } from "formik";
import { TextField } from "../../generic/FormikTextField";
import React from "react";
import { generateLabel, generateUrl } from "../../../util/hierarchy";
import Button from "@mui/material/Button";
import withContext from "../../generic/withContext";
import { publisher, publishers } from "../../../graphql/queriesTyped";
import { decapitalize, stripItem } from "../../../util/util";
import { addToCache, updateInCache } from "./Editor";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import TitleLine from "../../generic/TitleLine";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { DocumentNode } from "graphql";

const editorFieldSx = { width: "100%", maxWidth: { xs: "100%", md: 420 } } as const;
const editorTextAreaSx = { width: "100%", maxWidth: { xs: "100%", md: 640 } } as const;

interface PublisherFormValues {
  name: string;
  startyear: number;
  endyear: number;
  addinfo: string;
  us: boolean;
}

interface PublisherEditorProps {
  defaultValues?: PublisherFormValues;
  edit?: boolean;
  mutation: DocumentNode;
  id?: string | number;
  session?: unknown;
  isDesktop?: boolean;
  navigate: (event: unknown, url: string) => void;
  lastLocation?: { pathname: string } | null;
  enqueueSnackbar: (
    message: string,
    options?: { variant?: "success" | "error" | "warning" | "info" }
  ) => void;
  [key: string]: unknown;
}

type PublisherMutationResult = {
  us?: boolean;
  [key: string]: unknown;
};

function createInitialPublisherValues(defaultValues?: PublisherFormValues): PublisherFormValues {
  if (defaultValues) return defaultValues;

  return {
    name: "",
    startyear: 1900,
    endyear: 1900,
    addinfo: "",
    us: false,
  };
}

function PublisherEditor(props: Readonly<PublisherEditorProps>) {
  const { lastLocation, navigate, enqueueSnackbar, edit = false, mutation } = props;

  const [defaultValues, setDefaultValues] = React.useState<PublisherFormValues>(() =>
    createInitialPublisherValues(props.defaultValues)
  );

  const mutationDefinition = mutation.definitions[0] as { name?: { value?: string } };
  const mutationName = decapitalize(mutationDefinition.name?.value || "");

  const header = edit ? generateLabel(defaultValues) + " bearbeiten" : "Verlag erstellen";
  const submitLabel = edit ? "Speichern" : "Erstellen";
  const successMessage = edit ? " erfolgreich gespeichert" : " erfolgreich erstellt";
  const errorMessage = edit
    ? generateLabel(defaultValues) + " konnte nicht gespeichert werden"
    : "Verlag konnte nicht erstellt werden";

  const [runMutation] = useMutation(mutation, {
    update: (cache, result) => {
      const payload = result.data as Record<string, unknown> | null | undefined;
      const res = payload?.[mutationName] as PublisherMutationResult | undefined;
      if (!res) return;

      if (!edit) {
        try {
          addToCache(cache, publishers, { us: res.us }, res);
        } catch {
          // ignore cache exception
        }
        return;
      }

      try {
        const publisherRef = {
          name: defaultValues.name,
          startyear: defaultValues.startyear,
          endyear: defaultValues.endyear,
        };

        updateInCache(cache, publisher, { publisher: publisherRef }, defaultValues, {
          publisher: res,
        });
      } catch {
        // ignore cache exception
      }

      try {
        updateInCache(cache, publishers, { us: res.us }, defaultValues, res);
      } catch {
        // ignore cache exception
      }
    },
    onCompleted: (data) => {
      const result = (data as Record<string, unknown>)[mutationName] as PublisherMutationResult;
      enqueueSnackbar(generateLabel(result) + successMessage, {
        variant: "success",
      });
      navigate(null, generateUrl(result, Boolean(result.us)));
    },
    onError: (errors) => {
      const message =
        errors.graphQLErrors && errors.graphQLErrors.length > 0
          ? " [" + errors.graphQLErrors[0].message + "]"
          : "";
      enqueueSnackbar(errorMessage + message, { variant: "error" });
    },
  });

  const toggleUs = React.useCallback(() => {
    setDefaultValues((prevState) => ({
      ...prevState,
      us: !prevState.us,
    }));
  }, []);

  return (
    <Formik
      initialValues={defaultValues}
      enableReinitialize
      validationSchema={PublisherSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);

        try {
          const variables: Record<string, unknown> = {};
          variables.item = stripItem(values);
          if (edit) variables.old = stripItem(defaultValues);

          await runMutation({ variables });
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ values, resetForm, submitForm, isSubmitting }) => (
        <Form>
          <Box sx={{ width: "100%", maxWidth: 1280, mx: "auto" }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                    <TitleLine title={header} id={props.id} session={props.session} />
                  </Typography>
                </Box>

                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Tooltip title={(values.us ? "Deutscher" : "US") + " Verlag"}>
                      <Switch
                        disabled={edit}
                        checked={values.us}
                        onChange={() => {
                          toggleUs();
                          resetForm();
                        }}
                        color="secondary"
                      />
                    </Tooltip>
                  }
                  label="US"
                />
              </Stack>
            </Paper>

            <Box sx={{ mt: 2 }}>
              <Stack spacing={2.5}>
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1">Basisdaten</Typography>

                    <FastField name="name" label="Name" component={TextField} sx={editorFieldSx} />

                    <FastField
                      name="startyear"
                      label="Startjahr"
                      type="number"
                      component={TextField}
                      sx={editorFieldSx}
                    />

                    <FastField
                      name="endyear"
                      label="Endjahr"
                      type="number"
                      component={TextField}
                      sx={editorFieldSx}
                    />
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1">Beschreibung</Typography>

                    <FastField
                      name="addinfo"
                      label="Weitere Informationen"
                      multiline
                      rows={10}
                      component={TextField}
                      sx={editorTextAreaSx}
                    />
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "center" }}
                  >
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        disabled={isSubmitting}
                        onClick={() => resetForm()}
                        variant="text"
                        color="inherit"
                      >
                        Zurücksetzen
                      </Button>

                      <Button
                        disabled={isSubmitting}
                        onClick={(e) =>
                          props.navigate(e, lastLocation ? lastLocation.pathname : "/")
                        }
                        variant="outlined"
                        color="inherit"
                      >
                        Abbrechen
                      </Button>
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}
                    >
                      <Button
                        disabled={isSubmitting}
                        onClick={submitForm}
                        variant="contained"
                        color="primary"
                      >
                        {submitLabel}
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default withContext(PublisherEditor);
