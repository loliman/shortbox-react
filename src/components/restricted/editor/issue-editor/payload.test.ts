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
  it("normalizes nested editor payloads for non-US issues", () => {
    const values = baseValues(false);
    const result = buildIssueMutationVariables(values, values, true);

    expect(result.item.cover).toBeUndefined();
    expect(result.item.individuals).toEqual([{ name: "Peter Parker", type: ["WRITER", "PENCILER"] }]);
    expect(result.item.arcs).toEqual([{ title: "Civil War", type: "EVENT" }]);

    const firstStory = result.item.stories[0] as any;
    expect(firstStory.appearances[0].type).toBe("CHARACTER");
    expect(firstStory.appearances[1].type).toBe("CHARACTER");
    expect(firstStory.individuals).toEqual([{ name: "Peter Parker", type: ["WRITER", "PENCILER"] }]);
    expect(firstStory.parent.issue.series.__typename).toBeUndefined();

    const firstCover = result.item.covers[0] as any;
    expect(firstCover.individuals).toEqual([{ name: "John Romita", type: ["ARTIST"] }]);
    expect(firstCover.parent.issue.series.__typename).toBeUndefined();

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
    expect(item.stories[0].parent).toBeUndefined();
    expect(item.covers[0].parent).toBeUndefined();
    expect(result.old).toBeUndefined();
  });

  it("preserves non-standard appearance type and strips top-level publisher metadata", () => {
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
    const firstStory = result.item.stories[0] as any;

    expect((result.item as any).publisher).toEqual({ name: "Marvel", us: false });
    expect(firstStory.appearances[0]).toEqual({ name: "Watcher", type: "CAMEO" });
  });
});
