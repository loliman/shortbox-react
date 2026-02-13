import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { generateLabel } from "../../util/hierarchy";
import Layout from "../Layout";
import { useQuery } from "@apollo/client";
import QueryResult from "../generic/QueryResult";
import { lastEdited, seriesd } from "../../graphql/queriesTyped";
import Typography from "@mui/material/Typography";
import EditButton from "../restricted/EditButton";
import IssuePreview, { IssuePreviewPlaceholder } from "../IssuePreview";
import withContext from "../generic/withContext";
import PaginatedQuery from "../generic/PaginatedQuery";
import IssuePreviewSmall, { IssuePreviewPlaceholderSmall } from "../IssuePreviewSmall";
import SortContainer from "../SortContainer";
import TitleLine from "../generic/TitleLine";
import LoadingDots from "../common/LoadingDots";

function SeriesDetails(props) {
  let filter;

  if (props.query && props.query.filter) {
    try {
      filter = JSON.parse(props.query.filter);
      filter.us = props.us;
      filter.series = [
        {
          title: props.selected.series.title,
          volume: props.selected.series.volume,
          publisher: {
            us: props.us,
          },
        },
      ];
      filter.publishers = [
        {
          name: props.selected.series.publisher.name,
          us: props.us,
        },
      ];
    } catch (e) {
      //
    }
  } else {
    filter = {
      us: props.us,
      series: [
        {
          title: props.selected.series.title,
          volume: props.selected.series.volume,
          publisher: {
            us: props.us,
          },
        },
      ],
      publishers: [
        {
          name: props.selected.series.publisher.name,
          us: props.us,
        },
      ],
    };
  }

  React.useEffect(() => {
    props.registerLoadingComponent("SeriesDetails_history");
    props.registerLoadingComponent("SeriesDetails_details");
  }, []);

  const { error: detailsError, data: detailsData } = useQuery(seriesd, {
    variables: props.selected,
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    if (detailsData || detailsError) {
      props.unregisterLoadingComponent("SeriesDetails_details");
    }
  }, [detailsData, detailsError, props.unregisterLoadingComponent]);

  return (
    <PaginatedQuery
      query={lastEdited}
      variables={{
        filter: filter,
        order: props.query && props.query.order ? props.query.order : "updatedAt",
        direction: props.query && props.query.direction ? props.query.direction : "DESC",
      }}
      onCompleted={() => props.unregisterLoadingComponent("SeriesDetails_history")}
    >
      {({ error, data, fetchMore, hasMore, fetching }) => {
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
                !detailsData.seriesd
              )
                return (
                  <QueryResult
                    error={detailsError || lastEditedError}
                    data={detailsData ? detailsData.seriesd : null}
                    selected={props.selected}
                    placeholder={<SeriesDetailsPlaceholder {...props} />}
                    placeholderCount={1}
                  />
                );

              let first =
                detailsData.seriesd.issueCount === 1
                  ? detailsData.seriesd.active
                    ? "Bisher einziges "
                    : "Einziges "
                  : "Erstes ";
              return (
                <React.Fragment>
                  <CardHeader
                    title={
                      <TitleLine
                        title={generateLabel(detailsData.seriesd)}
                        id={detailsData.seriesd.id}
                        session={props.session}
                      />
                    }
                    subheader={
                      detailsData.seriesd.startyear +
                      " - " +
                      (detailsData.seriesd.active ? "heute" : detailsData.seriesd.endyear)
                    }
                    action={<EditButton item={detailsData.seriesd} />}
                  />

                  <CardContent className="cardContent">
                    {detailsData.seriesd.addinfo ? (
                      <React.Fragment>
                        <br />

                        <Typography
                          dangerouslySetInnerHTML={{ __html: detailsData.seriesd.addinfo }}
                        />

                        <br />
                        <br />
                      </React.Fragment>
                    ) : null}

                    {(!props.query || !props.query.filter) && detailsData.seriesd.firstIssue ? (
                      <React.Fragment>
                        <CardHeader
                          title={
                            !props.us
                              ? first + "veröffentlichtes Comic mit Marvel Material"
                              : "Frühestes Comic mit auf deutsch veröffentlichtem Material"
                          }
                        />

                        <CardContent>
                          <IssuePreview {...props} issue={detailsData.seriesd.firstIssue} />
                        </CardContent>
                      </React.Fragment>
                    ) : null}

                    {!props.query || !props.query.filter ? <br /> : null}

                    {(!props.query || !props.query.filter) &&
                    detailsData.seriesd.lastIssue &&
                    detailsData.seriesd.issueCount > 1 ? (
                      <React.Fragment>
                        <CardHeader
                          title={
                            !props.us
                              ? "Letztes veröffentlichtes Comic mit Marvel Material"
                              : "Spätestes Comic mit auf deutsch veröffentlichtem Material"
                          }
                        />

                        <CardContent>
                          <IssuePreview {...props} issue={detailsData.seriesd.lastIssue} />
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

function SeriesDetailsPlaceholder(props) {
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
                      <div className="medium line" />
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

export default withContext(SeriesDetails);
