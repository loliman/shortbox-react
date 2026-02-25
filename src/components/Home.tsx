import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Layout from "./Layout";
import { lastEdited } from "../graphql/queriesTyped";
import QueryResult from "./generic/QueryResult";
import { withContext } from "./generic";
import IssuePreview from "./issue-preview/IssuePreview";
import PaginatedQuery from "./generic/PaginatedQuery";
import SortContainer from "./SortContainer";
import LoadingDots from "./generic/LoadingDots";
import { getListingDirection, getListingOrder, parseListingFilter } from "../util/listingQuery";
import { HomeListingPlaceholder } from "./placeholders/HomeListingPlaceholder";

const HOME_SEO_SUMMARY =
  "Shortbox listet alle deutschen Marvel Veröffentlichungen detailliert auf und ordnet diese den entsprechenden US Geschichten zu.";

interface HomeProps {
  registerLoadingComponent?: (component: string) => void;
  unregisterLoadingComponent?: (component: string) => void;
  query?: { filter?: string; order?: string; direction?: string } | null;
  us?: boolean;
  appIsLoading?: boolean;
  [key: string]: unknown;
}

class Home extends React.Component<HomeProps> {
  private homeLoadingRegistered = false;

  private unregisterHomeLoading = () => {
    if (!this.homeLoadingRegistered) return;
    this.homeLoadingRegistered = false;
    this.props.unregisterLoadingComponent?.("Home");
  };

  componentDidMount() {
    this.props.registerLoadingComponent?.("Home");
    this.homeLoadingRegistered = true;
  }

  componentWillUnmount() {
    this.unregisterHomeLoading();
  }

  render() {
    const filter = parseListingFilter(this.props.query, Boolean(this.props.us));

    return (
      <PaginatedQuery
        query={lastEdited}
        variables={{
          filter,
          order: getListingOrder(this.props.query),
          direction: getListingDirection(this.props.query),
        }}
        onCompleted={this.unregisterHomeLoading}
      >
        {({ error, data, fetchMore, fetching, hasMore, networkStatus }) => {
          const loading = hasMore && fetching ? <LoadingDots /> : null;

          return (
            <Layout handleScroll={fetchMore}>
              {this.props.appIsLoading || error || !data.lastEdited || networkStatus === 2 ? (
                <QueryResult
                  error={error}
                  loading={networkStatus === 2}
                  placeholder={<HomeListingPlaceholder />}
                  placeholderCount={1}
                />
              ) : (
                <React.Fragment>
                  <Stack spacing={3} sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box>
                      <Typography variant="h5">All-New, All-Different Shortbox</Typography>
                      <Typography color="text.secondary">
                        Das deutsche Archiv für Marvel Comics
                      </Typography>
                      <Typography
                        component="p"
                        sx={{
                          position: "absolute",
                          width: 1,
                          height: 1,
                          p: 0,
                          m: -1,
                          overflow: "hidden",
                          clip: "rect(0 0 0 0)",
                          whiteSpace: "nowrap",
                          border: 0,
                        }}
                      >
                        {HOME_SEO_SUMMARY}
                      </Typography>
                    </Box>

                    <SortContainer {...this.props} />

                    <Stack spacing={1.5}>
                      {data.lastEdited
                        ? data.lastEdited.map((i: Record<string, unknown>, idx: number) => (
                            <IssuePreview
                              {...this.props}
                              key={buildIssueKey(i as any, idx)}
                              issue={i as any}
                            />
                          ))
                        : null}

                      {loading}
                    </Stack>
                  </Stack>
                </React.Fragment>
              )}
            </Layout>
          );
        }}
      </PaginatedQuery>
    );
  }
}

function buildIssueKey(issue: { id?: string | number; number?: string }, idx: number) {
  if (issue.id) return String(issue.id);
  if (issue.number) return "issue|" + issue.number + "|" + idx;
  return "issue|" + idx;
}

export default withContext(Home);
