import { describe, expect, it, vi } from "vitest";

const addToCacheMock = vi.fn();
const removeFromCacheMock = vi.fn();
const updateInCacheMock = vi.fn();
const generateLabelMock = vi.fn(() => "Spider-Man");
const generateUrlMock = vi.fn(() => "/de/marvel/spider-man");

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
  wrapItem: (value: unknown) => value,
}));

vi.mock("./Editor", () => ({
  addToCache: (...args: unknown[]) => addToCacheMock(...args),
  removeFromCache: (...args: unknown[]) => removeFromCacheMock(...args),
  updateInCache: (...args: unknown[]) => updateInCacheMock(...args),
}));

vi.mock("../../../graphql/queriesTyped", () => ({
  publishers: { kind: "publishers" },
  series: { kind: "series" },
  seriesd: { kind: "seriesd" },
}));

import SeriesEditor from "./SeriesEditor";

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

    const mutationElement = instance.render();
    mutationElement.props.update(
      {},
      { data: { createSeries: { title: "Spider-Man", publisher: { us: false } } } }
    );
    expect(addToCacheMock).toHaveBeenCalledTimes(1);

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
  });

  it("handles edit flow updates and error callbacks", () => {
    addToCacheMock.mockReset();
    removeFromCacheMock.mockReset();
    updateInCacheMock.mockReset();

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

    expect(updateInCacheMock).toHaveBeenCalledTimes(1);
    expect(removeFromCacheMock).toHaveBeenCalledTimes(1);

    mutationElement.props.onError({ graphQLErrors: [{ message: "nope" }] });
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Spider-Man konnte nicht gespeichert werden [nope]",
      { variant: "error" }
    );
  });
});
