import { HierarchyLevel } from "../util/hierarchy";

import {
  AppsDocument,
  ArcsDocument,
  ExportDocument,
  IssueDocument,
  IndividualsDocument,
  IssuesDocument,
  LastEditedDocument,
  MeDocument,
  NodesDocument,
  PublisherDocument,
  PublishersDocument,
  SeriesDocument,
  SeriesdDocument,
} from "./typed-documents.generated";

const search = NodesDocument;
const exportQuery = ExportDocument;
const publishers = PublishersDocument;
const series = SeriesDocument;
const issues = IssuesDocument;
const individuals = IndividualsDocument;
const apps = AppsDocument;
const arcs = ArcsDocument;
const me = MeDocument;
const lastEdited = LastEditedDocument;
const publisher = PublisherDocument;
const seriesd = SeriesdDocument;
const issue = IssueDocument;

function getListQuery(level: string) {
  switch (level) {
    case HierarchyLevel.ROOT:
      return publishers;
    case HierarchyLevel.PUBLISHER:
      return series;
    default:
      return issues;
  }
}

export {
  apps,
  arcs,
  exportQuery,
  getListQuery,
  issue,
  individuals,
  issues,
  lastEdited,
  me,
  publisher,
  publishers,
  search,
  series,
  seriesd,
};
