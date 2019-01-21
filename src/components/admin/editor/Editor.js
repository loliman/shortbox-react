import React from 'react';
import {generateLabel, getHierarchyLevel, HierarchyLevel} from "../../../util/util";
import PublisherEditor from './PublisherEditor';
import {editPublisher} from "../../../graphql/mutations";
import {getListQuery} from "../../../graphql/queries";
import {Mutation} from "react-apollo";
import {Form, Formik} from "formik";
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Button from "@material-ui/core/Button/Button";
import * as Yup from "yup";
import {withSnackbar} from "notistack";

function Editor(props) {
    let level = getHierarchyLevel(props.context.selected);
    let editMutation = getEditMutation(level);
    let getQuery = getListQuery(level);
    let labels = getEditLabels(level, generateLabel(props.context.edit));

    let id = props.context.selected ? props.context.selected.id : null;
    let variables = {
        us: (!props.context.us ? false : true),
        publisher_id: id,
        series_id: id
    };

    let form;
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            form = <PublisherEditor />;
            break;
        case HierarchyLevel.ISSUE:
        case HierarchyLevel.SERIES:
        default:
            form = null;
    }

    return (
        <Mutation mutation={editMutation.gql}
                  update={async (cache, result) => {
                      let data = cache.readQuery({query: getQuery, variables: variables});

                      let idx = 0;
                      data[level].some((e, i) => {
                          idx = i;
                          return e.id === result.data[editMutation.name].id;
                      });

                      data[level][idx] = result.data[editMutation.name];
                      let newData = {};

                      newData[level] = sort(data[level], level);

                      cache.writeQuery({
                          query: getQuery,
                          variables: variables,
                          data: newData,
                      });
                  }}
                  onCompleted={() => {
                      props.handleEdit();
                      props.enqueueSnackbar(labels.error, {variant: 'success'});
                  }}
                  onError={() => {
                      props.enqueueSnackbar(labels.success, {variant: 'error'});
                  }}>
            {(mutation, {error}) => (
                <Formik
                    initialValues={props.context.edit}
                    validationSchema={getSchema(level)}
                    onSubmit={async (values, actions) => {
                        actions.setSubmitting(true);

                        values.id = parseInt(values.id);
                        await mutation({
                            variables: values
                        });

                        actions.setSubmitting(false);
                        if (!error)
                            actions.resetForm();
                    }}
                    render={({resetForm, submitForm, isSubmitting}) => (
                        <Form>
                            <Card>
                                <CardHeader title={labels.header}/>

                                <CardContent>
                                    {form}

                                    <br/>

                                    <Button disabled={isSubmitting}
                                            onClick={() => resetForm()}
                                            color="primary">
                                        Zurücksetzen
                                    </Button>
                                    <Button
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        color="primary">
                                        Speichern
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

function getEditMutation(level) {
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            return {
                gql: editPublisher,
                name: "editPublisher"
            };
        default:
            return null;
    }
}

function getEditLabels(level, title) {
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            return {
                error: title + " erfolgreich gespeichert",
                success: title + " konnte nicht gespeichert werden",
                header: title + " bearbeiten"
            };
        default:
            return null;
    }
}

function sort(updated, level) {
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            return updated.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return null;
    }
}

function getSchema(level) {
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            return Yup.object().shape({
                name: Yup.string()
                    .required('Required')
            });
        default:
            return null;
    }
}

export default withSnackbar(Editor)
