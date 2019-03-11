import React from 'react'
import Layout from "../../Layout";
import {createPublisher} from "../../../graphql/mutations";
import {withContext} from "../../generic";
import PublisherEditor from "../editor/PublisherEditor";

function PublisherCreate(props) {
    return (
        <Layout>
            <PublisherEditor mutation={createPublisher}/>
        </Layout>
    )
}

export default withContext(PublisherCreate);