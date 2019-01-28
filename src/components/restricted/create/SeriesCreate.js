import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation} from "react-apollo";
import {createSeries} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {series} from "../../../graphql/queries";
import {withSnackbar} from "notistack";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import {generateUrl} from "../../../util/hierarchiy";
import {SeriesSchema} from "../../../util/yupSchema";
import {generateLabel, getGqlVariables} from "../../../util/util";

function SeriesCreate(props) {
    const {history, enqueueSnackbar} = props;

    return (
        <Layout>
            <Mutation mutation={createSeries}
                      update={(cache, result) => {
                          let data = cache.readQuery({
                              query: series,
                              variables: getGqlVariables(result.data.createSeries.publisher)
                          });

                          data.series.push(result.data.createSeries);
                          data.series.sort((a, b) => {
                              return (a.title.toLowerCase() + a.volume).localeCompare((b.title.toLowerCase() + b.volume));
                          });

                          cache.writeQuery({
                              query: series,
                              variables: getGqlVariables(result.data.createSeries.publisher),
                              data: data
                          });
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
                            publisher: '',
                            volume: '',
                            startyear: '',
                            endyear: '',
                        }}
                        validationSchema={SeriesSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            await createSeries({
                                variables: {
                                    title: values.title,
                                    publisher_name: values.publisher,
                                    volume: values.volume,
                                    startyear: values.startyear,
                                    endyear: values.endyear,
                                }
                            });

                            actions.setSubmitting(false);
                            if (error)
                                actions.resetForm();
                        }}>
                        {({resetForm, submitForm, isSubmitting}) => (
                            <Form>
                                <CardHeader title="Serie erstellen"/>

                                <CardContent>
                                    <Field
                                        className="fieldSmall"
                                        name="title"
                                        label="Titel"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="fieldSmall"
                                        name="publisher"
                                        label="Verlag"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="fieldSmall"
                                        name="volume"
                                        label="Volume"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="fieldSmall"
                                        name="startyear"
                                        label="Starjahr"
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

                                    <Button disabled={isSubmitting}
                                            onClick={resetForm}
                                            color="secondary">
                                        Zurücksetzen
                                    </Button>
                                    <Button
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        color="primary">
                                        Erstellen
                                    </Button>
                                </CardContent>
                            </Form>
                        )}
                    </Formik>
                )}
            </Mutation>
        </Layout>
    )
}

export default compose(
    withSnackbar,
    withRouter
)(SeriesCreate);