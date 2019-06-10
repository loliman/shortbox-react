import {PublisherSchema} from "../../../util/yupSchema";
import {FastField, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React from "react";
import {Mutation} from "react-apollo";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@material-ui/core/CardHeader";
import {publisher, publishers} from "../../../graphql/queries";
import {decapitalize, stripItem} from "../../../util/util";
import {addToCache, updateInCache} from "./Editor";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";

class PublisherEditor extends React.Component {
    constructor(props) {
        super(props);

        let defaultValues = props.defaultValues;
        if(!defaultValues)
            defaultValues = {
                name: '',
                startyear: 1900,
                endyear: 1900,
                addinfo: '',
                us: false
            };

        this.state = {
            defaultValues: defaultValues,
            header: props.edit ?
                generateLabel(defaultValues) + " bearbeiten" :
                "Verlag erstellen",
            submitLabel: props.edit ?
                "Speichern" :
                "Erstellen",
            successMessage: props.edit ?
                " erfolgreich gespeichert" :
                " erfolgreich erstellt",
            errorMessage: props.edit ?
                generateLabel(defaultValues) + " konnte nicht gespeichert werden" :
                "Verlag konnte nicht erstellt werden"
        }
    }

    toogleUs = () => {
        let newDefaultValues = this.state.defaultValues;
        newDefaultValues.us = !newDefaultValues.us;
        this.setState({defaultValues: newDefaultValues});
    };

    render() {
        const {lastLocation, navigate, enqueueSnackbar, edit, mutation} = this.props;
        const {defaultValues, header, submitLabel, successMessage, errorMessage} = this.state;

        let mutationName = decapitalize(mutation.definitions[0].name.value);

        return (
            <Mutation mutation={mutation}
                      update={(cache, result) => {
                          let res = result.data[mutationName];

                          if(!edit) {
                              try {
                                  addToCache(cache, publishers, {us: res.us}, res);
                              }   catch (e) {
                                  //ignore cache exception;
                              }
                          } else {
                              try {
                                  let pub = {
                                      name: defaultValues.name,
                                      startyear: defaultValues.startyear,
                                      endyear: defaultValues.endyear
                                  };

                                  updateInCache(cache, publisher, {publisher: pub}, defaultValues, {publisher: res});
                              } catch (e) {
                                  //ignore cache exception;
                              }

                              try {
                                updateInCache(cache, publishers, {us: res.us}, defaultValues, res);
                              } catch (e) {
                                  //ignore cache exception;
                              }
                          }
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {variant: 'success'});
                          navigate(generateUrl(data[mutationName], data[mutationName].us));
                      }}
                      onError={(errors) => {
                          let message = (errors.graphQLErrors && errors.graphQLErrors.length > 0) ? ' [' + errors.graphQLErrors[0].message + ']' : '';
                          enqueueSnackbar(errorMessage + message, {variant: 'error'});
                      }}>
                {(mutation, {error}) => (
                    <Formik
                        initialValues={defaultValues}
                        validationSchema={PublisherSchema}
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
                                <CardHeader title={header}
                                            action={
                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Tooltip title={(values.us ? "Deutscher" : "US") + " Verlag"}>
                                                            <Switch
                                                                disabled={edit}
                                                                checked={defaultValues.us}
                                                                onChange={() => {
                                                                    this.toogleUs();
                                                                    resetForm();
                                                                }}
                                                                color="secondary"/>
                                                        </Tooltip>
                                                    }
                                                    label="US"
                                                />
                                            }
                                />

                                <CardContent className="cardContent">
                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="name"
                                        label="Name"
                                        component={TextField}
                                    />

                                    <br />

                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="startyear"
                                        label="Startjahr"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="endyear"
                                        label="Endjahr"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>

                                    <FastField
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
                                                onClick={() => this.props.navigate(lastLocation ? lastLocation.pathname : "/")}
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

export default withContext(PublisherEditor);