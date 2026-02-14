import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}));

vi.mock("@apollo/client", () => ({
  useQuery: useQueryMock,
}));

import PaginatedQuery from "./PaginatedQuery";

describe("PaginatedQuery", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  it("handles offset pagination for nodes queries", async () => {
    const fetchMoreMock = vi.fn(() => Promise.resolve({}));
    useQueryMock.mockReturnValue({
      loading: false,
      error: null,
      data: { nodes: [{ id: 1 }] },
      fetchMore: fetchMoreMock,
      networkStatus: 7,
    });

    const query = {
      definitions: [{ name: { value: "Nodes" } }],
    } as any;

    let renderProps: any;
    render(
      <PaginatedQuery query={query} variables={{}}>
        {(props) => {
          renderProps = props;
          return <div>child</div>;
        }}
      </PaginatedQuery>
    );

    await waitFor(() => {
      expect(renderProps).toBeTruthy();
    });

    expect(useQueryMock).toHaveBeenCalledWith(
      query,
      expect.objectContaining({
        variables: expect.objectContaining({ offset: 0, pattern: "" }),
      })
    );

    await act(async () => {
      renderProps.fetchMore({
        target: { scrollHeight: 100, scrollTop: 99, clientHeight: 0 },
      } as any);
    });

    expect(fetchMoreMock).toHaveBeenCalledTimes(1);
    const fetchMoreCalls = (fetchMoreMock as any).mock.calls as any[];
    const fetchMoreArg = fetchMoreCalls[0]?.[0];
    expect(fetchMoreArg).toBeTruthy();
    expect(fetchMoreArg.variables).toEqual({ offset: 1, pattern: "" });

    const merged = fetchMoreArg.updateQuery(
      { nodes: [{ id: 1 }] },
      { fetchMoreResult: { nodes: [{ id: 2 }] } }
    );
    expect(merged.nodes).toEqual([{ id: 1 }, { id: 2 }]);

    const unchanged = fetchMoreArg.updateQuery(
      { nodes: [{ id: 1 }, { id: 99 }] },
      { fetchMoreResult: { nodes: [{ id: 2 }] } }
    );
    expect(unchanged).toEqual({ nodes: [{ id: 1 }, { id: 99 }] });
  });

  it("handles connection pagination and merged edges", async () => {
    const fetchMoreMock = vi.fn(() => Promise.resolve({}));
    const onCompleted = vi.fn();
    useQueryMock.mockReturnValue({
      loading: false,
      error: null,
      data: {
        issues: {
          edges: [{ node: { number: "1" } }],
          pageInfo: { hasNextPage: true, endCursor: "cursor-1" },
        },
      },
      fetchMore: fetchMoreMock,
      networkStatus: 7,
    });

    const query = {
      definitions: [{ name: { value: "Issues" } }],
    } as any;

    let renderProps: any;
    render(
      <PaginatedQuery query={query} variables={{ first: 25 }} onCompleted={onCompleted}>
        {(props) => {
          renderProps = props;
          return <div>child</div>;
        }}
      </PaginatedQuery>
    );

    await waitFor(() => {
      expect(renderProps).toBeTruthy();
      expect(onCompleted).toHaveBeenCalled();
    });

    await act(async () => {
      renderProps.fetchMore({
        target: { scrollHeight: 100, scrollTop: 99, clientHeight: 0 },
      } as any);
    });

    const fetchMoreCalls = (fetchMoreMock as any).mock.calls as any[];
    const fetchMoreArg = fetchMoreCalls[0]?.[0];
    expect(fetchMoreArg).toBeTruthy();
    expect(fetchMoreArg.variables).toEqual({ first: 25, after: "cursor-1" });

    const merged = fetchMoreArg.updateQuery(
      {
        issues: {
          edges: [{ node: { number: "1" } }],
          pageInfo: { hasNextPage: true, endCursor: "cursor-1" },
        },
      },
      {
        fetchMoreResult: {
          issues: {
            edges: [{ node: { number: "2" } }],
            pageInfo: { hasNextPage: false, endCursor: "cursor-2" },
          },
        },
      }
    );

    expect(merged.issues.edges).toHaveLength(2);
    expect(merged.issues.pageInfo).toEqual({ hasNextPage: false, endCursor: "cursor-2" });
  });
});
