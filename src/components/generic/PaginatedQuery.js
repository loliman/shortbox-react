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

    componentDidUpdate(prevProps, prevState, snapshot) {
        let vars = JSON.stringify(this.props.variables);
        let oldvars = JSON.stringify(prevProps.variables);

        if(oldvars !== vars) {
            this.setState({
                hasMore: true
            })
        }
    }

    render() {
        this.props.variables.offset = 0;
        if(!this.props.variables.pattern)
            this.props.variables.pattern = "";

        return (
            <Query query={this.props.query} variables={this.props.variables}
                   onCompleted={this.props.onCompleted}
                   onError={this.props.onCompleted}
                   notifyOnNetworkStatusChange>
                {({loading, error, data, fetchMore}) => {
                    let queryName = this.props.query.definitions[0].name.value;
                    queryName = queryName[0].toLowerCase() + queryName.slice(1);
                    let offset = (data && data[queryName]) ? data[queryName].length : 0;

                    let fetchMoreVars = {};
                    if(this.props.variables)
                        fetchMoreVars = JSON.parse(JSON.stringify(this.props.variables));
                    fetchMoreVars.offset = offset ? offset : 0;
                    if(!fetchMoreVars.pattern)
                        fetchMoreVars.pattern = "";

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
