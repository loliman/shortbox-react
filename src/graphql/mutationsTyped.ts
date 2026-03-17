import {
  CreateIssueDocument,
  CreatePublisherDocument,
  CreateSeriesDocument,
  DiscardChangeRequestDocument,
  DeleteIssueDocument,
  DeletePublisherDocument,
  DeleteSeriesDocument,
  EditIssueDocument,
  EditPublisherDocument,
  EditSeriesDocument,
  LoginDocument,
  LogoutDocument,
  ReleaseAllAdminTaskLocksDocument,
  ReportErrorDocument,
  RunAdminTaskDocument,
} from "./typed-documents.generated";
import { HierarchyLevel } from "../util/hierarchy";

const login = LoginDocument;
const logout = LogoutDocument;
const releaseAllAdminTaskLocks = ReleaseAllAdminTaskLocksDocument;
const runAdminTask = RunAdminTaskDocument;
const createIssue = CreateIssueDocument;
const createSeries = CreateSeriesDocument;
const createPublisher = CreatePublisherDocument;
const editIssue = EditIssueDocument;
const editSeries = EditSeriesDocument;
const editPublisher = EditPublisherDocument;
const deleteIssue = DeleteIssueDocument;
const deleteSeries = DeleteSeriesDocument;
const deletePublisher = DeletePublisherDocument;
const reportError = ReportErrorDocument;
const discardChangeRequest = DiscardChangeRequestDocument;

function getDeleteMutation(level: string) {
  switch (level) {
    case HierarchyLevel.PUBLISHER:
      return deletePublisher;
    case HierarchyLevel.SERIES:
      return deleteSeries;
    default:
      return deleteIssue;
  }
}

export {
  createIssue,
  createPublisher,
  createSeries,
  discardChangeRequest,
  editIssue,
  editPublisher,
  editSeries,
  getDeleteMutation,
  login,
  logout,
  reportError,
  releaseAllAdminTaskLocks,
  runAdminTask,
};
