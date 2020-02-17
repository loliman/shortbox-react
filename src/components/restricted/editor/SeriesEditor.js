import {SeriesSchema} from "../../../util/yupSchema";
import {FastField, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React from "react";
import {Mutation} from "react-apollo";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@material-ui/core/CardHeader";
import {publishers, series, seriesd} from "../../../graphql/queries";
import {decapitalize, stripItem, wrapItem} from "../../../util/util";
import AutoComplete from "../../generic/AutoComplete";
import {addToCache, removeFromCache, updateInCache} from "./Editor";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class SeriesEditor extends React.Component {
    constructor(props) {
        super(props);

        let defaultValues = props.defaultValues;
        if(!defaultValues)
            defaultValues = {
                title: '',
                publisher: {
                    name: '',
                    us: false
                },
                volume: 1,
                startyear: 1900,
                endyear: 1900,
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

    toogleUs = () => {
        let newDefaultValues = this.state.defaultValues;
        newDefaultValues.publisher.us = !newDefaultValues.publisher.us;
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

                          let newSeries = JSON.parse(JSON.stringify(res));
                          newSeries.publisher.us = this.props.us;

                          try {
                              let publisher = JSON.parse(JSON.stringify(res.publisher));
                              publisher.us = undefined;
                              addToCache(cache, series, stripItem(wrapItem(publisher)), newSeries);
                          } catch (e) {
                              //ignore cache exception;
                          }

                          if(edit) {
                              let publisher = {
                                  name: defaultValues.publisher.name
                              };

                              try {
                                  let series = {
                                      title: defaultValues.title,
                                      volume: defaultValues.volume,
                                      publisher: publisher
                                  };

                                  updateInCache(cache, seriesd, {series: series}, defaultValues, {seriesd: newSeries});
                              } catch (e) {
                                //ignore cache exception;
                              }

                              try {
                                  removeFromCache(cache, series, {publisher: publisher}, defaultValues);
                              } catch (e) {
                                  //ignore cache exception;
                              }
                          }
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {variant: 'success'});
                          navigate(generateUrl(data[mutationName], data[mutationName].publisher.us));
                      }}
                      onError={(errors) => {
                          let message = (errors.graphQLErrors && errors.graphQLErrors.length > 0) ? ' [' + errors.graphQLErrors[0].message + ']' : '';
                          enqueueSnackbar(errorMessage + message, {variant: 'error'});
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
                        {({values, resetForm, submitForm, isSubmitting, setFieldValue}) => {
                            return (
                                <Form>
                                    <CardHeader title={header}
                                                action={
                                                    <FormControlLabel
                                                        className="switchEditor"
                                                        control={
                                                            <Tooltip title={(defaultValues.publisher.us ? "Deutscher" : "US") + " Serie"}>
                                                                <Switch
                                                                    disabled={edit}
                                                                    checked={defaultValues.publisher.us}
                                                                    onChange={() => {
                                                                        this.toogleUs();
                                                                        resetForm();
                                                                    }}
                                                                    color="secondary"/>
                                                            </Tooltip>
                                                        }
                                                        label="US"
                                                    />
                                                }/>

                                    <CardContent className="cardContent">
                                        <FastField
                                            className={this.props.desktop ? "field field35" : "field field100"}
                                            name="title"
                                            label="Titel"
                                            component={TextField}
                                        />
                                        <br/>

                                        <AutoComplete
                                            query={publishers}
                                            variables={{pattern: values.publisher.name, us: defaultValues.publisher.us}}
                                            name="publisher.name"
                                            label="Verlag"
                                            onChange={(option, live) => {
                                                if(live && option !== "")
                                                    setFieldValue("publisher.name", option);
                                                else
                                                    setFieldValue("publisher", option ? option : {name : '', us: defaultValues.publisher.us})
                                            }}
                                            style={{
                                                width: this.props.desktop ? "40.8%" : "100%"
                                            }}
                                            generateLabel={generateLabel}
                                        />
                                        <br/>
                                        <FastField
                                            className={this.props.desktop ? "field field35" : "field field100"}
                                            name="volume"
                                            label="Volume"
                                            type="number"
                                            component={TextField}
                                        />
                                        <br/>
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
                            )
                        }}
                    </Formik>
                )}
            </Mutation>
        );
    }
}

export default withContext(SeriesEditor);
