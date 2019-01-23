import React from 'react'
import {getHierarchyLevel} from "../../util/util";

export const AppContext = React.createContext();

class AppContextProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            lastSelected: [],
            drawerScrollTop: -1,
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
            selected: null,
            lastSelected: []
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

    handleNavigation = (e, back) => {
        let drawer = document.getElementById("drawer");
        let lastSelected = this.state.lastSelected.slice(0);

        if (drawer) {
            let drawerScrollEl = drawer.children[1];
            let drawerScrollTop = drawerScrollEl.scrollTop;

            let beforeLevel = getHierarchyLevel(this.state.selected);
            let afterLevel = getHierarchyLevel(e);
            let beforeIsIssue = beforeLevel.indexOf("issue_details") !== -1;
            let afterIsIssue = afterLevel.indexOf("issue_details") !== -1;

            let highlight = -1;
            if (!e)
                highlight = -1;
            else if (getHierarchyLevel(e).indexOf("issue_details" !== -1))
                highlight = e.id;
            else if (e.series)
                highlight = e.series.id;
            else if (e.publisher)
                highlight = e.publisher.id;

            if (beforeIsIssue && afterIsIssue)
                lastSelected = [];
            else if (!back) {
                if (getHierarchyLevel(e).indexOf("issue_details") === -1)
                    lastSelected.push({
                        drawerScrollTop: drawerScrollTop,
                        highlight: highlight
                    });
            } else
                lastSelected.pop();
        }

        this.setState(() => ({
            us: e && e.series ? e.series.publisher.us : this.state.us,
            selected: e,
            lastSelected: lastSelected,
            edit: null,
            drawerOpen: (window.innerWidth <= 600 && getHierarchyLevel(e).indexOf("issue_details") !== -1) ?
                false :
                this.state.drawerOpen
        }));
    };

    handleDrawerOpen = () => {
        let drawerScrollTop = this.state.drawerScrollTop;
        if (this.state.drawerOpen)
            drawerScrollTop = document.getElementById("drawer").children[1].scrollTop;
        else {
            window.requestAnimationFrame(() => {
                document.getElementById("drawer").children[1].scrollTop = this.state.drawerScrollTop;
                drawerScrollTop = -1;
            });
        }

        this.setState({
            drawerOpen: !this.state.drawerOpen,
            drawerScrollTop: drawerScrollTop
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