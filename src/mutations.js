import gql from "graphql-tag";
import {HierarchyLevel} from "./util";

const login = gql`mutation Login($name: String!, $password: String!){
    login(name: $name, password: $password) {
        id,
        sessionid
    }
}`;

const logout = gql`mutation Logout($id: Int!, $sessionid: String!){
    logout(id: $id, sessionid: $sessionid)
}`;

const deletePublishers = gql`mutation DeletePublishers($id: Int!){
    deletePublishers(id: $id)
}`;

const deleteSeries = gql`mutation DeleteSeries($id: Int!){
    deleteSeries(id: $id)
}`;

const deleteIssues = gql`mutation DeleteIssues($id: Int!){
    deleteIssues(id: $id)
}`;

const createPublisher = gql`mutation CreatePublisher($name: String!, $original: Boolean!){
   createPublisher(name: $name, original: $original) {
        id
   }
}`;

function getDeleteMutation(l) {
    switch (l) {
        case HierarchyLevel.PUBLISHER:
            return deletePublishers;
        case HierarchyLevel.SERIES:
            return deleteSeries;
        default:
            return deleteIssues;
    }
}

export {login, logout, getDeleteMutation, createPublisher}