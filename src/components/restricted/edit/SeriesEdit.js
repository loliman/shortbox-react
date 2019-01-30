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
import {generateLabel, getGqlVariables} from "../../../util/util";
import QueryResult from "../../generic/QueryResult";
import {SeriesSchema} from "../../../util/yupSchema";
import {generateUrl} from "../../../util/hierarchiy";
import AutoComplete from "../../generic/AutoComplete";


function SeriesEdit(props) {
    const {selected, history, enqueueSnackbar, us} = props;

    let o;

    return (
        <Layout>
            <Query query={seriesd} variables={getGqlVariables(selected)}>
                {({loading, error, data}) => {
                    o = data;
                    if (loading || error || !o.seriesd)
                        return <QueryResult loading={loading} error={error} data={o.seriesd} selected={selected}/>;

                    return (
                        <Mutation mutation={editSeries}
                                  update={(cache, result) => {
                                      let data = cache.readQuery({
                                          query: series,
                                          variables: {
                                              publisher_name: o.seriesd.publisher.name
                                          }
                                      });

                                      let idx = 0;
                                      data.series.some((e, i) => {
                                          idx = i;
                                          return e.id === o.seriesd.id;
                                      });

                                      data.series[idx] = result.data.editSeries;

                                      cache.writeQuery({
                                          query: series,
                                          variables: {
                                              publisher_name: o.seriesd.publisher.name
                                          },
                                          data: data
                                      });

                                      data = cache.readQuery({
                                          query: series,
                                          variables: getGqlVariables(selected)
                                      });

                                      data.series = result.data.editSeries;

                                      cache.writeQuery({
                                          query: series,
                                          variables: getGqlVariables(selected),
                                          data: data
                                      });
                                  }}
                                  onCompleted={(data) => {
                                      enqueueSnackbar(generateLabel(selected) + " erfolgreich gespeichert", {variant: 'success'});
                                      history.push(generateUrl(selected.publisher, o.seriesd.publisher.us));
                                  }}
                                  onError={() => {
                                      enqueueSnackbar(generateLabel(selected) + " kann nicht gespeichert werden", {variant: 'error'});
                                  }}>
                            {(editSeries, {error}) => (
                                <Formik
                                    initialValues={{
                                        title: o.seriesd.title,
                                        publisher: o.seriesd.publisher.name,
                                        volume: o.seriesd.volume,
                                        startyear: o.seriesd.startyear,
                                        endyear: o.seriesd.endyear
                                    }}
                                    validationSchema={SeriesSchema}
                                    onSubmit={async (values, actions) => {
                                        actions.setSubmitting(true);

                                        await editSeries({
                                            variables: {
                                                title_old: o.seriesd.title,
                                                volume_old: o.seriesd.volume,
                                                publisher_old: o.seriesd.publisher.name,
                                                title: values.title,
                                                publisher: values.publisher,
                                                volume: values.volume,
                                                startyear: values.startyear,
                                                endyear: values.endyear
                                            }
                                        });

                                        actions.setSubmitting(false);
                                        if (error)
                                            actions.resetForm();
                                    }}>
                                    {({resetForm, submitForm, isSubmitting, values, handleChange, touched, errors}) => (
                                        <Form>
                                            <CardHeader title={generateLabel(selected) + " bearbeiten"}/>

                                            <CardContent>
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
                                                    variables={getGqlVariables(null, us)}
                                                    suggestionLabel="name"
                                                    type="text"
                                                    name="publisher"
                                                    label="Verlag"
                                                    error={touched.publisher && errors.publisher}
                                                    value={values.publisher}
                                                    onChange={(field, value) => {
                                                        values[field] = value
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
                                                    type="number"
                                                    component={TextField}
                                                />

                                                <br/>
                                                <br/>

                                                <Button disabled={isSubmitting}
                                                        onClick={() => {
                                                            values = {
                                                                title: '',
                                                                publisher: '',
                                                                volume: '',
                                                                startyear: '',
                                                                endyear: '',
                                                            };
                                                            resetForm();
                                                        }}
                                                        color="secondary">
                                                    Zurücksetzen
                                                </Button>
                                                <Button
                                                    disabled={isSubmitting}
                                                    onClick={submitForm}
                                                    color="primary">
                                                    Speichern
                                                </Button>
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