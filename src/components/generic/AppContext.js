import React from 'react'
import {getHierarchyLevel} from "../../util/util";

export const AppContext = React.createContext();

class AppContextProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            edit: null,
            us: false,
            session: props.cookies.get('session'),
            drawerOpen: window.innerWidth > 600
        };
    }

    render() {
        return (
            <AppContext.Provider value={{
                context: this.state,
                toogleUs: this.toogleUs,
                handleLogin: this.handleLogin,
                handleLogout: this.handleLogout,
                handleNavigation: this.handleNavigation,
                handleDrawerOpen: this.handleDrawerOpen,
                handleAdd: this.handleAdd,
                handleEdit: this.handleEdit
            }}>
                {this.props.children}
            </AppContext.Provider>
        )
    }

    toogleUs = () => {
        this.setState(() => ({
            us: !this.state.us,
            selected: null
        }));
    };

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

    handleNavigation = (e) => {
        this.setState(() => ({
            us: e && e.series ? e.series.publisher.us : this.state.us,
            selected: e,
            edit: null,
            drawerOpen: (window.innerWidth <= 600 && getHierarchyLevel(e).indexOf("issue_details") !== -1) ?
                false :
                this.state.drawerOpen
        }));
    };

    handleDrawerOpen = () => {
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