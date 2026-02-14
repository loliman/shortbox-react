import { describe, expect, it, vi } from "vitest";

const addToCacheMock = vi.fn();
const updateInCacheMock = vi.fn();
const generateLabelMock = vi.fn(() => "Marvel");
const generateUrlMock = vi.fn(() => "/de/marvel");

vi.mock("../../generic/withContext", () => ({
  default: (Component: unknown) => Component,
}));

vi.mock("../../../util/hierarchy", () => ({
  generateLabel: (...args: unknown[]) => generateLabelMock(...args),
  generateUrl: (...args: unknown[]) => generateUrlMock(...args),
}));

vi.mock("../../../util/util", () => ({
  decapitalize: (value: string) => value.slice(0, 1).toLowerCase() + value.slice(1),
  stripItem: (value: unknown) => value,
}));

vi.mock("./Editor", () => ({
  addToCache: (...args: unknown[]) => addToCacheMock(...args),
  updateInCache: (...args: unknown[]) => updateInCacheMock(...args),
}));

vi.mock("../../../graphql/queriesTyped", () => ({
  publisher: { kind: "publisherQuery" },
  publishers: { kind: "publishersQuery" },
}));

import PublisherEditor from "./PublisherEditor";

describe("PublisherEditor", () => {
  it("handles create flow mutation callbacks", async () => {
    const navigate = vi.fn();
    const enqueueSnackbar = vi.fn();

    const instance = new (PublisherEditor as any)({
      edit: false,
      mutation: { definitions: [{ name: { value: "CreatePublisher" } }] },
      navigate,
      enqueueSnackbar,
    });

    const mutationElement = instance.render();
    mutationElement.props.update({}, { data: { createPublisher: { name: "Marvel", us: true } } });

    expect(addToCacheMock).toHaveBeenCalledTimes(1);
    mutationElement.props.onCompleted({ createPublisher: { name: "Marvel", us: true } });
    expect(enqueueSnackbar).toHaveBeenCalledWith("Marvel erfolgreich erstellt", {
      variant: "success",
    });
    expect(navigate).toHaveBeenCalledWith(null, "/de/marvel");

    const mutationFn = vi.fn(() => Promise.resolve());
    const formikElement = mutationElement.props.children(mutationFn);
    const actions = { setSubmitting: vi.fn() };
    await formikElement.props.onSubmit({ name: "Marvel", us: true }, actions);

    expect(mutationFn).toHaveBeenCalledWith({
      variables: { item: { name: "Marvel", us: true } },
    });
    expect(actions.setSubmitting).toHaveBeenCalledTimes(2);
  });

  it("handles edit flow cache updates and error messaging", () => {
    addToCacheMock.mockReset();
    updateInCacheMock.mockReset();
    const enqueueSnackbar = vi.fn();

    const defaultValues = {
      name: "Marvel",
      startyear: 1961,
      endyear: 2026,
      addinfo: "",
      us: false,
    };
    const instance = new (PublisherEditor as any)({
      edit: true,
      defaultValues,
      mutation: { definitions: [{ name: { value: "EditPublisher" } }] },
      navigate: vi.fn(),
      enqueueSnackbar,
    });

    const mutationElement = instance.render();
    mutationElement.props.update({}, { data: { editPublisher: { name: "Marvel", us: false } } });
    expect(updateInCacheMock).toHaveBeenCalledTimes(2);

    mutationElement.props.onError({ graphQLErrors: [{ message: "denied" }] });
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Marvel konnte nicht gespeichert werden [denied]",
      { variant: "error" }
    );
  });
});
