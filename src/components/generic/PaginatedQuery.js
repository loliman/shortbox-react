import {Query} from "react-apollo";
import React from "react";

class PaginatedQuery extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: false,
            hasMore: true
        };
    }

    render() {
        return (
            <Query query={this.props.query} variables={this.props.variables}
                   onCompleted={this.props.onCompleted}
                   onError={this.props.onCompleted}
                   notifyOnNetworkStatusChange>
                {({loading, error, data, fetchMore}) => {
                    let queryName = this.props.query.definitions[0].name.value;
                    queryName = queryName[0].toLowerCase() + queryName.slice(1);
                    let offset = (data && data[queryName]) ? data[queryName].length : 0;

                    let fetchMoreVars = JSON.parse(JSON.stringify(this.props.variables));
                    fetchMoreVars.offset = offset;

                    return this.props.children({
                        ...this.props,
                        loading: loading,
                        error: error,
                        data: data,
                        fetching: this.state.fetching,
                        hasMore: this.state.hasMore,
                        fetchMore: (e => this.fetchMoreOnScroll(e,
                            () => fetchMore({
                                variables: fetchMoreVars,
                                updateQuery: (prev, {fetchMoreResult}) => {
                                    if (!fetchMoreResult) return prev;

                                    this.setState({
                                        fetching: false
                                    });

                                    if(fetchMoreResult[queryName].length === 0)
                                        this.setState({
                                            hasMore: false
                                        });

                                    let src2 = {};

                                    if(prev)
                                        src2[queryName] = [...prev[queryName], ...fetchMoreResult[queryName]];

                                    return Object.assign({}, prev, src2);
                                }
                            })
                        ))
                    });
                }}
            </Query>
        );   
    }

    fetchMoreOnScroll = (e, reload) => {
        let element = e.target;

        if (element.scrollHeight - element.scrollTop <= element.clientHeight && this.state.hasMore) {
            reload();

            this.setState({
                fetching: true
            });
        }
    };
}

export default PaginatedQuery;
