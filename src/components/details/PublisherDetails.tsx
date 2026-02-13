import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import QueryResult from "../generic/QueryResult";
import { lastEdited, publisher } from "../../graphql/queriesTyped";
import { generateLabel } from "../../util/hierarchy";
import EditButton from "../restricted/EditButton";
import withContext from "../generic/withContext";
import PaginatedQuery from "../generic/PaginatedQuery";
import TitleLine from "../generic/TitleLine";
import {
  FirstLastIssueSections,
  IssueHistoryList,
} from "./DetailsListingSections";
import {
  getListingDirection,
  getListingOrder,
  parseListingFilter,
} from "../../util/listingQuery";
import { DetailsPagePlaceholder } from "../placeholders/DetailsPagePlaceholder";
import { DetailsAddInfo } from "./DetailsAddInfo";
import { useDualLoadingRegistration } from "./useDualLoadingRegistration";
import type { SelectedRoot } from "../../types/domain";

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
  const pageProps = props as Record<string, unknown>;
  const { markDetailsLoaded, markHistoryLoaded } = useDualLoadingRegistration({
    registerLoadingComponent: props.registerLoadingComponent,
    unregisterLoadingComponent: props.unregisterLoadingComponent,
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

  const { error: detailsError, data: detailsData } = useQuery(publisher, {
    variables: selected,
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
      {({ error, data, fetchMore, fetching, hasMore }) => {
        const issues = data ? data.lastEdited : [];
        const details = detailsData?.publisher;
        const combinedError = detailsError || error;

        return (
          <Layout handleScroll={fetchMore}>
            {props.appIsLoading || combinedError || !details ? (
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
                  title={<TitleLine title={generateLabel(details)} id={details.id} session={props.session} />}
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

export default withContext(PublisherDetails);
