import React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {generateLabel, generateUrl, HierarchyLevel} from "../../util/hierarchy";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Typography from "@material-ui/core/es/Typography/Typography";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import DeletionDialog from "./DeletionDialog";
import {withContext} from "../generic";
import {updateInCache} from "./editor/Editor";
import {Mutation} from "react-apollo";
import {issue} from "../../graphql/queries";
import {verifyIssue} from "../../graphql/mutations";
import {stripItem, wrapItem} from "../../util/util";

class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deletionOpen: false
        }
    }

    render() {
        if (!this.props.EditDropdown.item || !this.props.session)
            return null;

        let canDelete = true;

        if(this.props.level === HierarchyLevel.ISSUE && this.props.EditDropdown.item.series.publisher.us) {
            this.props.EditDropdown.item.stories.forEach(story => {
                if(canDelete)
                    canDelete = story.children.length === 0;
            })
        }

        return (
            <ClickAwayListener onClickAway={this.props.handleClose}>
                <div>
                    <Menu
                        id="long-menu"
                        anchorEl={this.props.EditDropdown.anchorEl}
                        open={this.props.EditDropdown.anchorEl !== null}
                        onClose={() => this.props.handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: 200,
                            },
                        }}>

                        {
                            this.props.level === HierarchyLevel.ISSUE ?
                                <VerifyMenuItem item={this.props.EditDropdown.item}
                                                enqueueSnackbar={this.props.enqueueSnackbar} /> : null
                        }

                        <MenuItem key="edit"
                                  onClick={() => {
                                      let us = false;
                                      switch (this.props.level) {
                                          case HierarchyLevel.ISSUE:
                                              us = this.props.EditDropdown.item.series.publisher.us;
                                              break;
                                          case HierarchyLevel.SERIES:
                                              us = this.props.EditDropdown.item.publisher.us;
                                              break;
                                          default:
                                              us = this.props.EditDropdown.item.us;
                                      }

                                      this.props.history.push("/edit" + generateUrl(this.props.EditDropdown.item, us));
                                      if(this.props.mobile && !this.props.mobileLandscape)
                                          this.props.toogleDrawer();
                                      this.props.handleClose();
                                  }}>
                            <ListItemIcon>
                                <EditIcon/>
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                Bearbeiten
                            </Typography>
                        </MenuItem>

                        <MenuItem disabled={!canDelete} key="delete" onClick={() => this.handleDelete()}>
                            <ListItemIcon>
                                <DeleteIcon/>
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                Löschen
                            </Typography>
                        </MenuItem>
                    </Menu>

                    <DeletionDialog handleClose={this.handleDeletionClose}
                                    open={this.state.deletionOpen}
                                    item={this.props.EditDropdown.item}/>
                </div>
            </ClickAwayListener>
        );
    }

    handleDelete = () => {
        this.setState({
            deletionOpen: true
        });

        this.props.handleClose();
    };

    handleDeletionClose = () => {
        this.setState({
            deletionOpen: false
        })
    };
}

function VerifyMenuItem(props) {
    let item = stripItem(JSON.parse(JSON.stringify(props.item)));
    let variables = {};
    variables.number = item.number;
    variables.series = item.series;
    variables.series.publisher.us = undefined;
    variables.format = item.format;
    if(item.variant !== "") {
        variables.variant = item.variant;
    }

    return (
        <Mutation mutation={verifyIssue}
                  update={(cache, result) => {
                      let update = JSON.parse(JSON.stringify(props.item));
                      update.verified = !update.verified;

                      try {
                        updateInCache(cache, issue, wrapItem(variables), item, {issue: update});
                      } catch (e) {
                        //ignore cache exception;
                      }
                  }}
                  onCompleted={(data) => {
                      props.enqueueSnackbar(generateLabel(item) + " erfolgreich " + (item.verified ? "falsifiziert" : "verifiziert"), {variant: 'success'});
                  }}
                  onError={(errors) => {
                      let message = (errors.graphQLErrors && errors.graphQLErrors.length > 0) ? ' [' + errors.graphQLErrors[0].message + ']' : '';
                      props.enqueueSnackbar("Ausgabe konnte nicht " + (item.verified ? "falsifiziert" : "verifiziert") + " werden" + message, {variant: 'error'});
                  }}>
            {(verifyIssue, {error}) => (
                <MenuItem key="verify" onClick={() => {
                    verifyIssue({
                        variables: {
                            item: variables
                        }
                    })
                }}>
                    <ListItemIcon>
                        {item.verified ? <CheckCircleIcon/> : <CheckCircleOutlineIcon/>}
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        {item.verified ? "Falsifizieren" : "Verifizieren"}
                    </Typography>
                </MenuItem>
            )}
        </Mutation>
    )
}

export default withContext(Dropdown);