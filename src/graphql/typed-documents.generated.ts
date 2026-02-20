import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
};

export type Appearance = {
  __typename?: 'Appearance';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type AppearanceConnection = {
  __typename?: 'AppearanceConnection';
  edges?: Maybe<Array<Maybe<AppearanceEdge>>>;
  pageInfo: PageInfo;
};

export type AppearanceEdge = {
  __typename?: 'AppearanceEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Appearance>;
};

export type AppearanceInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Arc = {
  __typename?: 'Arc';
  id?: Maybe<Scalars['ID']['output']>;
  issues?: Maybe<Array<Maybe<Issue>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type ArcConnection = {
  __typename?: 'ArcConnection';
  edges?: Maybe<Array<Maybe<ArcEdge>>>;
  pageInfo: PageInfo;
};

export type ArcEdge = {
  __typename?: 'ArcEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Arc>;
};

export type ArcInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Cover = {
  __typename?: 'Cover';
  addinfo?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Maybe<Cover>>>;
  exclusive?: Maybe<Scalars['Boolean']['output']>;
  firstapp?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  individuals?: Maybe<Array<Maybe<Individual>>>;
  issue?: Maybe<Issue>;
  number?: Maybe<Scalars['Int']['output']>;
  onlyapp?: Maybe<Scalars['Boolean']['output']>;
  parent?: Maybe<Cover>;
  url?: Maybe<Scalars['String']['output']>;
};

export type CoverInput = {
  addinfo?: InputMaybe<Scalars['String']['input']>;
  exclusive?: InputMaybe<Scalars['Boolean']['input']>;
  individuals?: InputMaybe<Array<InputMaybe<IndividualInput>>>;
  issue?: InputMaybe<IssueInput>;
  number: Scalars['Int']['input'];
  parent?: InputMaybe<CoverInput>;
};

export type DateFilter = {
  compare?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
};

export type Filter = {
  and?: InputMaybe<Scalars['Boolean']['input']>;
  appearances?: InputMaybe<Scalars['String']['input']>;
  arcs?: InputMaybe<Scalars['String']['input']>;
  exclusive?: InputMaybe<Scalars['Boolean']['input']>;
  firstPrint?: InputMaybe<Scalars['Boolean']['input']>;
  formats?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  individuals?: InputMaybe<Array<InputMaybe<IndividualInput>>>;
  noContent?: InputMaybe<Scalars['Boolean']['input']>;
  noCover?: InputMaybe<Scalars['Boolean']['input']>;
  noPrint?: InputMaybe<Scalars['Boolean']['input']>;
  numbers?: InputMaybe<Array<InputMaybe<NumberFilter>>>;
  onlyCollected?: InputMaybe<Scalars['Boolean']['input']>;
  onlyNotCollected?: InputMaybe<Scalars['Boolean']['input']>;
  onlyOnePrint?: InputMaybe<Scalars['Boolean']['input']>;
  onlyPrint?: InputMaybe<Scalars['Boolean']['input']>;
  onlyTb?: InputMaybe<Scalars['Boolean']['input']>;
  otherOnlyTb?: InputMaybe<Scalars['Boolean']['input']>;
  publishers?: InputMaybe<Array<InputMaybe<PublisherInput>>>;
  releasedates?: InputMaybe<Array<InputMaybe<DateFilter>>>;
  reprint?: InputMaybe<Scalars['Boolean']['input']>;
  sellable?: InputMaybe<Scalars['Boolean']['input']>;
  series?: InputMaybe<Array<InputMaybe<SeriesInput>>>;
  us: Scalars['Boolean']['input'];
  withVariants?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Individual = {
  __typename?: 'Individual';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type IndividualConnection = {
  __typename?: 'IndividualConnection';
  edges?: Maybe<Array<Maybe<IndividualEdge>>>;
  pageInfo: PageInfo;
};

export type IndividualEdge = {
  __typename?: 'IndividualEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Individual>;
};

export type IndividualInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Issue = {
  __typename?: 'Issue';
  addinfo?: Maybe<Scalars['String']['output']>;
  arcs?: Maybe<Array<Maybe<Arc>>>;
  collected?: Maybe<Scalars['Boolean']['output']>;
  comicguideid?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<Cover>;
  createdat?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  individuals?: Maybe<Array<Maybe<Individual>>>;
  inheritsStories?: Maybe<Scalars['Boolean']['output']>;
  isbn?: Maybe<Scalars['String']['output']>;
  limitation?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  pages?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  releasedate?: Maybe<Scalars['Date']['output']>;
  series?: Maybe<Series>;
  stories?: Maybe<Array<Maybe<Story>>>;
  storyOwner?: Maybe<Issue>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedat?: Maybe<Scalars['DateTime']['output']>;
  variant?: Maybe<Scalars['String']['output']>;
  variants?: Maybe<Array<Maybe<Issue>>>;
  verified?: Maybe<Scalars['Boolean']['output']>;
};

export type IssueConnection = {
  __typename?: 'IssueConnection';
  edges?: Maybe<Array<Maybe<IssueEdge>>>;
  pageInfo: PageInfo;
};

export type IssueEdge = {
  __typename?: 'IssueEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Issue>;
};

export type IssueInput = {
  addinfo?: InputMaybe<Scalars['String']['input']>;
  collected?: InputMaybe<Scalars['Boolean']['input']>;
  comicguideid?: InputMaybe<Scalars['Int']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  limitation?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  pages?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  releasedate?: InputMaybe<Scalars['Date']['input']>;
  series?: InputMaybe<SeriesInput>;
  stories?: InputMaybe<Array<InputMaybe<StoryInput>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LoginInput = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createIssue?: Maybe<Issue>;
  createPublisher?: Maybe<Publisher>;
  createSeries?: Maybe<Series>;
  deleteIssue?: Maybe<Scalars['Boolean']['output']>;
  deletePublisher?: Maybe<Scalars['Boolean']['output']>;
  deleteSeries?: Maybe<Scalars['Boolean']['output']>;
  editIssue?: Maybe<Issue>;
  editPublisher?: Maybe<Publisher>;
  editSeries?: Maybe<Series>;
  login: User;
  logout: Scalars['Boolean']['output'];
};


export type MutationCreateIssueArgs = {
  item: IssueInput;
};


export type MutationCreatePublisherArgs = {
  item: PublisherInput;
};


export type MutationCreateSeriesArgs = {
  item: SeriesInput;
};


export type MutationDeleteIssueArgs = {
  item: IssueInput;
};


export type MutationDeletePublisherArgs = {
  item: PublisherInput;
};


export type MutationDeleteSeriesArgs = {
  item: SeriesInput;
};


export type MutationEditIssueArgs = {
  item: IssueInput;
  old: IssueInput;
};


export type MutationEditPublisherArgs = {
  item: PublisherInput;
  old: PublisherInput;
};


export type MutationEditSeriesArgs = {
  item: SeriesInput;
  old: SeriesInput;
};


export type MutationLoginArgs = {
  credentials: LoginInput;
};

export type Node = {
  __typename?: 'Node';
  label?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type NumberFilter = {
  compare?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Publisher = {
  __typename?: 'Publisher';
  active?: Maybe<Scalars['Boolean']['output']>;
  addinfo?: Maybe<Scalars['String']['output']>;
  endyear?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  issueCount?: Maybe<Scalars['Int']['output']>;
  lastEdited?: Maybe<Array<Maybe<Issue>>>;
  name?: Maybe<Scalars['String']['output']>;
  series?: Maybe<Array<Maybe<Series>>>;
  seriesCount?: Maybe<Scalars['Int']['output']>;
  startyear?: Maybe<Scalars['Int']['output']>;
  us?: Maybe<Scalars['Boolean']['output']>;
};


export type PublisherLastEditedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type PublisherConnection = {
  __typename?: 'PublisherConnection';
  edges?: Maybe<Array<Maybe<PublisherEdge>>>;
  pageInfo: PageInfo;
};

export type PublisherEdge = {
  __typename?: 'PublisherEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Publisher>;
};

export type PublisherInput = {
  addinfo?: InputMaybe<Scalars['String']['input']>;
  endyear?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startyear?: InputMaybe<Scalars['Int']['input']>;
  us?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  apps?: Maybe<AppearanceConnection>;
  arcs?: Maybe<ArcConnection>;
  export?: Maybe<Scalars['String']['output']>;
  individuals?: Maybe<IndividualConnection>;
  issueDetails?: Maybe<Issue>;
  issueList?: Maybe<IssueConnection>;
  lastEdited?: Maybe<IssueConnection>;
  me?: Maybe<User>;
  nodes?: Maybe<Array<Maybe<Node>>>;
  publisherDetails?: Maybe<Publisher>;
  publisherList?: Maybe<PublisherConnection>;
  seriesDetails?: Maybe<Series>;
  seriesList?: Maybe<SeriesConnection>;
};


export type QueryAppsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pattern?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryArcsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pattern?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExportArgs = {
  filter: Filter;
  type: Scalars['String']['input'];
};


export type QueryIndividualsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pattern?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIssueDetailsArgs = {
  edit?: InputMaybe<Scalars['Boolean']['input']>;
  issue: IssueInput;
};


export type QueryIssueListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Filter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pattern?: InputMaybe<Scalars['String']['input']>;
  series: SeriesInput;
};


export type QueryLastEditedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Filter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNodesArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  pattern: Scalars['String']['input'];
  us: Scalars['Boolean']['input'];
};


export type QueryPublisherDetailsArgs = {
  publisher: PublisherInput;
};


export type QueryPublisherListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Filter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pattern?: InputMaybe<Scalars['String']['input']>;
  us: Scalars['Boolean']['input'];
};


export type QuerySeriesDetailsArgs = {
  series: SeriesInput;
};


export type QuerySeriesListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Filter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pattern?: InputMaybe<Scalars['String']['input']>;
  publisher: PublisherInput;
};

export type Series = {
  __typename?: 'Series';
  active?: Maybe<Scalars['Boolean']['output']>;
  addinfo?: Maybe<Scalars['String']['output']>;
  endyear?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  issueCount?: Maybe<Scalars['Int']['output']>;
  lastEdited?: Maybe<Array<Maybe<Issue>>>;
  publisher?: Maybe<Publisher>;
  startyear?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  volume?: Maybe<Scalars['Int']['output']>;
};


export type SeriesLastEditedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type SeriesConnection = {
  __typename?: 'SeriesConnection';
  edges?: Maybe<Array<Maybe<SeriesEdge>>>;
  pageInfo: PageInfo;
};

export type SeriesEdge = {
  __typename?: 'SeriesEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Series>;
};

export type SeriesInput = {
  addinfo?: InputMaybe<Scalars['String']['input']>;
  endyear?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  publisher?: InputMaybe<PublisherInput>;
  startyear?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  volume?: InputMaybe<Scalars['Int']['input']>;
};

export type Story = {
  __typename?: 'Story';
  addinfo?: Maybe<Scalars['String']['output']>;
  appearances?: Maybe<Array<Maybe<Appearance>>>;
  children?: Maybe<Array<Maybe<Story>>>;
  collected?: Maybe<Scalars['Boolean']['output']>;
  collectedmultipletimes?: Maybe<Scalars['Boolean']['output']>;
  exclusive?: Maybe<Scalars['Boolean']['output']>;
  firstapp?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  individuals?: Maybe<Array<Maybe<Individual>>>;
  issue?: Maybe<Issue>;
  number?: Maybe<Scalars['Int']['output']>;
  onlyapp?: Maybe<Scalars['Boolean']['output']>;
  onlyoneprint?: Maybe<Scalars['Boolean']['output']>;
  onlytb?: Maybe<Scalars['Boolean']['output']>;
  otheronlytb?: Maybe<Scalars['Boolean']['output']>;
  parent?: Maybe<Story>;
  part?: Maybe<Scalars['String']['output']>;
  reprintOf?: Maybe<Story>;
  reprints?: Maybe<Array<Maybe<Story>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type StoryInput = {
  addinfo?: InputMaybe<Scalars['String']['input']>;
  appearances?: InputMaybe<Array<InputMaybe<AppearanceInput>>>;
  collected?: InputMaybe<Scalars['Boolean']['input']>;
  exclusive?: InputMaybe<Scalars['Boolean']['input']>;
  firstapp?: InputMaybe<Scalars['Boolean']['input']>;
  individuals?: InputMaybe<Array<InputMaybe<IndividualInput>>>;
  issue?: InputMaybe<IssueInput>;
  number: Scalars['Int']['input'];
  onlyapp?: InputMaybe<Scalars['Boolean']['input']>;
  onlyoneprint?: InputMaybe<Scalars['Boolean']['input']>;
  onlytb?: InputMaybe<Scalars['Boolean']['input']>;
  otheronlytb?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<StoryInput>;
  part?: InputMaybe<Scalars['String']['input']>;
  reprintOf?: InputMaybe<StoryInput>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['ID']['output']>;
};

export type NodesQueryVariables = Exact<{
  pattern: Scalars['String']['input'];
  us: Scalars['Boolean']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type NodesQuery = { __typename?: 'Query', nodes?: Array<{ __typename?: 'Node', type?: string | null, label?: string | null, url?: string | null } | null> | null };

export type ExportQueryVariables = Exact<{
  filter: Filter;
  type: Scalars['String']['input'];
}>;


export type ExportQuery = { __typename?: 'Query', export?: string | null };

export type PublishersQueryVariables = Exact<{
  pattern?: InputMaybe<Scalars['String']['input']>;
  us: Scalars['Boolean']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Filter>;
}>;


export type PublishersQuery = { __typename?: 'Query', publisherList?: { __typename?: 'PublisherConnection', edges?: Array<{ __typename?: 'PublisherEdge', node?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type SeriesQueryVariables = Exact<{
  pattern?: InputMaybe<Scalars['String']['input']>;
  publisher: PublisherInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Filter>;
}>;


export type SeriesQuery = { __typename?: 'Query', seriesList?: { __typename?: 'SeriesConnection', edges?: Array<{ __typename?: 'SeriesEdge', node?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type IssuesQueryVariables = Exact<{
  pattern?: InputMaybe<Scalars['String']['input']>;
  series: SeriesInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Filter>;
}>;


export type IssuesQuery = { __typename?: 'Query', issueList?: { __typename?: 'IssueConnection', edges?: Array<{ __typename?: 'IssueEdge', node?: { __typename?: 'Issue', title?: string | null, number?: string | null, comicguideid?: string | null, collected?: boolean | null, format?: string | null, cover?: { __typename?: 'Cover', url?: string | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, variants?: Array<{ __typename?: 'Issue', collected?: boolean | null, variant?: string | null } | null> | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type IndividualsQueryVariables = Exact<{
  pattern?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type IndividualsQuery = { __typename?: 'Query', individuals?: { __typename?: 'IndividualConnection', edges?: Array<{ __typename?: 'IndividualEdge', node?: { __typename?: 'Individual', name?: string | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type AppsQueryVariables = Exact<{
  pattern?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type AppsQuery = { __typename?: 'Query', apps?: { __typename?: 'AppearanceConnection', edges?: Array<{ __typename?: 'AppearanceEdge', node?: { __typename?: 'Appearance', name?: string | null, type?: string | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type ArcsQueryVariables = Exact<{
  pattern?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type ArcsQuery = { __typename?: 'Query', arcs?: { __typename?: 'ArcConnection', edges?: Array<{ __typename?: 'ArcEdge', node?: { __typename?: 'Arc', title?: string | null, type?: string | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id?: string | null } | null };

export type LoginMutationVariables = Exact<{
  credentials: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id?: string | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type LastEditedQueryVariables = Exact<{
  filter?: InputMaybe<Filter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['String']['input']>;
}>;


export type LastEditedQuery = { __typename?: 'Query', lastEdited?: { __typename?: 'IssueConnection', edges?: Array<{ __typename?: 'IssueEdge', node?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, verified?: boolean | null, collected?: boolean | null, title?: string | null, createdat?: string | null, updatedat?: string | null, comicguideid?: string | null, cover?: { __typename?: 'Cover', url?: string | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, stories?: Array<{ __typename?: 'Story', onlyapp?: boolean | null, firstapp?: boolean | null, onlytb?: boolean | null, exclusive?: boolean | null, otheronlytb?: boolean | null, onlyoneprint?: boolean | null, collectedmultipletimes?: boolean | null, collected?: boolean | null, number?: number | null, children?: Array<{ __typename?: 'Story', number?: number | null, issue?: { __typename?: 'Issue', collected?: boolean | null } | null } | null> | null, reprintOf?: { __typename?: 'Story', number?: number | null } | null, reprints?: Array<{ __typename?: 'Story', number?: number | null } | null> | null, parent?: { __typename?: 'Story', collectedmultipletimes?: boolean | null, collected?: boolean | null, children?: Array<{ __typename?: 'Story', number?: number | null, issue?: { __typename?: 'Issue', collected?: boolean | null } | null } | null> | null } | null } | null> | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type PublisherQueryVariables = Exact<{
  publisher: PublisherInput;
}>;


export type PublisherQuery = { __typename?: 'Query', publisherDetails?: { __typename?: 'Publisher', id?: string | null, name?: string | null, us?: boolean | null, startyear?: number | null, endyear?: number | null, seriesCount?: number | null, issueCount?: number | null, active?: boolean | null, addinfo?: string | null } | null };

export type SeriesdQueryVariables = Exact<{
  series: SeriesInput;
}>;


export type SeriesdQuery = { __typename?: 'Query', seriesDetails?: { __typename?: 'Series', id?: string | null, title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, issueCount?: number | null, active?: boolean | null, addinfo?: string | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null };

export type IssueQueryVariables = Exact<{
  issue: IssueInput;
  edit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type IssueQuery = { __typename?: 'Query', issueDetails?: { __typename?: 'Issue', id?: string | null, title?: string | null, isbn?: string | null, number?: string | null, format?: string | null, limitation?: string | null, pages?: number | null, comicguideid?: string | null, releasedate?: string | null, price?: number | null, currency?: string | null, inheritsStories?: boolean | null, variant?: string | null, verified?: boolean | null, collected?: boolean | null, addinfo?: string | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, cover?: { __typename?: 'Cover', url?: string | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, stories?: Array<{ __typename?: 'Story', title?: string | null, addinfo?: string | null, part?: string | null, number?: number | null, onlyapp?: boolean | null, firstapp?: boolean | null, otheronlytb?: boolean | null, onlytb?: boolean | null, onlyoneprint?: boolean | null, exclusive?: boolean | null, reprints?: Array<{ __typename?: 'Story', number?: number | null, addinfo?: string | null, issue?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, collected?: boolean | null, cover?: { __typename?: 'Cover', url?: string | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null } | null> | null, children?: Array<{ __typename?: 'Story', part?: string | null, number?: number | null, addinfo?: string | null, issue?: { __typename?: 'Issue', collected?: boolean | null, number?: string | null, title?: string | null, variant?: string | null, cover?: { __typename?: 'Cover', url?: string | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null, parent?: { __typename?: 'Story', issue?: { __typename?: 'Issue', number?: string | null, collected?: boolean | null, cover?: { __typename?: 'Cover', url?: string | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null } | null } | null> | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, appearances?: Array<{ __typename?: 'Appearance', name?: string | null, type?: string | null, role?: string | null } | null> | null, reprintOf?: { __typename?: 'Story', title?: string | null, number?: number | null, issue?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, collected?: boolean | null, cover?: { __typename?: 'Cover', url?: string | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null } | null, parent?: { __typename?: 'Story', title?: string | null, number?: number | null, issue?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, collected?: boolean | null, cover?: { __typename?: 'Cover', url?: string | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, stories?: Array<{ __typename?: 'Story', number?: number | null } | null> | null, arcs?: Array<{ __typename?: 'Arc', title?: string | null, type?: string | null } | null> | null } | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, appearances?: Array<{ __typename?: 'Appearance', name?: string | null, type?: string | null, role?: string | null } | null> | null } | null } | null> | null, storyOwner?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null, arcs?: Array<{ __typename?: 'Arc', title?: string | null, type?: string | null } | null> | null, variants?: Array<{ __typename?: 'Issue', format?: string | null, variant?: string | null, number?: string | null, comicguideid?: string | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, cover?: { __typename?: 'Cover', url?: string | null } | null } | null> | null } | null };

export type DeleteIssueMutationVariables = Exact<{
  item: IssueInput;
}>;


export type DeleteIssueMutation = { __typename?: 'Mutation', deleteIssue?: boolean | null };

export type DeleteSeriesMutationVariables = Exact<{
  item: SeriesInput;
}>;


export type DeleteSeriesMutation = { __typename?: 'Mutation', deleteSeries?: boolean | null };

export type DeletePublisherMutationVariables = Exact<{
  item: PublisherInput;
}>;


export type DeletePublisherMutation = { __typename?: 'Mutation', deletePublisher?: boolean | null };

export type CreatePublisherMutationVariables = Exact<{
  item: PublisherInput;
}>;


export type CreatePublisherMutation = { __typename?: 'Mutation', createPublisher?: { __typename?: 'Publisher', id?: string | null, name?: string | null, startyear?: number | null, endyear?: number | null, addinfo?: string | null, us?: boolean | null } | null };

export type CreateSeriesMutationVariables = Exact<{
  item: SeriesInput;
}>;


export type CreateSeriesMutation = { __typename?: 'Mutation', createSeries?: { __typename?: 'Series', id?: string | null, title?: string | null, startyear?: number | null, endyear?: number | null, volume?: number | null, addinfo?: string | null, publisher?: { __typename?: 'Publisher', id?: string | null, name?: string | null, us?: boolean | null } | null } | null };

export type CreateIssueMutationVariables = Exact<{
  item: IssueInput;
}>;


export type CreateIssueMutation = { __typename?: 'Mutation', createIssue?: { __typename?: 'Issue', title?: string | null, number?: string | null, format?: string | null, isbn?: string | null, limitation?: string | null, pages?: number | null, comicguideid?: string | null, releasedate?: string | null, price?: number | null, currency?: string | null, variant?: string | null, verified?: boolean | null, collected?: boolean | null, addinfo?: string | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, cover?: { __typename?: 'Cover', url?: string | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, stories?: Array<{ __typename?: 'Story', title?: string | null, addinfo?: string | null, number?: number | null, onlyapp?: boolean | null, firstapp?: boolean | null, exclusive?: boolean | null, children?: Array<{ __typename?: 'Story', issue?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null } | null> | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, parent?: { __typename?: 'Story', number?: number | null, issue?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, series?: { __typename?: 'Series', title?: string | null, startyear?: number | null, endyear?: number | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null } | null } | null> | null, variants?: Array<{ __typename?: 'Issue', format?: string | null, variant?: string | null, number?: string | null, comicguideid?: string | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, cover?: { __typename?: 'Cover', url?: string | null } | null } | null> | null } | null };

export type EditIssueMutationVariables = Exact<{
  old: IssueInput;
  item: IssueInput;
}>;


export type EditIssueMutation = { __typename?: 'Mutation', editIssue?: { __typename?: 'Issue', title?: string | null, isbn?: string | null, number?: string | null, format?: string | null, limitation?: string | null, pages?: number | null, comicguideid?: string | null, releasedate?: string | null, price?: number | null, currency?: string | null, variant?: string | null, verified?: boolean | null, collected?: boolean | null, addinfo?: string | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, cover?: { __typename?: 'Cover', url?: string | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null } | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, stories?: Array<{ __typename?: 'Story', title?: string | null, addinfo?: string | null, number?: number | null, onlyapp?: boolean | null, firstapp?: boolean | null, otheronlytb?: boolean | null, onlytb?: boolean | null, onlyoneprint?: boolean | null, exclusive?: boolean | null, children?: Array<{ __typename?: 'Story', addinfo?: string | null, issue?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null } | null } | null> | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, appearances?: Array<{ __typename?: 'Appearance', name?: string | null, type?: string | null, role?: string | null } | null> | null, parent?: { __typename?: 'Story', title?: string | null, number?: number | null, issue?: { __typename?: 'Issue', number?: string | null, format?: string | null, variant?: string | null, series?: { __typename?: 'Series', title?: string | null, startyear?: number | null, endyear?: number | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, stories?: Array<{ __typename?: 'Story', number?: number | null } | null> | null, arcs?: Array<{ __typename?: 'Arc', title?: string | null, type?: string | null } | null> | null } | null, individuals?: Array<{ __typename?: 'Individual', name?: string | null, type?: Array<string | null> | null } | null> | null, appearances?: Array<{ __typename?: 'Appearance', name?: string | null, type?: string | null, role?: string | null } | null> | null } | null } | null> | null, variants?: Array<{ __typename?: 'Issue', format?: string | null, variant?: string | null, number?: string | null, comicguideid?: string | null, series?: { __typename?: 'Series', title?: string | null, volume?: number | null, publisher?: { __typename?: 'Publisher', name?: string | null, us?: boolean | null } | null } | null, cover?: { __typename?: 'Cover', url?: string | null } | null } | null> | null, arcs?: Array<{ __typename?: 'Arc', title?: string | null, type?: string | null } | null> | null } | null };

export type EditSeriesMutationVariables = Exact<{
  old: SeriesInput;
  item: SeriesInput;
}>;


export type EditSeriesMutation = { __typename?: 'Mutation', editSeries?: { __typename?: 'Series', id?: string | null, title?: string | null, volume?: number | null, startyear?: number | null, endyear?: number | null, addinfo?: string | null, publisher?: { __typename?: 'Publisher', id?: string | null, name?: string | null, us?: boolean | null } | null } | null };

export type EditPublisherMutationVariables = Exact<{
  old: PublisherInput;
  item: PublisherInput;
}>;


export type EditPublisherMutation = { __typename?: 'Mutation', editPublisher?: { __typename?: 'Publisher', id?: string | null, name?: string | null, us?: boolean | null, addinfo?: string | null } | null };


export const NodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Nodes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"us"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}}},{"kind":"Argument","name":{"kind":"Name","value":"us"},"value":{"kind":"Variable","name":{"kind":"Name","value":"us"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<NodesQuery, NodesQueryVariables>;
export const ExportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Export"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"export"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<ExportQuery, ExportQueryVariables>;
export const PublishersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Publishers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"us"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publisherList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}}},{"kind":"Argument","name":{"kind":"Name","value":"us"},"value":{"kind":"Variable","name":{"kind":"Name","value":"us"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<PublishersQuery, PublishersQueryVariables>;
export const SeriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Series"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publisher"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublisherInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seriesList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}}},{"kind":"Argument","name":{"kind":"Name","value":"publisher"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publisher"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<SeriesQuery, SeriesQueryVariables>;
export const IssuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Issues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"series"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SeriesInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issueList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}}},{"kind":"Argument","name":{"kind":"Name","value":"series"},"value":{"kind":"Variable","name":{"kind":"Name","value":"series"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<IssuesQuery, IssuesQueryVariables>;
export const IndividualsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Individuals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"individuals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<IndividualsQuery, IndividualsQueryVariables>;
export const AppsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Apps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<AppsQuery, AppsQueryVariables>;
export const ArcsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Arcs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arcs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pattern"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<ArcsQuery, ArcsQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const LastEditedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LastEdited"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"direction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastEdited"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"direction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"direction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdat"}},{"kind":"Field","name":{"kind":"Name","value":"updatedat"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onlyapp"}},{"kind":"Field","name":{"kind":"Name","value":"firstapp"}},{"kind":"Field","name":{"kind":"Name","value":"onlytb"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"otheronlytb"}},{"kind":"Field","name":{"kind":"Name","value":"onlyoneprint"}},{"kind":"Field","name":{"kind":"Name","value":"collectedmultipletimes"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reprintOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reprints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectedmultipletimes"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<LastEditedQuery, LastEditedQueryVariables>;
export const PublisherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Publisher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publisher"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublisherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publisherDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"publisher"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publisher"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"seriesCount"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}}]}}]}}]} as unknown as DocumentNode<PublisherQuery, PublisherQueryVariables>;
export const SeriesdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Seriesd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"series"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SeriesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seriesDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"series"},"value":{"kind":"Variable","name":{"kind":"Name","value":"series"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}}]}}]} as unknown as DocumentNode<SeriesdQuery, SeriesdQueryVariables>;
export const IssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Issue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"issue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IssueInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"edit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issueDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"issue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"issue"}}},{"kind":"Argument","name":{"kind":"Name","value":"edit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"edit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isbn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"limitation"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"releasedate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"part"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"reprints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"part"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"part"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appearances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reprintOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"stories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appearances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"onlyapp"}},{"kind":"Field","name":{"kind":"Name","value":"firstapp"}},{"kind":"Field","name":{"kind":"Name","value":"otheronlytb"}},{"kind":"Field","name":{"kind":"Name","value":"onlytb"}},{"kind":"Field","name":{"kind":"Name","value":"onlyoneprint"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inheritsStories"}},{"kind":"Field","name":{"kind":"Name","value":"storyOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}}]}}]}}]} as unknown as DocumentNode<IssueQuery, IssueQueryVariables>;
export const DeleteIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}]}]}}]} as unknown as DocumentNode<DeleteIssueMutation, DeleteIssueMutationVariables>;
export const DeleteSeriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSeries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SeriesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSeries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}]}]}}]} as unknown as DocumentNode<DeleteSeriesMutation, DeleteSeriesMutationVariables>;
export const DeletePublisherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePublisher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublisherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePublisher"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}]}]}}]} as unknown as DocumentNode<DeletePublisherMutation, DeletePublisherMutationVariables>;
export const CreatePublisherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePublisher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublisherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPublisher"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}}]} as unknown as DocumentNode<CreatePublisherMutation, CreatePublisherMutationVariables>;
export const CreateSeriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSeries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SeriesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSeries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSeriesMutation, CreateSeriesMutationVariables>;
export const CreateIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"isbn"}},{"kind":"Field","name":{"kind":"Name","value":"limitation"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"releasedate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onlyapp"}},{"kind":"Field","name":{"kind":"Name","value":"firstapp"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}}]}}]}}]} as unknown as DocumentNode<CreateIssueMutation, CreateIssueMutationVariables>;
export const EditIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"old"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IssueInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"old"},"value":{"kind":"Variable","name":{"kind":"Name","value":"old"}}},{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isbn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"limitation"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"releasedate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appearances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"stories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"individuals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appearances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"onlyapp"}},{"kind":"Field","name":{"kind":"Name","value":"firstapp"}},{"kind":"Field","name":{"kind":"Name","value":"otheronlytb"}},{"kind":"Field","name":{"kind":"Name","value":"onlytb"}},{"kind":"Field","name":{"kind":"Name","value":"onlyoneprint"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"comicguideid"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"arcs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"collected"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}}]}}]}}]} as unknown as DocumentNode<EditIssueMutation, EditIssueMutationVariables>;
export const EditSeriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditSeries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"old"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SeriesInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SeriesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editSeries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"old"},"value":{"kind":"Variable","name":{"kind":"Name","value":"old"}}},{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"startyear"}},{"kind":"Field","name":{"kind":"Name","value":"endyear"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}}]}}]}}]}}]} as unknown as DocumentNode<EditSeriesMutation, EditSeriesMutationVariables>;
export const EditPublisherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditPublisher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"old"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublisherInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"item"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublisherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editPublisher"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"old"},"value":{"kind":"Variable","name":{"kind":"Name","value":"old"}}},{"kind":"Argument","name":{"kind":"Name","value":"item"},"value":{"kind":"Variable","name":{"kind":"Name","value":"item"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"us"}},{"kind":"Field","name":{"kind":"Name","value":"addinfo"}}]}}]}}]} as unknown as DocumentNode<EditPublisherMutation, EditPublisherMutationVariables>;