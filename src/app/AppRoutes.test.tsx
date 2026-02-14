import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const privateRouteSpy = vi.fn();

vi.mock("./PrivateRoute", () => ({
  PrivateRoute: (props: { session?: unknown; authReady?: boolean; children?: unknown }) => {
    privateRouteSpy({ session: props.session, authReady: props.authReady });
    return <>{props.children}</>;
  },
}));

vi.mock("../components/Home", () => ({
  default: () => <div>HOME</div>,
}));

vi.mock("../components/restricted/create/PublisherCreate", () => ({
  default: () => <div>PUBLISHER_CREATE</div>,
}));

import { AppRoutes } from "./AppRoutes";

function renderRoutes(path: string, session?: { loggedIn: boolean }, authReady = false) {
  return render(
    <Suspense fallback={<div>LOADING</div>}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes session={session} authReady={authReady} />
      </MemoryRouter>
    </Suspense>
  );
}

describe("AppRoutes", () => {
  beforeEach(() => {
    privateRouteSpy.mockClear();
  });

  it("redirects root to /de", async () => {
    renderRoutes("/");
    expect(await screen.findByText("HOME")).toBeTruthy();
  });

  it("wraps restricted routes in PrivateRoute guard", async () => {
    const session = { loggedIn: true };
    renderRoutes("/create/publisher", session, true);

    expect(await screen.findByText("PUBLISHER_CREATE")).toBeTruthy();
    expect(privateRouteSpy).toHaveBeenCalledWith({ session, authReady: true });
  });
});
