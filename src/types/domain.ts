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
  name?: string | null;
  __typename?: "Publisher";
}

export interface Series extends GraphqlSeries {
  id?: string | number;
  title?: string | null;
  volume?: number | null;
  publisher: Publisher;
  __typename?: "Series";
}

export interface Issue extends GraphqlIssue {
  id?: string | number;
  number: string;
  addinfo?: string | null;
  collected?: boolean | null;
  format?: string | null;
  releasedate?: string | null;
  title?: string | null;
  variant?: string | null;
  verified?: boolean | null;
  series: Series;
  __typename?: "Issue";
}

export interface SelectedRoot extends Omit<ContractSelectedRoot, "publisher" | "series" | "issue"> {
  publisher?: Publisher;
  series?: Series;
  issue?: Issue;
}

export type { RouteParams };
