import { useMutation } from "@apollo/client";
import { SeriesSchema } from "../../../util/yupSchema";
import { FastField, Form, Formik } from "formik";
import { TextField } from "../../generic/FormikTextField";
import React from "react";
import { generateLabel, generateUrl } from "../../../util/hierarchy";
import Button from "@mui/material/Button";
import withContext from "../../generic/withContext";
import { publishers, series, seriesd } from "../../../graphql/queriesTyped";
import { decapitalize, stripItem, wrapItem } from "../../../util/util";
import AutocompleteBase from "../../generic/AutocompleteBase";
import { useAutocompleteQuery } from "../../generic/useAutocompleteQuery";
import { addToCache, removeFromCache, updateInCache } from "./Editor";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TitleLine from "../../generic/TitleLine";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { DocumentNode } from "graphql";
import type { FieldItem } from "../../../util/filterFieldHelpers";
import type { SxProps, Theme } from "@mui/material/styles";

const MIN_QUERY_LENGTH = 2;
const editorFieldSx = { width: "100%", maxWidth: { xs: "100%", md: 420 } } as const;
const editorTextAreaSx = { width: "100%", maxWidth: { xs: "100%", md: 640 } } as const;

interface SeriesFormValues {
  title: string;
  publisher: {
    name: string;
    us: boolean;
  };
  volume: number;
  startyear: number;
  endyear: number;
  addinfo: string;
}

interface SeriesEditorProps {
  defaultValues?: SeriesFormValues;
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
  us?: boolean;
  [key: string]: unknown;
}

type SeriesMutationResult = {
  publisher?: { us?: boolean };
  [key: string]: unknown;
};

function createInitialSeriesValues(defaultValues?: SeriesFormValues): SeriesFormValues {
  if (defaultValues) return defaultValues;

  return {
    title: "",
    publisher: {
      name: "",
      us: false,
    },
    volume: 1,
    startyear: 1900,
    endyear: 1900,
    addinfo: "",
  };
}

function SeriesEditor(props: Readonly<SeriesEditorProps>) {
  const { lastLocation, navigate, enqueueSnackbar, edit = false, mutation } = props;

  const [defaultValues, setDefaultValues] = React.useState<SeriesFormValues>(() =>
    createInitialSeriesValues(props.defaultValues)
  );

  const mutationDefinition = mutation.definitions[0] as { name?: { value?: string } };
  const mutationName = decapitalize(mutationDefinition.name?.value || "");

  const header = edit ? generateLabel(defaultValues) + " bearbeiten" : "Serie erstellen";
  const submitLabel = edit ? "Speichern" : "Erstellen";
  const successMessage = edit ? " erfolgreich gespeichert" : " erfolgreich erstellt";
  const errorMessage = edit
    ? generateLabel(defaultValues) + " konnte nicht gespeichert werden"
    : "Serie konnte nicht erstellt werden";

  const [runMutation] = useMutation(mutation, {
    update: (cache, result) => {
      const payload = result.data as Record<string, unknown> | null | undefined;
      const res = payload?.[mutationName] as SeriesMutationResult | undefined;
      if (!res) return;

      const newSeries = structuredClone(res);

      try {
        const publisher = structuredClone(res.publisher || {});
        publisher.us = undefined;
        addToCache(cache, series, stripItem(wrapItem(publisher)), newSeries);
      } catch {
        // ignore cache exception
      }

      if (!edit) return;

      const publisherRef = {
        name: defaultValues.publisher.name,
      };

      try {
        const seriesRef = {
          title: defaultValues.title,
          volume: defaultValues.volume,
          publisher: publisherRef,
        };

        updateInCache(cache, seriesd, { series: seriesRef }, defaultValues, {
          seriesd: newSeries,
        });
      } catch {
        // ignore cache exception
      }

      try {
        removeFromCache(cache, series, { publisher: publisherRef }, defaultValues);
      } catch {
        // ignore cache exception
      }
    },
    onCompleted: (data) => {
      const result = (data as Record<string, unknown>)[mutationName] as SeriesMutationResult;
      enqueueSnackbar(generateLabel(result) + successMessage, {
        variant: "success",
      });
      navigate(null, generateUrl(result, Boolean(result.publisher?.us)));
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
      publisher: {
        ...prevState.publisher,
        us: !prevState.publisher.us,
      },
    }));
  }, []);

  return (
    <Formik
      initialValues={defaultValues}
      enableReinitialize
      validationSchema={SeriesSchema}
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
      {({ values, resetForm, submitForm, isSubmitting, setFieldValue }) => {
        return (
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
                      <Tooltip title={(values.publisher.us ? "Deutscher" : "US") + " Serie"}>
                        <Switch
                          disabled={edit}
                          checked={values.publisher.us}
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

                      <FastField name="title" label="Titel" component={TextField} sx={editorFieldSx} />

                      <SeriesPublisherAutocomplete
                        publisherName={values.publisher.name}
                        publisherUs={Boolean(defaultValues.publisher.us)}
                        setFieldValue={setFieldValue}
                        textFieldSx={editorFieldSx}
                      />

                      <FastField
                        name="volume"
                        label="Volume"
                        type="number"
                        component={TextField}
                        sx={editorFieldSx}
                      />

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

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
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
        );
      }}
    </Formik>
  );
}

interface SeriesPublisherAutocompleteProps {
  publisherName: string;
  publisherUs: boolean;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
  textFieldSx?: SxProps<Theme>;
}

function SeriesPublisherAutocomplete({
  publisherName,
  publisherUs,
  setFieldValue,
  textFieldSx,
}: Readonly<SeriesPublisherAutocompleteProps>) {
  const query = useAutocompleteQuery<FieldItem>({
    query: publishers,
    variables: {
      pattern: publisherName,
      us: publisherUs,
    },
    searchText: publisherName,
    minQueryLength: MIN_QUERY_LENGTH,
    debounceMs: 250,
  });

  const currentValue =
    query.options.find((entry) => normalizeText(entry.name) === normalizeText(publisherName)) ||
    (normalizeText(publisherName).length > 0 ? publisherName : null);

  return (
    <AutocompleteBase
      options={query.options}
      value={currentValue}
      inputValue={publisherName}
      label="Verlag"
      freeSolo
      textFieldSx={textFieldSx}
      loading={query.loading}
      noOptionsText={
        query.isBelowMinLength
          ? `Mindestens ${MIN_QUERY_LENGTH} Zeichen eingeben`
          : query.error
            ? "Fehler!"
            : "Keine Ergebnisse gefunden"
      }
      onListboxScroll={query.onListboxScroll}
      getOptionLabel={(option) => String((option as { name?: unknown })?.name || "")}
      isOptionEqualToValue={(option, value) =>
        normalizeText(option.name) === normalizeText((value as { name?: unknown })?.name)
      }
      onInputChange={(_, inputValue, reason) => {
        if (reason !== "input" && reason !== "clear") return;
        setFieldValue("publisher.name", inputValue);
      }}
      onChange={(_, option) => {
        const selectedOption = Array.isArray(option) ? option[0] || null : option;

        setFieldValue("publisher", {
          name: "",
          us: publisherUs,
        });

        if (isOptionLike(selectedOption)) setFieldValue("publisher", selectedOption);
      }}
    />
  );
}

function isOptionLike(value: unknown): value is FieldItem {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default withContext(SeriesEditor);
