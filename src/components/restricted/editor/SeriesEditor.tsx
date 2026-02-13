import { SeriesSchema } from "../../../util/yupSchema";
import { FastField, Form, Formik } from "formik";
import { TextField } from "../../generic/FormikTextField";
import React from "react";
import { Mutation } from "@apollo/client/react/components";
import { generateLabel, generateUrl } from "../../../util/hierarchy";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@mui/material/CardHeader";
import { publishers, series, seriesd } from "../../../graphql/queriesTyped";
import { decapitalize, stripItem, wrapItem } from "../../../util/util";
import AutocompleteField from "../../generic/AutocompleteField";
import { addToCache, removeFromCache, updateInCache } from "./Editor";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TitleLine from "../../generic/TitleLine";
import Stack from "@mui/material/Stack";
import type { DocumentNode } from "graphql";

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

interface SeriesEditorState {
  defaultValues: SeriesFormValues;
  header: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

class SeriesEditor extends React.Component<SeriesEditorProps, SeriesEditorState> {
  constructor(props: SeriesEditorProps) {
    super(props);

    let defaultValues = props.defaultValues;
    if (!defaultValues)
      defaultValues = {
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

    this.state = {
      defaultValues: defaultValues,
      header: props.edit ? generateLabel(defaultValues) + " bearbeiten" : "Serie erstellen",
      submitLabel: props.edit ? "Speichern" : "Erstellen",
      successMessage: props.edit ? " erfolgreich gespeichert" : " erfolgreich erstellt",
      errorMessage: props.edit
        ? generateLabel(defaultValues) + " konnte nicht gespeichert werden"
        : "Serie konnte nicht erstellt werden",
    };
  }

  toggleUs = () => {
    this.setState((prevState) => ({
      defaultValues: {
        ...prevState.defaultValues,
        publisher: {
          ...prevState.defaultValues.publisher,
          us: !prevState.defaultValues.publisher.us,
        },
      },
    }));
  };

  render() {
    const { lastLocation, navigate, enqueueSnackbar, edit, mutation } = this.props;
    const { defaultValues, header, submitLabel, successMessage, errorMessage } = this.state;

    const mutationDefinition = mutation.definitions[0] as { name?: { value?: string } };
    let mutationName = decapitalize(mutationDefinition.name?.value || "");

    return (
      <Mutation
        mutation={mutation}
        update={(cache, result) => {
          let res = result.data[mutationName];

          let newSeries = structuredClone(res);

          try {
            let publisher = structuredClone(res.publisher);
            publisher.us = undefined;
            addToCache(cache, series, stripItem(wrapItem(publisher)), newSeries);
          } catch {
            //ignore cache exception;
          }

          if (edit) {
            let publisher = {
              name: defaultValues.publisher.name,
            };

            try {
              let series = {
                title: defaultValues.title,
                volume: defaultValues.volume,
                publisher: publisher,
              };

              updateInCache(cache, seriesd, { series: series }, defaultValues, {
                seriesd: newSeries,
              });
            } catch {
              //ignore cache exception;
            }

            try {
              removeFromCache(cache, series, { publisher: publisher }, defaultValues);
            } catch {
              //ignore cache exception;
            }
          }
        }}
        onCompleted={(data) => {
          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {
            variant: "success",
          });
          navigate(null, generateUrl(data[mutationName], data[mutationName].publisher.us));
        }}
        onError={(errors) => {
          let message =
            errors.graphQLErrors && errors.graphQLErrors.length > 0
              ? " [" + errors.graphQLErrors[0].message + "]"
              : "";
          enqueueSnackbar(errorMessage + message, { variant: "error" });
        }}
      >
        {(mutation) => (
          <Formik
            initialValues={defaultValues}
            enableReinitialize
            validationSchema={SeriesSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);

              let variables: Record<string, unknown> = {};
              variables.item = stripItem(values);
              if (edit) variables.old = stripItem(defaultValues);

              await mutation({
                variables: variables,
              });

              actions.setSubmitting(false);
            }}
          >
            {({ values, resetForm, submitForm, isSubmitting, setFieldValue }) => {
              return (
                <Form>
                  <CardHeader
                    title={
                      <TitleLine title={header} id={this.props.id} session={this.props.session} />
                    }
                    action={
                      <FormControlLabel
                        className="switchEditor"
                        control={
                          <Tooltip
                            title={(values.publisher.us ? "Deutscher" : "US") + " Serie"}
                          >
                            <Switch
                              disabled={edit}
                              checked={values.publisher.us}
                              onChange={() => {
                                this.toggleUs();
                                resetForm();
                              }}
                              color="secondary"
                            />
                          </Tooltip>
                        }
                        label="US"
                      />
                    }
                  />

                  <CardContent className="cardContent">
                    <Stack spacing={2.5}>
                      <FastField
                        className={this.props.isDesktop ? "field field35" : "field field100"}
                        name="title"
                        label="Titel"
                        component={TextField}
                      />

                      <AutocompleteField
                        query={publishers}
                        name="publisher.name"
                        label="Verlag"
                        variables={{
                          pattern: values.publisher.name,
                          us: defaultValues.publisher.us ? defaultValues.publisher.us : false,
                        }}
                        onChange={(option, live) => {
                          if (typeof option !== "string" || option.trim() !== "") {
                            if (live) {
                              setFieldValue("publisher.name", option);
                            } else {
                              setFieldValue("publisher", {
                                name: "",
                                us: defaultValues.publisher.us,
                              });

                              if (option) setFieldValue("publisher", option);
                            }
                          }
                        }}
                        generateLabel={generateLabel}
                      />

                      <FastField
                        className={this.props.isDesktop ? "field field35" : "field field100"}
                        name="volume"
                        label="Volume"
                        type="number"
                        component={TextField}
                      />

                      <FastField
                        className={this.props.isDesktop ? "field field35" : "field field100"}
                        name="startyear"
                        label="Startjahr"
                        type="number"
                        component={TextField}
                      />

                      <FastField
                        className={this.props.isDesktop ? "field field35" : "field field100"}
                        name="endyear"
                        label="Endjahr"
                        type="number"
                        component={TextField}
                      />

                      <FastField
                        className={this.props.isDesktop ? "field field35" : "field field100"}
                        name="addinfo"
                        label="Weitere Informationen"
                        multiline
                        rows={10}
                        component={TextField}
                      />

                      <div className="formButtons">
                        <Button
                          disabled={isSubmitting}
                          onClick={() => resetForm()}
                          color="secondary"
                        >
                          Zurücksetzen
                        </Button>

                        <Button
                          disabled={isSubmitting}
                          onClick={(e) =>
                            this.props.navigate(e, lastLocation ? lastLocation.pathname : "/")
                          }
                          color="primary"
                        >
                          Abbrechen
                        </Button>

                        <Button
                          className="createButton"
                          disabled={isSubmitting}
                          onClick={submitForm}
                          color="primary"
                        >
                          {submitLabel}
                        </Button>
                      </div>
                    </Stack>
                  </CardContent>
                </Form>
              );
            }}
          </Formik>
        )}
      </Mutation>
    );
  }
}

export default withContext(SeriesEditor);
