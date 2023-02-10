import Card from "@material-ui/core/Card/Card";
import React from "react";
import TopBar from "./TopBar";
import List from "./List";
import {withContext} from "./generic";
import AddFab from "./restricted/AddFab";
import Typography from "@material-ui/core/Typography";
import {Mutation, withApollo} from "react-apollo";
import {logout} from "../graphql/mutations";
import Cookies from "./Cookies";
import {generateUrl} from "../util/hierarchy";

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openSpeedDial: false
        };
    }

    render() {
        const {us, children, drawerOpen, session} = this.props;

        return(
            <React.Fragment>
                <TopBar/>

                <div id="main">
                    <List/>

                    <div id="content" className={drawerOpen ? 'content-show' : 'content-hide'} onScroll={e => this.props.handleScroll ? this.props.handleScroll(e) : false}>
                        <Card id="contentBg">
                            <div id="contentChildren">
                                {children}
                            </div>

                            <div id="footer">
                                <Typography>
                                    <span className="spanLink"
                                          onMouseDown={(e) => this.props.navigate(e, "/contact")}>Kontakt
                                        {!this.props.mobile || this.props.mobileLandscape ? "/Fehler melden/Unterstützen" : ""}
                                    </span>
                                    <span className="spanDif">|</span>
                                    <span className="spanLink"
                                          onMouseDown={(e) => this.props.navigate(e, "/impress")}>Impressum</span>
                                    <span className="spanDif">|</span>
                                    <span className="spanLink"
                                          onMouseDown={(e) => this.props.navigate(e, "/privacy")}>Datenschutz</span>
                                    <span className="spanDif">|</span>
                                    <span className="spanLink"
                                          onMouseDown={(e) => {
                                              if(this.props.cookies.get("newDesign") === "true")
                                                  this.props.cookies.set("newDesign", "false");
                                              else
                                                  this.props.cookies.set("newDesign", "true");

                                              this.props.navigate(e, generateUrl(this.props.selected, this.props.us),
                                                  {
                                                      filter: this.props.query ? this.props.query.filter : null,
                                                      order: this.props.query ? this.props.query.order : null,
                                                      direction: this.props.query ? this.props.query.direction : null
                                                  })
                                          }}>Zu {this.props.cookies.get("newDesign") === "true" ? 'altem' : 'neuem'} Design wechseln</span>
                                    <span className="spanDif">|</span>
                                    {
                                        !session ? <LogIn {...this.props}/> : <LogOut {...this.props}/>
                                    }

                                </Typography>
                            </div>
                        </Card>
                    </div>

                    <Cookies/>
                    <AddFab us={us}/>
                </div>
            </React.Fragment>
        );
    }
}

function LogIn(props) {
    return (
        <span className="spanLink"
                onMouseDown={(e) => props.navigate(e, "/login")}>
            Login
        </span>
    );
}

function LogOut(props) {
    const {session, enqueueSnackbar, handleLogout} = props;

    return (
        <Mutation mutation={logout}
                  onCompleted={(data) => {
                      if (!data.logout)
                          enqueueSnackbar("Logout fehlgeschlagen", {variant: 'error'});
                      else {
                          enqueueSnackbar("Auf Wiedersehen!", {variant: 'success'});
                          props.client.resetStore();
                          handleLogout();
                      }
                  }}
                  onError={(errors) => {
                      let message = (errors.graphQLErrors && errors.graphQLErrors.length > 0) ? ' [' + errors.graphQLErrors[0].message + ']' : '';
                      enqueueSnackbar("Logout fehlgeschlagen" + message, {variant: 'error'});
                  }}
                  ignoreResults>
            {(logout) => (
                <span className="spanLink" onMouseDown={(e) => {
                    logout({
                        variables: {
                            user: {
                                id: parseInt(session.id),
                                sessionid: session.sessionid
                            }
                        }
                    })
                }}>
                    Logout
                </span>
            )}
        </Mutation>
    );
}

export default withApollo(withContext(Layout));
