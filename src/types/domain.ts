import type {
  Issue as GraphqlIssue,
  Publisher as GraphqlPublisher,
  RouteParams,
  SelectedRoot as ContractSelectedRoot,
  Series as GraphqlSeries,
} from "@shortbox/contract";

export interface Publisher extends GraphqlPublisher {
  id?: string | number;
  us?: boolean;
  __typename?: "Publisher";
}

export interface Series extends GraphqlSeries {
  id?: string | number;
  publisher: Publisher;
  __typename?: "Series";
}

export interface Issue extends GraphqlIssue {
  id?: string | number;
  number: string;
  series: Series;
  __typename?: "Issue";
}

export interface SelectedRoot extends Omit<ContractSelectedRoot, "publisher" | "series" | "issue"> {
  publisher?: Publisher;
  series?: Series;
  issue?: Issue;
}

export type { RouteParams };
