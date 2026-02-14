import { describe, expect, it, vi } from "vitest";

const createEmptyIssueValuesMock = vi.fn(() => ({
  title: "",
  series: { title: "", volume: 1, publisher: { name: "", us: false } },
  number: "",
  variant: "",
  cover: "",
  format: "",
  releasedate: "",
  individuals: [],
  addinfo: "",
  stories: [],
  features: [],
  covers: [],
}));
const buildIssueEditorStateMock = vi.fn((props: any, defaultValues: any) => ({
  defaultValues,
  header: props.edit ? "Ausgabe bearbeiten" : "Ausgabe erstellen",
  submitLabel: "Speichern",
  submitAndCopyLabel: "Speichern und kopieren",
  successMessage: " erfolgreich gespeichert",
  errorMessage: "Fehler",
  copy: false,
}));
const buildIssueMutationVariablesMock = vi.fn(() => ({ item: { title: "Issue" } }));
const updateIssueEditorCacheMock = vi.fn();
const formContentSpy = vi.fn();
const generateLabelMock = vi.fn(() => "Issue #1");
const generateUrlMock = vi.fn(() => "/de/marvel/spider-man/1");

vi.mock("../../generic/withContext", () => ({
  default: (Component: unknown) => Component,
}));

vi.mock("../../../util/hierarchy", () => ({
  generateLabel: (...args: unknown[]) => generateLabelMock(...args),
  generateUrl: (...args: unknown[]) => generateUrlMock(...args),
}));

vi.mock("../../../util/util", () => ({
  decapitalize: (value: string) => value.slice(0, 1).toLowerCase() + value.slice(1),
}));

vi.mock("./issue-editor/constants", () => ({
  createEmptyIssueValues: (...args: unknown[]) => createEmptyIssueValuesMock(...args),
  currencies: [],
  formats: [],
}));

vi.mock("./issue-editor/state", () => ({
  buildIssueEditorState: (...args: unknown[]) => buildIssueEditorStateMock(...args),
}));

vi.mock("./issue-editor/payload", () => ({
  buildIssueMutationVariables: (...args: unknown[]) => buildIssueMutationVariablesMock(...args),
}));

vi.mock("./issue-editor/cache", () => ({
  updateIssueEditorCache: (...args: unknown[]) => updateIssueEditorCacheMock(...args),
}));

vi.mock("./issue-editor/IssueEditorFormContent", () => ({
  default: (props: unknown) => {
    formContentSpy(props);
    return <div>IssueEditorFormContent</div>;
  },
}));

import IssueEditor from "./IssueEditor";

describe("IssueEditor", () => {
  it("wires mutation callbacks and submit pipeline", async () => {
    const navigate = vi.fn();
    const enqueueSnackbar = vi.fn();
    const instance = new (IssueEditor as any)({
      edit: true,
      mutation: { definitions: [{ name: { value: "EditIssue" } }] },
      navigate,
      enqueueSnackbar,
      selected: { issue: { number: "1", series: { title: "Spider-Man", volume: 1 } } },
    });

    const mutationElement = instance.render();
    mutationElement.props.update(
      {},
      { data: { editIssue: { number: "1", series: { publisher: {} } } } }
    );
    expect(updateIssueEditorCacheMock).toHaveBeenCalledTimes(1);

    mutationElement.props.onCompleted({
      editIssue: { number: "1", series: { publisher: { us: false } } },
    });
    expect(enqueueSnackbar).toHaveBeenCalledWith("Issue #1 erfolgreich gespeichert", {
      variant: "success",
    });
    expect(navigate).toHaveBeenCalledWith(null, "/de/marvel/spider-man/1");

    mutationElement.props.onError({ graphQLErrors: [{ message: "denied" }] });
    expect(enqueueSnackbar).toHaveBeenCalledWith("Fehler [denied]", { variant: "error" });

    const runMutation = vi.fn(() => Promise.resolve());
    const formikElement = mutationElement.props.children(runMutation);
    const actions = { setSubmitting: vi.fn() };
    await formikElement.props.onSubmit({ title: "Issue" }, actions);
    expect(buildIssueMutationVariablesMock).toHaveBeenCalled();
    expect(runMutation).toHaveBeenCalledWith({ variables: { item: { title: "Issue" } } });
    expect(actions.setSubmitting).toHaveBeenCalledTimes(2);
  });

  it("supports copy navigation and form content actions", () => {
    const navigate = vi.fn();
    const instance = new (IssueEditor as any)({
      edit: false,
      mutation: { definitions: [{ name: { value: "CreateIssue" } }] },
      navigate,
      enqueueSnackbar: vi.fn(),
      selected: {
        us: true,
        issue: {
          number: "1",
          series: { title: "Spider-Man", volume: 1, publisher: { us: true } },
        },
      },
      lastLocation: { pathname: "/de" },
    });

    instance.setState = (updater: any, callback?: () => void) => {
      const next = typeof updater === "function" ? updater(instance.state) : updater;
      instance.state = { ...instance.state, ...next };
      if (callback) callback();
    };

    const mutationElement = instance.render();

    instance.state.copy = true;
    mutationElement.props.onCompleted({
      createIssue: {
        number: "2",
        format: "A",
        variant: "B",
        series: { publisher: { us: true } },
      },
    });
    expect(navigate).toHaveBeenCalledWith(null, "/copy/issue/de/marvel/spider-man/1");

    const runMutation = vi.fn(() => Promise.resolve());
    const formikElement = mutationElement.props.children(runMutation);
    const formElement = formikElement.props.children({
      values: instance.state.defaultValues,
      resetForm: vi.fn(),
      submitForm: vi.fn(),
      isSubmitting: false,
      setFieldValue: vi.fn(),
    });
    const formContentProps = formElement.props.children.props as Record<string, any>;
    formContentProps.onToggleUs();
    expect(instance.state.defaultValues.series.publisher.us).toBe(true);

    formContentProps.onCancel({ type: "click" });
    expect(navigate).toHaveBeenCalledWith({ type: "click" }, "/de/marvel/spider-man/1");
  });
});
