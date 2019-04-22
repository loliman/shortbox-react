import React from 'react';
import Button from "@material-ui/core/Button/Button";
import {login} from "../graphql/mutations";
import {Mutation} from "react-apollo";
import {sha256} from 'js-sha256';
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Link from "react-router-dom/es/Link";
import {withContext} from "./generic";
import {LoginSchema} from "../util/yupSchema";

function Login(props) {
    return (
        <Mutation mutation={login}
                  onCompleted={(data) => {
                      props.enqueueSnackbar("Willkommen!", {variant: 'success'});
                      props.handleLogin(data.login);
                      props.history.push(props.lastLocation ? props.lastLocation : "/");
                  }}
                  onError={(errors) => {
                      props.enqueueSnackbar("Login fehlgeschlagen [" + errors.graphQLErrors[0].message + "]", {variant: 'error'});
                  }}>
            {(login) => (
                <Formik
                    initialValues={{
                        name: '',
                        password: ''
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, actions) => {
                        let password = sha256(values.password);
                        await login({
                            variables: {
                                user : {
                                    name: values.name,
                                    password: password
                                }
                            }
                        });

                        actions.setSubmitting(false);
                    }}>
                    {({resetForm, submitForm, isSubmitting}) => (
                        <Form id="loginForm">
                            <Card>
                                <CardHeader title="Login"
                                            subheader="Bitte Benutzername und Passwort eingeben"/>

                                <CardContent>
                                    <Field
                                        className="field field100"
                                        name="name"
                                        label="Name"
                                        component={TextField}
                                    /><br/>
                                    <Field
                                        className="field field100"
                                        name="password"
                                        type="password"
                                        label="Passwort"
                                        component={TextField}
                                    />
                                    <div id="loginButtons">
                                        <Button disabled={isSubmitting}
                                                component={Link}
                                                to={props.lastLocation ? props.lastLocation : "/"}
                                                color="secondary">
                                            Abbrechen
                                        </Button>
                                        <Button
                                            disabled={isSubmitting}
                                            onClick={submitForm}
                                            color="primary">
                                            Login
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Form>
                    )}
                </Formik>
            )}
        </Mutation>
    );
}

export default withContext(Login);