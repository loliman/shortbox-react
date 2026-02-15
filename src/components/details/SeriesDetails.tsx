import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { generateLabel } from "../../util/hierarchy";
import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import QueryResult from "../generic/QueryResult";
import { lastEdited, seriesd } from "../../graphql/queriesTyped";
import EditButton from "../restricted/EditButton";
import withContext from "../generic/withContext";
import PaginatedQuery from "../generic/PaginatedQuery";
import TitleLine from "../generic/TitleLine";
import { FirstLastIssueSections, IssueHistoryList } from "./DetailsListingSections";
import { getListingDirection, getListingOrder, parseListingFilter } from "../../util/listingQuery";
import { DetailsPagePlaceholder } from "../placeholders/DetailsPagePlaceholder";
import { DetailsAddInfo } from "./DetailsAddInfo";
import { useDualLoadingRegistration } from "./useDualLoadingRegistration";
import type { SelectedRoot } from "../../types/domain";

interface SeriesDetailsProps {
  selected: SelectedRoot & {
    series: {
      title: string;
      volume: number;
      publisher: {
        name: string;
      };
    };
  };
  us?: boolean;
  query?: Record<string, unknown> | null;
  session?: unknown;
  appIsLoading?: boolean;
  registerLoadingComponent?: (component: string) => void;
  unregisterLoadingComponent?: (component: string) => void;
  [key: string]: unknown;
}

function SeriesDetails(props: Readonly<SeriesDetailsProps>) {
  const us = Boolean(props.us);
  const registerLoadingComponent = props.registerLoadingComponent || (() => {});
  const unregisterLoadingComponent = props.unregisterLoadingComponent || (() => {});
  const pageProps = props as Record<string, unknown>;
  const { markDetailsLoaded, markHistoryLoaded } = useDualLoadingRegistration({
    registerLoadingComponent,
    unregisterLoadingComponent,
    detailsKey: "SeriesDetails_details",
    historyKey: "SeriesDetails_history",
  });
  const filter = React.useMemo(() => {
    const parsed = parseListingFilter(props.query, us);
    return {
      ...parsed,
      series: [
        {
          title: props.selected.series.title,
          volume: props.selected.series.volume,
          publisher: { us },
        },
      ],
      publishers: [{ name: props.selected.series.publisher.name, us }],
    };
  }, [
    props.query,
    props.selected.series.publisher.name,
    props.selected.series.title,
    props.selected.series.volume,
    us,
  ]);

  const { error: detailsError, data: detailsData } = useQuery(seriesd, {
    variables: props.selected,
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    if (detailsData || detailsError) {
      markDetailsLoaded();
    }
  }, [detailsData, detailsError, markDetailsLoaded]);

  return (
    <PaginatedQuery
      query={lastEdited}
      variables={{
        filter,
        order: getListingOrder(props.query),
        direction: getListingDirection(props.query),
      }}
      onCompleted={markHistoryLoaded}
    >
      {({ error, data, fetchMore, hasMore, fetching }) => {
        const issues = data ? data.lastEdited : [];
        const details = detailsData?.seriesd;
        const combinedError = detailsError || error;

        return (
          <Layout handleScroll={fetchMore}>
            {props.appIsLoading || combinedError || !details ? (
              <QueryResult
                error={combinedError}
                data={details || null}
                selected={props.selected}
                placeholder={
                  <DetailsPagePlaceholder
                    query={props.query}
                    titleWidth="45%"
                    subheaderWidth="30%"
                  />
                }
                placeholderCount={1}
              />
            ) : (
              <React.Fragment>
                <CardHeader
                  title={
                    <TitleLine
                      title={generateLabel({ series: details as any, us })}
                      id={details.id ?? undefined}
                      session={props.session}
                    />
                  }
                  subheader={
                    details.startyear + " - " + (details.active ? "heute" : details.endyear)
                  }
                  action={<EditButton item={details} />}
                />

                <CardContent className="cardContent">
                  <DetailsAddInfo addinfo={details.addinfo} />

                  <FirstLastIssueSections
                    query={props.query}
                    us={us}
                    issueCount={details.issueCount}
                    active={details.active}
                    firstIssue={details.firstIssue}
                    lastIssue={details.lastIssue}
                    previewProps={pageProps}
                  />

                  <IssueHistoryList
                    query={props.query}
                    issues={issues}
                    loadingMore={Boolean(hasMore && fetching)}
                    previewProps={pageProps}
                  />
                </CardContent>
              </React.Fragment>
            )}
          </Layout>
        );
      }}
    </PaginatedQuery>
  );
}

export default withContext(SeriesDetails);
