import React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Box from "@mui/material/Box";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BookIcon from "@mui/icons-material/Book";
import ListIcon from "@mui/icons-material/List";
import { withContext } from "../generic";
import { generateUrl, HierarchyLevel } from "../../util/hierarchy";
import { FileCopy } from "@mui/icons-material";
import type { SelectedRoot } from "../../types/domain";

interface AddFabProps {
  session?: unknown;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  level?: string;
  selected?: SelectedRoot;
  us?: boolean;
  [key: string]: unknown;
}

interface AddFabState {
  open: boolean;
}

class AddFab extends React.Component<AddFabProps, AddFabState> {
  constructor(props: AddFabProps) {
    super(props);

    this.state = {
      open: false,
    };
  }

  shouldComponentUpdate(nextProps: AddFabProps, nextState: AddFabState) {
    return nextState.open !== this.state.open;
  }

  render() {
    const { session, navigate } = this.props;
    const selected = this.props.selected || { us: Boolean(this.props.us) };
    const us = Boolean(this.props.us);

    if (session)
      return (
        <ClickAwayListener onClickAway={this.handleClose}>
          <Box sx={{ float: "right" }}>
            <SpeedDial
              ariaLabel="Erstellen"
              icon={<SpeedDialIcon />}
              onClick={this.handleClick}
              open={this.state.open}
              sx={{
                position: "fixed",
                bottom: 16,
                right: 24,
              }}
            >
              <SpeedDialAction
                key="publisher"
                icon={<AccountBalanceIcon />}
                tooltipTitle="Verlag"
                tooltipOpen
                onMouseDown={(e) => {
                  navigate(e, "/create/publisher");
                  this.handleClick();
                }}
              />
              <SpeedDialAction
                key="series"
                icon={<ListIcon />}
                tooltipTitle="Serie"
                tooltipOpen
                onMouseDown={(e) => {
                  navigate(e, "/create/series");
                  this.handleClick();
                }}
              />
              <SpeedDialAction
                key="issue"
                icon={<BookIcon />}
                tooltipTitle="Ausgabe"
                tooltipOpen
                onMouseDown={(e) => {
                  if (this.props.level === HierarchyLevel.PUBLISHER) {
                    navigate?.(e, "/create/issue" + generateUrl(selected, us));
                  } else if (this.props.level === HierarchyLevel.SERIES) {
                    navigate?.(e, "/create/issue" + generateUrl(selected, us));
                  } else if (this.props.level === HierarchyLevel.ISSUE && selected.issue) {
                    navigate?.(
                      e,
                      "/create/issue" + generateUrl({ series: selected.issue.series }, us)
                    );
                  } else {
                    navigate?.(e, "/create/issue/" + us);
                  }

                  this.handleClick();
                }}
              />
              {this.props.level === HierarchyLevel.ISSUE && selected.issue ? (
                <SpeedDialAction
                  key="issue"
                  icon={<FileCopy />}
                  tooltipTitle="Variant"
                  tooltipOpen
                  onMouseDown={(e) => {
                    const selectedCopy = JSON.parse(JSON.stringify(selected)) as SelectedRoot;
                    if (selectedCopy.issue) {
                      selectedCopy.issue.format = undefined;
                      selectedCopy.issue.variant = undefined;
                    }

                    navigate?.(e, "/copy/issue" + generateUrl(selectedCopy, us));
                    this.handleClick();
                  }}
                />
              ) : null}
            </SpeedDial>
          </Box>
        </ClickAwayListener>
      );
    else return null;
  }

  handleClick = () => {
    this.setState((state) => ({
      open: !state.open,
    }));
  };

  handleClose = () => {
    this.setState((state) => ({
      open: false,
    }));
  };
}

export default withContext(AddFab);
