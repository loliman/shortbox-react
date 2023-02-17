import React from 'react'
import Layout from "../../Layout";
import {createIssue} from "../../../graphql/mutations";
import {withContext} from "../../generic";
import IssueEditor, {currencies, formats} from "../editor/IssueEditor";
import {HierarchyLevel} from "../../../util/hierarchy";

function IssueCreate(props) {
    const {selected, level} = props;

    let defaultValues = {
        title: '',
        number: '',
        variant: '',
        cover: '',
        format: formats[0],
        limitation: 0,
        pages: 0,
        releasedate: '1900-01-01',
        price: '0',
        currency: currencies[0],
        individuals: [],
        addinfo: '',
        comicguideid: 0,
        stories: [],
        features: [],
        covers: []
    };

    if (level === HierarchyLevel.PUBLISHER) {
        defaultValues.series = {publisher: selected.publisher};
    } else if (level === HierarchyLevel.SERIES) {
        defaultValues.series = selected.series
    } else if (level === HierarchyLevel.ISSUE) {
        defaultValues.series = selected.issue.series
    }

    return (
        <Layout>
            <IssueEditor mutation={createIssue}
                         defaultValues={defaultValues}/>
        </Layout>
    )
}

export default withContext(IssueCreate);