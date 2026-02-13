import React from "react";
import Button from "@mui/material/Button";
import { login } from "../graphql/mutationsTyped";
import { useApolloClient, useMutation } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import { TextField } from "./generic/FormikTextField";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { withContext } from "./generic";
import { LoginSchema } from "../util/yupSchema";
import { sha256Hex } from "../util/crypto";

function Login(props) {
  const client = useApolloClient();
  const [runLogin] = useMutation(login, {
    onCompleted: (data) => {
      props.enqueueSnackbar("Willkommen!", { variant: "success" });
      props.handleLogin(data.login);
      client.resetStore();
      props.navigate(null, props.lastLocation ? props.lastLocation.pathname : "/");
    },
    onError: (errors) => {
      let message =
        errors.graphQLErrors && errors.graphQLErrors.length > 0
          ? " [" + errors.graphQLErrors[0].message + "]"
          : "";
      props.enqueueSnackbar("Login fehlgeschlagen" + message, { variant: "error" });
    },
  });

  return (
    <Formik
      initialValues={{
        name: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={async (values, actions) => {
        let password = await sha256Hex(values.password);
        await runLogin({
          variables: {
            user: {
              name: values.name,
              password: password,
            },
          },
        });

        actions.setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form id="loginForm">
          <Card>
            <CardHeader title="Login" subheader="Bitte Benutzername und Passwort eingeben" />

            <CardContent>
              <Field className="field field100" name="name" label="Name" component={TextField} />
              <br />
              <Field
                className="field field100"
                name="password"
                type="password"
                label="Passwort"
                component={TextField}
              />
              <div id="loginButtons">
                <Button
                  disabled={isSubmitting}
                  onMouseDown={(e) =>
                    props.navigate(e, props.lastLocation ? props.lastLocation.pathname : "/")
                  }
                  color="secondary"
                >
                  Abbrechen
                </Button>
                <Button disabled={isSubmitting} onClick={submitForm} color="primary">
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

export default withContext(Login);
