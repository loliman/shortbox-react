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
import {withSnackbar} from "notistack";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import {generateUrl} from "../../../util/hierarchiy";
import {PublisherSchema} from "../../../util/yupSchema";

function PublisherCreate(props) {
    const {history, enqueueSnackbar} = props;

    return (
        <Layout>
            <Mutation mutation={createPublisher}
                      update={(cache, result) => {
                          let data = cache.readQuery({query: publishers,
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
                            name: ''
                        }}
                        validationSchema={PublisherSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            await createPublisher({
                                variables: {
                                    publisher: {
                                        name: values.name
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
                                        className="fieldSmall"
                                        name="name"
                                        label="Name"
                                        component={TextField}
                                    />

                                    <br/>
                                    <br/>

                                    <Button disabled={isSubmitting}
                                            onClick={() => {
                                                values = {
                                                    name: ''
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
export default compose(
    withSnackbar,
    withRouter
)(PublisherCreate);