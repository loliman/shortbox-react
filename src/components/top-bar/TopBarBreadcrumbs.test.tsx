import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BreadcrumbCompact, BreadcrumbExpanded, buildBreadcrumbTokens } from "./TopBarBreadcrumbs";
import { HierarchyLevel } from "../../util/hierarchy";

const issueSelection = {
  us: true,
  issue: {
    number: "1",
    series: {
      title: "Spider-Man",
      volume: 1,
      publisher: { name: "Marvel", us: true },
    },
  },
};

describe("TopBarBreadcrumbs", () => {
  it("builds no tokens on root level", () => {
    expect(
      buildBreadcrumbTokens(
        { level: HierarchyLevel.ROOT, us: false, selected: { us: false } },
        "compact"
      )
    ).toEqual([]);
    expect(
      buildBreadcrumbTokens(
        { level: HierarchyLevel.ROOT, us: false, selected: { us: false } },
        "expanded"
      )
    ).toEqual([]);
  });

  it("renders expanded breadcrumbs and navigates through publisher and series links", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    render(
      <BreadcrumbExpanded
        level={HierarchyLevel.ISSUE}
        us={true}
        selected={issueSelection as never}
        navigate={navigate}
      />
    );

    await user.click(screen.getByRole("button", { name: "Marvel" }));
    await user.click(screen.getByRole("button", { name: "Spider-Man (Vol. I)" }));

    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate.mock.calls[0][1]).toBe("/us/Marvel");
    expect(navigate.mock.calls[1][1]).toBe("/us/Marvel/Spider-Man_Vol_1");
  });

  it("renders compact breadcrumb back navigation on issue level", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    const { container } = render(
      <BreadcrumbCompact
        level={HierarchyLevel.ISSUE}
        us={true}
        selected={issueSelection as never}
        navigate={navigate}
      />
    );

    expect(screen.getByText("#1")).toBeTruthy();

    const backButton = container.querySelector("button");
    expect(backButton).toBeTruthy();
    await user.click(backButton as HTMLButtonElement);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][1]).toBe("/us/Marvel/Spider-Man_Vol_1");
  });
});
