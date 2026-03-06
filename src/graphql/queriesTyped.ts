import { HierarchyLevel } from "../util/hierarchy";

import {
  AppsDocument,
  AdminTasksDocument,
  ArcsDocument,
  ExportDocument,
  GenresDocument,
  IssueDocument,
  IndividualsDocument,
  IssuesDocument,
  LastEditedDocument,
  MeDocument,
  NodesDocument,
  PublisherDocument,
  RealitiesDocument,
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
const genres = GenresDocument;
const apps = AppsDocument;
const realities = RealitiesDocument;
const arcs = ArcsDocument;
const me = MeDocument;
const adminTasks = AdminTasksDocument;
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
  realities,
  arcs,
  exportQuery,
  getListQuery,
  issue,
  individuals,
  genres,
  issues,
  lastEdited,
  adminTasks,
  me,
  publisher,
  publishers,
  search,
  series,
  seriesd,
};
