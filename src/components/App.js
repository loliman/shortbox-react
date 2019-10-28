import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import {withRouter} from "react-router";
import {compose} from "recompose";
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./Login";
import PublisherDetails from "./details/PublisherDetails";
import SeriesDetails from "./details/SeriesDetails";
import IssueCreate from "./restricted/create/IssueCreate";
import PublisherCreate from "./restricted/create/PublisherCreate";
import SeriesCreate from "./restricted/create/SeriesCreate";
import PublisherEdit from "./restricted/edit/PublisherEdit";
import SeriesEdit from "./restricted/edit/SeriesEdit";
import IssueEditor from "./restricted/edit/IssueEdit";
import Home from "./Home";
import AppContextProvider from "./generic/AppContext";
import IssueDetailsUS from "./details/IssueDetailsUS";
import IssueDetailsDE from "./details/IssueDetailsDE";
import Impress from "./Impress";
import Privacy from "./Privacy";
import Contact from "./Contact";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Filter from "./Filter";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: '#546e7a'
        },
    }
});

class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    render() {
        let session = this.props.cookies.get('session');

        return (
            <MuiThemeProvider theme={theme}>
                <AppContextProvider>
                    <CssBaseline/>

                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/de" />}/>

                        <Route exact path="/de" component={Home}/>
                        <Route exact path="/de/:publisher" component={PublisherDetails}/>
                        <Route exact path="/de/:publisher/:series" component={SeriesDetails}/>
                        <Route exact path="/de/:publisher/:series/:issue" component={IssueDetailsDE}/>
                        <Route exact path="/de/:publisher/:series/:issue/:variant" component={IssueDetailsDE}/>

                        <Route exact path="/us" component={Home}/>
                        <Route exact path="/us/:publisher" component={PublisherDetails}/>
                        <Route exact path="/us/:publisher/:series" component={SeriesDetails}/>
                        <Route exact path="/us/:publisher/:series/:issue" component={IssueDetailsUS}/>
                        <Route exact path="/us/:publisher/:series/:issue/:variant" component={IssueDetailsUS}/>

                        <Route exact path="/filter/de" component={Filter}/>
                        <Route exact path="/filter/us" component={Filter}/>

                        <Route exact path="/login" component={Login}/>

                        <Route exact path="/contact" component={Contact}/>
                        <Route exact path="/impress" component={Impress}/>
                        <Route exact path="/privacy" component={Privacy}/>

                        <PrivateRoute exact session={session} path="/create/publisher" component={PublisherCreate}/>
                        <PrivateRoute exact session={session} path="/create/series" component={SeriesCreate}/>
                        <PrivateRoute exact session={session} path="/create/issue" component={IssueCreate}/>

                        <PrivateRoute exact session={session} path="/edit/de/:publisher" component={PublisherEdit}/>
                        <PrivateRoute exact session={session} path="/edit/de/:publisher/:series" component={SeriesEdit}/>
                        <PrivateRoute exact session={session} path="/edit/de/:publisher/:series/:issue" component={IssueEditor}/>
                        <PrivateRoute exact session={session} path="/edit/de/:publisher/:series/:issue/:variant" component={IssueEditor}/>

                        <PrivateRoute exact session={session} path="/edit/us/:publisher" component={PublisherEdit}/>
                        <PrivateRoute exact session={session} path="/edit/us/:publisher/:series" component={SeriesEdit}/>
                        <PrivateRoute exact session={session} path="/edit/us/:publisher/:series/:issue" component={IssueEditor}/>
                        <PrivateRoute exact session={session} path="/edit/us/:publisher/:series/:issue/:variant" component={IssueEditor}/>

                        <Route render={() => <Redirect to="/de" />} />
                    </Switch>
                </AppContextProvider>
            </MuiThemeProvider>
        );
    }
}

function PrivateRoute({ component: Component, session, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                return session ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }}
        />
    );
}

export default compose(
    withRouter,
    withCookies
)(App);
