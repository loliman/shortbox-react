import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation, Query} from "react-apollo";
import {editSeries} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {publishers, series, seriesd} from "../../../graphql/queries";
import {withContext} from "../../generic";
import {compare, generateLabel, generateUrl} from "../../../util/hierarchy";
import QueryResult from "../../generic/QueryResult";
import {SeriesSchema} from "../../../util/yupSchema";
import AutoComplete from "../../generic/AutoComplete";
import Link from "react-router-dom/es/Link";

function SeriesEdit(props) {
    const {selected, history, enqueueSnackbar, lastLocation, us} = props;
    let old;
    let edit;

    return (
        <Layout>
            <Query query={seriesd} variables={selected}>
                {({loading, error, data}) => {
                    old = data.seriesd;

                    if (loading || error || !old)
                        return <QueryResult loading={loading} error={error} data={old} selected={selected}/>;

                    return (
                        <Mutation mutation={editSeries}
                                  update={(cache, result) => {
                                      try {
                                          let queryName = series.definitions[0].name.value.toLowerCase();
                                          edit = result.data.editSeries;

                                          let data = cache.readQuery({
                                              query: series,
                                              variables: {
                                                  publisher: {
                                                      name: old.publisher.name
                                                  }
                                              }
                                          });

                                          data[queryName] = data[queryName].filter((e) => compare(e, old));

                                          cache.writeQuery({
                                              query: series,
                                              variables: {
                                                  publisher: {
                                                      name: old.publisher.name
                                                  }
                                              },
                                              data: data
                                          });

                                          data = cache.readQuery({
                                              query: series,
                                              variables: {
                                                  publisher: {
                                                      name: edit.publisher.name
                                                  }
                                              }
                                          });

                                          data.series.push(edit);
                                          data.series.sort((a, b) => {
                                              return (a.title.toLowerCase() + a.volume).localeCompare((b.title.toLowerCase() + b.volume));
                                          });

                                          cache.writeQuery({
                                              query: series,
                                              variables: {
                                                  publisher: {
                                                      name: edit.publisher.name
                                                  }
                                              },
                                              data: data
                                          });
                                      } catch (e) {
                                          //ignore cache exception;
                                      }
                                  }}
                                  onCompleted={(data) => {
                                      enqueueSnackbar(generateLabel(edit) + " erfolgreich gespeichert", {variant: 'success'});
                                      history.push(generateUrl(edit), us);
                                  }}
                                  onError={() => {
                                      enqueueSnackbar(generateLabel(old) + " kann nicht gespeichert werden", {variant: 'error'});
                                  }}>
                            {(editSeries, {error}) => (
                                <Formik
                                    initialValues={{
                                        title: old.title,
                                        publisher: {
                                            name: old.publisher.name
                                        },
                                        volume: old.volume,
                                        startyear: old.startyear,
                                        endyear: (old.endyear ? old.endyear : "")
                                    }}
                                    validationSchema={SeriesSchema}
                                    onSubmit={async (values, actions) => {
                                        actions.setSubmitting(true);

                                        await editSeries({
                                            variables: {
                                                old: {
                                                    title: old.title,
                                                    publisher: {
                                                        name: old.publisher.name
                                                    },
                                                    volume: old.volume,
                                                    startyear: old.startyear,
                                                    endyear: parseInt(old.endyear)
                                                },
                                                edit: {
                                                    title: values.title,
                                                    publisher: {
                                                        name: values.publisher.name
                                                    },
                                                    volume: values.volume,
                                                    startyear: values.startyear,
                                                    endyear: parseInt(values.endyear)
                                                }
                                            }
                                        });

                                        actions.setSubmitting(false);
                                        if (error)
                                            actions.resetForm();
                                    }}>
                                    {({resetForm, submitForm, isSubmitting, values, handleChange, touched, errors}) => (
                                        <Form>
                                            <CardHeader title={generateLabel(selected) + " bearbeiten"}/>

                                            <CardContent className="cardContent">
                                                <Field
                                                    className="fieldSmall"
                                                    name="title"
                                                    label="Titel"
                                                    component={TextField}
                                                />
                                                <br/>

                                                <AutoComplete
                                                    id="publisher"
                                                    query={publishers}
                                                    variables={{us: us}}
                                                    suggestionLabel="name"
                                                    type="text"
                                                    name="publisher.name"
                                                    label="Verlag"
                                                    error={touched.publisher && errors.publisher}
                                                    value={values.publisher.name}
                                                    onChange={(field, value) => {
                                                        values.publisher.name = value
                                                    }}
                                                />

                                                <Field
                                                    className="fieldSmall"
                                                    name="volume"
                                                    label="Volume"
                                                    type="number"
                                                    component={TextField}
                                                />
                                                <br/>
                                                <Field
                                                    className="fieldSmall"
                                                    name="startyear"
                                                    label="Startjahr"
                                                    type="number"
                                                    component={TextField}
                                                />
                                                <br/>
                                                <Field
                                                    className="fieldSmall"
                                                    name="endyear"
                                                    label="Endjahr"
                                                    component={TextField}
                                                />

                                                <br/>
                                                <br/>
                                                <div className="formButtons">
                                                    <Button disabled={isSubmitting}
                                                            onClick={() => {
                                                                values = {
                                                                    title: old.title,
                                                                    publisher: {
                                                                        name: old.publisher.name
                                                                    },
                                                                    volume: old.volume,
                                                                    startyear: old.startyear,
                                                                    endyear: (old.endyear ? old.endyear : "")
                                                                };
                                                                resetForm();
                                                            }}
                                                            color="secondary">
                                                        Zurücksetzen
                                                    </Button>
                                                    <Button disabled={isSubmitting}
                                                            component={Link}
                                                            to={lastLocation ? lastLocation : "/"}
                                                            color="primary">
                                                        Abbrechen
                                                    </Button>

                                                    <Button
                                                        className="createButton"
                                                        disabled={isSubmitting}
                                                        onClick={submitForm}
                                                        color="primary">
                                                        Speichern
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Form>
                                    )}
                                </Formik>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        </Layout>
    )
}

export default withContext(SeriesEdit);