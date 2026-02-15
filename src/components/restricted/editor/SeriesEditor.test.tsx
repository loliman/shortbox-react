import React from "react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  addToCacheMock: vi.fn(),
  removeFromCacheMock: vi.fn(),
  updateInCacheMock: vi.fn(),
  generateLabelMock: vi.fn(() => "Spider-Man"),
  generateUrlMock: vi.fn(() => "/de/marvel/spider-man"),
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
  wrapItem: (value: unknown) => value,
}));

vi.mock("./Editor", () => ({
  addToCache: mocks.addToCacheMock,
  removeFromCache: mocks.removeFromCacheMock,
  updateInCache: mocks.updateInCacheMock,
}));

vi.mock("../../../graphql/queriesTyped", () => ({
  publishers: { kind: "publishers" },
  series: { kind: "series" },
  seriesd: { kind: "seriesd" },
}));

import SeriesEditor from "./SeriesEditor";

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

describe("SeriesEditor", () => {
  it("handles create flow submit and completion", async () => {
    const navigate = vi.fn();
    const enqueueSnackbar = vi.fn();

    const instance = new (SeriesEditor as any)({
      edit: false,
      mutation: { definitions: [{ name: { value: "CreateSeries" } }] },
      navigate,
      enqueueSnackbar,
    });
    instance.setState = (updater: any) => {
      const next = typeof updater === "function" ? updater(instance.state) : updater;
      instance.state = { ...instance.state, ...next };
    };

    const mutationElement = instance.render();
    mutationElement.props.update(
      {},
      { data: { createSeries: { title: "Spider-Man", publisher: { us: false } } } }
    );
    expect(mocks.addToCacheMock).toHaveBeenCalledTimes(1);

    mutationElement.props.onCompleted({
      createSeries: { title: "Spider-Man", publisher: { us: false } },
    });
    expect(enqueueSnackbar).toHaveBeenCalledWith("Spider-Man erfolgreich erstellt", {
      variant: "success",
    });
    expect(navigate).toHaveBeenCalledWith(null, "/de/marvel/spider-man");

    const mutationFn = vi.fn(() => Promise.resolve());
    const formikElement = mutationElement.props.children(mutationFn);
    const actions = { setSubmitting: vi.fn() };
    await formikElement.props.onSubmit({ title: "Spider-Man" }, actions);
    expect(mutationFn).toHaveBeenCalledWith({
      variables: { item: { title: "Spider-Man" } },
    });
    expect(actions.setSubmitting).toHaveBeenCalledTimes(2);

    const resetForm = vi.fn();
    const submitForm = vi.fn();
    const setFieldValue = vi.fn();
    const formTree = formikElement.props.children({
      values: {
        title: "Spider-Man",
        publisher: { name: "Marvel", us: true },
        volume: 1,
        startyear: 1963,
        endyear: 1998,
        addinfo: "",
      },
      resetForm,
      submitForm,
      isSubmitting: false,
      setFieldValue,
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

  it("handles edit flow updates and error callbacks", () => {
    mocks.addToCacheMock.mockReset();
    mocks.removeFromCacheMock.mockReset();
    mocks.updateInCacheMock.mockReset();

    const enqueueSnackbar = vi.fn();
    const defaultValues = {
      title: "Spider-Man",
      publisher: { name: "Marvel", us: false },
      volume: 1,
      startyear: 1963,
      endyear: 1998,
      addinfo: "",
    };

    const instance = new (SeriesEditor as any)({
      edit: true,
      defaultValues,
      mutation: { definitions: [{ name: { value: "EditSeries" } }] },
      navigate: vi.fn(),
      enqueueSnackbar,
    });

    const mutationElement = instance.render();
    mutationElement.props.update(
      {},
      { data: { editSeries: { title: "Spider-Man", publisher: { us: true } } } }
    );

    expect(mocks.updateInCacheMock).toHaveBeenCalledTimes(1);
    expect(mocks.removeFromCacheMock).toHaveBeenCalledTimes(1);

    mutationElement.props.onError({ graphQLErrors: [{ message: "nope" }] });
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Spider-Man konnte nicht gespeichert werden [nope]",
      { variant: "error" }
    );
  });
});
