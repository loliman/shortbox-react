import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createRootRenderMock: vi.fn(),
  createRootMock: vi.fn(() => ({
    render: vi.fn(),
  })),
  apolloLinkFromMock: vi.fn(() => ({ kind: "composed-link" })),
  createApolloMockLinkMock: vi.fn(() => ({ kind: "mock-link" })),
}));
mocks.createRootMock.mockImplementation(() => ({
  render: mocks.createRootRenderMock,
}));

vi.mock("react-dom/client", () => ({
  createRoot: mocks.createRootMock,
}));

vi.mock("@apollo/client", () => ({
  ApolloClient: class {
    constructor(_: unknown) {}
  },
  ApolloLink: {
    from: mocks.apolloLinkFromMock,
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
  createApolloMockLink: mocks.createApolloMockLinkMock,
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
    mocks.createRootRenderMock.mockReset();
    mocks.createRootMock.mockReset();
    mocks.createRootMock.mockImplementation(() => ({
      render: mocks.createRootRenderMock,
    }));
    mocks.apolloLinkFromMock.mockReset();
    mocks.createApolloMockLinkMock.mockReset();
    document.body.innerHTML = "";
  });

  it("mounts the app when root exists", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import("./index");

    expect(mocks.createRootMock).toHaveBeenCalledTimes(1);
    expect(mocks.createRootRenderMock).toHaveBeenCalledTimes(1);
    expect(mocks.apolloLinkFromMock).toHaveBeenCalledTimes(1);
  });

  it("does nothing when root element is missing", async () => {
    document.body.innerHTML = '<div id="other"></div>';

    await import("./index");

    expect(mocks.createRootMock).not.toHaveBeenCalled();
  });
});
