import { HierarchyLevel } from "../util/hierarchy";

import {
  AppsDocument,
  AdminTasksDocument,
  ArcsDocument,
  ChangeRequestsDocument,
  ChangeRequestCountDocument,
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
const changeRequestCount = ChangeRequestCountDocument;
const changeRequests = ChangeRequestsDocument;
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
  changeRequestCount,
  changeRequests,
  me,
  publisher,
  publishers,
  search,
  series,
  seriesd,
};
