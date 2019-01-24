import React from 'react'
import {getHierarchyLevel} from "../../util/util";

export const AppContext = React.createContext();

class AppContextProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,

            edit: null,

            session: props.cookies.get('session'),
            drawerOpen: window.innerWidth > 600
        };
    }

    render() {
        return (
            <AppContext.Provider value={{
                context: this.state,
                handleLogin: this.handleLogin,
                handleLogout: this.handleLogout,
                handleNavigation: this.handleNavigation,
                toogleDrawer: this.toogleDrawer,
                handleAdd: this.handleAdd,
                handleEdit: this.handleEdit
            }}>
                {this.props.children}
            </AppContext.Provider>
        )
    }

    handleLogin = (user) => {
        this.props.cookies.set('session', user);
        this.setState(() => ({
            session: user
        }))
    };

    handleLogout = () => {
        this.props.cookies.remove('session');
        this.setState(() => ({
            session: null
        }))
    };

    handleNavigation = (e, back) => {
        this.setState(() => ({
            selected: e,
            edit: null,
            drawerOpen: (window.innerWidth <= 600 && getHierarchyLevel(e).indexOf("issue_details") !== -1) ?
                false :
                this.state.drawerOpen
        }));
    };

    toogleDrawer = () => {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    };

    handleEdit = (e) => {
        this.setState(() => ({
            edit: e,
            drawerOpen: window.innerWidth > 600 ? this.state.drawerOpen : !this.state.drawerOpen
        }));
    };

    handleAdd = (e) => {
        this.setState(() => ({
            edit: e
        }));
    };
}

export default AppContextProvider