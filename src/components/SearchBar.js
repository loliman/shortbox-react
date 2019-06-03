import React from "react";
import {Form, Formik} from "formik";
import {search} from "../graphql/queries";
import {withContext} from "./generic";
import AutoComplete from "./generic/AutoComplete";
import SearchIcon from '@material-ui/icons/Search';

class SearchBar extends React.Component {
    render() {
        const {navigate, mobile, tablet, tabletLandscape, us} = this.props;
        return <div id="headerSearch" className={this.props.focus ? "headerSearchFocused" : ""}>
             <Formik initialValues={{pattern: ""}}
                           onSubmit={false}>
                {({values, setFieldValue}) => {
                    return (
                        <Form>
                            <AutoComplete
                                query={search}
                                liveSearch
                                name="pattern"
                                placeholder={mobile || (tablet && !tabletLandscape) ? " " : "Suchen"}
                                variant="outlined"
                                onFocus={(e) => this.onFocus(e, true)}
                                onBlur={(e) => mobile || (tablet && !tabletLandscape) ? null : this.onFocus(e, false)}
                                variables={{pattern: values.pattern, us: us}}
                                onChange={(node, live) => {
                                    if(!node)
                                        return;

                                    if(live)
                                        setFieldValue("pattern", node);
                                    else {
                                        setFieldValue("pattern", "");
                                        window.focus();
                                        if (document.activeElement) {
                                            document.activeElement.blur();
                                        }
                                        this.onFocus(null, false);
                                        navigate(node.url, us);
                                    }

                                }}
                                dropdownIcon={<SearchIcon />}
                                style={{
                                    width: "100%",
                                    paddingRight: '0'
                                }}
                                generateLabel={(node) => getNodeType(node) + node.label}
                            />
                        </Form>
                    );
                }}
            </Formik>
        </div>
    }

    onFocus = (e, focus) => {
        this.props.onFocus(e, focus);
    }
}

function getNodeType(node) {
    switch (node.type) {
        case "Publisher":
            return "!!Verlag!!";
        case "Series":
            return "!!Serie!!";
        default:
            return "!!Ausgabe!!";
    }
}

export default withContext(SearchBar);