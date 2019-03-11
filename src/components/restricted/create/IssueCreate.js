import React from 'react'
import Layout from "../../Layout";
import {createIssue} from "../../../graphql/mutations";
import {withContext} from "../../generic";
import IssueEditor from "../editor/IssueEditor";

function IssueCreate(props) {
    return (
        <Layout>
            <IssueEditor mutation={createIssue}/>
        </Layout>
    )
}

export default withContext(IssueCreate);