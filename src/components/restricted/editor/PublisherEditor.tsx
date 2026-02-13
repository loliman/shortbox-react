import { PublisherSchema } from "../../../util/yupSchema";
import { FastField, Form, Formik } from "formik";
import { TextField } from "../../generic/FormikTextField";
import React from "react";
import { Mutation } from "@apollo/client/react/components";
import { generateLabel, generateUrl } from "../../../util/hierarchy";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@mui/material/CardHeader";
import { publisher, publishers } from "../../../graphql/queriesTyped";
import { decapitalize, stripItem } from "../../../util/util";
import { addToCache, updateInCache } from "./Editor";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import TitleLine from "../../generic/TitleLine";
import Stack from "@mui/material/Stack";
import type { DocumentNode } from "graphql";

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

interface PublisherEditorState {
  defaultValues: PublisherFormValues;
  header: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

class PublisherEditor extends React.Component<PublisherEditorProps, PublisherEditorState> {
  constructor(props: PublisherEditorProps) {
    super(props);

    let defaultValues = props.defaultValues;
    if (!defaultValues)
      defaultValues = {
        name: "",
        startyear: 1900,
        endyear: 1900,
        addinfo: "",
        us: false,
      };

    this.state = {
      defaultValues: defaultValues,
      header: props.edit ? generateLabel(defaultValues) + " bearbeiten" : "Verlag erstellen",
      submitLabel: props.edit ? "Speichern" : "Erstellen",
      successMessage: props.edit ? " erfolgreich gespeichert" : " erfolgreich erstellt",
      errorMessage: props.edit
        ? generateLabel(defaultValues) + " konnte nicht gespeichert werden"
        : "Verlag konnte nicht erstellt werden",
    };
  }

  toggleUs = () => {
    this.setState((prevState) => ({
      defaultValues: {
        ...prevState.defaultValues,
        us: !prevState.defaultValues.us,
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

          if (!edit) {
            try {
              addToCache(cache, publishers, { us: res.us }, res);
            } catch {
              //ignore cache exception;
            }
          } else {
            try {
              let pub = {
                name: defaultValues.name,
                startyear: defaultValues.startyear,
                endyear: defaultValues.endyear,
              };

              updateInCache(cache, publisher, { publisher: pub }, defaultValues, {
                publisher: res,
              });
            } catch {
              //ignore cache exception;
            }

            try {
              updateInCache(cache, publishers, { us: res.us }, defaultValues, res);
            } catch {
              //ignore cache exception;
            }
          }
        }}
        onCompleted={(data) => {
          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {
            variant: "success",
          });
          navigate(null, generateUrl(data[mutationName], data[mutationName].us));
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
            validationSchema={PublisherSchema}
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
            {({ values, resetForm, submitForm, isSubmitting }) => (
              <Form>
                <CardHeader
                  title={
                    <TitleLine title={header} id={this.props.id} session={this.props.session} />
                  }
                  action={
                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Tooltip title={(values.us ? "Deutscher" : "US") + " Verlag"}>
                          <Switch
                            disabled={edit}
                            checked={values.us}
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
                      name="name"
                      label="Name"
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
            )}
          </Formik>
        )}
      </Mutation>
    );
  }
}

export default withContext(PublisherEditor);
