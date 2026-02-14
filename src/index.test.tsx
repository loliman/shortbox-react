import { beforeEach, describe, expect, it, vi } from "vitest";

const createRootRenderMock = vi.fn();
const createRootMock = vi.fn(() => ({
  render: createRootRenderMock,
}));
const apolloLinkFromMock = vi.fn(() => ({ kind: "composed-link" }));
const createApolloMockLinkMock = vi.fn(() => ({ kind: "mock-link" }));

vi.mock("react-dom/client", () => ({
  createRoot: (...args: unknown[]) => createRootMock(...args),
}));

vi.mock("@apollo/client", () => ({
  ApolloClient: class {
    constructor(_: unknown) {}
  },
  ApolloLink: {
    from: (...args: unknown[]) => apolloLinkFromMock(...args),
  },
  HttpLink: class {
    constructor(_: unknown) {}
  },
  InMemoryCache: class {},
}));

vi.mock("@apollo/client/react", () => ({
  ApolloProvider: (props: { children?: unknown }) => <>{props.children}</>,
}));

vi.mock("@apollo/client/link/error", () => ({
  onError: () => ({ kind: "error-link" }),
}));

vi.mock("@apollo/client/link/context", () => ({
  setContext: () => ({ kind: "context-link" }),
}));

vi.mock("notistack", () => ({
  SnackbarProvider: (props: { children?: unknown }) => <>{props.children}</>,
}));

vi.mock("react-router-dom", () => ({
  BrowserRouter: (props: { children?: unknown }) => <>{props.children}</>,
}));

vi.mock("./components/App", () => ({
  default: () => <div>APP</div>,
}));

vi.mock("./mock/apolloMockLink", () => ({
  createApolloMockLink: (...args: unknown[]) => createApolloMockLinkMock(...args),
}));

vi.mock("./app/mockMode", () => ({
  isMockMode: false,
}));

vi.mock("./app/authEvents", () => ({
  notifySessionInvalid: vi.fn(),
}));

describe("index bootstrap", () => {
  beforeEach(() => {
    vi.resetModules();
    createRootRenderMock.mockReset();
    createRootMock.mockReset();
    apolloLinkFromMock.mockReset();
    createApolloMockLinkMock.mockReset();
    document.body.innerHTML = "";
  });

  it("mounts the app when root exists", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import("./index");

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(createRootRenderMock).toHaveBeenCalledTimes(1);
    expect(apolloLinkFromMock).toHaveBeenCalledTimes(1);
  });

  it("does nothing when root element is missing", async () => {
    document.body.innerHTML = '<div id="other"></div>';

    await import("./index");

    expect(createRootMock).not.toHaveBeenCalled();
  });
});
