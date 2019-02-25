import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation, Query} from "react-apollo";
import {editPublisher} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {publisher, publishers} from "../../../graphql/queries";
import {withContext} from "../../generic";
import {compare, generateLabel, generateUrl} from "../../../util/hierarchy";
import QueryResult from "../../generic/QueryResult";
import {PublisherSchema} from "../../../util/yupSchema";
import Link from "react-router-dom/es/Link";

function PublisherEdit(props) {
    const {selected, history, lastLocation, enqueueSnackbar, us} = props;
    let old;
    let edit;

    return (
        <Layout>
            <Query query={publisher} variables={selected}>
                {({loading, error, data}) => {
                    old = data.publisher;

                    if (loading || error || !old)
                        return <QueryResult loading={loading} error={error} data={old} selected={selected}/>;

                    return (
                        <Mutation mutation={editPublisher}
                                  update={(cache, result) => {
                                      try {
                                          edit = result.data.editPublisher;

                                          let data = cache.readQuery({
                                              query: publishers,
                                              variables: {us: us}
                                          });

                                          let idx = 0;
                                          data.publishers.some((e, i) => {
                                              idx = i-1;
                                              return !compare(e, old);
                                          });

                                          data.publishers[idx] = edit;

                                          cache.writeQuery({
                                              query: publishers,
                                              variables: {us: us},
                                              data: data
                                          })
                                      } catch (e) {
                                          //ignore cache exception;
                                      }
                                  }}
                                  onCompleted={(data) => {
                                      enqueueSnackbar(edit.name + " erfolgreich gespeichert", {variant: 'success'});
                                      history.push(generateUrl(edit), us);
                                  }}
                                  onError={() => {
                                      enqueueSnackbar(generateLabel({name: old.name}) + " kann nicht gespeichert werden", {variant: 'error'});
                                  }}>
                            {(editPublisher, {error}) => (
                                <Formik
                                    initialValues={{
                                        name: old.name,
                                        addinfo: old.addinfo
                                    }}
                                    validationSchema={PublisherSchema}
                                    onSubmit={async (values, actions) => {
                                        actions.setSubmitting(true);

                                        await editPublisher({
                                            variables: {
                                                old: {
                                                    name: old.name
                                                },
                                                edit: {
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
                                            <CardHeader title={generateLabel(selected) + " bearbeiten"} />

                                            <CardContent className="cardContent">
                                                <Field
                                                    className="field field35"
                                                    name="name"
                                                    label="Name"
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
                                                                    name: old.name,
                                                                    addino: old.addinfo
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
export default withContext(PublisherEdit);