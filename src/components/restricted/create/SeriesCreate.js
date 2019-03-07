import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation} from "react-apollo";
import {createSeries} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {publishers, series} from "../../../graphql/queries";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import {SeriesSchema} from "../../../util/yupSchema";
import {withContext} from "../../generic";
import AutoComplete from "../../generic/AutoComplete";
import Link from "react-router-dom/es/Link";

function SeriesCreate(props) {
    const {history, enqueueSnackbar, lastLocation, us} = props;

    return (
        <Layout>
            <Mutation mutation={createSeries}
                      update={(cache, result) => {
                          try {
                              let data = cache.readQuery({
                                  query: series,
                                  variables: {
                                      publisher: {
                                          name: result.data.createSeries.publisher.name
                                      }
                                  }
                              });

                              data.series.push(result.data.createSeries);
                              data.series.sort((a, b) => {
                                  return (a.title.toLowerCase() + a.volume).localeCompare((b.title.toLowerCase() + b.volume));
                              });

                              cache.writeQuery({
                                  query: series,
                                  variables: {
                                      publisher: {
                                          name: result.data.createSeries.publisher.name
                                      }
                                  },
                                  data: data
                              });
                          } catch (e) {
                              //ignore cache exception;
                          }
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(generateLabel(data.createSeries) + " erfolgreich erstellt", {variant: 'success'});
                          history.push(generateUrl(data.createSeries));
                      }}
                      onError={() => {
                          enqueueSnackbar("Serie kann nicht erstellt werden", {variant: 'error'});
                      }}>
                {(createSeries, {error}) => (
                    <Formik
                        initialValues={{
                            title: '',
                            publisher: {
                              name: ''
                            },
                            volume: 0,
                            startyear: 0,
                            endyear: 0,
                            addinfo: ''
                        }}
                        validationSchema={SeriesSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            await createSeries({
                                variables: {
                                    series: {
                                        title: values.title,
                                        publisher: {
                                            name: values.publisher.name
                                        },
                                        volume: values.volume,
                                        startyear: values.startyear,
                                        endyear: values.endyear,
                                        addinfo: values.addinfo
                                    }
                                }
                            });

                            actions.setSubmitting(false);
                            if (error)
                                actions.resetForm();
                        }}>
                        {({resetForm, submitForm, isSubmitting, values, setFieldValue, touched, errors}) => (
                            <Form>
                                <CardHeader title="Serie erstellen"/>

                                <CardContent className="cardContent">
                                    <Field
                                        className="field field35"
                                        name="title"
                                        label="Titel"
                                        component={TextField}
                                    />
                                    <br/>

                                    <AutoComplete
                                        id="publisher"
                                        query={publishers}
                                        variables={{us: us}}
                                        name="publisher.name"
                                        label="Verlag"
                                        onChange={(value) => {
                                            setFieldValue("publisher", value, true);
                                        }}
                                        style={{
                                            "width": "35%"
                                        }}
                                        generateLabel={generateLabel}
                                    />

                                    <br/>
                                    <Field
                                        className="field field35"
                                        name="volume"
                                        label="Volume"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="field field35"
                                        name="startyear"
                                        label="Startjahr"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="field field35"
                                        name="endyear"
                                        label="Endjahr"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="field field35"
                                        name="addinfo"
                                        label="Weitere Informationen"
                                        multiline
                                        rows={10}
                                        component={TextField}
                                    />
                                    <br/>
                                    <br/>

                                    <div className="formButtons">
                                        <Button disabled={isSubmitting}
                                                onClick={() => {
                                                    values = {
                                                        title: '',
                                                        publisher: {
                                                            name: ''
                                                        },
                                                        volume: 0,
                                                        startyear: 0,
                                                        endyear: 0,
                                                        addinfo: ''
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
                                            Erstellen
                                        </Button>
                                    </div>
                                </CardContent>
                            </Form>
                        )}
                    </Formik>
                )}
            </Mutation>
        </Layout>
    )
}

export default withContext(SeriesCreate);