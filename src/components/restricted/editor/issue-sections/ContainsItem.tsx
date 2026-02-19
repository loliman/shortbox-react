import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
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
      <Box>
        <RemoveContainsButton {...this.props} disabled={isDisabled} />

        <Accordion expanded={true} sx={{ mt: 1 }}>
          <AccordionSummary>
            {React.cloneElement(this.props.fields, {
              ...this.props,
              disabled: isDisabled,
            })}
          </AccordionSummary>
        </Accordion>
      </Box>
    );
  }
}

export default ContainsItem;
