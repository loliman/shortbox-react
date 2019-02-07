import React from 'react'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {withRouter} from "react-router-dom";
import Layout from "../Layout";
import {Query} from "react-apollo";
import QueryResult from "../generic/QueryResult";
import {publisher} from "../../graphql/queries";
import {generateLabel} from "../../util/util";
import {getSelected} from "../../util/hierarchiy";

function PublisherDetails(props) {
    let selected = getSelected(props.match.params);
    let variables = {
        publisher_name: selected.name
    };

    return (
        <Layout>
            <Query query={publisher} variables={variables}>
                {({loading, error, data}) => {
                    if (loading || error || !data.publisher)
                        return <QueryResult loading={loading} error={error} data={data.publisher} selected={selected}/>;

                    return (
                        <React.Fragment>
                            <CardHeader title={generateLabel(data.publisher)}/>

                            <CardContent className="cardContent">

                            </CardContent>
                        </React.Fragment>
                    );
                }}
            </Query>
        </Layout>
    )
}

export default withRouter(PublisherDetails);