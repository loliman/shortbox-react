import React from 'react'
import {withRouter} from "react-router-dom";
import {withCookies} from "react-cookie";
import {compose} from "recompose";

export const AppContext = React.createContext();

class AppContextProvider extends React.Component {
    constructor(props) {
        super(props);
        let mobile = window.innerWidth <= 600;
        let mobileLandscape = (window.innerWidth <= 767 && window.screen.orientation
            && (window.screen.orientation.angle === 90 || window.screen.orientation.angle === 180));

        let tablet = window.innerWidth <= 1024;
        let tableLandscape = (window.innerWidth <= 1024 && window.screen.orientation
            && (window.screen.orientation.angle === 90 || window.screen.orientation.angle === 180));

        let desktop = !mobile && !mobileLandscape && !tablet && !tableLandscape;

        this.state = {
            mobile: mobile,
            mobileLandscape: mobileLandscape,
            tablet: tablet,
            tabletLandscape: tableLandscape,
            desktop: desktop,
            drawerOpen: !mobile
        };
    }

    render() {
        return (
            <AppContext.Provider value={{
                drawerOpen: this.state.drawerOpen,
                toogleDrawer: this.toogleDrawer,
                session: this.props.cookies.get('session'),
                handleLogin: this.handleLogin,
                handleLogout: this.handleLogout,
                mobile: this.state.mobile,
                mobileLandscape: this.state.mobileLandscape,
                tablet: this.state.tablet,
                tabletLandscape: this.state.tabletLandscape,
                desktop: this.state.desktop
            }}>
                {this.props.children}
            </AppContext.Provider>
        )
    }

    handleLogin = (user) => {
        this.props.cookies.set('session', user);
    };

    handleLogout = () => {
        this.props.cookies.remove('session');
    };


    toogleDrawer = () => {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    };
}

export default compose(
    withCookies,
    withRouter
)(AppContextProvider);
