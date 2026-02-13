import { ApolloLink, Observable } from "@apollo/client";
import type { DocumentNode, FieldNode, OperationDefinitionNode } from "graphql";
import {
  createMockIssueList,
  createMockPublisher,
  createMockSeries,
} from "../test/mocks/domainMocks";
import { mockLastEditedIssues } from "./fixtures/lastEditedIssues";
import { mockPublisherFixture } from "./fixtures/publisherMock";
import { mockSeriesFixture } from "./fixtures/seriesMock";
import { mockIssueDeFixture } from "./fixtures/issueMockDe";
import { mockIssueUsFixture } from "./fixtures/issueMockUs";

const publisher = createMockPublisher();
const series = createMockSeries();
const mockPublisherNames = [
  "All Verlag",
  "Arboris Verlag",
  "Bastei",
  "Blue Ocean",
  "Bocola",
  "Bootlegs",
  "BSV",
  "BSV - Bildschriftenverlag Hannover",
  "Bundeszentrale für politische Bildung",
  "Buzemi",
  "Carlsen",
  "Cartoon Aid Ltd",
  "Cinemaxx",
  "Comic Buch Club",
  "Comic-Fan Digest",
  "Comicothek",
  "Condor",
  "Cross Cult",
  "Dani Books",
  "Dino",
  "Egmont Ehapa",
  "Fancomics",
  "Feest Comics",
  "Finix Comics",
  "Frankfurter Allgemeine Zeitung",
  "Gabor",
  "Gevacur AG",
  "Hachette",
  "Hethke",
  "HEYNE",
  "Infinity",
  "Interessengemeinschaft Superhelden Comics O.V. Schwäbisch Gmünd",
  "JNK",
  "Jürgen Maier",
  "KariCartoon",
  "Koralle",
  "Kult Editionen",
  "Marquard Media",
  "Marvel",
  "Mehrholz-Goldriver",
  "Melzer",
  "Modern Graphics",
  "Norbert Breling",
  "Panini - DC, Vertigo & Wildstorm",
  "Panini - Marvel & Icon",
  "Panini - Marvel UK",
  "Panini - Star Wars & Generation",
  "Panini Manga",
  "Phoenix International Publications Germany GmbH",
  "Planet!",
  "Popcom",
  "Quick Easy Comics",
  "Reclam",
  "Schreiber & Leser",
  "Sekundärliteratur",
  "Speed",
  "Splitter",
  "Splitter (ab 2006)",
  "Verein Action",
  "Volksverlag",
  "Wick Comics",
  "Williams",
  "Zauberstern Comics",
];
const mockPublishers = mockPublisherNames.map((name) => ({
  name,
  us: false,
  __typename: "Publisher",
}));
const mockSeries = [
  {
    title: "Die Abenteuer von Red Sonja - Gesamtausgabe",
    volume: 1,
    startyear: 2024,
    endyear: 0,
    publisher: { name: "All Verlag", us: false, __typename: "Publisher" },
    __typename: "Series",
  },
  {
    title: "Marada - Die Wölfin (Gesamtausgabe)",
    volume: 1,
    startyear: 2015,
    endyear: 2015,
    publisher: { name: "All Verlag", us: false, __typename: "Publisher" },
    __typename: "Series",
  },
];
const mockIssues = [
  {
    title: "",
    number: "1",
    comicguideid: 0,
    collected: true,
    cover: null,
    covers: [],
    series: {
      title: "Die Abenteuer von Red Sonja - Gesamtausgabe",
      volume: 1,
      publisher: { name: "All Verlag", us: false, __typename: "Publisher" },
      __typename: "Series",
    },
    format: null,
    variants: [
      { collected: true, variant: "", __typename: "Issue" },
      { collected: false, variant: "Vorzugsausgabe", __typename: "Issue" },
    ],
    __typename: "Issue",
  },
  {
    title: "",
    number: "2",
    comicguideid: 0,
    collected: true,
    cover: null,
    covers: [],
    series: {
      title: "Die Abenteuer von Red Sonja - Gesamtausgabe",
      volume: 1,
      publisher: { name: "All Verlag", us: false, __typename: "Publisher" },
      __typename: "Series",
    },
    format: null,
    variants: [
      { collected: true, variant: "", __typename: "Issue" },
      { collected: false, variant: "Vorzugsausgabe", __typename: "Issue" },
    ],
    __typename: "Issue",
  },
];
const issues = createMockIssueList(5).map((issue, index) => ({
  ...issue,
  comicguideid: `cg-${index + 1}`,
  cover: { url: `https://img.shortbox.mock/amazing-spider-man-${index + 1}.jpg` },
  covers: [],
  variants: index === 0 ? [{ collected: false, variant: "B" }] : [],
  stories: [],
  individuals: [{ name: "Stan Lee", type: ["writer"] }],
  features: [],
  releasedate: `1963-0${Math.min(index + 3, 9)}-01`,
  createdAt: `2025-01-0${Math.min(index + 1, 9)}T12:00:00.000Z`,
  updatedAt: `2025-01-1${Math.min(index + 1, 9)}T12:00:00.000Z`,
}));

const individuals = [{ name: "Stan Lee" }, { name: "Steve Ditko" }];
const apps = [{ name: "Spider-Man", type: "HERO" }];
const arcs = [{ title: "Origin", type: "RUN" }];

const createConnection = <T>(nodes: T[]) => ({
  edges: nodes.map((node, idx) => ({ cursor: String(idx + 1), node })),
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: nodes.length ? "1" : null,
    endCursor: nodes.length ? String(nodes.length) : null,
  },
});

