import Card from "@material-ui/core/Card/Card";
import React from "react";
import TopBar from "./TopBar";
import List from "./List";
import EditDropdown from "./restricted/Dropdown";
import {withContext} from "./generic";
import AddFab from "./restricted/AddFab";

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openSpeedDial: false,
            EditDropdown: {
                anchorEl: null,
                item: null
            }
        };
    }

    render() {
        const {us, children, drawerOpen} = this.props;

        return(
            <React.Fragment>
                <TopBar/>

                <List handleMenuOpen={this.handleEditDropdownOpen}
                      anchorEl={this.state.EditDropdown.anchorEl}/>

                <main className={drawerOpen ? 'content' : 'contentShift'}>
                    <Card>
                        {children}
                    </Card>
                </main>

                <AddFab us={us}/>
                <EditDropdown EditDropdown={this.state.EditDropdown}
                          handleOpen={this.handleEditDropdownOpen}
                          handleClose={this.handleEditDropdownClose}/>
            </React.Fragment>
        );
    }

    handleEditDropdownOpen = (e, item) => {
        this.setState({
            EditDropdown: {
                anchorEl: e.currentTarget,
                item: item
            }
        });
    };

    handleEditDropdownClose = () => {
        this.setState({
            EditDropdown: {
                anchorEl: null,
                item: this.state.EditDropdown.item
            }
        });
    };
}

export default withContext(Layout);