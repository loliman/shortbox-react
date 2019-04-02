import Card from "@material-ui/core/Card/Card";
import React from "react";
import TopBar from "./TopBar";
import List from "./List";
import {withContext} from "./generic";
import AddFab from "./restricted/AddFab";
import Typography from "@material-ui/core/Typography";

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openSpeedDial: false,
        };
    }

    render() {
        const {us, children, drawerOpen} = this.props;

        return(
            <React.Fragment>
                <TopBar/>

                <List/>

                <main className={drawerOpen ? 'content' : 'contentShift'}>
                    <Card>
                        {children}
                    </Card>

                    <Typography className="footer">
                        <span className="spanLink"
                              onClick={() => this.props.history.push("/contact")}>Kontakt/Fehler melden/Unterstützen</span> | &nbsp;
                        <span className="spanLink"
                              onClick={() => this.props.history.push("/impress")}>Impressum</span> | &nbsp;
                        <span className="spanLink"
                              onClick={() => this.props.history.push("/privacy")}>Datenschutz</span>
                    </Typography>
                </main>

                <AddFab us={us}/>

            </React.Fragment>
        );
    }
}

export default withContext(Layout);