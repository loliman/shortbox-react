import React from 'react'
import Layout from "../../Layout";
import {createIssue} from "../../../graphql/mutations";
import {withContext} from "../../generic";
import IssueEditor from "../editor/IssueEditor";
import {getHierarchyLevel, HierarchyLevel} from "../../../util/hierarchy";

function IssueCreate(props) {
    const {selected, level} = props;

    let defaultValues;
    if (level === HierarchyLevel.PUBLISHER) {
        defaultValues = {series: {publisher: selected.publisher}};
    } else if (level === HierarchyLevel.SERIES) {
        defaultValues = {series: selected.series}
    } else if (level === HierarchyLevel.ISSUE) {
        defaultValues = {series: selected.issue.series}
    }

    return (
        <Layout>
            <IssueEditor mutation={createIssue}
                         defaultValues={defaultValues}/>
        </Layout>
    )
}

export default withContext(IssueCreate);