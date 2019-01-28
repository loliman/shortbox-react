import React from 'react'
import {withRouter} from "react-router-dom";
import {withCookies} from "react-cookie";
import {compose} from "recompose";

export const AppContext = React.createContext();

class AppContextProvider extends React.Component {
    constructor(props) {
        super(props);

        let mobile = window.innerWidth <= 600;
        this.state = {
            mobile: mobile,
            drawerOpen: !mobile
        };
    }

    render() {
        return (
            <AppContext.Provider value={{
                context: this.state,

                drawerOpen: this.state.drawerOpen,
                toogleDrawer: this.toogleDrawer,
                session: this.props.cookies.get('session'),
                handleLogin: this.handleLogin,
                handleLogout: this.handleLogout,
                mobile: this.state.mobile
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
