import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation} from "react-apollo";
import {createIssue} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {SimpleFileUpload, TextField} from 'formik-material-ui';
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
                            series: {
                                title: '',
                                volume: '',
                                publisher: {
                                    name: ''
                                }
                            },
                            number: '',
                            cover: '',
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
                                    series: {
                                        title: values.series.title,
                                        volume: values.series.volume,
                                        publisher: {
                                            name: values.series.publisher.name
                                        }
                                    },
                                    number: values.number,
                                    cover: values.cover,
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
                        {({resetForm, submitForm, isSubmitting, values, setFieldValue, touched, errors}) => {
                            return (
                                <Form>
                                    <CardHeader title="Ausgabe erstellen"/>

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
                                            name="series.publisher.name"
                                            label="Verlag"
                                            error={touched.series && touched.series.publisher && errors.series && errors.series.publisher}
                                            onChange={(value) => {
                                                setFieldValue("series.publisher", value, true);
                                            }}
                                            width="35%"
                                        />

                                        <br/>

                                        <AutoComplete
                                            disabled={!values.series.publisher.name ||
                                                values.series.publisher.name.trim().length === 0}
                                            id="series"
                                            query={series}
                                            variables={{publisher: {name: values.series.publisher.name}}}
                                            name="series.title"
                                            label="Serie"
                                            error={touched.series && errors.series}
                                            onChange={(value) => {
                                                setFieldValue("series", value, true);
                                            }}
                                            width="25%"
                                        />

                                        <Field
                                            disabled={!values.series.publisher.name ||
                                                values.series.publisher.name.trim().length === 0}
                                            className="field field10"
                                            name="series.volume"
                                            label="Volume"
                                            type="number"
                                            component={TextField}
                                        />
                                        <br/>
                                        <Field
                                            className="field field35"
                                            name="number"
                                            label="Nummer"
                                            component={TextField}
                                        />
                                        <br/>
                                        <div className="field field35 fieldFileUpload">
                                            <Field
                                                name="cover"
                                                label="Cover"
                                                component={SimpleFileUpload}
                                            />
                                        </div>
                                        <Field
                                            className="field field35"
                                            name="pages"
                                            label="Seiten"
                                            type="number"
                                            component={TextField}
                                        />
                                        <br/>
                                        <Field
                                            className="field field35"
                                            name="releasedate"
                                            label="Erscheinungsdatum"
                                            type="date"
                                            component={TextField}
                                        />
                                        <br/>
                                        <Field
                                            className="field field25"
                                            name="price"
                                            label="Preis"
                                            type="number"
                                            component={TextField}
                                        />

                                        <Field
                                            type="text"
                                            name="currency"
                                            label="Währung"
                                            select
                                            component={TextField}
                                            className="field field10"
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
                                                        series: {
                                                            title: values.series.title,
                                                            volume: values.series.volume,
                                                            publisher: {
                                                                name: values.series.publisher.name
                                                            }
                                                        },
                                                        number: '',
                                                        cover: '',
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
                            )
                        }}
                    </Formik>
                )}
            </Mutation>
        </Layout>
    )
}

export default withContext(IssueCreate);