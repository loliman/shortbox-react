import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/Error";
import Typography from "@material-ui/core/es/Typography/Typography";

export class QueryResult extends React.Component {
    render() {
        const {loading, error} = this.props;

        if (loading)
            return <div className="queryResult"><CircularProgress/><Typography
                className="queryResultText">Lade...</Typography></div>;
        if (error)
            return <div className="queryResult"><ErrorIcon fontSize="large"/><Typography
                className="queryResultText">Fehler</Typography></div>;

        return "";
    }
}