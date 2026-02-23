import React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BookIcon from "@mui/icons-material/Book";
import ListIcon from "@mui/icons-material/List";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { withContext } from "../generic";
import { generateUrl, HierarchyLevel } from "../../util/hierarchy";
import type { SelectedRoot } from "../../types/domain";

interface AddFabProps {
  session?: unknown;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  level?: string;
  selected?: SelectedRoot;
  us?: boolean;
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

  render() {
    const { session, navigate } = this.props;
    const selected = this.props.selected || { us: Boolean(this.props.us) };
    const us = Boolean(this.props.us);

    if (!session) return null;

    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <SpeedDial
          ariaLabel="Erstellen"
          icon={<SpeedDialIcon />}
          onClick={this.handleClick}
          open={this.state.open}
          sx={{
            position: "fixed",
            bottom: { xs: "calc(16px + 64px + env(safe-area-inset-bottom))", sm: 16 },
            right: { xs: 16, sm: 24 },
          }}
        >
          <SpeedDialAction
            key="publisher"
            icon={<AccountBalanceIcon />}
            tooltipTitle="Verlag"
            onClick={(e) => {
              navigate?.(e, "/create/publisher");
              this.handleClose();
            }}
          />
          <SpeedDialAction
            key="series"
            icon={<ListIcon />}
            tooltipTitle="Serie"
            onClick={(e) => {
              navigate?.(e, "/create/series");
              this.handleClose();
            }}
          />
          <SpeedDialAction
            key="issue"
            icon={<BookIcon />}
            tooltipTitle="Ausgabe"
            onClick={(e) => {
              navigate?.(e, getIssueCreatePath(this.props.level, selected, us));
              this.handleClose();
            }}
          />

          {this.props.level === HierarchyLevel.ISSUE && selected.issue ? (
            <SpeedDialAction
              key="variant"
              icon={<FileCopyIcon />}
              tooltipTitle="Variant"
              onClick={(e) => {
                const selectedCopy: SelectedRoot = {
                  ...selected,
                  issue: selected.issue
                    ? {
                        ...selected.issue,
                        format: undefined,
                        variant: undefined,
                      }
                    : undefined,
                };

                navigate?.(e, "/copy/issue" + generateUrl(selectedCopy, us));
                this.handleClose();
              }}
            />
          ) : null}
        </SpeedDial>
      </ClickAwayListener>
    );
  }

  handleClick = () => {
    this.setState((state) => ({
      open: !state.open,
    }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };
}

function getIssueCreatePath(
  level: string | undefined,
  selected: SelectedRoot,
  us: boolean
): string {
  if (level === HierarchyLevel.PUBLISHER || level === HierarchyLevel.SERIES) {
    return "/create/issue" + generateUrl(selected, us);
  }

  if (level === HierarchyLevel.ISSUE && selected.issue) {
    return "/create/issue" + generateUrl({ series: selected.issue.series }, us);
  }

  return "/create/issue";
}

export default withContext(AddFab);
