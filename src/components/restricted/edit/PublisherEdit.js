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
import {generateLabel, getGqlVariables} from "../../../util/util";
import QueryResult from "../../generic/QueryResult";
import {PublisherSchema} from "../../../util/yupSchema";
import {generateUrl} from "../../../util/hierarchiy";


function PublisherEdit(props) {
    const {selected, history, enqueueSnackbar} = props;
    let old;
    let neew;

    return (
        <Layout>
            <Query query={publisher} variables={getGqlVariables(selected)}>
                {({loading, error, data}) => {
                    old = data.publisher;

                    if (loading || error || !old)
                        return <QueryResult loading={loading} error={error} data={old} selected={selected}/>;

                    return (
                        <Mutation mutation={editPublisher}
                                  update={(cache, result) => {
                                      neew = result.data.editPublisher;

                                      let data = cache.readQuery({query: publishers,
                                          variables: {
                                              us: old.us
                                          }
                                      });

                                      let idx = 0;
                                      data.publishers.some((e, i) => {
                                          idx = i;
                                          return e.id === old.id;
                                      });

                                      data.publishers[idx] = neew;

                                      cache.writeQuery({
                                          query: publishers,
                                          variables: {
                                              us: old.us
                                          },
                                          data: data
                                      });
                                  }}
                                  onCompleted={(data) => {
                                      enqueueSnackbar(neew.name + " erfolgreich gespeichert", {variant: 'success'});
                                      history.push(generateUrl(null, neew.us));
                                  }}
                                  onError={() => {
                                      enqueueSnackbar(generateLabel({name: old.name}) + " kann nicht gespeichert werden", {variant: 'error'});
                                  }}>
                            {(editPublisher, {error}) => (
                                <Formik
                                    initialValues={{
                                        name: old.name
                                    }}
                                    validationSchema={PublisherSchema}
                                    onSubmit={async (values, actions) => {
                                        actions.setSubmitting(true);

                                        await editPublisher({
                                            variables: {
                                                name_old: old.name,
                                                name: values.name
                                            }
                                        });

                                        actions.setSubmitting(false);
                                        if(error)
                                            actions.resetForm();
                                    }}>
                                    {({values, resetForm, submitForm, isSubmitting}) => (
                                        <Form>
                                            <CardHeader title={generateLabel(selected) + " bearbeiten"} />

                                            <CardContent>
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
export default withContext(PublisherEdit);