import React from 'react'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {generateLabel, getSelected} from "../../util/hierarchy";
import {withRouter} from "react-router-dom";
import Layout from "../Layout";
import {Query} from "react-apollo";
import QueryResult from "../generic/QueryResult";
import {seriesd} from "../../graphql/queries";
import Typography from "@material-ui/core/es/Typography/Typography";
import EditButton from "../restricted/EditButton";

function SeriesDetails(props) {
    let selected = getSelected(props.match.params);

    return (
        <Layout>
            <Query query={seriesd} variables={selected}>
                {({loading, error, data}) => {
                    if (loading || error || !data.seriesd)
                        return <QueryResult loading={loading} error={error} data={data.seriesd} selected={selected}/>;

                    return(
                        <React.Fragment>
                            <CardHeader title={generateLabel(data.seriesd)}
                                        action={<EditButton item={data.seriesd}/>}/>

                            <CardContent className="cardContent">
                                <Typography dangerouslySetInnerHTML={{__html: data.seriesd.addinfo}} />
                            </CardContent>
                        </React.Fragment>
                    );
                }}
            </Query>
        </Layout>
    )
}

export default withRouter(SeriesDetails);