import React from "react";
import { useQuery } from "@apollo/client";
import type { Connection, QueryCollection } from "../../types/graphql";

function PaginatedQuery(props) {
  const { query, onCompleted, variables: inputVariables = {} } = props;
  const [fetching, setFetching] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const fetchMoreInFlightRef = React.useRef(false);
  const queryNameRaw = getQueryName(query);
  const queryName = queryNameRaw ? queryNameRaw[0].toLowerCase() + queryNameRaw.slice(1) : "";
  const offsetMode = queryName === "nodes";
  const onCompletedRef = React.useRef(onCompleted);

  const inputKey = React.useMemo(() => JSON.stringify(inputVariables || {}), [inputVariables]);
  const parsedInputVariables = React.useMemo(() => JSON.parse(inputKey), [inputKey]);

  React.useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);

  const variables = React.useMemo(() => {
    const next = { ...parsedInputVariables };
    if (offsetMode) {
      next.offset = 0;
      if (!next.pattern) next.pattern = "";
    } else {
      next.after = null;
      next.first = next.first || 50;
    }
    return next;
  }, [parsedInputVariables, offsetMode]);

  React.useEffect(() => {
    setHasMore(true);
  }, [inputKey]);

  const { loading, error, data, fetchMore, networkStatus } = useQuery(query, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    if ((data || error) && onCompletedRef.current) onCompletedRef.current();
  }, [data, error]);

  const rawResult = data ? (data as Record<string, QueryCollection<unknown>>)[queryName] : null;
  const normalized = normalizeResult(rawResult);
  const offset = normalized ? normalized.length : 0;
  const endCursor =
    isConnection(rawResult) && rawResult.pageInfo ? rawResult.pageInfo.endCursor : null;
  const remoteHasNextPage =
    isConnection(rawResult) && rawResult.pageInfo ? Boolean(rawResult.pageInfo.hasNextPage) : false;

  React.useEffect(() => {
    if (!offsetMode && data) {
      setHasMore(remoteHasNextPage);
    }
  }, [offsetMode, data, remoteHasNextPage]);

  const fetchMoreVars = React.useMemo(() => {
    const next = { ...parsedInputVariables };
    if (offsetMode) {
      next.offset = offset || 0;
      if (!next.pattern) next.pattern = "";
    } else {
      next.after = endCursor || null;
      next.first = next.first || 50;
    }
    return next;
  }, [parsedInputVariables, offset, offsetMode, endCursor]);

  const fetchMoreOnScroll = (
    e: React.UIEvent<HTMLElement>,
    reload: () => void
  ) => {
    const element = e.target as HTMLElement | null;
    if (!element) return;
    if (!hasMore || loading || fetching || fetchMoreInFlightRef.current) return;

    const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;
    const isNearBottom = remaining <= 1;
    if (!isNearBottom) return;

    reload();
  };

  return props.children({
    ...props,
    loading,
    error,
    data: { ...(data || {}), [queryName]: normalized },
    fetching,
    networkStatus,
    hasMore,
    fetchMore: (e) =>
      fetchMoreOnScroll(e, () =>
        {
          fetchMoreInFlightRef.current = true;
          setFetching(true);

          void fetchMore({
            variables: fetchMoreVars,
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;

              if (offsetMode) {
                if (!prev || prev[queryName].length !== fetchMoreVars.offset) return prev;

                if (fetchMoreResult[queryName].length === 0) setHasMore(false);

                return {
                  ...prev,
                  [queryName]: [...prev[queryName], ...fetchMoreResult[queryName]],
                };
              }

              const previousConnection =
                prev && prev[queryName] ? prev[queryName] : { edges: [], pageInfo: {} };
              const nextConnection = fetchMoreResult[queryName];
              if (!isConnection(previousConnection) || !isConnection(nextConnection)) return prev;

              const nextEdges = nextConnection.edges || [];
              const mergedEdges = [...(previousConnection.edges || []), ...nextEdges];
              const nextPageInfo = nextConnection.pageInfo
                ? nextConnection.pageInfo
                : previousConnection.pageInfo;

              setHasMore(Boolean(nextPageInfo && nextPageInfo.hasNextPage));

              return {
                ...prev,
                [queryName]: {
                  ...previousConnection,
                  edges: mergedEdges,
                  pageInfo: nextPageInfo,
                },
              };
            },
          }).finally(() => {
            fetchMoreInFlightRef.current = false;
            setFetching(false);
          });
        }
      ),
  });
}

function getQueryName(query: {
  definitions?: ReadonlyArray<{ name?: { value?: string } }>;
}): string {
  return query.definitions?.[0]?.name?.value || "";
}

function isConnection<T>(value: QueryCollection<T> | null | undefined): value is Connection<T> {
  return !!value && !Array.isArray(value) && "edges" in value && "pageInfo" in value;
}

function normalizeResult<T>(value: QueryCollection<T> | null | undefined): T[] {
  if (!value) return [];

  if (Array.isArray(value)) return value.filter(Boolean) as T[];

  return value.edges.map((edge) => edge && edge.node).filter(Boolean) as T[];
}

export default PaginatedQuery;
