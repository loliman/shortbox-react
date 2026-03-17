import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
      this.props.expanded !== nextProps.expanded
    );
  }

  render() {
    const childCount = Array.isArray(this.props.item.children)
      ? this.props.item.children.length
      : 0;
    const isDisabled = childCount > 0;
    const isExpanded = Boolean(this.props.expanded);
    const title = String(this.props.item.title || "").trim();
    const parent = (this.props.item.parent || {}) as {
      issue?: { series?: { title?: string } };
    };
    const seriesTitle = String(parent.issue?.series?.title || "").trim();
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
          borderColor: `var(--border-subtle, ${theme.palette.divider})`,
          backgroundColor: `var(--surface-2, ${theme.palette.background.paper})`,
          transition: theme.transitions.create("border-color", {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            borderColor: `var(--border-strong, ${theme.palette.text.disabled})`,
          },
        })}
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
              <IconButton size="small" sx={{ mr: 0.5 }}>
                <ExpandMoreIcon
                  sx={{
                    transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 180ms ease",
                  }}
                />
              </IconButton>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {`Story ${number}${primaryLabel ? ` — ${primaryLabel}` : ""}`}
              </Typography>
            </Box>
            <Box onClick={(event) => event.stopPropagation()}>
              <RemoveContainsButton {...this.props} disabled={isDisabled} />
            </Box>
          </Box>

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
