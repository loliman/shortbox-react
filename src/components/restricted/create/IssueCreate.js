import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation} from "react-apollo";
import {createIssue} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {issues, publishers, series} from "../../../graphql/queries";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import {IssueSchema} from "../../../util/yupSchema";
import {withContext} from "../../generic";
import AutoComplete from "../../generic/AutoComplete";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

function IssueCreate(props) {
    const {history, enqueueSnackbar, us} = props;

    return (
        <Layout>
            <Mutation mutation={createIssue}
                      update={(cache, result) => {
                          let data = cache.readQuery({
                              query: issues,
                              variables: result.data.createIssue.series
                          });

                          data.series.push(result.data.createIssue);
                          data.series.sort((a, b) => {
                              return (a.series.title.toLowerCase() + a.number)
                                  .localeCompare((b.series.title.toLowerCase() + b.number));
                          });

                          cache.writeQuery({
                              query: issues,
                              variables: result.data.createIssue.series,
                              data: data
                          });
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(generateLabel(data.createIssue) + " erfolgreich erstellt", {variant: 'success'});
                          history.push(generateUrl(data.createIssue));
                      }}
                      onError={() => {
                          enqueueSnackbar("Ausgabe kann nicht erstellt werden", {variant: 'error'});
                      }}>
                {(createIssue, {error}) => (
                    <Formik
                        initialValues={{
                            title: '',
                            publisher: '',
                            seriestitle: '',
                            seriesvolume: '',
                            number: '',
                            limitation: '',
                            pages: '',
                            releasedate: '',
                            price: '',
                            currency: 'EUR'
                        }}
                        validationSchema={IssueSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            await createIssue({
                                variables: {
                                    title: values.title,
                                    publisher: values.publisher,
                                    seriestitle: values.seriestitle,
                                    seriesvolume: values.seriesvolume,
                                    number: values.number,
                                    pages: parseInt(values.pages),
                                    releasedate: values.releasedate,
                                    price: parseFloat(values.price),
                                    currency: values.currency
                                }
                            });

                            actions.setSubmitting(false);
                            if (error)
                                actions.resetForm();
                        }}>
                        {({resetForm, submitForm, isSubmitting, values, handleChange, touched, errors}) => (
                            <Form>
                                <CardHeader title="Ausgabe erstellen"/>

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
                                        name="publisher"
                                        label="Verlag"
                                        error={touched.publisher && errors.publisher}
                                        value={values.publisher}
                                        onChange={(field, value) => {
                                            values[field] = value
                                        }}
                                    />

                                    <AutoComplete
                                        disabled={!values.publisher || values.publisher.trim().length === 0}
                                        id="series"
                                        query={series}
                                        variables={{name: values.publisher}}
                                        suggestionLabel="title"
                                        type="text"
                                        name="seriestitle"
                                        label="Serie"
                                        error={touched.seriestitle && errors.seriestitle}
                                        value={values.seriestitle}
                                        onChange={(field, value) => {
                                            values[field] = value
                                        }}
                                    />

                                    <Field
                                        disabled={!values.publisher || values.publisher.trim().length === 0}
                                        className="fieldSmall"
                                        name="seriesvolume"
                                        label="Volume"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="fieldSmall"
                                        name="number"
                                        label="Nummer"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="fieldSmall"
                                        name="pages"
                                        label="Seiten"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="fieldSmall"
                                        name="releasedate"
                                        label="Erscheinungsdatum"
                                        type="date"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className="fieldSmall"
                                        name="price"
                                        label="Preis"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        type="text"
                                        name="currency"
                                        label="Währung"
                                        select
                                        component={TextField}
                                        className="fieldSmall"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                        <MenuItem key="eur" value="EUR">
                                            EUR
                                        </MenuItem>
                                        <MenuItem key="dem" value="DEM">
                                            DEM
                                        </MenuItem>
                                    </Field>
                                    <br/>
                                    <br/>

                                    <Button disabled={isSubmitting}
                                            onClick={() => {
                                                values = {
                                                    title: '',
                                                    publisher: '',
                                                    seriestitle: '',
                                                    seriesvolume: '',
                                                    number: '',
                                                    limitation: '',
                                                    pages: '',
                                                    releasedate: '',
                                                    price: '',
                                                    currency: 'EUR'
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

export default withContext(IssueCreate);