const matches = (value: string, pattern?: string | null) => {
  const p = (pattern ?? "").trim().toLowerCase();
  if (!p || p === "*") return true;
  return value.toLowerCase().includes(p);
};

const getRootFieldName = (query: DocumentNode): string | null => {
  const operationDef = query.definitions.find(
    (definition): definition is OperationDefinitionNode => definition.kind === "OperationDefinition"
  );
  const firstSelection = operationDef?.selectionSet?.selections?.[0];
  if (firstSelection?.kind !== "Field") return null;
  return firstSelection.name.value;
};

const buildResult = (key: string, variables: Record<string, unknown>) => {
  switch (key) {
    case "nodes":
      return {
        nodes: [
          { type: "publisher", label: publisher.name, url: `/us/${publisher.name}` },
          {
            type: "series",
            label: `${series.title} Vol ${series.volume}`,
            url: `/us/${publisher.name}/${series.title}_Vol_${series.volume}`,
          },
          {
            type: "issue",
            label: `${series.title} #${issues[0].number}`,
            url: `/us/${publisher.name}/${series.title}_Vol_${series.volume}/${issues[0].number}`,
          },
        ].filter((node) => matches(node.label, variables.pattern as string)),
      };
    case "export":
      return { export: "Mock export content" };
    case "publishers":
      return {
        publishers: createConnection(
          mockPublishers.filter((p) => matches(p.name, variables.pattern as string))
        ),
      };
    case "series":
      return {
        series: createConnection(
          mockSeries.filter((s) => matches(s.title, variables.pattern as string))
        ),
      };
    case "issues":
      return {
        issues: createConnection(mockIssues.filter((i) => matches(i.title || i.number, variables.pattern as string))),
      };
    case "individuals":
      return { individuals: createConnection(individuals) };
    case "apps":
      return { apps: createConnection(apps) };
    case "arcs":
      return { arcs: createConnection(arcs) };
    case "me":
      return { me: { id: 1 } };
    case "lastEdited":
      return { lastEdited: createConnection(mockLastEditedIssues) };
    case "publisher":
      {
        const selectedPublisher = (variables.publisher as { us?: boolean } | undefined) ?? {};
        const publisherUs =
          typeof selectedPublisher.us === "boolean" ? selectedPublisher.us : mockPublisherFixture.us;

        return {
          publisher: {
            ...mockPublisherFixture,
            us: publisherUs,
          },
        };
      }
    case "seriesd":
      {
        const selectedSeries = (variables.series as { publisher?: { us?: boolean } } | undefined) ?? {};
        const publisherUs =
          typeof selectedSeries.publisher?.us === "boolean"
            ? selectedSeries.publisher.us
            : mockSeriesFixture.publisher.us;

        return {
          seriesd: {
            ...mockSeriesFixture,
            publisher: { ...mockSeriesFixture.publisher, us: publisherUs },
            firstIssue: {
              ...mockSeriesFixture.firstIssue,
              series: {
                ...mockSeriesFixture.firstIssue.series,
                publisher: { ...mockSeriesFixture.firstIssue.series.publisher, us: publisherUs },
              },
            },
            lastIssue: {
              ...mockSeriesFixture.lastIssue,
              series: {
                ...mockSeriesFixture.lastIssue.series,
                publisher: { ...mockSeriesFixture.lastIssue.series.publisher, us: publisherUs },
              },
            },
          },
        };
      }
    case "issue": {
      const issueVar = variables.issue as
        | {
            series?: { publisher?: { us?: boolean } };
          }
        | undefined;
      const requestedUs = Boolean(
        (variables.us as boolean | undefined) ?? issueVar?.series?.publisher?.us
      );
      return { issue: requestedUs ? mockIssueUsFixture : mockIssueDeFixture };
    }
    case "login":
      return { login: { id: 1, sessionid: "mock-session" } };
    case "logout":
      return { logout: true };
    case "deleteIssue":
      return { deleteIssue: true };
    case "deleteSeries":
      return { deleteSeries: true };
    case "deletePublisher":
      return { deletePublisher: true };
    case "createPublisher":
      return { createPublisher: { id: "pub-created", us: true, ...(variables.item as object) } };
    case "editPublisher":
      return { editPublisher: { id: "pub-edited", us: true, ...(variables.item as object) } };
    case "createSeries":
      return {
        createSeries: {
          id: "series-created",
          publisher,
          ...(variables.item as object),
        },
      };
    case "editSeries":
      return {
        editSeries: {
          id: "series-edited",
          publisher,
          ...(variables.item as object),
        },
      };
    case "createIssue":
      return {
        createIssue: {
          ...issues[0],
          id: "issue-created",
          ...(variables.item as object),
        },
      };
    case "editIssue":
      return {
        editIssue: {
          ...issues[0],
          id: "issue-edited",
          ...(variables.item as object),
        },
      };
    default:
      return null;
  }
};

export const createApolloMockLink = (delayMs = 100) =>
  new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        const rootFieldName = getRootFieldName(operation.query);
        const opName = operation.operationName || "";
        const normalizedKey =
          rootFieldName || (opName ? opName[0].toLowerCase() + opName.slice(1) : "");
        const result = buildResult(normalizedKey, operation.variables as Record<string, unknown>);

        if (!result) {
          observer.error(
            new Error(
              `[mock-mode] Unsupported GraphQL root field "${normalizedKey || "(unknown)"}". ` +
                "Please add a mock handler in src/mock/apolloMockLink.ts."
            )
          );
          return;
        }

        setTimeout(() => {
          observer.next({ data: result });
          observer.complete();
        }, delayMs);
      })
  );
