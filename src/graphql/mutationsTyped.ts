import {
  CreateIssueDocument,
  CreatePublisherDocument,
  CreateSeriesDocument,
  DeleteIssueDocument,
  DeletePublisherDocument,
  DeleteSeriesDocument,
  EditIssueDocument,
  EditPublisherDocument,
  EditSeriesDocument,
  LoginDocument,
  LogoutDocument,
} from "./typed-documents.generated";
import { HierarchyLevel } from "../util/hierarchy";

const login = LoginDocument;
const logout = LogoutDocument;
const createIssue = CreateIssueDocument;
const createSeries = CreateSeriesDocument;
const createPublisher = CreatePublisherDocument;
const editIssue = EditIssueDocument;
const editSeries = EditSeriesDocument;
const editPublisher = EditPublisherDocument;
const deleteIssue = DeleteIssueDocument;
const deleteSeries = DeleteSeriesDocument;
const deletePublisher = DeletePublisherDocument;

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
  editIssue,
  editPublisher,
  editSeries,
  getDeleteMutation,
  login,
  logout,
};
