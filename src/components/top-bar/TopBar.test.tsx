import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HierarchyLevel } from "../../util/hierarchy";
import { TopBar } from "./TopBar";

vi.mock("./SearchBar", () => ({
  __esModule: true,
  default: function MockSearchBar() {
    return <div data-testid="searchbar-mock">SearchBar</div>;
  },
}));

vi.mock("./TopBarFilterMenu", () => ({
  __esModule: true,
  default: function MockTopBarFilterMenu() {
    return <div data-testid="filter-menu-mock">FilterMenu</div>;
  },
}));

describe("TopBar", () => {
  it("navigates to current locale home via logo button", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    render(<TopBar us={true} selected={{ us: true }} navigate={navigate} />);

    await user.click(screen.getByRole("button", { name: "Zur Startseite" }));

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][1]).toBe("/us");
  });

  it("toggles locale switch and resets filter query", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    render(<TopBar us={true} selected={{ us: true }} navigate={navigate} />);

    await user.click(screen.getByRole("checkbox", { name: "Zu Deutsch wechseln" }));

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][1]).toBe("/de");
    expect(navigate.mock.calls[0][2]).toEqual({ filter: null });
  });

  it("hides logo in phone portrait on non-root levels", () => {
    render(
      <TopBar
        us={false}
        isPhone={true}
        isPhonePortrait={true}
        level={HierarchyLevel.ISSUE}
        selected={{
          us: false,
          issue: {
            number: "1",
            series: { title: "Spider-Man", volume: 1, publisher: { name: "Marvel", us: false } },
          },
        }}
      />
    );

    expect(screen.queryByRole("button", { name: "Zur Startseite" })).toBeNull();
  });
});
