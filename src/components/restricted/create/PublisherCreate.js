import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation} from "react-apollo";
import {createPublisher} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {publishers} from "../../../graphql/queries";
import {generateUrl} from "../../../util/hierarchy";
import {PublisherSchema} from "../../../util/yupSchema";
import Link from "react-router-dom/es/Link";
import {withContext} from "../../generic";

function PublisherCreate(props) {
    const {history, lastLocation, enqueueSnackbar} = props;

    return (
        <Layout>
            <Mutation mutation={createPublisher}
                      update={(cache, result) => {
                          try {
                              let data = cache.readQuery({
                                  query: publishers,
                                  variables: {
                                      us: false
                                  }
                              });
                              data.publishers.push(result.data.createPublisher);
                              data.publishers.sort((a, b) => {
                                  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                              });

                              cache.writeQuery({
                                  query: publishers,
                                  variables: {
                                      us: false
                                  },
                                  data: data
                              });
                          } catch (e) {
                              //ignore cache exception;
                          }
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(data.createPublisher.name + " erfolgreich erstellt", {variant: 'success'});
                          history.push(generateUrl(data.createPublisher));
                      }}
                      onError={() => {
                          enqueueSnackbar("Verlag kann nicht erstellt werden", {variant: 'error'});
                      }}>
                {(createPublisher, {error}) => (
                    <Formik
                        initialValues={{
                            name: '',
                            addinfo: ''
                        }}
                        validationSchema={PublisherSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            await createPublisher({
                                variables: {
                                    publisher: {
                                        name: values.name,
                                        addinfo: values.addinfo
                                    }
                                }
                            });

                            actions.setSubmitting(false);
                            if(error)
                                actions.resetForm();
                        }}>
                        {({values, resetForm, submitForm, isSubmitting}) => (
                            <Form>
                                <CardHeader title="Verlag erstellen" />

                                <CardContent className="cardContent">
                                    <Field
                                        className="field field35"
                                        name="name"
                                        label="Name"
                                        component={TextField}
                                    />

                                    <br />

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
                                                        name: '',
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

export default withContext(PublisherCreate);