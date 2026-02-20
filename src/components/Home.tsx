import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
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
                    </Box>

                    <Stack spacing={1.5}>
                      <Typography color="text.secondary">
                        Shortbox listet alle deutschen Marvel Veröffentlichungen detailliert auf und
                        ordnet diese den entsprechenden US Geschichten zu.
                      </Typography>

                      <Typography color="text.secondary">
                        Angefangen über Geschichten der bekanntesten Superhelden Spider-Man,
                        Deadpool, den X-Men oder den Avengers oder unbekannteren Helden wie Moon
                        Knight und den New Mutants, über Comics zum Marvel Cinematic Universe mit
                        Captain America, Captain Marvel und Iron Man bis hin zu Western-Comics,
                        Horror-Comics und Kinder-Comics wie den Glücksbärchis oder der Police
                        Acadamy findet ihr hier alle Veröffentlichungen in offiziellen Ausgaben,
                        Raubkopien oder Fan-Comics.
                      </Typography>

                      <Typography color="text.secondary">
                        Inspiriert durch{" "}
                        <Link
                          href="https://www.maxithecat.de/UHBMCC/INDEX.HTM"
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                        >
                          maxithecat&apos;s UHBMCC
                        </Link>{" "}
                        wurde Shortbox 2018 ins Leben gerufen und ist ein vollständig privates
                        Projekt für Marvel-Fans von Marvel-Fans.
                      </Typography>

                      <Typography color="text.secondary">
                        Die gelisteten Informationen unterliegen der{" "}
                        <Link
                          href="https://creativecommons.org/licenses/by/3.0/de/"
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                        >
                          Creative Commons License 3.0
                        </Link>
                        . Ausgenommen sind die vom{" "}
                        <Link
                          href="https://www.comicguide.de/index.php"
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                        >
                          ComicGuide
                        </Link>{" "}
                        bereitgestellten Cover. Diese dürfen ohne Genehmigung weiter verbreitet
                        werden.
                      </Typography>
                    </Stack>

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
