import {
  createMockFilter,
  createMockIssue,
  createMockIssueList,
  createMockSelectedRoot,
} from "./domainMocks";

describe("frontend domain mocks", () => {
  it("builds an issue with nested series and publisher", () => {
    const issue = createMockIssue();

    expect(issue.number).toBe("1");
    expect(issue.series.title).toBe("Amazing Spider-Man");
    expect(issue.series.publisher.name).toBe("Marvel");
  });

  it("builds selected root with issue hierarchy", () => {
    const selected = createMockSelectedRoot();

    expect(selected.us).toBe(true);
    expect(selected.issue?.series.publisher.name).toBe("Marvel");
  });

  it("builds a filter and a stable issue list", () => {
    const filter = createMockFilter();
    const issues = createMockIssueList(2);

    expect(filter.publishers?.[0]?.name).toBe("Marvel");
    expect(issues).toHaveLength(2);
    expect(issues[1].number).toBe("2");
  });
});
