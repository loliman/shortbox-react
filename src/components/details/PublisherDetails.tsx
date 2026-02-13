import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import QueryResult from "../generic/QueryResult";
import { lastEdited, publisher } from "../../graphql/queriesTyped";
import { generateLabel } from "../../util/hierarchy";
import Typography from "@mui/material/Typography";
import EditButton from "../restricted/EditButton";
import withContext from "../generic/withContext";
import IssuePreview, { IssuePreviewPlaceholder } from "../IssuePreview";
import PaginatedQuery from "../generic/PaginatedQuery";
import IssuePreviewSmall, { IssuePreviewPlaceholderSmall } from "../IssuePreviewSmall";
import SortContainer from "../SortContainer";
import TitleLine from "../generic/TitleLine";
import LoadingDots from "../common/LoadingDots";

function PublisherDetails(props) {
  let selected = props.selected;

  let filter;
  if (props.query && props.query.filter) {
    try {
      filter = JSON.parse(props.query.filter);
      filter.us = props.us;
      filter.publishers = [
        {
          name: props.selected.publisher.name,
          us: props.us,
        },
      ];
    } catch (e) {
      //
    }
  } else {
    filter = { us: props.us, publishers: [{ name: props.selected.publisher.name, us: props.us }] };
  }

  const { error: detailsError, data: detailsData } = useQuery(publisher, {
    variables: selected,
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    if (detailsData || detailsError) {
      props.unregisterLoadingComponent("PublisherDetails_details");
    }
  }, [detailsData, detailsError, props.unregisterLoadingComponent]);

  React.useEffect(() => {
    props.registerLoadingComponent("PublisherDetails_history");
    props.registerLoadingComponent("PublisherDetails_details");
  }, []);

  return (
    <PaginatedQuery
      query={lastEdited}
      variables={{
        filter: filter,
        order: props.query && props.query.order ? props.query.order : "updatedAt",
        direction: props.query && props.query.direction ? props.query.direction : "DESC",
      }}
      onCompleted={() => props.unregisterLoadingComponent("PublisherDetails_history")}
    >
      {({ error, data, fetchMore, fetching, hasMore }) => {
        let lastEdited = data ? data.lastEdited : [];
        let lastEditedError = error;

        const loading = hasMore && fetching ? <LoadingDots /> : null;

        return (
          <Layout handleScroll={fetchMore}>
            {(() => {
              if (
                props.appIsLoading ||
                detailsError ||
                lastEditedError ||
                !detailsData ||
                !detailsData.publisher
              )
                return (
                  <QueryResult
                    error={detailsError || lastEditedError}
                    data={detailsData ? detailsData.publisher : null}
                    selected={selected}
                    placeholder={<PublisherDetailsPlaceholder {...props} />}
                    placeholderCount={1}
                  />
                );

              let first =
                detailsData.publisher.issueCount === 1
                  ? detailsData.publisher.active
                    ? "Bisher einziges "
                    : "Einziges "
                  : "Erstes ";
              return (
                <React.Fragment>
                  <CardHeader
                    title={
                      <TitleLine
                        title={generateLabel(detailsData.publisher)}
                        id={detailsData.publisher.id}
                        session={props.session}
                      />
                    }
                    subheader={
                      detailsData.publisher.startyear +
                      " - " +
                      (detailsData.publisher.active ? "heute" : detailsData.publisher.endyear)
                    }
                    action={<EditButton item={detailsData.publisher} />}
                  />

                  <CardContent className="cardContent">
                    {detailsData.publisher.addinfo ? (
                      <React.Fragment>
                        <br />

                        <Typography
                          dangerouslySetInnerHTML={{ __html: detailsData.publisher.addinfo }}
                        />

                        <br />
                        <br />
                      </React.Fragment>
                    ) : null}

                    {(!props.query || !props.query.filter) && detailsData.publisher.firstIssue ? (
                      <React.Fragment>
                        <CardHeader
                          title={
                            !props.us
                              ? first + "veröffentlichtes Comic mit Marvel Material"
                              : "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                          }
                        />

                        <CardContent>
                          <IssuePreview {...props} issue={detailsData.publisher.firstIssue} />
                        </CardContent>
                      </React.Fragment>
                    ) : null}

                    {!props.query || !props.query.filter ? <br /> : null}

                    {(!props.query || !props.query.filter) &&
                    detailsData.publisher.lastIssue &&
                    detailsData.publisher.issueCount > 1 ? (
                      <React.Fragment>
                        <CardHeader
                          title={
                            !props.us
                              ? "Letztes veröffentlichtes Comic mit Marvel Material"
                              : "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                          }
                        />

                        <CardContent>
                          <IssuePreview {...props} issue={detailsData.publisher.lastIssue} />
                        </CardContent>
                      </React.Fragment>
                    ) : null}

                    {!props.query || !props.query.filter ? <br /> : null}

                    <React.Fragment>
                      <div>
                        <SortContainer {...props} />
                      </div>

                      <br />

                      <CardContent>
                        {lastEdited
                          ? lastEdited.map((i, idx) => (
                              <IssuePreviewSmall
                                {...props}
                                isLast={idx === lastEdited.length - 1}
                                idx={idx}
                                key={idx}
                                issue={i}
                              />
                            ))
                          : null}
                      </CardContent>
                    </React.Fragment>
                  </CardContent>

                  {loading}
                </React.Fragment>
              );
            })()}
          </Layout>
        );
      }}
    </PaginatedQuery>
  );
}

function PublisherDetailsPlaceholder(props) {
  return (
    <React.Fragment>
      <CardHeader
        title={
          <div className="ui placeholder cardHeaderPlaceholder">
            <div className={"header"}>
              <div className="medium line" />
              <div className="short line" />
            </div>
          </div>
        }
      />

      <CardContent className="cardContent">
        {!props.query || !props.query.filter ? (
          <React.Fragment>
            <React.Fragment>
              <CardHeader
                title={
                  <div className="ui placeholder cardHeaderPlaceholder">
                    <div className={"header"}>
                      <div className="short line" />
                    </div>
                  </div>
                }
              />
              <CardContent>
                <IssuePreviewPlaceholder />
              </CardContent>
            </React.Fragment>
            <br />
            <br />
            <React.Fragment>
              <CardHeader
                title={
                  <div className="ui placeholder cardHeaderPlaceholder">
                    <div className={"header"}>
                      <div className="medium line" />
                    </div>
                  </div>
                }
              />
              <CardContent>
                <IssuePreviewPlaceholder />
              </CardContent>
            </React.Fragment>
            <br />{" "}
          </React.Fragment>
        ) : null}

        <React.Fragment>
          <CardHeader
            title={
              <div className="ui placeholder cardHeaderPlaceholder">
                <div className={"header"}>
                  <div className="very short line" />
                </div>
              </div>
            }
          />
          <CardContent>
            <IssuePreviewPlaceholderSmall idx={0} />
            <IssuePreviewPlaceholderSmall />
            <IssuePreviewPlaceholderSmall />
            <IssuePreviewPlaceholderSmall />
            <IssuePreviewPlaceholderSmall isLast={true} />
          </CardContent>
        </React.Fragment>
      </CardContent>
    </React.Fragment>
  );
}

export default withContext(PublisherDetails);
