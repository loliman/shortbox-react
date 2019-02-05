import React from 'react';
import {compose} from "recompose";
import {withSnackbar} from "notistack";
import {withLastLocation} from "react-router-last-location";
import {withRouter} from "react-router-dom";
import {AppContext} from "./AppContext";
import {getHierarchyLevel} from "../../util/hierarchiy";
import {getSelected} from "../../util/hierarchiy";
import {generateLabel} from "../../util/util";

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withContext(WrappedComponent) {
    const WithContext = props => (
        <AppContext.Consumer>
            {(context) => {
                let edit =  props.match.url.indexOf("/edit") === 0;
                let us = props.match.url.indexOf("/us") === 0;
                let selected = getSelected(props.match.params);
                let level = getHierarchyLevel(selected, edit);

                document.title = generateLabel(selected);

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