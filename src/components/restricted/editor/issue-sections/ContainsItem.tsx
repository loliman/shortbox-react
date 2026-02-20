import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RemoveContainsButton from "./RemoveContainsButton";
import type { ContainsProps, FieldItem } from "./types";

interface ContainsItemProps extends ContainsProps {
  item: FieldItem;
  index: number;
  fields: React.ReactElement;
  type: "stories";
}

class ContainsItem extends React.Component<ContainsItemProps> {
  shouldComponentUpdate(nextProps: ContainsItemProps) {
    return (
      this.props.item !== nextProps.item ||
      (this.props.items || []).length !== (nextProps.items || []).length ||
      this.props.index !== nextProps.index
    );
  }

  render() {
    const childCount = Array.isArray(this.props.item.children)
      ? this.props.item.children.length
      : 0;
    const isDisabled = childCount > 0;

    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Geschichte {this.props.index + 1}
            </Typography>
            <RemoveContainsButton {...this.props} disabled={isDisabled} />
          </Box>

          <Box>
            {React.cloneElement(this.props.fields, {
              ...this.props,
              disabled: isDisabled,
            })}
          </Box>
        </Stack>
      </Paper>
    );
  }
}

export default ContainsItem;
