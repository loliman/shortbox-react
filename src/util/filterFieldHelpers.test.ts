import { vi } from "vitest";
import { getPattern, updateField } from "./filterFieldHelpers";

describe("filterFieldHelpers", () => {
  it("returns trailing pattern value when present", () => {
    expect(getPattern([], "name")).toBeNull();
    expect(getPattern([{ pattern: true, name: "Spi" }], "name")).toBe("Spi");
  });

  it("writes live placeholder values", () => {
    const setFieldValue = vi.fn();

    updateField("Spi", true, [], setFieldValue, "stories[0].individuals", "name");

    expect(setFieldValue).toHaveBeenCalledWith("stories[0].individuals", [
      { pattern: true, name: "Spi" },
    ]);
  });

  it("selects and extends individual type entries", () => {
    const setFieldValue = vi.fn();
    const values = [{ name: "Peter Parker", type: ["WRITER"], role: ["Writer"] }];

    updateField(
      {
        action: "select-option",
        option: { name: "Peter Parker" },
        type: "PENCILER",
        role: "Penciler",
      },
      false,
      values as any,
      setFieldValue,
      "stories[0].individuals",
      "name"
    );

    expect(setFieldValue).toHaveBeenCalledWith("stories[0].individuals", [
      { name: "Peter Parker", type: ["WRITER", "PENCILER"], role: ["Writer", "Penciler"] },
    ]);
  });

  it("removes types and drops empty individual entries", () => {
    const setFieldValue = vi.fn();
    const values = [{ name: "Peter Parker", type: ["WRITER"], role: ["Writer"] }];

    updateField(
      {
        action: "remove-value",
        name: "stories[0].individuals",
        removedValue: { name: "Peter Parker" },
        type: "WRITER",
      },
      false,
      values as any,
      setFieldValue,
      "stories[0].individuals",
      "name"
    );

    expect(setFieldValue).toHaveBeenCalledWith("stories[0].individuals", []);
  });

  it("supports create-option and clear for appearance mode", () => {
    const setFieldValue = vi.fn();
    const values = [{ name: "Spider-Man", type: ["HERO"], role: ["Hero"] }];

    updateField(
      {
        action: "create-option",
        type: "WRITER",
        role: "Writer",
      },
      false,
      values as any,
      setFieldValue,
      "stories[0].individuals",
      "name"
    );

    expect(setFieldValue).toHaveBeenCalledWith("stories[0].individuals", [
      { name: "Spider-Man", type: ["HERO"], role: ["Hero"] },
      { name: "Spider-Man", type: ["WRITER"], role: ["Writer"] },
    ]);

    updateField(
      {
        action: "clear",
        name: "stories[0].appearances",
        type: "HERO",
      },
      false,
      [{ name: "Spider-Man", type: "HERO", role: "Hero" }] as any,
      setFieldValue,
      "stories[0].appearances",
      "name"
    );

    expect(setFieldValue).toHaveBeenLastCalledWith("stories[0].appearances", []);
  });

  it("ignores empty string and unsupported actions", () => {
    const setFieldValue = vi.fn();
    const values = [{ name: "Peter Parker", type: ["WRITER"] }];

    updateField("", true, values as any, setFieldValue, "stories[0].individuals", "name");
    updateField(
      { action: "unknown" } as any,
      false,
      values as any,
      setFieldValue,
      "stories[0].individuals",
      "name"
    );

    expect(setFieldValue).not.toHaveBeenCalled();
  });
});
