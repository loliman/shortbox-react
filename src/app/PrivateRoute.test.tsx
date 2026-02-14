import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PrivateRoute } from "./PrivateRoute";

describe("PrivateRoute", () => {
  it("renders nothing while auth is not ready", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/secure"]}>
        <PrivateRoute authReady={false} session={{ loggedIn: true }}>
          <div>secure-content</div>
        </PrivateRoute>
      </MemoryRouter>
    );
    expect(container.textContent).toBe("");
  });

  it("renders children when logged in", () => {
    render(
      <MemoryRouter initialEntries={["/secure"]}>
        <PrivateRoute authReady={true} session={{ loggedIn: true }}>
          <div>secure-content</div>
        </PrivateRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("secure-content")).toBeTruthy();
  });

  it("redirects to login when no session exists", () => {
    render(
      <MemoryRouter initialEntries={["/secure"]}>
        <Routes>
          <Route
            path="/secure"
            element={
              <PrivateRoute authReady={true} session={{ loggedIn: false }}>
                <div>secure-content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>login-page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("login-page")).toBeTruthy();
  });
});

