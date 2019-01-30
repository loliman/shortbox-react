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

const createSeries = gql`mutation CreateSeries($title: String!, $startyear: Int!, $endyear: Int, $volume: Int!, $publisher_name: String!){
   createSeries(title: $title, startyear: $startyear, endyear: $endyear, volume: $volume, publisher_name: $publisher_name) {
        id,
        title,
        startyear,
        endyear,
        volume,
        publisher {
            id,
            name,
            us
        }
   }
}`;

const editPublisher = gql`mutation EditPublisher($name_old: String!, $name: String!){
   editPublisher(name_old: $name_old, name: $name) {
        id,
        name,
        us
   }
}`;

const editSeries = gql`mutation EditSeries($title_old: String!, $volume_old: Int!, $publisher_old: String!, 
                                           $title: String!, $publisher: String!, $volume: Int!, $startyear: Int!, $endyear: Int){
   editSeries(title_old: $title_old, volume_old: $volume_old, publisher_old: $publisher_old, 
              title: $title, publisher: $publisher, volume: $volume, startyear: $startyear, endyear: $endyear) {
        id,
        title,
        volume,
        startyear,
        endyear,
        publisher {
            id,
            name,
            us
        }
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

export {login, logout, getDeleteMutation, editPublisher, createPublisher, createSeries, editSeries}