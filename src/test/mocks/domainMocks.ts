import type { Issue, Publisher, SelectedRoot, Series } from "../../types/domain";
import type { Filter as GraphqlFilter } from "../../types/graphql";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export const createMockPublisher = (overrides: DeepPartial<Publisher> = {}): Publisher => ({
  id: "pub-1",
  name: "Marvel",
  us: true,
  addinfo: "US publisher fixture",
  startyear: 1939,
  endyear: null,
  __typename: "Publisher",
  ...overrides,
});

export const createMockSeries = (overrides: DeepPartial<Series> = {}): Series => {
  const { publisher: publisherOverrides, ...seriesOverrides } = overrides;

  return {
    id: "series-1",
    title: "Amazing Spider-Man",
    volume: 1,
    startyear: 1963,
    endyear: null,
    addinfo: "Core series fixture",
    publisher: createMockPublisher(publisherOverrides),
    __typename: "Series",
    ...seriesOverrides,
  } as Series;
};

export const createMockIssue = (overrides: DeepPartial<Issue> = {}): Issue => {
  const { series: seriesOverrides, ...issueOverrides } = overrides;

  return {
    id: "issue-1",
    title: "The Amazing Spider-Man",
    number: "1",
    format: "HEFT",
    variant: "",
    releasedate: "1963-03-01",
    pages: 28,
    price: 0.12,
    currency: "USD",
    limitation: "",
    addinfo: "First issue fixture",
    series: createMockSeries(seriesOverrides),
    __typename: "Issue",
    ...issueOverrides,
  } as Issue;
};

export const createMockSelectedRoot = (overrides: DeepPartial<SelectedRoot> = {}): SelectedRoot => {
  const { publisher, series, issue, ...rootOverrides } = overrides;

  return {
    us: true,
    publisher: createMockPublisher(publisher),
    series: createMockSeries(series),
    issue: createMockIssue(issue),
    ...rootOverrides,
  } as SelectedRoot;
};

export const createMockFilter = (overrides: DeepPartial<GraphqlFilter> = {}): GraphqlFilter => ({
  us: true,
  withVariants: false,
  formats: ["HEFT"],
  publishers: [{ name: "Marvel" }],
  series: [{ title: "Amazing Spider-Man", volume: 1 }],
  numbers: [{ number: "1", compare: ">=" }],
  releasedates: [{ date: "1963-03-01", compare: ">=" }],
  and: true,
  ...overrides,
});

export const createMockIssueList = (count = 5): Issue[] =>
  Array.from({ length: count }).map((_, index) =>
    createMockIssue({
      id: `issue-${index + 1}`,
      number: String(index + 1),
      title: `Amazing Spider-Man #${index + 1}`,
    })
  );

export const frontendMockDataset = {
  publisher: createMockPublisher(),
  series: createMockSeries(),
  issue: createMockIssue(),
  issues: createMockIssueList(3),
  selected: createMockSelectedRoot(),
  filter: createMockFilter(),
};
