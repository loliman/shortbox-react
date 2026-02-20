import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FooterLinks from "./FooterLinks";

vi.mock("./FooterAuthLink", () => ({
  default: () => <div>AuthLink</div>,
}));

describe("FooterLinks", () => {
  it("renders footer links and forwards navigation", () => {
    const navigate = vi.fn();
    render(<FooterLinks navigate={navigate} isPhonePortrait={false} />);

    expect(screen.getByText("AuthLink")).toBeTruthy();
    expect(screen.getByText("Kontakt / Fehler melden / Unterstützen")).toBeTruthy();
    expect(screen.getByText("Impressum")).toBeTruthy();
    expect(screen.getByText("Datenschutz")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Kontakt / Fehler melden / Unterstützen" }));
    fireEvent.click(screen.getByRole("button", { name: "Impressum" }));
    fireEvent.click(screen.getByRole("button", { name: "Datenschutz" }));

    expect(navigate).toHaveBeenNthCalledWith(1, null, "/contact");
    expect(navigate).toHaveBeenNthCalledWith(2, null, "/impress");
    expect(navigate).toHaveBeenNthCalledWith(3, null, "/privacy");
  });

  it("uses short contact text on phone portrait", () => {
    render(<FooterLinks isPhonePortrait />);
    expect(screen.getByText("Kontakt")).toBeTruthy();
  });
});
