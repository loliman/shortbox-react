import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchiy";

const login = gql`mutation Login($name: String!, $password: String!){
    login(name: $name, password: $password) {
        id,
        sessionid
    }
}`;

const logout = gql`mutation Logout($id: Int!, $sessionid: String!){
    logout(id: $id, sessionid: $sessionid)
}`;

const deletePublishers = gql`mutation DeletePublishers($publisher_name: String!){
    deletePublishers(publisher_name: $publisher_name)
}`;

const deleteSeries = gql`mutation DeleteSeries($series_title: String!, $series_volume: Int!, $publisher_name: String!){
    deleteSeries(series_title: $series_title, series_volume: $series_volume, publisher_name: $publisher_name)
}`;

const deleteIssues = gql`mutation DeleteIssues($issue_number: String!, $series_title: String!, $series_volume: Int!, $publisher_name: String!){
    deleteIssues(issue_number: $issue_number, series_title: $series_title, series_volume: $series_volume, publisher_name: $publisher_name)
}`;

const createPublisher = gql`mutation CreatePublisher($name: String!){
   createPublisher(name: $name) {
        id,
        name,
        us
   }
}`;

const editPublisher = gql`mutation EditPublisher($name_old: String!, $name: String!){
   editPublisher(name_old: $name_old, name: $name) {
        id,
        name,
        us
   }
}`;

function getDeleteMutation(level) {
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            return deletePublishers;
        case HierarchyLevel.SERIES:
            return deleteSeries;
        default:
            return deleteIssues;
    }
}

export {login, logout, getDeleteMutation, editPublisher, createPublisher}