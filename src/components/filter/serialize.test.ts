import { serializeFilterValues } from "./serialize";
import type { FilterValues } from "./types";

function createBaseValues(): FilterValues {
  return {
    formats: [],
    withVariants: false,
    releasedates: [],
    publishers: [],
    series: [],
    numbers: [],
    arcs: "",
    individuals: [],
    appearances: "",
    firstPrint: false,
    onlyPrint: false,
    onlyTb: false,
    exclusive: false,
    reprint: false,
    otherOnlyTb: false,
    onlyOnePrint: false,
    noPrint: false,
    onlyCollected: false,
    onlyNotCollected: false,
    sellable: false,
    noCover: false,
    noContent: false,
    and: false,
  };
}

describe("serializeFilterValues", () => {
  it("returns null when nothing is selected", () => {
    expect(serializeFilterValues(createBaseValues(), true)).toBeNull();
  });

  it("serializes selected values and strips transport-only metadata", () => {
    const values = createBaseValues();
    values.formats = [{ name: "HC" }];
    values.withVariants = true;
    values.releasedates = [
      { compare: ">=", date: "1900-01-01" },
      { compare: ">=", date: "2020-01-01" },
    ];
    values.publishers = [
      { __typename: "Publisher", id: 1, us: true, name: "Marvel", __resolveType: "Publisher" },
    ];
    values.series = [
      {
        __typename: "Series",
        id: 2,
        title: "Spider-Man",
        volume: 1,
        publisher: { __typename: "Publisher", id: 3, name: "Marvel", us: true },
      },
    ];
    values.numbers = [
      { compare: "=", number: "", variant: "" },
      { compare: ">=", number: "10", variant: "" },
    ];
    values.arcs = "Maximum Carnage";
    values.individuals = [
      { __typename: "Individual", name: "Peter Parker", type: ["WRITER"], role: ["Writer"] },
    ];
    values.appearances = "Spider-Man";
    values.firstPrint = true;
    values.onlyPrint = true;
    values.otherOnlyTb = true;
    values.and = true;

    const payload = serializeFilterValues(values, false);

    expect(payload).not.toBeNull();
    expect(payload).toMatchObject({
      formats: ["HC"],
      withVariants: true,
      releasedates: [{ compare: ">=", date: "2020-01-01" }],
      numbers: [{ compare: ">=", number: "10", variant: "" }],
      arcs: "Maximum Carnage",
      appearances: "Spider-Man",
      firstPrint: true,
      onlyPrint: true,
      otherOnlyTb: true,
      and: true,
      us: false,
    });

    const publisher = payload?.publishers?.[0] as Record<string, unknown>;
    expect(publisher.name).toBe("Marvel");
    expect(publisher.us).toBeUndefined();
    expect(publisher.__typename).toBeUndefined();

    const individual = payload?.individuals?.[0] as Record<string, unknown>;
    expect(individual.name).toBe("Peter Parker");
    expect(individual.role).toBeUndefined();
  });
});
