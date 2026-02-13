import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { acceptCookies, CookiesBanner, declineCookies, hasCookieConsent } from "./Cookies";

describe("CookiesBanner", () => {
  it("hides banner when cookie consent is string or boolean", () => {
    expect(hasCookieConsent("true")).toBe(true);
    expect(hasCookieConsent("false")).toBe(true);
    expect(hasCookieConsent(true)).toBe(true);
    expect(hasCookieConsent(false)).toBe(true);
  });

  it("renders banner when consent cookie is missing", () => {
    const markup = renderToStaticMarkup(
      <CookiesBanner cookies={{ get: () => undefined }} navigate={vi.fn()} />
    );

    expect(markup).toContain("Shortbox verwendet Cookies");
  });

  it("does not render banner when consent cookie is set", () => {
    const markup = renderToStaticMarkup(
      <CookiesBanner cookies={{ get: () => "true" }} navigate={vi.fn()} />
    );

    expect(markup).toBe("");
  });
});

describe("cookie actions", () => {
  it("acceptCookies stores cookie with global options", () => {
    const set = vi.fn();
    acceptCookies({ set });

    expect(set).toHaveBeenCalledWith(
      "cookiesAccepted",
      "true",
      expect.objectContaining({ path: "/", sameSite: "lax" })
    );
  });

  it("declineCookies stores cookie with global options", () => {
    const set = vi.fn();
    declineCookies({ set });

    expect(set).toHaveBeenCalledWith(
      "cookiesAccepted",
      "false",
      expect.objectContaining({ path: "/", sameSite: "lax" })
    );
  });
});
