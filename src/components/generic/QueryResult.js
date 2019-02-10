import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/Error";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/es/Typography/Typography";
import {generateLabel} from "../../util/util";

export default function QueryResult(props) {
    const {loading, error, data, selected} = props;

        if (loading)
            return <div className="queryResult"><CircularProgress className="circularProgress"/><Typography
                className="queryResultText">Lade...</Typography></div>;
        if (error)
            return <div className="queryResult"><ErrorIcon fontSize="large"/><Typography
                className="queryResultText">Fehler</Typography></div>;
    if (!data)
        return <div className="queryResult"><SearchIcon fontSize="large"/><Typography
            className="queryResultText">{generateLabel(selected)} nicht gefunden</Typography></div>;

    return null;
}