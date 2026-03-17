import React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import BugReportIcon from "@mui/icons-material/BugReport";
import { withContext } from "../generic";
import { generateUrl, HierarchyLevel } from "../../util/hierarchy";
import type { SelectedRoot } from "../../types/domain";

interface ErrorFabProps {
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  level?: string;
  selected?: SelectedRoot;
  us?: boolean;
}

interface ErrorFabState {
  open: boolean;
  mobileBottomBarHeight: number | null;
}

const DEFAULT_MOBILE_BOTTOM_BAR_HEIGHT = 64;
const MOBILE_BOTTOM_BAR_SELECTOR = '[data-testid="mobile-bottom-bar"]';

class ErrorFab extends React.Component<ErrorFabProps, ErrorFabState> {
  private resizeObserver?: ResizeObserver;
  private observedBottomBar?: HTMLElement;
  private rafId?: number;

  constructor(props: ErrorFabProps) {
    super(props);

    this.state = {
      open: false,
      mobileBottomBarHeight: null,
    };
  }

  componentDidMount(): void {
    this.observeBottomBar();
    this.updateBottomBarHeight();
    this.addViewportListeners();

    if (typeof window !== "undefined") {
      this.rafId = window.requestAnimationFrame(() => {
        this.observeBottomBar();
        this.updateBottomBarHeight();
      });
    }
  }

  componentWillUnmount(): void {
    this.removeViewportListeners();
    this.resizeObserver?.disconnect();
    if (typeof window !== "undefined" && this.rafId !== undefined) {
      window.cancelAnimationFrame(this.rafId);
    }
  }

  componentDidUpdate(): void {
    this.observeBottomBar();
    this.updateBottomBarHeight();
  }

  render() {
    const { navigate } = this.props;
    const selected = this.props.selected || { us: Boolean(this.props.us) };
    const us = Boolean(this.props.us);
    const mobileBottomOffset = this.getMobileBottomOffsetExpression();

    if (this.props.level !== HierarchyLevel.ISSUE || !selected.issue) return null;

    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <SpeedDial
          ariaLabel="Fehler melden"
          icon={<BugReportIcon />}
          onClick={this.handleClick}
          open={this.state.open}
          sx={{
            position: "fixed",
            bottom: `calc(16px + ${mobileBottomOffset})`,
            right: { xs: 16, sm: 24 },
          }}
        >
          <SpeedDialAction
            key="report"
            icon={<BugReportIcon />}
            tooltipTitle="Fehler melden"
            onClick={(e) => {
              navigate?.(e, "/report" + generateUrl(selected, us));
              this.handleClose();
            }}
          />
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

  private getMobileBottomOffsetExpression(): string {
    if (this.state.mobileBottomBarHeight === null) {
      return `${DEFAULT_MOBILE_BOTTOM_BAR_HEIGHT}px + env(safe-area-inset-bottom)`;
    }
    if (this.state.mobileBottomBarHeight > 0) {
      return `${this.state.mobileBottomBarHeight}px`;
    }
    return "env(safe-area-inset-bottom)";
  }

  private getBottomBarHeight(): number {
    if (typeof document === "undefined") return 0;
    const bottomBar = document.querySelector<HTMLElement>(MOBILE_BOTTOM_BAR_SELECTOR);
    if (!bottomBar) return 0;

    return Math.ceil(bottomBar.getBoundingClientRect().height || bottomBar.offsetHeight || 0);
  }

  private updateBottomBarHeight = () => {
    const nextHeight = this.getBottomBarHeight();
    if (nextHeight === this.state.mobileBottomBarHeight) return;
    this.setState({ mobileBottomBarHeight: nextHeight });
  };

  private addViewportListeners() {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", this.handleViewportChange);
    window.addEventListener("orientationchange", this.handleViewportChange);
  }

  private removeViewportListeners() {
    if (typeof window === "undefined") return;
    window.removeEventListener("resize", this.handleViewportChange);
    window.removeEventListener("orientationchange", this.handleViewportChange);
  }

  private handleViewportChange = () => {
    this.observeBottomBar();
    this.updateBottomBarHeight();
  };

  private observeBottomBar() {
    if (typeof ResizeObserver === "undefined" || typeof document === "undefined") return;

    const bottomBar = document.querySelector<HTMLElement>(MOBILE_BOTTOM_BAR_SELECTOR) || undefined;
    if (bottomBar === this.observedBottomBar) return;

    this.resizeObserver?.disconnect();
    this.observedBottomBar = bottomBar;

    if (!bottomBar) return;
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateBottomBarHeight();
      });
    }
    this.resizeObserver.observe(bottomBar);
  }
}

export default withContext(ErrorFab);
