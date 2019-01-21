import React from 'react';
import Button from "@material-ui/core/Button/Button";
import {createPublisher} from "../mutations";
import {Mutation} from "react-apollo";
import * as Yup from 'yup';
import {Field, Form, Formik} from 'formik';
import {Checkbox, TextField} from 'formik-material-ui';
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import {withSnackbar} from "notistack";

const PublisherSchema = Yup.object().shape({
    name: Yup.string()
        .required('Required')
});

function PublisherEdit(props) {
    return (
        <Mutation mutation={createPublisher}
                  onCompleted={(data) => {
                      props.enqueueSnackbar("Verlag erfolgreich erstellt", {variant: 'success'});
                  }}
                  onError={() => {
                      props.enqueueSnackbar("Fehler beim Erstellen des Verlags", {variant: 'error'});
                  }}>
            {(createPublisher, {error}) => (
                <Formik
                    initialValues={{
                        name: '',
                        original: false
                    }}
                    validationSchema={PublisherSchema}
                    onSubmit={async (values, actions) => {
                        actions.setSubmitting(true);

                        await createPublisher({
                            variables: {
                                name: values.name,
                                original: values.original
                            }
                        });

                        actions.setSubmitting(false);
                        if (!error)
                            actions.resetForm();
                    }}
                    render={({resetForm, submitForm, isSubmitting}) => (
                        <Form>
                            <Card>
                                <CardHeader title="Verlag erstellen"/>

                                <CardContent>
                                    <Field
                                        className="field"
                                        name="name"
                                        label="Name"
                                        component={TextField}
                                    /><br/>
                                    <Field
                                        name="original" label="Original Verlag?" component={Checkbox}
                                    /><br/>

                                    <Button disabled={isSubmitting}
                                            onClick={() => resetForm()}
                                            color="primary">
                                        Zurücksetzen
                                    </Button>
                                    <Button
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        color="primary">
                                        Erstellen
                                    </Button>
                                </CardContent>
                            </Card>
                        </Form>
                    )}>
                </Formik>
            )}
        </Mutation>
    );
}

export default withSnackbar(PublisherEdit);