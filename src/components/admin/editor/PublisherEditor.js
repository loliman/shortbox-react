import {Field} from "formik";
import {Checkbox, TextField} from "formik-material-ui";
import {withSnackbar} from "notistack";
import React from "react";

function PublisherEditor(props) {
    return (
        <React.Fragment>
            <Field
                className="field"
                name="name"
                label="Name"
                component={TextField}
            />
            <br/>
            <Field
                name="original" label="Original Verlag?" component={Checkbox}
            />
        </React.Fragment>
    );
}

export default withSnackbar(PublisherEditor);