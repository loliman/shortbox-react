import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RemoveContainsButton from "./RemoveContainsButton";
import type { ContainsProps, FieldItem } from "./types";

interface ContainsItemProps extends ContainsProps {
  item: FieldItem;
  index: number;
  fields: React.ReactElement;
  type: "stories";
  expanded?: boolean;
}

class ContainsItem extends React.Component<ContainsItemProps> {
  shouldComponentUpdate(nextProps: ContainsItemProps) {
    return (
      this.props.item !== nextProps.item ||
      (this.props.items || []).length !== (nextProps.items || []).length ||
      this.props.index !== nextProps.index ||
      this.props.expanded !== nextProps.expanded ||
      this.props.dragOverStoryIndex !== nextProps.dragOverStoryIndex ||
      this.props.draggedStoryIndex !== nextProps.draggedStoryIndex
    );
  }

  render() {
    const childCount = Array.isArray(this.props.item.children)
      ? this.props.item.children.length
      : 0;
    const isDisabled = childCount > 0;
    const isExpanded = Boolean(this.props.expanded);
    const isDragOver = this.props.dragOverStoryIndex === this.props.index;
    const isDragging = this.props.draggedStoryIndex === this.props.index;
    const title = String(this.props.item.title || "").trim();
    const parent = (this.props.item.parent || {}) as {
      issue?: { number?: string | number; series?: { title?: string } };
    };
    const seriesTitle = String(parent.issue?.series?.title || "").trim();
    const issueNumber = String(parent.issue?.number || "").trim();
    const seriesIssueLabel = [seriesTitle, issueNumber ? `#${issueNumber}` : ""]
      .filter((entry) => entry.length > 0)
      .join(" ");
    const primaryLabel = title
      ? `${title}${seriesTitle && seriesTitle !== title ? ` (${seriesTitle})` : ""}`
      : seriesTitle;
    const number = this.props.index + 1;

    return (
      <Paper
        variant="outlined"
        data-story-card="true"
        data-story-index={this.props.index}
        sx={(theme) => ({
          p: 2,
          borderRadius: "10px",
          border: "1px solid",
          borderColor: isDragOver
            ? `var(--accent, ${theme.palette.primary.main})`
            : `var(--border-subtle, ${theme.palette.divider})`,
          backgroundColor: `var(--surface-2, ${theme.palette.background.paper})`,
          transition: theme.transitions.create("border-color", {
            duration: theme.transitions.duration.shorter,
          }),
          opacity: isDragging ? 0.7 : 1,
          "&:hover": {
            borderColor: `var(--border-strong, ${theme.palette.text.disabled})`,
          },
        })}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          this.props.onStoryDragOver?.(this.props.index);
        }}
        onDrop={(event) => {
          event.preventDefault();
          const raw = event.dataTransfer.getData("text/plain");
          const fromIndex = Number(raw);
          if (Number.isInteger(fromIndex)) {
            this.props.onStoryReorder?.(fromIndex, this.props.index);
          }
          this.props.onStoryDragEnd?.();
        }}
      >
        <Stack spacing={1.5}>
          <Box
            className="story-header"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              position: "sticky",
              top: 0,
              zIndex: 1,
              py: 0.25,
              backgroundColor: `var(--surface-1, ${theme.palette.background.default})`,
            })}
          >
            <Box
              role="button"
              tabIndex={0}
              onClick={() => this.props.onStoryToggle?.(this.props.index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  this.props.onStoryToggle?.(this.props.index);
                }
              }}
              sx={{ display: "flex", alignItems: "center", minWidth: 0, flexGrow: 1, cursor: "pointer" }}
            >
              <IconButton
                size="small"
                title="Reihenfolge ändern"
                draggable
                onClick={(event) => event.stopPropagation()}
                onDragStart={(event) => {
                  event.stopPropagation();
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(this.props.index));
                  this.props.onStoryDragStart?.(this.props.index);
                }}
                onDragEnd={() => {
                  this.props.onStoryDragEnd?.();
                }}
                sx={{ mr: 0.25, cursor: "grab" }}
              >
                <DragIndicatorIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {`Story ${number}${primaryLabel ? ` — ${primaryLabel}` : ""}`}
              </Typography>
            </Box>
            <Box onClick={(event) => event.stopPropagation()} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <RemoveContainsButton {...this.props} disabled={isDisabled} />
              <IconButton
                size="small"
                color="inherit"
                sx={{ color: "text.secondary" }}
                onClick={() => this.props.onStoryToggle?.(this.props.index)}
              >
                <ExpandMoreIcon
                  sx={{
                    transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 180ms ease",
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          {!isExpanded && seriesIssueLabel ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ pl: 4.75, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {seriesIssueLabel}
            </Typography>
          ) : null}

          <Collapse in={isExpanded} timeout={180} unmountOnExit>
            <Box>
              {React.cloneElement(this.props.fields, {
                ...this.props,
                disabled: isDisabled,
              })}
            </Box>
          </Collapse>
        </Stack>
      </Paper>
    );
  }
}

export default ContainsItem;
