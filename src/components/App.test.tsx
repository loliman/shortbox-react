import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const queryMock = vi.fn();
const clearStoreMock = vi.fn();
const routesSpy = vi.fn();
const sessionInvalidListeners: Array<() => void> = [];
let mockMode = false;

vi.mock("@apollo/client", () => ({
  useApolloClient: () => ({
    query: (...args: unknown[]) => queryMock(...args),
    clearStore: (...args: unknown[]) => clearStoreMock(...args),
  }),
}));

vi.mock("./generic/AppContext", () => ({
  default: (props: { children?: unknown }) => <>{props.children}</>,
}));

vi.mock("../app/AppRoutes", () => ({
  AppRoutes: (props: { session?: { loggedIn?: boolean }; authReady?: boolean }) => {
    routesSpy(props);
    return (
      <div data-testid="routes">
        {props.authReady ? "ready" : "pending"}-{props.session?.loggedIn ? "in" : "out"}
      </div>
    );
  },
}));

vi.mock("../app/mockMode", () => ({
  get isMockMode() {
    return mockMode;
  },
}));

vi.mock("../app/authEvents", () => ({
  subscribeSessionInvalid: (listener: () => void) => {
    sessionInvalidListeners.push(listener);
    return () => {};
  },
}));

vi.mock("../graphql/queriesTyped", () => ({
  me: { kind: "Document" },
}));

import App from "./App";

describe("App", () => {
  beforeEach(() => {
    mockMode = false;
    queryMock.mockReset();
    clearStoreMock.mockReset();
    routesSpy.mockReset();
    sessionInvalidListeners.length = 0;
  });

  it("boots authenticated state immediately in mock mode", async () => {
    mockMode = true;
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("routes").textContent).toBe("ready-in");
    });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it("loads session via me query in live mode", async () => {
    queryMock.mockResolvedValueOnce({ data: { me: { id: "1" } } });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("routes").textContent).toBe("ready-in");
    });
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it("handles query errors and session invalidation", async () => {
    queryMock.mockRejectedValueOnce(new Error("boom"));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("routes").textContent).toBe("ready-out");
    });

    expect(sessionInvalidListeners).toHaveLength(1);
    sessionInvalidListeners[0]();

    await waitFor(() => {
      expect(clearStoreMock).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("routes").textContent).toBe("ready-out");
    });
  });
});
