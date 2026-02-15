import { describe, expect, it } from "vitest";
import { buildIssueMutationVariables } from "./payload";
import type { IssueEditorFormValues } from "./types";

function baseValues(us = false): IssueEditorFormValues {
  return {
    title: "Issue 1",
    series: {
      title: "Spider-Man",
      volume: 1,
      publisher: { name: "Marvel", us },
    },
    number: "1",
    variant: "A",
    cover: "",
    format: "Heft",
    limitation: "1000",
    pages: 44,
    releasedate: "2026-01-01",
    price: "4.99",
    currency: "EUR",
    individuals: [
      { name: "Peter Parker", type: ["WRITER", "WRITER"] },
      { name: "Peter Parker", type: "PENCILER" },
    ],
    addinfo: "note",
    comicguideid: 42,
    isbn: "isbn",
    arcs: [{ title: "Civil War", type: "EVENT", __typename: "Arc" }],
    stories: [
      {
        title: "Story A",
        exclusive: false,
        parent: {
          issue: {
            series: { title: "Spider-Man", volume: 1, publisher: { name: "Marvel", us: false } },
          },
        },
        individuals: [
          { name: "Peter Parker", type: ["WRITER"] },
          { name: "Peter Parker", type: "PENCILER" },
        ],
        appearances: [
          { name: "Spider-Man", type: "FEATURED" },
          { name: "Venom", type: "ANTAGONIST" },
        ],
      },
    ],
    features: [
      {
        title: "Backup",
        individuals: [
          { name: "A", type: "WRITER" },
          { name: "A", type: "WRITER" },
        ],
      },
    ],
    covers: [
      {
        exclusive: false,
        parent: {
          issue: {
            series: { title: "Spider-Man", volume: 1, publisher: { name: "Marvel", us: false } },
          },
        },
        individuals: [
          { name: "John Romita", type: "ARTIST" },
          { name: "John Romita", type: "ARTIST" },
        ],
      },
    ],
  };
}

describe("buildIssueMutationVariables", () => {
  it("keeps only IssueInput fields for non-US issues", () => {
    const values = baseValues(false);
    const result = buildIssueMutationVariables(values, values, true);
    const item = result.item as any;

    expect(item.title).toBe("Issue 1");
    expect(item.number).toBe("1");
    expect(item.format).toBe("Heft");
    expect(item.variant).toBe("A");
    expect(item.releasedate).toBe("2026-01-01");
    expect(item.pages).toBe(44);
    expect(item.price).toBe(4.99);
    expect(item.currency).toBe("EUR");
    expect(item.isbn).toBe("isbn");
    expect(item.limitation).toBe("1000");
    expect(item.addinfo).toBe("note");
    expect(item.series).toEqual({
      title: "Spider-Man",
      volume: 1,
      publisher: { name: "Marvel", us: false },
    });
    expect(item.stories).toBeUndefined();
    expect(item.covers).toBeUndefined();
    expect(item.features).toBeUndefined();
    expect(item.individuals).toBeUndefined();
    expect(item.arcs).toBeUndefined();
    expect(item.comicguideid).toBeUndefined();
    expect(item.verified).toBeUndefined();
    expect(item.collected).toBeUndefined();

    expect(result.old).toEqual({
      series: { title: "Spider-Man", volume: 1, publisher: { name: "Marvel", us: false } },
      number: "1",
      format: "Heft",
      variant: "A",
    });
  });

  it("drops DE-only fields for US issues and removes parents for exclusive entries", () => {
    const values = baseValues(true);
    (values.stories[0] as any).exclusive = true;
    (values.covers[0] as any).exclusive = true;

    const result = buildIssueMutationVariables(values, values, false);
    const item = result.item as any;

    expect(item.format).toBeUndefined();
    expect(item.limitation).toBeUndefined();
    expect(item.pages).toBeUndefined();
    expect(item.comicguideid).toBeUndefined();
    expect(item.isbn).toBeUndefined();
    expect(item.price).toBeUndefined();
    expect(item.currency).toBeUndefined();
    expect(item.stories).toBeUndefined();
    expect(item.covers).toBeUndefined();
    expect(result.old).toBeUndefined();
  });

  it("ignores non-IssueInput relation payload and keeps sanitized series", () => {
    const values = baseValues(false) as any;
    values.publisher = { name: "Marvel", us: false, __typename: "Publisher" };
    values.stories = [
      {
        title: "Story B",
        exclusive: false,
        parent: {
          issue: {
            series: { title: "Spider-Man", volume: 1, __typename: "Series" },
          },
        },
        appearances: [{ name: "Watcher", type: "CAMEO", __typename: "Appearance" }],
      },
    ];

    const result = buildIssueMutationVariables(values, values, false);
    const item = result.item as any;

    expect(item.publisher).toBeUndefined();
    expect(item.stories).toBeUndefined();
    expect(item.series).toEqual({
      title: "Spider-Man",
      volume: 1,
      publisher: { name: "Marvel", us: false },
    });
  });
});
