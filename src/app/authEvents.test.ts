import { describe, expect, it, vi } from "vitest";
import { notifySessionInvalid, subscribeSessionInvalid } from "./authEvents";

describe("authEvents", () => {
  it("notifies and unsubscribes listeners", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeSessionInvalid(listener);

    notifySessionInvalid();
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    notifySessionInvalid();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("is a no-op when window is unavailable", () => {
    vi.stubGlobal("window", undefined);

    const listener = vi.fn();
    const unsubscribe = subscribeSessionInvalid(listener);
    expect(() => notifySessionInvalid()).not.toThrow();
    unsubscribe();

    expect(listener).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
