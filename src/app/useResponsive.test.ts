import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useResponsive } from "./useResponsive";

const useThemeMock = vi.hoisted(() => vi.fn());
const useMediaQueryMock = vi.hoisted(() => vi.fn());

vi.mock("@mui/material/styles", () => ({
  useTheme: useThemeMock,
}));

vi.mock("@mui/material/useMediaQuery", () => ({
  default: useMediaQueryMock,
}));

describe("useResponsive", () => {
  it("maps media query states to responsive flags", () => {
    useThemeMock.mockReturnValue({
      breakpoints: {
        down: vi.fn(() => "(max-width:600px)"),
        up: vi.fn(() => "(min-width:1200px)"),
      },
    });

    useMediaQueryMock
      .mockReturnValueOnce(true) // orientation
      .mockReturnValueOnce(true) // isPhone
      .mockReturnValueOnce(false); // isDesktop

    const { result } = renderHook(() => useResponsive());
    expect(result.current).toEqual({
      isPhone: true,
      isTablet: false,
      isDesktop: false,
      isLandscape: true,
      isPhoneLandscape: true,
      isTabletLandscape: false,
      isPhonePortrait: false,
      isCompact: true,
      navWide: false,
    });
  });

  it("calculates tablet landscape nav width", () => {
    useThemeMock.mockReturnValue({
      breakpoints: {
        down: vi.fn(() => "(max-width:600px)"),
        up: vi.fn(() => "(min-width:1200px)"),
      },
    });

    useMediaQueryMock
      .mockReturnValueOnce(true) // orientation
      .mockReturnValueOnce(false) // isPhone
      .mockReturnValueOnce(false); // isDesktop

    const { result } = renderHook(() => useResponsive());
    expect(result.current.isTablet).toBe(true);
    expect(result.current.navWide).toBe(true);
    expect(result.current.isCompact).toBe(false);
  });
});
