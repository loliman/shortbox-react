import React from "react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  addToCacheMock: vi.fn(),
  updateInCacheMock: vi.fn(),
  generateLabelMock: vi.fn(() => "Marvel"),
  generateUrlMock: vi.fn(() => "/de/marvel"),
}));

vi.mock("../../generic/withContext", () => ({
  default: (Component: unknown) => Component,
}));

vi.mock("../../../util/hierarchy", () => ({
  generateLabel: mocks.generateLabelMock,
  generateUrl: mocks.generateUrlMock,
}));

vi.mock("../../../util/util", () => ({
  decapitalize: (value: string) => value.slice(0, 1).toLowerCase() + value.slice(1),
  stripItem: (value: unknown) => value,
}));

vi.mock("./Editor", () => ({
  addToCache: mocks.addToCacheMock,
  updateInCache: mocks.updateInCacheMock,
}));

vi.mock("../../../graphql/queriesTyped", () => ({
  publisher: { kind: "publisherQuery" },
  publishers: { kind: "publishersQuery" },
}));

import PublisherEditor from "./PublisherEditor";

function walkElements(node: unknown, visitor: (element: any) => void) {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((entry) => walkElements(entry, visitor));
    return;
  }
  if (!React.isValidElement(node)) return;

  const element = node as React.ReactElement<any>;
  visitor(element);
  React.Children.forEach(element.props?.children, (child) => {
    walkElements(child, visitor);
  });
}

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
    instance.setState = (updater: any) => {
      const next = typeof updater === "function" ? updater(instance.state) : updater;
      instance.state = { ...instance.state, ...next };
    };

    const mutationElement = instance.render();
    mutationElement.props.update({}, { data: { createPublisher: { name: "Marvel", us: true } } });

    expect(mocks.addToCacheMock).toHaveBeenCalledTimes(1);
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

    const resetForm = vi.fn();
    const submitForm = vi.fn();
    const formTree = formikElement.props.children({
      values: {
        name: "Marvel",
        startyear: 1961,
        endyear: 2026,
        addinfo: "",
        us: true,
      },
      resetForm,
      submitForm,
      isSubmitting: false,
    });

    const clickHandlers: Array<(event?: unknown) => void> = [];
    const changeHandlers: Array<(event?: unknown) => void> = [];
    walkElements(formTree, (element) => {
      if (typeof element.props?.onClick === "function") clickHandlers.push(element.props.onClick);
      if (typeof element.props?.onChange === "function")
        changeHandlers.push(element.props.onChange);
    });
    clickHandlers.forEach((handler) => handler({ button: 0 }));
    changeHandlers.forEach((handler) => handler({}));

    expect(resetForm).toHaveBeenCalled();
    expect(submitForm).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
  });

  it("handles edit flow cache updates and error messaging", () => {
    mocks.addToCacheMock.mockReset();
    mocks.updateInCacheMock.mockReset();
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
    expect(mocks.updateInCacheMock).toHaveBeenCalledTimes(2);

    mutationElement.props.onError({ graphQLErrors: [{ message: "denied" }] });
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Marvel konnte nicht gespeichert werden [denied]",
      { variant: "error" }
    );
  });
});
