import React from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import {login} from "../mutations";
import {Mutation} from "react-apollo";
import {sha256} from 'js-sha256';
import {AppContext} from "./AppContext";
import {withSnackbar} from "notistack";
import * as Yup from 'yup';
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';

const LoginSchema = Yup.object().shape({
    name: Yup.string()
        .required('Required'),
    password: Yup.string()
        .required('Required')
});


function LoginDialog(props) {
    return (
        <AppContext.Consumer>
            {({handleLogin}) => (
                <Mutation mutation={login}
                          onCompleted={(data) => {
                              props.enqueueSnackbar("Willkommen!", {variant: 'success'});
                              props.handleLogin(data.login, handleLogin)
                          }}
                          onError={() => {
                              props.enqueueSnackbar("Login fehlgeschlagen", {variant: 'error'});
                          }}>
                    {(login) => (
                        <Formik
                            initialValues={{
                                name: '',
                                password: ''
                            }}
                            validationSchema={LoginSchema}
                            onSubmit={async (values, actions) => {
                                actions.setSubmitting(true);

                                let password = sha256(values.password);
                                await login({
                                    variables: {
                                        name: values.name,
                                        password: password
                                    }
                                });

                                actions.setSubmitting(false);
                            }}
                            render={({resetForm, submitForm, isSubmitting}) => (
                                <Form>
                                    <Dialog open={props.open}
                                            onClose={props.handleClose}
                                            aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Login</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Bitte Benutzername und Passwort eingeben
                                            </DialogContentText>
                                            <Field
                                                className="field"
                                                name="name"
                                                label="Name"
                                                component={TextField}
                                            /><br/>
                                            <Field
                                                className="field"
                                                name="password"
                                                type="password"
                                                label="Passwort"
                                                component={TextField}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button disabled={isSubmitting}
                                                    onClick={() => {
                                                        resetForm();
                                                        props.handleClose()
                                                    }}
                                                    color="primary">
                                                Abbrechen
                                            </Button>
                                            <Button
                                                disabled={isSubmitting}
                                                onClick={submitForm}
                                                color="primary">
                                                Login
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Form>
                            )}>
                        </Formik>
                    )}
                </Mutation>
            )}
        </AppContext.Consumer>
    );
}

export default withSnackbar(LoginDialog);