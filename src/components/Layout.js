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

                <div id="main">
                    <List/>

                    <div id="content" className={drawerOpen ? 'content-show' : 'content-hide'}>
                        <Card>
                            {children}


                            <br />
                            <br />
                            <br />
                        </Card>
                    </div>

                    <AddFab us={us}/>
                </div>

                <div id="footer">
                    <Typography>
                        <span className="spanLink"
                              onClick={() => this.props.history.push("/contact")}>Kontakt/Fehler melden
                            {!this.props.mobile || this.props.mobileLandscape ? "/Unterstützen" : ""}
                        </span>|
                        <span className="spanLink"
                              onClick={() => this.props.history.push("/impress")}>Impressum</span>|
                        <span className="spanLink"
                              onClick={() => this.props.history.push("/privacy")}>Datenschutz</span>
                    </Typography>
                </div>
            </React.Fragment>
        );
    }
}

export default withContext(Layout);