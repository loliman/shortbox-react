import { describe, expect, it } from "vitest";
import { createDefaultFilterValues, parseFilterValues } from "./defaults";

describe("filter defaults", () => {
  it("creates stable default filter values", () => {
    const defaults = createDefaultFilterValues();
    expect(defaults.formats).toEqual([]);
    expect(defaults.releasedates).toEqual([{ date: "1900-01-01", compare: ">" }]);
    expect(defaults.numbers).toEqual([{ number: "", compare: ">", variant: "" }]);
    expect(defaults.withVariants).toBe(false);
  });

  it("parses query filter and normalizes list fields", () => {
    const parsed = parseFilterValues(
      JSON.stringify({
        formats: ["Heft", { name: "Taschenbuch" }, { foo: "bar" }],
        releasedates: [],
        publishers: [{ name: "Marvel" }],
        series: [{ title: "Spider-Man" }, null, 42],
        numbers: [],
        individuals: [{ name: "Peter" }],
        arcs: "Civil War",
        appearances: "Venom",
        withVariants: 1,
        firstPrint: true,
      })
    );

    expect(parsed.formats).toEqual([{ name: "Heft" }, { name: "Taschenbuch" }]);
    expect(parsed.series).toEqual([{ title: "Spider-Man", __typename: "Series" }]);
    expect(parsed.publishers).toEqual([{ name: "Marvel" }]);
    expect(parsed.releasedates).toEqual([{ date: "1900-01-01", compare: ">" }]);
    expect(parsed.numbers).toEqual([{ number: "", compare: ">", variant: "" }]);
    expect(parsed.withVariants).toBe(true);
    expect(parsed.firstPrint).toBe(true);
  });

  it("falls back to defaults on missing/invalid filters", () => {
    expect(parseFilterValues()).toEqual(createDefaultFilterValues());
    expect(parseFilterValues("not-json")).toEqual(createDefaultFilterValues());
  });
});
