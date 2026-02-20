import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopBarFilterMenu from "./TopBarFilterMenu";

vi.mock("./ExportDialog", () => ({
  default: function MockExportDialog(props: { open?: boolean }) {
    return props.open ? <div data-testid="export-dialog-open">Export dialog open</div> : null;
  },
}));

describe("TopBarFilterMenu", () => {
  it("renders disabled filter button for logged-out users", () => {
    render(<TopBarFilterMenu us={false} selected={{ us: false }} navigate={vi.fn()} session={null} />);

    const button = screen.getByRole("button", { name: "Filter aktuell deaktiviert" });
    expect(button.getAttribute("disabled")).toBe("");
  });

  it("shows disabled tooltip on hover for logged-out users", async () => {
    const user = userEvent.setup();
    render(<TopBarFilterMenu us={false} selected={{ us: false }} navigate={vi.fn()} session={null} />);

    await user.hover(screen.getByTestId("filter-disabled-wrapper"));

    expect(await screen.findByText("Aktuell deaktiviert")).toBeTruthy();
  });

  it("opens menu for active filters and supports edit/reset/export actions for logged-in users", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    const selected = {
      us: true,
      publisher: { name: "Marvel" },
    };

    render(
      <TopBarFilterMenu
        us={true}
        selected={selected as never}
        isFilterActive={true}
        session={{ loggedIn: true }}
        navigate={navigate}
      />
    );

    await user.click(screen.getByRole("button", { name: "Filteroptionen" }));
    await user.click(await screen.findByRole("menuitem", { name: "Bearbeiten" }));

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][1]).toBe("/filter/us");

    await user.click(screen.getByRole("button", { name: "Filteroptionen" }));
    await user.click(await screen.findByRole("menuitem", { name: "Zurücksetzen" }));

    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate.mock.calls[1][1]).toBe("/us/Marvel");
    expect(navigate.mock.calls[1][2]).toEqual({ filter: null });

    await user.click(screen.getByRole("button", { name: "Filteroptionen" }));
    await user.click(await screen.findByRole("menuitem", { name: "Exportieren" }));

    expect(screen.getByTestId("export-dialog-open")).toBeTruthy();
  });
});
