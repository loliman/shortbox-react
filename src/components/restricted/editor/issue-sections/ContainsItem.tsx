import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
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
    const itemCount = Array.isArray(this.props.items) ? this.props.items.length : 0;
    const isFirst = this.props.index === 0;
    const isLast = this.props.index === itemCount - 1;
    const borderRadius = isFirst ? (isLast ? "8px" : "8px 8px 0 0") : isLast ? "0 0 8px 8px" : "0";

    return (
      <Accordion
        disableGutters
        expanded={isExpanded}
        data-story-card="true"
        data-story-index={this.props.index}
        onChange={() => this.props.onStoryToggle?.(this.props.index)}
        sx={(theme) => ({
          borderRadius,
          width: "auto",
          maxWidth: "100%",
          mt: isFirst ? 0 : "-1px",
          border: "1px solid",
          borderColor: isDragOver
            ? `var(--accent, ${theme.palette.primary.main})`
            : theme.palette.divider,
          backgroundColor: theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
          boxShadow: theme.shadows[1],
          transition: "box-shadow 180ms ease, border-color 180ms ease",
          opacity: isDragging ? 0.7 : 1,
          "&:hover": {
            borderColor: `var(--border-strong, ${theme.palette.divider})`,
          },
          "&:before": { display: "none" },
          "& .MuiAccordionSummary-root": {
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#ffffff"),
          },
          "& .MuiAccordionDetails-root": {
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#ffffff"),
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
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={(theme) => ({
            py: 1.25,
            px: 2,
            minHeight: 0,
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
            "&.Mui-expanded": {
              minHeight: 0,
            },
            "& .MuiAccordionSummary-content": {
              width: "100%",
              margin: 0,
              "&.Mui-expanded": {
                margin: 0,
              },
            },
            "& .MuiAccordionSummary-expandIconWrapper": {
              margin: 0,
              alignSelf: "center",
            },
          })}
        >
          <Box sx={{ width: "100%", pr: 0.5 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, flexGrow: 1 }}>
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
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {`Story ${number}${primaryLabel ? ` — ${primaryLabel}` : ""}`}
                  </Typography>

                  {!isExpanded && seriesIssueLabel ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {seriesIssueLabel}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
              <Box onClick={(event) => event.stopPropagation()}>
                <RemoveContainsButton {...this.props} disabled={isDisabled} />
              </Box>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0.5 }}>
          <Box>
            {React.cloneElement(this.props.fields, {
              ...this.props,
              disabled: isDisabled,
            })}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default ContainsItem;
