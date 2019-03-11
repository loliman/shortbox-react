import React from 'react'
import Layout from "../../Layout";
import {createSeries} from "../../../graphql/mutations";
import {withContext} from "../../generic";
import SeriesEditor from "../editor/SeriesEditor";

function SeriesCreate(props) {
    return (
        <Layout>
            <SeriesEditor mutation={createSeries}/>
        </Layout>
    )
}

export default withContext(SeriesCreate);