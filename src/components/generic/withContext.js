import React from 'react';
import {compose} from "recompose";
import {withSnackbar} from "notistack";
import {withLastLocation} from "react-router-last-location";
import {withRouter} from "react-router-dom";
import {AppContext} from "./AppContext";
import {generateLabel, getHierarchyLevel, getSelected, HierarchyLevel} from "../../util/hierarchy";
import * as queryString from "query-string";

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withContext(WrappedComponent) {
    const WithContext = props => (
        <AppContext.Consumer>
            {(context) => {
                let us = props.match.url.indexOf("/us") === 0 || props.match.url.indexOf("/edit/us") === 0 || props.match.url.indexOf("/filter/us") === 0;
                let selected = getSelected(props.match.params, us);
                let currentQuery = props.location.search ? queryString.parse(props.location.search) : null;

                let params = {
                    edit: props.match.url.indexOf("/edit") === 0,
                    create: props.match.url.indexOf("/create") === 0,
                    us: us,
                    selected: selected,
                    query: currentQuery,
                    level: getHierarchyLevel(selected),
                    navigate: (url, query) => navigate(props, url, query, currentQuery)
                };

                document.title = createAppTitle(params, props.match.url);

                return (
                    <WrappedComponent {...params} {...context} {...props} />
                );
            }}
        </AppContext.Consumer>
    );

    WithContext.displayName = `WithContext(${getDisplayName(WrappedComponent)})`;

    return compose(
        withSnackbar,
        withLastLocation,
        withRouter
    )(WithContext);
}

function navigate(props, url, query, currentQuery) {
    let lastUrl = props.location ? props.location.pathname : null;
    let q = currentQuery ? currentQuery : {};

    if(query) {
        for (let p in query) {
            if (query.hasOwnProperty(p)) {
                q[p] = query[p] ? query[p] : undefined;
            }
        }
    }

    props.history.push((lastUrl === url && query === currentQuery ? (props.us ? "/us" : "/de") : url) + "?" + queryString.stringify(q));
}

function createAppTitle(params, url) {
    let title;
    if(params.edit)
        title = generateLabel(params.selected) + " bearbeiten";
    else if(params.create) {
        if (url.indexOf("/issue") !== -1)
            title = "Ausgabe";
        else if (url.indexOf("/series") !== -1)
            title = "Serie";
        else
            title = "Verlag";

        title += " erstellen";
    } else {
        title = generateLabel(params.selected);
    }

    if(params.us)
        title += " [US]";

    if(params.level !== HierarchyLevel.ROOT || params.edit || params.create)
        title += " - Shortbox";

    return title;
}

export default withContext;