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
        let tabletLandscape = tablet && landscape;

        let desktop = !mobile && !mobileLandscape && !tablet && !tabletLandscape;

        if(mobile || mobileLandscape || tablet || tabletLandscape) {
            window.onorientationchange = function() {
                let landscape = false;

                if(window.screen.orientation)
                    landscape = (window.screen.orientation.angle === 90 || window.screen.orientation.angle === 270);
                else if(window.orientation)
                    landscape = (window.orientation === 90 || window.orientation === -90);

                if((!mobileLandscape && landscape) || (mobileLandscape && !landscape) ||
                    (!tabletLandscape && landscape) || (tabletLandscape && !landscape))
                    window.location.reload();
            };
        }

        this.state = {
            mobile: mobile,
            mobileLandscape: mobileLandscape,
            tablet: tablet,
            tabletLandscape: tabletLandscape,
            desktop: desktop,
            drawerOpen: desktop || tabletLandscape,
            loadingComponents: []
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
                desktop: this.state.desktop,
                appIsLoading: this.state.loadingComponents.length > 0,
                resetLoadingComponents: this.resetLoadingComponents,
                registerLoadingComponent: this.registerLoadingComponent,
                unregisterLoadingComponent: this.unregisterLoadingComponent,
                isComponentRegistered: this.isComponentRegistered
            }}>
                {this.props.children}
            </AppContext.Provider>
        )
    }

    resetLoadingComponents = () => {
        console.log("reset loading components");
        
        this.setState({
            loadingComponents: []
        });
    };

    registerLoadingComponent = (component) => {
        let components = this.state.loadingComponents;
        components.push(component);

        console.log(component);
        console.log(components);
        console.log("\n");

        this.setState({
            loadingComponents: components
        });
    };

    unregisterLoadingComponent = (component) => {
        let components = this.state.loadingComponents;
        components = components.filter(c => c !== component);

        console.log(component);
        console.log(components);
        console.log("\n");

        this.setState({
            loadingComponents: components
        });
    };

    isComponentRegistered = (component) => {
        return this.state.loadingComponents.find(c => c === component);
    };

    handleLogin = (user) => {
        this.props.cookies.set('session', user);
    };

    handleLogout = () => {
        this.props.cookies.remove('session');
        window.location.reload();
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
