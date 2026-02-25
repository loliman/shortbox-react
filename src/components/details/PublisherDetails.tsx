import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import QueryResult from "../generic/QueryResult";
import { lastEdited, publisher } from "../../graphql/queriesTyped";
import { generateLabel } from "../../util/hierarchy";
import EditButton from "../restricted/EditButton";
import withContext from "../generic/withContext";
import PaginatedQuery from "../generic/PaginatedQuery";
import TitleLine from "../generic/TitleLine";
import { IssueHistoryList } from "./DetailsListingSections";
import { getListingDirection, getListingOrder, parseListingFilter } from "../../util/listingQuery";
import { DetailsPagePlaceholder } from "../placeholders/DetailsPagePlaceholder";
import { DetailsAddInfo } from "./DetailsAddInfo";
import { useDualLoadingRegistration } from "./useDualLoadingRegistration";
import type { SelectedRoot } from "../../types/domain";
import SortContainer from "../SortContainer";

interface PublisherDetailsProps {
  selected: SelectedRoot & {
    publisher: {
      name: string;
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

function PublisherDetails(props: Readonly<PublisherDetailsProps>) {
  const selected = props.selected;
  const us = Boolean(props.us);
  const registerLoadingComponent = props.registerLoadingComponent || (() => {});
  const unregisterLoadingComponent = props.unregisterLoadingComponent || (() => {});
  const pageProps = props as Record<string, unknown>;
  const { markDetailsLoaded, markHistoryLoaded } = useDualLoadingRegistration({
    registerLoadingComponent,
    unregisterLoadingComponent,
    detailsKey: "PublisherDetails_details",
    historyKey: "PublisherDetails_history",
  });
  const filter = React.useMemo(() => {
    const parsed = parseListingFilter(props.query, us);
    return {
      ...parsed,
      publishers: [{ name: props.selected.publisher.name, us }],
    };
  }, [props.query, props.selected.publisher.name, us]);

  const {
    error: detailsError,
    data: detailsData,
    previousData: previousDetailsData,
    loading,
  } = useQuery(publisher, {
    variables: selected,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const details =
    detailsData?.publisherDetails ?? (loading ? previousDetailsData?.publisherDetails : null);
  const endYearLabel =
    details && (details.active || details.endyear === 0) ? "heute" : details?.endyear;

  React.useEffect(() => {
    if (details || detailsError) {
      markDetailsLoaded();
    }
  }, [details, detailsError, markDetailsLoaded]);

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
      {({ error, data, fetchMore, fetching, hasMore }) => {
        const issues = data ? data.lastEdited : [];
        const combinedError = detailsError || error;

        return (
          <Layout handleScroll={fetchMore}>
            {combinedError || !details ? (
              <QueryResult
                error={combinedError}
                data={details || null}
                selected={selected}
                placeholder={
                  <DetailsPagePlaceholder
                    query={props.query}
                    titleWidth="48%"
                    subheaderWidth="26%"
                  />
                }
                placeholderCount={1}
              />
            ) : (
              <React.Fragment>
                <CardHeader
                  title={
                    <TitleLine
                      title={generateLabel({ publisher: details as any, us })}
                      id={details.id ?? undefined}
                      session={props.session}
                    />
                  }
                  subheader={details.startyear + " - " + endYearLabel}
                  action={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SortContainer {...pageProps} />
                      <EditButton item={details} />
                    </Stack>
                  }
                />

                <CardContent sx={{ pt: 1 }}>
                  <DetailsAddInfo addinfo={details.addinfo} />

                  <IssueHistoryList
                    query={props.query}
                    issues={issues}
                    loadingMore={Boolean(hasMore && fetching)}
                    previewProps={pageProps}
                    showSort={false}
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

export default withContext(PublisherDetails);
