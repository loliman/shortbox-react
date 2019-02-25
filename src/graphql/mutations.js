import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const login = gql`mutation Login($user: UserInput!){
    login(user: $user) {
        id,
        sessionid
    }
}`;

const logout = gql`mutation Logout($user: UserInput!){
    logout(user: $user)
}`;

const deletePublishers = gql`mutation DeletePublishers($item: PublisherInput!){
    deletePublishers(item: $item)
}`;

const deleteSeries = gql`mutation DeleteSeries($item: SeriesInput!){
    deleteSeries(item: $item)
}`;

const deleteIssues = gql`mutation DeleteIssues($item: IssueInput!){
    deleteIssues(item: $item)
}`;

const createPublisher = gql`mutation CreatePublisher($publisher: PublisherInput!){
   createPublisher(publisher: $publisher) {
        id,
        name,
        addinfo,
        us
   }
}`;

const createSeries = gql`mutation CreateSeries($series: SeriesInput!){
   createSeries(series: $series) {
        id,
        title,
        startyear,
        endyear,
        volume,
        addinfo,
        publisher {
            id,
            name,
            us
        }
   }
}`;

const createIssue = gql`mutation CreateIssue($title: String!, $publishername: String!, $seriestitle: String!, $seriesvolume: Int!, 
    $number: String!, $limitation: Int, $pages: Int, $releasedate: Date, $price: String, $currency: String){
   createIssue(title: $title, publishername: $publishername, seriestitle: $seriestitle, seriesvolume: $seriesvolume, 
    number: $number, limitation: $limitation, pages: $pages, releasedate: $releasedate, price: $price, currency: $currency) {
        id,
        number,
        series {
            id,
            title,
            startyear,
            endyear,
            volume,
            addinfo,
            publisher {
                id,
                name,
                us
            } 
        }  
   }
}`;

const editPublisher = gql`mutation EditPublisher($old: PublisherInput!, $edit: PublisherInput!){
   editPublisher(old: $old, edit: $edit) {
        id,
        name,
        us,
        addinfo,
   }
}`;

const editSeries = gql`mutation EditSeries($old: SeriesInput!, $edit: SeriesInput!){
   editSeries(old: $old, edit: $edit) {
        id,
        title,
        volume,
        startyear,
        endyear,
        addinfo,
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

export {login, logout, getDeleteMutation, editPublisher, createPublisher, createSeries, createIssue, editSeries}