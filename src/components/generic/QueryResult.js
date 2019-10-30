import React from 'react';
import ErrorIcon from "@material-ui/icons/Error";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/es/Typography/Typography";
import {generateLabel} from "../../util/hierarchy";
import CircularProgress from "@material-ui/core/CircularProgress";
import withContext from "./withContext";

function QueryResult(props) {
    let {appIsLoading, error, data, selected} = props;

    if (appIsLoading) {
        if(props.placeholder && props.placeholderCount) {
            let placeholder = [];

            for(let i = 0; i < props.placeholderCount; i++)
                placeholder.push(React.cloneElement(props.placeholder, {
                    key: i
                }));

            return placeholder;
        } else
            return <div className="queryResult"><CircularProgress className="circularProgress"/><Typography
                className="queryResultText">Lade...</Typography></div>;
    }

    if (error || (data && data.errors))
        return <div className="queryResult"><ErrorIcon fontSize="large"/><Typography
            className="queryResultText">Fehler</Typography></div>;

    if (!data)
        return <div className="queryResult"><SearchIcon fontSize="large"/><Typography
            className="queryResultText">{generateLabel(selected)} nicht gefunden</Typography></div>;

    return null;
}

export default withContext(QueryResult);
