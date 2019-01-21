import {AppContext} from "./generic/AppContext";
import Card from "@material-ui/core/Card/Card";
import {Details} from "./details/Details";
import React from "react";
import Editor from "./admin/editor/Editor";

export default function Content(props) {
    return (
        <AppContext.Consumer>
            {({context, handleEdit}) => (
                <main className={!context.drawerOpen ? 'content contentShift' : 'content'}>
                    <Card>
                        {
                            context.edit ?
                                <Editor context={context} handleEdit={handleEdit} /> :
                                <Details context={context}/>
                        }
                    </Card>
                </main>
            )}
        </AppContext.Consumer>
    );
}