import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import TopBar from "./TopBar";
import {TypeList} from "./TypeList";
import {Details} from "./Details";
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import {AddFab, EditMenu} from "./Admin";
import AppContext from "./AppContext";
import PublisherEdit from "./Edit";

class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        this.handleEditMenuOpen = this.handleEditMenuOpen.bind(this);
        this.handleEditMenuClose = this.handleEditMenuClose.bind(this);

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

                    <TypeList handleMenuOpen={this.handleEditMenuOpen}
                              anchorEl={this.state.editMenu.anchorEl}/>

                    <div className="toolbar"/>

                    <Details drawerOpen={this.state.drawerOpen}/>

                    <PublisherEdit/>

                    <AddFab/>
                    <EditMenu editMenu={this.state.editMenu}
                              handleOpen={this.handleEditMenuOpen}
                              handleClose={this.handleEditMenuClose}/>
                </div>
            </AppContext>
        );
    }

    handleEditMenuOpen(e, item) {
        this.setState({
            editMenu: {
                anchorEl: e.currentTarget,
                item: item
            }
        });
    };

    handleEditMenuClose() {
        this.setState({
            editMenu: {
                anchorEl: null,
                item: this.state.editMenu.item
            }
        });
    }
}

export default withCookies(App);