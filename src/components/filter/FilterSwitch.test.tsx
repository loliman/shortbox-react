import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSwitch from "./FilterSwitch";

describe("FilterSwitch", () => {
  it("toggles switch through user click", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<FilterSwitch checked={false} label="Exklusiv" onToggle={onToggle} />);

    await user.click(screen.getByRole("checkbox", { name: "Exklusiv" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("uses custom class name when provided", () => {
    const { container } = render(
      <FilterSwitch
        checked={true}
        label="US"
        onToggle={() => undefined}
        className="custom-switch"
      />
    );

    expect(container.querySelector(".custom-switch")).toBeTruthy();
  });
});
