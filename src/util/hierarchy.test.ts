import { generateUrl, getHierarchyLevel, getSelected, HierarchyLevel } from "./hierarchy";

describe("hierarchy util", () => {
  it("detects hierarchy levels", () => {
    expect(getHierarchyLevel({})).toBe(HierarchyLevel.ROOT);
    expect(getHierarchyLevel({ publisher: { name: "Marvel" } })).toBe(HierarchyLevel.PUBLISHER);
    expect(
      getHierarchyLevel({
        series: {
          title: "Spider-Man",
          volume: 1,
          publisher: { name: "Marvel" },
        },
      })
    ).toBe(HierarchyLevel.SERIES);
    expect(
      getHierarchyLevel({
        issue: {
          number: "1",
          series: {
            title: "Spider-Man",
            volume: 1,
            publisher: { name: "Marvel" },
          },
        },
      })
    ).toBe(HierarchyLevel.ISSUE);
  });

  it("builds issue URLs with format and variant", () => {
    const url = generateUrl(
      {
        issue: {
          number: "1",
          format: "HC",
          variant: "B",
          series: {
            title: "Spider-Man",
            volume: 1,
            publisher: { name: "Marvel" },
          },
        },
      },
      false
    );

    expect(url).toBe("/de/Marvel/Spider-Man_Vol_1/1/HC_B");
  });

  it("parses route params into selected issue object", () => {
    const selected = getSelected(
      {
        publisher: "Marvel",
        series: "Spider-Man_Vol_1",
        issue: "1",
        variant: "HC_B",
      },
      true
    );

    expect(selected).toEqual({
      us: true,
      issue: {
        number: "1",
        format: "HC",
        variant: "B",
        series: {
          title: "Spider-Man",
          volume: 1,
          publisher: { name: "Marvel" },
        },
      },
    });
  });
});
