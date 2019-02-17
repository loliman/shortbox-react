import React from 'react';
import {compose} from "recompose";
import {withSnackbar} from "notistack";
import {withLastLocation} from "react-router-last-location";
import {withRouter} from "react-router-dom";
import {AppContext} from "./AppContext";
import {generateLabel, getHierarchyLevel, getSelected, HierarchyLevel} from "../../util/hierarchy";

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withContext(WrappedComponent) {
    const WithContext = props => (
        <AppContext.Consumer>
            {(context) => {
                let edit =  props.match.url.indexOf("/edit") === 0;
                let us = props.match.url.indexOf("/us") === 0;
                let selected = getSelected(props.match.params, us);
                let level = getHierarchyLevel(selected);

                let title = generateLabel(selected);
                if(level !== HierarchyLevel.ROOT)
                    title += " - Shortbox";
                document.title = title;

                return (
                    <WrappedComponent us={us} edit={edit}
                                      selected={selected} level={level}
                                      {...context} {...props} />
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

export default withContext;