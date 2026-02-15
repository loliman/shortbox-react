import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createRootRenderMock: vi.fn(),
  createRootMock: vi.fn(() => ({
    render: vi.fn(),
  })),
  apolloLinkFromMock: vi.fn(() => ({ kind: "composed-link" })),
  createApolloMockLinkMock: vi.fn(() => ({ kind: "mock-link" })),
  onErrorHandler: undefined as undefined | ((args: any) => void),
  setContextHandler: undefined as undefined | ((operation: any, prevContext: any) => any),
  notifySessionInvalidMock: vi.fn(),
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
  onError: (handler: (args: any) => void) => {
    mocks.onErrorHandler = handler;
    return { kind: "error-link" };
  },
}));

vi.mock("@apollo/client/link/context", () => ({
  setContext: (handler: (operation: any, prevContext: any) => any) => {
    mocks.setContextHandler = handler;
    return { kind: "context-link" };
  },
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
  notifySessionInvalid: mocks.notifySessionInvalidMock,
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
    mocks.notifySessionInvalidMock.mockReset();
    mocks.onErrorHandler = undefined;
    mocks.setContextHandler = undefined;
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

  it("covers auth error and csrf context link branches", async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import("./index");

    expect(typeof mocks.onErrorHandler).toBe("function");
    expect(typeof mocks.setContextHandler).toBe("function");

    mocks.onErrorHandler?.({ graphQLErrors: [], operation: { operationName: "Any" } });
    mocks.onErrorHandler?.({
      graphQLErrors: [{ extensions: { code: "UNAUTHENTICATED" } }],
      operation: { operationName: "Login" },
    });
    mocks.onErrorHandler?.({
      graphQLErrors: [{ extensions: { code: "UNAUTHENTICATED" } }],
      operation: { operationName: "ListIssues" },
    });
    expect(mocks.notifySessionInvalidMock).toHaveBeenCalledTimes(1);

    const nonMutationContext = mocks.setContextHandler?.(
      {
        operationName: "ListIssues",
        query: { definitions: [{ kind: "OperationDefinition", operation: "query" }] },
      },
      { headers: { a: "1" } }
    );
    expect(nonMutationContext).toEqual({ headers: { a: "1" } });

    const loginMutationContext = mocks.setContextHandler?.(
      {
        operationName: "Login",
        query: { definitions: [{ kind: "OperationDefinition", operation: "mutation" }] },
      },
      { headers: { a: "1" } }
    );
    expect(loginMutationContext).toEqual({ headers: { a: "1" } });

    const noCookieContext = mocks.setContextHandler?.(
      {
        operationName: "CreateIssue",
        query: { definitions: [{ kind: "OperationDefinition", operation: "mutation" }] },
      },
      { headers: { a: "1" } }
    );
    expect(noCookieContext).toEqual({ headers: { a: "1" } });

    document.cookie = "sb_csrf=token-123";
    const csrfContext = mocks.setContextHandler?.(
      {
        operationName: "CreateIssue",
        query: { definitions: [{ kind: "OperationDefinition", operation: "mutation" }] },
      },
      { headers: { a: "1" } }
    );
    expect(csrfContext).toEqual({
      headers: {
        a: "1",
        "x-csrf-token": "token-123",
      },
    });
  });
});
