import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import TopBar from "./TopBar";
import {List} from "./List";
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import {AddFab, EditMenu} from "./admin/Admin";
import AppContext from "./generic/AppContext";
import Content from "./Content";

class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            openSpeedDial: false,
            editMenu: {
                anchorEl: null,
                item: null
            }
        };
    }

    render() {
        return (
            <AppContext cookies={this.props.cookies}>
                <div className="root">
                    <CssBaseline/>

                    <TopBar/>

                    <List handleMenuOpen={this.handleEditMenuOpen}
                          anchorEl={this.state.editMenu.anchorEl}/>

                    <div className="toolbar"/>

                    <Content drawerOpen={this.state.drawerOpen}/>

                    <AddFab/>
                    <EditMenu editMenu={this.state.editMenu}
                              handleOpen={this.handleEditMenuOpen}
                              handleClose={this.handleEditMenuClose}/>
                </div>
            </AppContext>
        );
    }

    handleEditMenuOpen = (e, item) => {
        this.setState({
            editMenu: {
                anchorEl: e.currentTarget,
                item: item
            }
        });
    };

    handleEditMenuClose = () => {
        this.setState({
            editMenu: {
                anchorEl: null,
                item: this.state.editMenu.item
            }
        });
    };
}

export default withCookies(App);