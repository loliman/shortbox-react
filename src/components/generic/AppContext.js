import React from 'react'
import {withRouter} from "react-router-dom";
import {withCookies} from "react-cookie";
import {compose} from "recompose";

export const AppContext = React.createContext();

class AppContextProvider extends React.Component {
    constructor(props) {
        super(props);
        let landscape = false;

        if(window.screen.orientation)
            landscape = (window.screen.orientation.angle === 90 || window.screen.orientation.angle === 270);
        else if(window.orientation)
            landscape = (window.orientation === 90 || window.orientation === -90);

        let width = window.innerWidth;

        let mobile = (!landscape ? (width >= 320 && width <= 480) : (width >= 481 && width <= 861));
        let tablet = (!landscape ? (width >= 768 && width <= 1024) : (width >= 861 && width <= 1024));

        let mobileLandscape = mobile && landscape;
        let tableLandscape = tablet && landscape;

        let desktop = !mobile && !mobileLandscape && !tablet && !tableLandscape;

        if(mobile || mobileLandscape) {
            window.onorientationchange = function() {
                let landscape = false;

                if(window.screen.orientation)
                    landscape = (window.screen.orientation.angle === 90 || window.screen.orientation.angle === 270);
                else if(window.orientation)
                    landscape = (window.orientation === 90 || window.orientation === -90);

                if((!mobileLandscape && landscape) || (mobileLandscape && !landscape))
                    window.location.reload();
            };
        }

        this.state = {
            mobile: mobile,
            mobileLandscape: mobileLandscape,
            tablet: tablet,
            tabletLandscape: tableLandscape,
            desktop: desktop,
            drawerOpen: !mobile || mobileLandscape
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
