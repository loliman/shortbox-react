import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
                  <CardHeader
                    title="Willkommen auf Shortbox"
                    subheader="Das deutsche Archiv für Marvel Comics"
                  />

                  <CardContent sx={{ pt: 1 }}>
                    <Typography paragraph color="text.secondary">
                      Shortbox listet alle deutschen Marvel Veröffentlichungen detailliert auf und
                      ordnet diese den entsprechenden US Geschichten zu.
                    </Typography>

                    <Typography paragraph color="text.secondary">
                      Angefangen über Geschichten der bekanntesten Superhelden Spider-Man, Deadpool,
                      den X-Men oder den Avengers oder unbekannteren Helden wie Moon Knight und den
                      New Mutants, über Comics zum Marvel Cinematic Universe mit Captain America,
                      Captain Marvel und Iron Man bis hin zu Western-Comics, Horror-Comics und
                      Kinder-Comics wie den Glücksbärchis oder der Police Acadamy findet ihr hier
                      alle Veröffentlichungen in offiziellen Ausgaben, Raubkopien oder Fan-Comics.
                    </Typography>

                    <Typography paragraph color="text.secondary">
                      Inspiriert durch{" "}
                      <a
                        href="https://www.maxithecat.de/UHBMCC/INDEX.HTM"
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        maxithecat&apos;s UHBMCC
                      </a>{" "}
                      wurde Shortbox 2018 ins Leben gerufen. Shortbox ist ein vollständig privates
                      Projekt von mir für alle Marvel Fans.
                    </Typography>

                    <Typography paragraph color="text.secondary">
                      Aus diesem Grund unterliegen alle auf Shortbox gelisteten Informationen
                      der&nbsp;
                      <a
                        href="https://creativecommons.org/licenses/by/3.0/de/"
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        Creative Commons License 3.0
                      </a>{" "}
                      und stehen somit, unter Angabe der Quelle, jedem zur freien und kostenlosen
                      Verfügung. Ausgenommen sind davon lediglich durch den&nbsp;
                      <a
                        href="https://www.comicguide.de/index.php"
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        ComicGuide
                      </a>{" "}
                      bereitgestellte Cover, welche nicht ohne Genehmigung weiter verbreitet werden
                      dürfen.
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                      <SortContainer {...this.props} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
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
                    </Box>
                  </CardContent>
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
