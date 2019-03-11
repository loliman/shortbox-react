import {SeriesSchema} from "../../../util/yupSchema";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import Link from "react-router-dom/es/Link";
import React from "react";
import {Mutation} from "react-apollo";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@material-ui/core/CardHeader";
import {publishers, series} from "../../../graphql/queries";
import {decapitalize, stripItem} from "../../../util/util";
import AutoComplete from "../../generic/AutoComplete";
import {addToCache, removeFromCache} from "./Editor";

class SeriesEditor extends React.Component {
    constructor(props) {
        super(props);

        let defaultValues = props.defaultValues;
        if(!defaultValues)
            defaultValues = {
                title: '',
                publisher: {
                    name: ''
                },
                volume: 0,
                startyear: 0,
                endyear: 0,
                addinfo: ''
            };

        this.state = {
            defaultValues: defaultValues,
            header: props.edit ?
                generateLabel(defaultValues) + " bearbeiten" :
                "Serie erstellen",
            submitLabel: props.edit ?
                "Speichern" :
                "Erstellen",
            successMessage: props.edit ?
                " erfolgreich gespeichert" :
                " erfolgreich erstellt",
            errorMessage: props.edit ?
                generateLabel(defaultValues) + " konnte nicht gespeichert werden" :
                "Serie konnte nicht erstellt werden"
        }
    }

    render() {
        const {lastLocation, history, enqueueSnackbar, edit, mutation, us} = this.props;
        const {defaultValues, header, submitLabel, successMessage, errorMessage} = this.state;

        let mutationName = decapitalize(mutation.definitions[0].name.value);

        return (
            <Mutation mutation={mutation}
                      update={(cache, result) => {
                          let res = result.data[mutationName];

                          try {
                              addToCache(cache, series, res.publisher, res);
                          } catch (e) {
                              //ignore cache exception;
                          }

                          if(edit)
                              try {
                                  removeFromCache(cache, series, defaultValues.publisher, defaultValues);
                              } catch (e) {
                                  //ignore cache exception;
                              }
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {variant: 'success'});
                          history.push(generateUrl(data[mutationName]));
                      }}
                      onError={() => {
                          enqueueSnackbar(errorMessage, {variant: 'error'});
                      }}>
                {(mutation, {error}) => (
                    <Formik
                        initialValues={defaultValues}
                        validationSchema={SeriesSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            let variables = {};
                            variables.item = stripItem(values);
                            if(edit)
                                variables.old = stripItem(defaultValues);

                            await mutation({
                                variables: variables
                            });

                            actions.setSubmitting(false);
                            if(error)
                                actions.resetForm();
                        }}>
                        {({values, resetForm, submitForm, isSubmitting, setFieldValue}) => (
                            <Form>
                                <CardHeader title={header} />

                                <CardContent className="cardContent">
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="title"
                                        label="Titel"
                                        component={TextField}
                                    />
                                    <br/>

                                    <AutoComplete
                                        id="publisher"
                                        query={publishers}
                                        variables={{us: us}}
                                        name="publisher.name"
                                        label="Verlag"
                                        onChange={(value) => {
                                            setFieldValue("publisher", value, true);
                                        }}
                                        style={{
                                            "width": this.props.desktop ? "35%" : "100%"
                                        }}
                                        generateLabel={generateLabel}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="volume"
                                        label="Volume"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="startyear"
                                        label="Startjahr"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="endyear"
                                        label="Endjahr"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
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
                                                    values = defaultValues;
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
                                            {submitLabel}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Form>
                        )}
                    </Formik>
                )}
            </Mutation>
        );
    }
}

export default withContext(SeriesEditor);