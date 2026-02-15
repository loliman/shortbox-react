import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppContext } from "./AppContext";

const navigateRouterMock = vi.fn();
const enqueueSnackbarMock = vi.fn();
const closeSnackbarMock = vi.fn();
const getSelectedMock = vi.fn();
const getHierarchyLevelMock = vi.fn();
const generateLabelMock = vi.fn();

let mockLocation = {
  pathname: "/de",
  search: "",
  hash: "",
  state: null as unknown,
  key: "k1",
};
let mockParams: Record<string, string> = {};

vi.mock("react-router-dom", () => ({
  useLocation: () => mockLocation,
  useNavigate: () => navigateRouterMock,
  useParams: () => mockParams,
}));

vi.mock("notistack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: enqueueSnackbarMock,
    closeSnackbar: closeSnackbarMock,
  }),
}));

vi.mock("../../util/hierarchy", () => ({
  HierarchyLevel: {
    ROOT: "ROOT",
    PUBLISHER: "PUBLISHER",
  },
  generateLabel: (...args: unknown[]) => generateLabelMock(...args),
  getHierarchyLevel: (...args: unknown[]) => getHierarchyLevelMock(...args),
  getSelected: (...args: unknown[]) => getSelectedMock(...args),
}));

import withContext from "./withContext";

describe("withContext", () => {
  beforeEach(() => {
    navigateRouterMock.mockReset();
    enqueueSnackbarMock.mockReset();
    closeSnackbarMock.mockReset();
    getSelectedMock.mockReset();
    getHierarchyLevelMock.mockReset();
    generateLabelMock.mockReset();
    vi.stubGlobal("open", vi.fn());
  });

  it("injects context props, sets title and navigates in-app", async () => {
    mockLocation = {
      pathname: "/de/marvel",
      search: "?filter=spider&expand=1",
      hash: "",
      state: null,
      key: "k1",
    };
    mockParams = { publisher: "marvel" };
    getSelectedMock.mockReturnValue({ publisher: { name: "Marvel" } });
    getHierarchyLevelMock.mockReturnValue("PUBLISHER");
    generateLabelMock.mockReturnValue("Marvel");

    let receivedProps: Record<string, unknown> | null = null;
    const Wrapped = withContext((props: Record<string, unknown>) => {
      receivedProps = props;
      return <div>wrapped</div>;
    });

    render(
      <AppContext.Provider
        value={
          {
            resetLoadingComponents: vi.fn(),
          } as any
        }
      >
        <Wrapped someProp="value" />
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(document.title).toBe("Marvel - Shortbox");
      expect(receivedProps).not.toBeNull();
    });

    (receivedProps as any).navigate(null, "/target", { foo: "bar", empty: "" });

    const targetUrl = String(navigateRouterMock.mock.calls[0][0]);
    expect(targetUrl.startsWith("/target?")).toBe(true);
    expect(targetUrl.includes("filter=spider")).toBe(true);
    expect(targetUrl.includes("foo=bar")).toBe(true);
    expect(targetUrl.includes("expand=")).toBe(false);
    expect((receivedProps as any).enqueueSnackbar).toBe(enqueueSnackbarMock);
    expect((receivedProps as any).closeSnackbar).toBe(closeSnackbarMock);
  });

  it("opens in new tab for modifier-click and ignores unsupported mouse buttons", async () => {
    mockLocation = {
      pathname: "/create/issue/us",
      search: "",
      hash: "",
      state: null,
      key: "k2",
    };
    mockParams = {};
    getSelectedMock.mockReturnValue({});
    getHierarchyLevelMock.mockReturnValue("ROOT");
    generateLabelMock.mockReturnValue("Ignored");

    let receivedProps: Record<string, unknown> | null = null;
    const Wrapped = withContext((props: Record<string, unknown>) => {
      receivedProps = props;
      return <div>wrapped</div>;
    });

    render(
      <AppContext.Provider
        value={
          {
            resetLoadingComponents: vi.fn(),
          } as any
        }
      >
        <Wrapped />
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(document.title).toBe("Ausgabe erstellen - Shortbox");
      expect(receivedProps).not.toBeNull();
    });

    (receivedProps as any).navigate({ metaKey: true, button: 0 }, "/new-tab", { foo: "bar" });
    expect(globalThis.open).toHaveBeenCalledWith("/new-tab?foo=bar", "_blank", "noreferrer");
    expect(navigateRouterMock).not.toHaveBeenCalled();

    (receivedProps as any).navigate({ button: 2 }, "/ignored");
    expect((globalThis.open as any).mock.calls).toHaveLength(1);
    expect(navigateRouterMock).not.toHaveBeenCalled();
  });
});
