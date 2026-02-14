import { IssueSchema } from "../../../util/yupSchema";
import { Form, Formik } from "formik";
import React from "react";
import { Mutation } from "@apollo/client/react/components";
import withContext from "../../generic/withContext";
import { generateLabel, generateUrl } from "../../../util/hierarchy";
import { decapitalize } from "../../../util/util";
import { createEmptyIssueValues } from "./issue-editor/constants";
import { buildIssueMutationVariables } from "./issue-editor/payload";
import { updateIssueEditorCache } from "./issue-editor/cache";
import { buildIssueEditorState } from "./issue-editor/state";
import IssueEditorFormContent from "./issue-editor/IssueEditorFormContent";
import type { IssueEditorProps, IssueEditorState } from "./issue-editor/types";

class IssueEditor extends React.Component<IssueEditorProps, IssueEditorState> {
  constructor(props: IssueEditorProps) {
    super(props);

    const defaultValues = props.defaultValues || createEmptyIssueValues();
    this.state = buildIssueEditorState(props, defaultValues);
  }

  toggleUs = () => {
    this.setState((prevState) => ({
      defaultValues: {
        ...prevState.defaultValues,
        series: {
          ...prevState.defaultValues.series,
          publisher: {
            ...prevState.defaultValues.series.publisher,
            us: !prevState.defaultValues.series.publisher.us,
          },
        },
      },
    }));
  };

  render() {
    const { lastLocation, navigate, enqueueSnackbar, edit, mutation, selected } = this.props;
    const { defaultValues, header, submitLabel, submitAndCopyLabel, successMessage, errorMessage } =
      this.state;

    const mutationDefinition = mutation.definitions[0] as { name?: { value?: string } };
    const mutationName = decapitalize(mutationDefinition.name?.value || "");

    return (
      <Mutation
        mutation={mutation}
        update={(cache, result) => {
          updateIssueEditorCache(cache, result.data || {}, mutationName, edit, defaultValues);
        }}
        onCompleted={(data) => {
          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {
            variant: "success",
          });

          if (!this.state.copy) {
            navigate(null, generateUrl(data[mutationName], data[mutationName].series.publisher.us));
            return;
          }

          const copiedSelection = structuredClone(data[mutationName]);
          copiedSelection.format = undefined;
          copiedSelection.variant = undefined;
          navigate(
            null,
            "/copy/issue" + generateUrl(copiedSelection, copiedSelection.series.publisher.us)
          );
        }}
        onError={(errors) => {
          const message =
            errors.graphQLErrors && errors.graphQLErrors.length > 0
              ? " [" + errors.graphQLErrors[0].message + "]"
              : "";

          enqueueSnackbar(errorMessage + message, { variant: "error" });
        }}
      >
        {(runMutation) => (
          <Formik
            initialValues={defaultValues}
            enableReinitialize
            validationSchema={IssueSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              try {
                const variables = buildIssueMutationVariables(values, defaultValues, edit);
                await runMutation({ variables });
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {({ values, resetForm, submitForm, isSubmitting, setFieldValue }) => (
              <Form>
                <IssueEditorFormContent
                  values={values}
                  edit={edit}
                  isDesktop={this.props.isDesktop}
                  id={this.props.id}
                  session={this.props.session}
                  header={header}
                  submitLabel={submitLabel}
                  submitAndCopyLabel={submitAndCopyLabel}
                  isSubmitting={isSubmitting}
                  setFieldValue={setFieldValue}
                  resetForm={() => resetForm()}
                  onToggleUs={this.toggleUs}
                  onCancel={(event) => {
                    if (this.state.copy && selected) {
                      navigate(event, generateUrl(selected, Boolean(selected.us)));
                      return;
                    }

                    navigate(event, lastLocation ? lastLocation.pathname : "/");
                  }}
                  onSubmitMode={(copyMode) => {
                    this.setState({ copy: copyMode }, submitForm);
                  }}
                />
              </Form>
            )}
          </Formik>
        )}
      </Mutation>
    );
  }
}

export { currencies, formats } from "./issue-editor/constants";
export { getPattern, updateField } from "./IssueEditorSections";
export default withContext(IssueEditor);
